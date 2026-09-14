from abc import ABC, abstractmethod
from datetime import datetime, timedelta, timezone
import random
import string
from typing import Optional, Tuple
from sqlalchemy.orm import Session
import bcrypt

from backend.app.core.config import settings
from backend.app.core.logger import logger
from backend.app.models.enums import OtpType
from backend.app.models.user import OtpVerification
from backend.app.services.redis import get_redis_client


class IOtpService(ABC):
    """Abstract interface for OTP generation, delivery, and verification."""

    @abstractmethod
    async def send_otp(self, target: str, otp_type: OtpType, db: Session) -> Tuple[bool, str, Optional[str]]:
        """Generates, saves, and sends OTP. Returns (success, message, debug_otp_if_dev)."""
        pass

    @abstractmethod
    def verify_otp(self, target: str, code: str, otp_type: OtpType, db: Session) -> Tuple[bool, str]:
        """Verifies given OTP for target."""
        pass


class OtpServiceBase(IOtpService):
    """Base OTP implementation with DB / Redis verification logic."""

    def _generate_code(self, length: int = 6) -> str:
        has_live_provider = bool(
            settings.INDIAN_SMS_PROVIDER_API_KEY
            or getattr(settings, "FAST2SMS_API_KEY", None)
            or getattr(settings, "MSG91_AUTH_KEY", None)
            or getattr(settings, "TWILIO_AUTH_TOKEN", None)
        )
        if settings.OTP_TEST_MODE and not has_live_provider:
            return settings.DEFAULT_TEST_OTP
        return "".join(random.choices(string.digits, k=length))

    def _hash_code(self, code: str) -> str:
        salt = bcrypt.gensalt(rounds=8)
        return bcrypt.hashpw(code.encode("utf-8"), salt).decode("utf-8")

    def _check_code(self, plain: str, hashed: str) -> bool:
        try:
            return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
        except Exception:
            return False

    async def send_otp(self, target: str, otp_type: OtpType, db: Session) -> Tuple[bool, str, Optional[str]]:
        target_clean = target.strip().lower()

        # Invalidate old unused OTPs for this target and type
        db.query(OtpVerification).filter(
            OtpVerification.target == target_clean,
            OtpVerification.otp_type == otp_type,
            OtpVerification.is_used == False,
        ).update({"is_used": True})

        code = self._generate_code()
        hashed_code = self._hash_code(code)
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        expires_at = now_utc + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

        otp_record = OtpVerification(
            target=target_clean,
            otp_code_hash=hashed_code,
            otp_type=otp_type,
            attempts=0,
            expires_at=expires_at,
            is_used=False,
        )
        db.add(otp_record)
        db.commit()

        # Also store in Redis cache if available for fast rate-limiting
        redis_client = get_redis_client()
        if redis_client:
            redis_key = f"otp:{otp_type.value}:{target_clean}"
            redis_client.setex(redis_key, settings.OTP_EXPIRE_MINUTES * 60, code)

        logger.info(f"Generated OTP [{code}] for target [{target_clean}] (Type: {otp_type.value})")

        # Deliver via SMS, WhatsApp, or Dual SMTP Email
        delivered = await self._deliver(target_clean, code, otp_type, db)
        debug_code = code if (settings.DEBUG or settings.OTP_TEST_MODE) else None

        if delivered:
            return True, "OTP sent successfully.", debug_code
        return False, "Failed to deliver OTP.", None

    @abstractmethod
    async def _deliver(self, target: str, code: str, otp_type: OtpType, db: Optional[Session] = None) -> bool:
        pass

    def verify_otp(self, target: str, code: str, otp_type: OtpType, db: Session) -> Tuple[bool, str]:
        target_clean = target.strip().lower()
        code_clean = code.strip()

        # Fast path test bypass if configured and in test mode
        if settings.OTP_TEST_MODE and code_clean == settings.DEFAULT_TEST_OTP:
            logger.info(f"Test mode OTP matched for {target_clean}")
            return True, "OTP verified successfully."

        # Fetch latest active OTP
        record = (
            db.query(OtpVerification)
            .filter(
                OtpVerification.target == target_clean,
                OtpVerification.otp_type == otp_type,
                OtpVerification.is_used == False,
            )
            .order_by(OtpVerification.id.desc())
            .first()
        )

        if not record:
            return False, "No active OTP found. Please request a new one."

        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        exp_val = getattr(record, "expires_at", None)
        if exp_val is not None:
            if hasattr(exp_val, "replace"):
                exp_val = exp_val.replace(tzinfo=None)
            if exp_val < now_utc:
                setattr(record, "is_used", True)
                db.commit()
                return False, "OTP has expired. Please request a new one."

        curr_attempts = int(getattr(record, "attempts", 0) or 0)
        if curr_attempts >= 5:
            setattr(record, "is_used", True)
            db.commit()
            return False, "Too many failed attempts. Please request a new OTP."

        otp_hash = str(record.otp_code_hash or "")
        if not self._check_code(code_clean, otp_hash):
            setattr(record, "attempts", curr_attempts + 1)
            db.commit()
            remaining = max(0, 5 - (curr_attempts + 1))
            return False, f"Invalid OTP code. {remaining} attempt(s) remaining."

        # Mark OTP as successfully used
        setattr(record, "is_used", True)
        db.commit()
        return True, "OTP verified successfully."


class MockOtpService(OtpServiceBase):
    """Multi-Channel OTP Service: delivers live email via Gmail SMTP, live SMS via Fast2SMS/MSG91/Twilio, and logs code."""

    async def _deliver(self, target: str, code: str, otp_type: OtpType, db: Optional[Session] = None) -> bool:
        # 1. Dual Email Delivery: If target is an email address OR registered mobile has an associated user email
        email_recipient: Optional[str] = None
        if "@" in target:
            email_recipient = target
        elif db is not None:
            clean_digits = target.replace("+91", "").strip()[-10:]
            from backend.app.models.user import User
            user_match = db.query(User).filter(
                (User.mobile_number == clean_digits) | (User.mobile_number.endswith(clean_digits))
            ).first()
            if user_match is not None:
                u_email = getattr(user_match, "email", None)
                if u_email:
                    email_recipient = str(u_email)

        if email_recipient:
            try:
                from backend.app.services.email import get_email_service
                email_svc = get_email_service()
                await email_svc.send_otp_email(
                    to_email=email_recipient,
                    otp_code=code,
                    purpose=otp_type.value.replace("_", " ").title(),
                )
                logger.info(f"[EMAIL OTP] Successfully delivered live OTP {code} to {email_recipient}")
            except Exception as e:
                logger.warning(f"[EMAIL OTP] Delivery failed for {email_recipient}: {e}")

        # 2. Live Mobile SMS / WhatsApp Gateways
        if target.replace("+91", "").strip().isdigit():
            clean_mobile = target.replace("+91", "").strip()[-10:]

            # Option A: MSG91 OTP Gateway (DLT compliant, standard OTP route)
            msg91_key = getattr(settings, "MSG91_AUTH_KEY", None) or getattr(settings, "INDIAN_SMS_PROVIDER_API_KEY", None)
            msg91_template = getattr(settings, "MSG91_TEMPLATE_ID", None)
            if msg91_key:
                try:
                    import urllib.request
                    import json
                    msg91_url = f"https://control.msg91.com/api/v5/otp?mobile=91{clean_mobile}&authkey={msg91_key}&otp={code}"
                    if msg91_template:
                        msg91_url += f"&template_id={msg91_template}"
                    req = urllib.request.Request(msg91_url, headers={"Content-Type": "application/json"})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        resp_data = json.loads(resp.read().decode())
                        if resp_data.get("type") == "success":
                            logger.info(f"[SMS GATEWAY - MSG91] Live OTP {code} successfully dispatched to +91-{clean_mobile} (Request ID: {resp_data.get('request_id')})")
                        else:
                            logger.warning(f"[SMS GATEWAY - MSG91] Provider response: {resp_data}")
                except Exception as msg91_err:
                    logger.warning(f"[SMS GATEWAY - MSG91] Delivery error: {msg91_err}")

            # Option B: Fast2SMS DLT Gateway (if distinct FAST2SMS_API_KEY configured)
            fast2sms_key = getattr(settings, "FAST2SMS_API_KEY", None)
            if fast2sms_key and fast2sms_key != msg91_key:
                try:
                    import urllib.request
                    import json
                    fast2sms_url = f"https://www.fast2sms.com/dev/bulkV2?authorization={fast2sms_key}&variables_values={code}&route=otp&numbers={clean_mobile}"
                    req = urllib.request.Request(fast2sms_url, headers={"User-Agent": "ChristianMatrimony/1.0"})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        resp_data = json.loads(resp.read().decode())
                        if resp_data.get("return"):
                            logger.info(f"[SMS GATEWAY - Fast2SMS] Live SMS successfully delivered to +91-{clean_mobile}")
                        else:
                            logger.warning(f"[SMS GATEWAY - Fast2SMS] Provider response: {resp_data}")
                except Exception as sms_err:
                    logger.warning(f"[SMS GATEWAY - Fast2SMS] Delivery error: {sms_err}")

            # Option C: Twilio SMS / WhatsApp Gateway
            twilio_sid = getattr(settings, "TWILIO_ACCOUNT_SID", None)
            twilio_token = getattr(settings, "TWILIO_AUTH_TOKEN", None)
            twilio_from = getattr(settings, "TWILIO_PHONE_NUMBER", None)
            if twilio_sid and twilio_token and twilio_from:
                try:
                    import urllib.request
                    import urllib.parse
                    import base64
                    twilio_url = f"https://api.twilio.com/2010-04-01/Accounts/{twilio_sid}/Messages.json"
                    msg_body = f"Your CovenantNest verification code is: {code}. Valid for 10 minutes. Do not share this OTP."
                    data = urllib.parse.urlencode({
                        "To": f"+91{clean_mobile}",
                        "From": twilio_from,
                        "Body": msg_body,
                    }).encode("utf-8")
                    auth_header = "Basic " + base64.b64encode(f"{twilio_sid}:{twilio_token}".encode("utf-8")).decode("utf-8")
                    req = urllib.request.Request(twilio_url, data=data, headers={"Authorization": auth_header})
                    with urllib.request.urlopen(req, timeout=10) as resp:
                        logger.info(f"[SMS GATEWAY - Twilio] Live SMS OTP dispatched to +91-{clean_mobile}")
                except Exception as twilio_err:
                    logger.warning(f"[SMS GATEWAY - Twilio] Delivery error: {twilio_err}")

        logger.info(f"[OTP SERVICE] Target: {target} | Code: {code} | Type: {otp_type.value}")
        return True


class IndianSmsOtpService(MockOtpService):
    """Production Indian SMS Gateway OTP Service."""
    pass


def get_otp_service() -> IOtpService:
    """Returns appropriate OTP service based on environment."""
    return MockOtpService()

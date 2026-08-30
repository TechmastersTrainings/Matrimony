from abc import ABC, abstractmethod
from datetime import datetime, timedelta
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
        if settings.OTP_TEST_MODE:
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
        expires_at = datetime.utcnow() + timedelta(minutes=settings.OTP_EXPIRE_MINUTES)

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

        # Deliver via SMS or Mock
        delivered = await self._deliver(target_clean, code, otp_type)
        debug_code = code if settings.DEBUG or settings.OTP_TEST_MODE else None

        if delivered:
            return True, "OTP sent successfully.", debug_code
        return False, "Failed to deliver OTP.", None

    @abstractmethod
    async def _deliver(self, target: str, code: str, otp_type: OtpType) -> bool:
        pass

    def verify_otp(self, target: str, code: str, otp_type: OtpType, db: Session) -> Tuple[bool, str]:
        target_clean = target.strip().lower()
        code_clean = code.strip()

        # Fast path test bypass if configured
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

        if record.expires_at < datetime.utcnow():
            record.is_used = True
            db.commit()
            return False, "OTP has expired. Please request a new one."

        if record.attempts >= 5:
            record.is_used = True
            db.commit()
            return False, "Too many failed attempts. Please request a new OTP."

        if not self._check_code(code_clean, record.otp_code_hash):
            record.attempts += 1
            db.commit()
            remaining = max(0, 5 - record.attempts)
            return False, f"Invalid OTP code. {remaining} attempt(s) remaining."

        # Mark OTP as successfully used
        record.is_used = True
        db.commit()
        return True, "OTP verified successfully."


class MockOtpService(OtpServiceBase):
    """Development / Test Mock OTP Service."""

    async def _deliver(self, target: str, code: str, otp_type: OtpType) -> bool:
        logger.info(f"[DEV MOCK SMS/EMAIL] Delivery to {target}: Your OTP code is {code} ({otp_type.value})")
        return True


class IndianSmsOtpService(OtpServiceBase):
    """Production Indian SMS Gateway OTP Service."""

    async def _deliver(self, target: str, code: str, otp_type: OtpType) -> bool:
        if not settings.INDIAN_SMS_PROVIDER_API_KEY:
            logger.warning("INDIAN_SMS_PROVIDER_API_KEY not configured. Falling back to log delivery.")
            return True

        # Hook for production SMS gateway (e.g. Fast2SMS / MSG91 API call)
        logger.info(f"[SMS GATEWAY] Sending OTP {code} to {target}")
        return True


def get_otp_service() -> IOtpService:
    """Returns appropriate OTP service based on environment."""
    if settings.ENVIRONMENT == "production" and settings.INDIAN_SMS_PROVIDER_API_KEY:
        return IndianSmsOtpService()
    return MockOtpService()

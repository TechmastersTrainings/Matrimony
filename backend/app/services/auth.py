from datetime import datetime, timedelta, timezone
import hashlib
from typing import Optional, Tuple
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.core.config import settings
from backend.app.core.logger import logger
from backend.app.core.security import create_access_token, create_refresh_token, decode_token, hash_password, verify_password
from backend.app.models.enums import AccountStatus, Gender, OtpType, ProfileCreatedBy, ProfileStatus, UserRole
from backend.app.models.profile import Profile, ProfileDraft
from backend.app.models.user import RefreshToken, User
from backend.app.schemas.auth import RegisterRequest, TokenResponse
from backend.app.services.otp import get_otp_service


class AuthService:
    @staticmethod
    async def register_user(
        payload: RegisterRequest,
        db: Session,
    ) -> Tuple[User, Optional[str]]:
        mobile_clean = payload.mobile_number.strip().replace(" ", "").replace("-", "")
        email_clean = payload.email.strip().lower()

        # 1. Uniqueness Checks
        existing_mobile = db.query(User).filter(User.mobile_number == mobile_clean).first()
        if existing_mobile:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this mobile number already exists.",
            )

        existing_email = db.query(User).filter(User.email == email_clean).first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="An account with this email address already exists.",
            )

        # 2. Parse Gender Enum safely
        try:
            gender_enum = Gender(payload.gender.upper())
        except ValueError:
            gender_enum = Gender.MALE

        # 3. Create User
        password_hash = hash_password(payload.password) if payload.password else None
        new_user = User(
            mobile_number=mobile_clean,
            email=email_clean,
            password_hash=password_hash,
            account_status=AccountStatus.PENDING_VERIFICATION,
            role=UserRole.CANDIDATE,  # Admin accounts can ONLY be created via backend code/seeds
            is_mobile_verified=False,
            is_email_verified=False,
        )
        db.add(new_user)
        db.flush()

        new_user_id: int = int(getattr(new_user, "id"))

        # 4. Create Initial Profile
        new_profile = Profile(
            user_id=new_user_id,
            profile_created_by=payload.profile_created_by,
            first_name=payload.first_name.strip(),
            last_name=payload.last_name.strip(),
            gender=gender_enum,
            status=ProfileStatus.DRAFT,
            completion_percentage=15,
        )
        db.add(new_profile)

        # 5. Create Initial Profile Draft
        initial_draft_data = {
            "first_name": payload.first_name.strip(),
            "last_name": payload.last_name.strip(),
            "gender": gender_enum.value,
            "mobile_number": mobile_clean,
            "email": email_clean,
            "profile_created_by": payload.profile_created_by.value,
        }
        new_draft = ProfileDraft(
            user_id=new_user_id,
            current_step=1,
            draft_data=initial_draft_data,
        )
        db.add(new_draft)
        db.commit()
        db.refresh(new_user)

        # 6. Send Registration OTP
        otp_service = get_otp_service()
        ok, msg, debug_otp = await otp_service.send_otp(mobile_clean, OtpType.REGISTRATION, db)
        logger.info(f"User registration initialized: {new_user_id} ({mobile_clean}) - OTP status: {ok}")

        return new_user, debug_otp

    @staticmethod
    def create_user_tokens(user: User, db: Session) -> TokenResponse:
        user_id_val: int = int(getattr(user, "id"))
        role_val: str = str(getattr(user.role, "value", user.role))
        email_val: str = str(getattr(user, "email", ""))
        mobile_val: str = str(getattr(user, "mobile_number", ""))
        account_status_val: str = str(getattr(user.account_status, "value", user.account_status))
        is_mobile_ver: bool = bool(getattr(user, "is_mobile_verified", False))
        is_email_ver: bool = bool(getattr(user, "is_email_verified", False))

        access_token = create_access_token(
            subject=user_id_val,
            extra_claims={
                "role": role_val,
                "email": email_val,
                "mobile": mobile_val,
                "account_status": account_status_val,
            },
        )
        raw_refresh = create_refresh_token(subject=user_id_val)
        refresh_hash = hashlib.sha256(raw_refresh.encode("utf-8")).hexdigest()

        now_utc = datetime.now(timezone.utc)
        refresh_record = RefreshToken(
            user_id=user_id_val,
            token_hash=refresh_hash,
            expires_at=now_utc + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            is_revoked=False,
        )
        db.add(refresh_record)
        setattr(user, "last_login_at", now_utc)
        db.commit()

        profile_status = "DRAFT"
        if getattr(user, "profile", None) and hasattr(user.profile, "status"):
            profile_status = str(getattr(user.profile.status, "value", user.profile.status))

        return TokenResponse(
            access_token=access_token,
            refresh_token=raw_refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user_id_val,
            role=role_val,
            account_status=account_status_val,
            is_mobile_verified=is_mobile_ver,
            is_email_verified=is_email_ver,
            profile_status=profile_status,
        )

    @staticmethod
    async def login_with_password(identifier: str, password: str, db: Session) -> TokenResponse:
        ident_clean = identifier.strip().lower()
        # Find user by email or mobile
        user = db.query(User).filter(
            (User.email == ident_clean) | (User.mobile_number == ident_clean)
        ).first()

        pwd_hash: str = str(getattr(user, "password_hash", "") or "")
        if not user or not pwd_hash or not verify_password(password, pwd_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials. Please check your mobile/email and password.",
            )

        if user.account_status in [AccountStatus.SUSPENDED, AccountStatus.DEACTIVATED]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Your account is {user.account_status.value.lower()}. Please contact support.",
            )

        return AuthService.create_user_tokens(user, db)

    @staticmethod
    async def login_with_otp(target: str, otp_code: str, db: Session) -> TokenResponse:
        target_clean = target.strip().lower()
        user = db.query(User).filter(
            (User.email == target_clean) | (User.mobile_number == target_clean)
        ).first()

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No account found matching this mobile number or email.",
            )

        otp_service = get_otp_service()
        verified, msg = otp_service.verify_otp(target_clean, otp_code, OtpType.LOGIN, db)
        if not verified:
            # Also check if it was registration type OTP
            verified, msg = otp_service.verify_otp(target_clean, otp_code, OtpType.REGISTRATION, db)
            if not verified:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=msg,
                )

        # Mark verified and active
        user_mobile = str(getattr(user, "mobile_number", "") or "").lower()
        user_email = str(getattr(user, "email", "") or "").lower()
        if target_clean == user_mobile:
            setattr(user, "is_mobile_verified", True)
        elif target_clean == user_email:
            setattr(user, "is_email_verified", True)

        if getattr(user, "account_status", None) == AccountStatus.PENDING_VERIFICATION:
            setattr(user, "account_status", AccountStatus.ACTIVE)

        db.commit()
        db.refresh(user)

        return AuthService.create_user_tokens(user, db)

    @staticmethod
    def refresh_access_token(refresh_token: str, db: Session) -> TokenResponse:
        payload = decode_token(refresh_token)
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type for refresh.",
            )

        sub = payload.get("sub")
        if sub is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject.")

        user_id = int(sub)
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        if user.account_status in [AccountStatus.SUSPENDED, AccountStatus.DEACTIVATED]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active.",
            )

        return AuthService.create_user_tokens(user, db)

    @staticmethod
    def logout(user_id: int, db: Session) -> bool:
        db.query(RefreshToken).filter(
            RefreshToken.user_id == user_id,
            RefreshToken.is_revoked == False,
        ).update({"is_revoked": True})
        db.commit()
        return True

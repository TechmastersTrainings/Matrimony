from datetime import datetime, timedelta
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

        # 4. Create Initial Profile
        new_profile = Profile(
            user_id=new_user.id,
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
            user_id=new_user.id,
            current_step=1,
            draft_data=initial_draft_data,
        )
        db.add(new_draft)
        db.commit()
        db.refresh(new_user)

        # 6. Send Registration OTP
        otp_service = get_otp_service()
        ok, msg, debug_otp = await otp_service.send_otp(mobile_clean, OtpType.REGISTRATION, db)
        logger.info(f"User registration initialized: {new_user.id} ({mobile_clean}) - OTP status: {ok}")

        return new_user, debug_otp

    @staticmethod
    def create_user_tokens(user: User, db: Session) -> TokenResponse:
        access_token = create_access_token(
            subject=user.id,
            extra_claims={
                "role": user.role.value,
                "email": user.email,
                "mobile": user.mobile_number,
                "account_status": user.account_status.value,
            },
        )
        raw_refresh = create_refresh_token(subject=user.id)
        refresh_hash = hash_password(raw_refresh[:30])

        refresh_record = RefreshToken(
            user_id=user.id,
            token_hash=refresh_hash,
            expires_at=datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS),
            is_revoked=False,
        )
        db.add(refresh_record)
        user.last_login_at = datetime.utcnow()
        db.commit()

        profile_status = user.profile.status.value if user.profile else "DRAFT"

        return TokenResponse(
            access_token=access_token,
            refresh_token=raw_refresh,
            expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60,
            user_id=user.id,
            role=user.role.value,
            account_status=user.account_status.value,
            is_mobile_verified=user.is_mobile_verified,
            is_email_verified=user.is_email_verified,
            profile_status=profile_status,
        )

    @staticmethod
    async def login_with_password(identifier: str, password: str, db: Session) -> TokenResponse:
        ident_clean = identifier.strip().lower()
        # Find user by email or mobile
        user = db.query(User).filter(
            (User.email == ident_clean) | (User.mobile_number == ident_clean)
        ).first()

        if not user or not user.password_hash or not verify_password(password, user.password_hash):
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
        if target_clean == user.mobile_number.lower():
            user.is_mobile_verified = True
        elif target_clean == user.email.lower():
            user.is_email_verified = True

        if user.account_status == AccountStatus.PENDING_VERIFICATION:
            user.account_status = AccountStatus.ACTIVE

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

        user_id = int(payload.get("sub"))
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

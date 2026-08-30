from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import AccountStatus, OtpType
from backend.app.models.user import User
from backend.app.schemas.auth import (
    LoginRequest,
    MessageResponse,
    RefreshTokenRequest,
    RegisterRequest,
    SendOtpRequest,
    TokenResponse,
    UserResponse,
    VerifyOtpRequest,
)
from backend.app.services.auth import AuthService
from backend.app.services.database import get_db
from backend.app.services.otp import get_otp_service

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post(
    "/register",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register Account & Send Verification OTP",
)
async def register(
    payload: RegisterRequest,
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    user, debug_otp = await AuthService.register_user(payload, db)
    return MessageResponse(
        success=True,
        message=f"Registration initiated. Verification OTP sent to {user.mobile_number}.",
        debug_otp=debug_otp,
    )


@router.post(
    "/send-otp",
    response_model=MessageResponse,
    summary="Send or Resend OTP for Mobile/Email",
)
async def send_otp(
    payload: SendOtpRequest,
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    otp_service = get_otp_service()
    ok, msg, debug_otp = await otp_service.send_otp(payload.target, payload.otp_type, db)
    if not ok:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=msg)

    return MessageResponse(success=True, message=msg, debug_otp=debug_otp)


@router.post(
    "/verify-otp",
    response_model=TokenResponse,
    summary="Verify OTP & Complete Authentication",
)
async def verify_otp(
    payload: VerifyOtpRequest,
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    return await AuthService.login_with_otp(payload.target, payload.otp_code, db)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login with Password or OTP",
)
async def login(
    payload: LoginRequest,
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    if payload.login_type == "otp":
        if not payload.otp_code:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OTP code is required for OTP login.",
            )
        return await AuthService.login_with_otp(payload.identifier, payload.otp_code, db)
    else:
        if not payload.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Password is required for password login.",
            )
        return await AuthService.login_with_password(payload.identifier, payload.password, db)


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh Access Token using Refresh Token",
)
async def refresh_token(
    payload: RefreshTokenRequest,
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    return AuthService.refresh_access_token(payload.refresh_token, db)


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout User & Invalidate Sessions",
)
async def logout(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    AuthService.logout(current_user.id, db)
    return MessageResponse(success=True, message="Successfully logged out.")

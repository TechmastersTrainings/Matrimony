from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field
from backend.app.models.enums import AccountStatus, OtpType, ProfileCreatedBy, UserRole


class RegisterRequest(BaseModel):
    mobile_number: str = Field(..., description="Indian 10-digit mobile number or +91 format")
    email: EmailStr = Field(..., description="Valid unique email address")
    password: Optional[str] = Field(None, min_length=6, description="Optional plaintext password")
    role: UserRole = Field(default=UserRole.CANDIDATE, description="Account role")
    profile_created_by: ProfileCreatedBy = Field(default=ProfileCreatedBy.SELF, description="Who is creating the profile")
    first_name: str = Field(..., min_length=2, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    gender: str = Field(..., description="MALE or FEMALE")


class SendOtpRequest(BaseModel):
    target: str = Field(..., description="Mobile number or email address")
    otp_type: OtpType = Field(default=OtpType.REGISTRATION)


class VerifyOtpRequest(BaseModel):
    target: str = Field(..., description="Mobile number or email address")
    otp_code: str = Field(..., min_length=4, max_length=8)
    otp_type: OtpType = Field(default=OtpType.REGISTRATION)


class LoginRequest(BaseModel):
    identifier: str = Field(..., description="Mobile number or Email address")
    password: Optional[str] = None
    otp_code: Optional[str] = None
    login_type: str = Field("password", description="'password' or 'otp'")


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user_id: int
    role: str
    account_status: str
    is_mobile_verified: bool
    is_email_verified: bool
    profile_status: Optional[str] = "DRAFT"


class UserResponse(BaseModel):
    id: int
    mobile_number: str
    email: str
    account_status: AccountStatus
    role: UserRole
    is_mobile_verified: bool
    is_email_verified: bool
    created_at: datetime
    last_login_at: Optional[datetime] = None

    model_config = ConfigDict(from_attributes=True)


class MessageResponse(BaseModel):
    success: bool
    message: str
    debug_otp: Optional[str] = None

from datetime import date, datetime
from typing import Any, Dict, List, Optional
from pydantic import BaseModel, ConfigDict, Field
from backend.app.models.enums import (
    AccountStatus,
    Denomination,
    Diet,
    FamilyStatus,
    FamilyValues,
    Gender,
    HabitStatus,
    MaritalStatus,
    OccupationType,
    PhysicalStatus,
    ProfileCreatedBy,
    ProfileStatus,
    UserRole,
)


class ProfileDraftUpdateRequest(BaseModel):
    current_step: int = Field(..., ge=1, le=6, description="Current wizard step (1-6)")
    draft_data: Dict[str, Any] = Field(default_factory=dict, description="Arbitrary step form fields dictionary")


class ProfileDraftResponse(BaseModel):
    user_id: int
    current_step: int
    draft_data: Dict[str, Any]
    last_saved_at: datetime


class ProfileSubmitRequest(BaseModel):
    confirmed: bool = Field(True, description="Confirmation to submit profile for verification")


class ProfileDetailResponse(BaseModel):
    id: int
    user_id: int
    profile_manager_id: Optional[int] = None
    profile_created_by: ProfileCreatedBy
    manager_name: Optional[str] = None
    manager_relationship: Optional[str] = None
    manager_contact: Optional[str] = None

    # Basic
    first_name: str
    last_name: str
    gender: Gender
    dob: Optional[date] = None
    age: Optional[int] = None
    marital_status: Optional[MaritalStatus] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[int] = None
    physical_status: Optional[PhysicalStatus] = None
    mother_tongue: Optional[str] = None

    # Faith
    denomination: Optional[Denomination] = None
    sub_denomination: Optional[str] = None
    church_name: Optional[str] = None
    parish_or_pastor: Optional[str] = None
    is_baptized: bool = True
    is_born_again: bool = False
    church_activity: Optional[str] = None

    # Location
    state: Optional[str] = None
    district: Optional[str] = None
    city: Optional[str] = None
    pincode: Optional[str] = None
    native_place: Optional[str] = None

    # Education & Career
    highest_education: Optional[str] = None
    education_field: Optional[str] = None
    institution: Optional[str] = None
    occupation_type: Optional[OccupationType] = None
    occupation_title: Optional[str] = None
    employed_in: Optional[str] = None
    annual_income_min: Optional[int] = None
    annual_income_max: Optional[int] = None
    annual_income_currency: Optional[str] = "INR"
    work_location: Optional[str] = None

    # Family
    father_name: Optional[str] = None
    father_occupation: Optional[str] = None
    mother_name: Optional[str] = None
    mother_occupation: Optional[str] = None
    family_status: Optional[FamilyStatus] = None
    family_values: Optional[FamilyValues] = None
    brothers_count: Optional[int] = 0
    married_brothers_count: Optional[int] = 0
    sisters_count: Optional[int] = 0
    married_sisters_count: Optional[int] = 0
    about_family: Optional[str] = None

    # Lifestyle & About
    diet: Optional[Diet] = None
    smoking: Optional[HabitStatus] = None
    drinking: Optional[HabitStatus] = None
    hobbies: Optional[str] = None
    bio: Optional[str] = None
    faith_testimony: Optional[str] = None

    # Partner Preferences
    partner_preferences: Optional[Dict[str, Any]] = None

    # Status
    status: ProfileStatus
    completion_percentage: int
    submitted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class ProfileRegistrationMeResponse(BaseModel):
    user_id: int
    mobile_number: str
    email: str
    account_status: AccountStatus
    role: UserRole
    is_mobile_verified: bool
    is_email_verified: bool
    profile: Optional[ProfileDetailResponse] = None
    draft: Optional[ProfileDraftResponse] = None
    current_step: int = 1
    completion_percentage: int = 15
    profile_status: ProfileStatus = ProfileStatus.DRAFT

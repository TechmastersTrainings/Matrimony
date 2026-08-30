from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_active_user, get_current_user
from backend.app.models.enums import ProfileStatus
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.schemas.auth import MessageResponse
from backend.app.schemas.profile import (
    ProfileDetailResponse,
    ProfileDraftResponse,
    ProfileDraftUpdateRequest,
    ProfileRegistrationMeResponse,
    ProfileSubmitRequest,
)
from backend.app.services.database import get_db
from backend.app.services.registration import RegistrationService

router = APIRouter(prefix="/registration", tags=["Registration"])


@router.get(
    "/me",
    response_model=ProfileRegistrationMeResponse,
    summary="Get Current User Registration Status, Profile, and Draft Progress",
)
async def get_registration_me(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    draft = RegistrationService.get_or_create_draft(current_user, db)

    current_step = draft.current_step if draft else 1
    completion_percentage = profile.completion_percentage if profile else 15
    profile_status = profile.status if profile else ProfileStatus.DRAFT

    draft_response = None
    if draft:
        draft_response = ProfileDraftResponse(
            user_id=draft.user_id,
            current_step=draft.current_step,
            draft_data=draft.draft_data or {},
            last_saved_at=draft.last_saved_at,
        )

    profile_response = None
    if profile:
        profile_response = ProfileDetailResponse.model_validate(profile)

    return ProfileRegistrationMeResponse(
        user_id=current_user.id,
        mobile_number=current_user.mobile_number,
        email=current_user.email,
        account_status=current_user.account_status,
        role=current_user.role,
        is_mobile_verified=current_user.is_mobile_verified,
        is_email_verified=current_user.is_email_verified,
        profile=profile_response,
        draft=draft_response,
        current_step=current_step,
        completion_percentage=completion_percentage,
        profile_status=profile_status,
    )


@router.post(
    "/submit",
    response_model=ProfileDetailResponse,
    summary="Finalize and Submit Profile for Verification",
)
async def submit_registration(
    payload: ProfileSubmitRequest,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    profile = RegistrationService.submit_profile(current_user, db)
    return ProfileDetailResponse.model_validate(profile)

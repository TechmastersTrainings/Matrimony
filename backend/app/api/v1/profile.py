from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_active_user, get_current_user
from backend.app.models.profile import ProfileDraft
from backend.app.models.user import User
from backend.app.schemas.profile import ProfileDraftResponse, ProfileDraftUpdateRequest
from backend.app.services.database import get_db
from backend.app.services.registration import RegistrationService

router = APIRouter(prefix="/profile", tags=["Profile & Drafts"])


@router.get(
    "/draft",
    response_model=ProfileDraftResponse,
    summary="Get Saved Profile Draft",
)
async def get_profile_draft(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    draft = RegistrationService.get_or_create_draft(current_user, db)
    return ProfileDraftResponse(
        user_id=draft.user_id,
        current_step=draft.current_step,
        draft_data=draft.draft_data or {},
        last_saved_at=draft.last_saved_at,
    )


@router.put(
    "/draft",
    response_model=ProfileDraftResponse,
    summary="Save / Update Incremental Profile Draft Step",
)
async def update_profile_draft(
    payload: ProfileDraftUpdateRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if db is None:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Database unavailable.")

    draft, completion = RegistrationService.update_draft(
        user=current_user,
        current_step=payload.current_step,
        step_data=payload.draft_data,
        db=db,
    )

    return ProfileDraftResponse(
        user_id=draft.user_id,
        current_step=draft.current_step,
        draft_data=draft.draft_data or {},
        last_saved_at=draft.last_saved_at,
    )

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.models.verification import ProfileVerification
from backend.app.services.database import get_db
from backend.app.services.photo_service import PhotoService
from backend.app.services.verification_service import VerificationService

router = APIRouter(prefix="/verification", tags=["Verification Pipeline"])


@router.get(
    "/status",
    summary="Get Current Profile Verification & Moderation Status",
)
async def get_verification_status(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

    latest_verif = (
        db.query(ProfileVerification)
        .filter(ProfileVerification.profile_id == profile.id)
        .order_by(ProfileVerification.id.desc())
        .first()
    )

    has_min_photos, count = PhotoService.check_min_photos(profile.id, db)

    return {
        "profile_id": profile.id,
        "status": profile.status.value,
        "submitted_at": profile.submitted_at,
        "approved_at": profile.approved_at,
        "rejection_reason": profile.rejection_reason,
        "changes_requested_notes": profile.changes_requested_notes,
        "photos_count": count,
        "has_min_5_photos": has_min_photos,
        "automated_checks_passed": latest_verif.automated_checks_passed if latest_verif else False,
        "flagged_reasons": latest_verif.flagged_reasons if latest_verif else [],
        "checks_detail": latest_verif.checks_detail if latest_verif else {},
    }

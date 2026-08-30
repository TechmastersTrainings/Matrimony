from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import AccountStatus, AuditAction, PhotoStatus, ProfileStatus, ReportStatus, UserRole
from backend.app.models.interaction import UserReport
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.settings import PlatformSetting
from backend.app.models.subscription import PaymentOrder, SubscriptionPlan, UserSubscription
from backend.app.models.user import User
from backend.app.models.verification import AuditLog, ProfileVerification
from backend.app.schemas.profile import ProfileDetailResponse
from backend.app.services.admin_service import AdminService
from backend.app.services.database import get_db

router = APIRouter(prefix="/admin", tags=["Admin Platform Management"])


class RejectProfileRequest(BaseModel):
    reason: str


class RequestChangesRequest(BaseModel):
    notes: str


class ModeratePhotoRequest(BaseModel):
    approved: bool


class UserStatusChangeRequest(BaseModel):
    status: AccountStatus
    reason: str


class PlatformSettingRequest(BaseModel):
    key: str
    value: Any
    description: Optional[str] = None
    category: str = "GENERAL"


# ------------------ DASHBOARD ------------------
@router.get("/dashboard", summary="Admin High-Level Operations & Revenue Metrics")
async def get_dashboard(db: Session = Depends(get_db)):
    metrics = AdminService.get_dashboard_metrics(db)
    return metrics


# ------------------ USERS ------------------
@router.get("/users", summary="List & Search Users with Statuses")
async def list_users(
    search: Optional[str] = None,
    status_filter: Optional[AccountStatus] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(User)
    if status_filter:
        query = query.filter(User.account_status == status_filter)
    if search:
        search_fmt = f"%{search.strip()}%"
        query = query.join(User.profile).filter(
            (User.mobile_number.ilike(search_fmt)) |
            (User.email.ilike(search_fmt)) |
            (Profile.first_name.ilike(search_fmt)) |
            (Profile.last_name.ilike(search_fmt))
        )

    total = query.count()
    users = query.order_by(User.id.desc()).offset(skip).limit(limit).all()

    result = []
    for u in users:
        p = u.profile
        result.append({
            "id": u.id,
            "mobile_number": u.mobile_number,
            "email": u.email,
            "account_status": u.account_status.value,
            "role": u.role.value,
            "first_name": p.first_name if p else "",
            "last_name": p.last_name if p else "",
            "profile_status": p.status.value if p else "DRAFT",
            "completion_percentage": p.completion_percentage if p else 15,
            "denomination": p.denomination.value if p and p.denomination else None,
            "city": p.city if p else "Bidar",
            "created_at": u.created_at,
            "last_login_at": u.last_login_at,
        })

    return {"total": total, "skip": skip, "limit": limit, "users": result}


@router.put("/users/{user_id}/status", summary="Suspend, Reactivate, or Block User")
async def update_user_status(
    user_id: int,
    payload: UserStatusChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user = AdminService.change_user_status(
        admin=current_user,
        user_id=user_id,
        new_status=payload.status,
        reason=payload.reason,
        db=db,
    )
    return {"success": True, "message": f"User status updated to {user.account_status.value}."}


# ------------------ PROFILES MODERATION ------------------
@router.get("/profiles", summary="List Profiles by Moderation Status (SUBMITTED, UNDER_REVIEW, etc.)")
async def list_profiles(
    status_filter: Optional[ProfileStatus] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Profile)
    if status_filter:
        query = query.filter(Profile.status == status_filter)
    else:
        query = query.filter(Profile.status.in_([ProfileStatus.SUBMITTED, ProfileStatus.UNDER_REVIEW, ProfileStatus.CHANGES_REQUIRED]))

    total = query.count()
    profiles = query.order_by(Profile.submitted_at.desc().nullslast(), Profile.id.desc()).offset(skip).limit(limit).all()

    results = []
    for p in profiles:
        photos = db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == p.id).all()
        results.append({
            "id": p.id,
            "user_id": p.user_id,
            "name": f"{p.first_name} {p.last_name}",
            "gender": p.gender.value,
            "age": p.age,
            "denomination": p.denomination.value if p.denomination else None,
            "church_name": p.church_name,
            "status": p.status.value,
            "photos_count": len(photos),
            "photos": [{"id": ph.id, "url": ph.r2_url, "is_primary": ph.is_primary} for ph in photos],
            "submitted_at": p.submitted_at,
            "rejection_reason": p.rejection_reason,
            "changes_requested_notes": p.changes_requested_notes,
        })

    return {"total": total, "profiles": results}


@router.post("/profiles/{profile_id}/approve", summary="Approve Matrimonial Profile")
async def approve_profile(
    profile_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = AdminService.approve_profile(current_user, profile_id, db)
    return {"success": True, "message": f"Profile #{p.id} successfully approved.", "status": p.status.value}


@router.post("/profiles/{profile_id}/reject", summary="Reject Matrimonial Profile with Reason")
async def reject_profile(
    profile_id: int,
    payload: RejectProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = AdminService.reject_profile(current_user, profile_id, payload.reason, db)
    return {"success": True, "message": f"Profile #{p.id} rejected.", "status": p.status.value}


@router.post("/profiles/{profile_id}/request-changes", summary="Request Information / Photo Changes from Candidate")
async def request_changes(
    profile_id: int,
    payload: RequestChangesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = AdminService.request_changes(current_user, profile_id, payload.notes, db)
    return {"success": True, "message": f"Changes requested for Profile #{p.id}.", "status": p.status.value}


# ------------------ PHOTO MODERATION ------------------
@router.post("/photos/{photo_id}/moderate", summary="Approve or Reject a Specific Profile Photo")
async def moderate_photo(
    photo_id: int,
    payload: ModeratePhotoRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    photo = AdminService.moderate_photo(current_user, photo_id, payload.approved, db)
    return {"success": True, "photo_id": photo.id, "status": photo.status.value}


# ------------------ REPORTS QUEUE ------------------
@router.get("/reports", summary="List Open User Reports")
async def list_reports(
    status_filter: Optional[ReportStatus] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(UserReport)
    if status_filter:
        query = query.filter(UserReport.status == status_filter)
    reports = query.order_by(UserReport.id.desc()).all()

    return {
        "reports": [
            {
                "id": r.id,
                "reporter_id": r.reporter_id,
                "reported_user_id": r.reported_user_id,
                "report_type": r.report_type.value,
                "description": r.description,
                "status": r.status.value,
                "created_at": r.created_at,
            }
            for r in reports
        ]
    }


# ------------------ AUDIT LOGS ------------------
@router.get("/audit-logs", summary="List Administrative Audit Trail Logs")
async def list_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    total = db.query(AuditLog).count()
    logs = db.query(AuditLog).order_by(AuditLog.id.desc()).offset(skip).limit(limit).all()

    return {
        "total": total,
        "logs": [
            {
                "id": l.id,
                "admin_user_id": l.admin_user_id,
                "action": l.action.value,
                "target_entity": l.target_entity,
                "target_id": l.target_id,
                "old_value": l.old_value,
                "new_value": l.new_value,
                "reason": l.reason,
                "created_at": l.created_at,
            }
            for l in logs
        ],
    }


# ------------------ PLATFORM SETTINGS ------------------
@router.get("/settings", summary="Get Dynamic Platform Settings")
async def get_settings(db: Session = Depends(get_db)):
    settings_list = db.query(PlatformSetting).all()
    return {
        "settings": [
            {"id": s.id, "key": s.key, "value": s.value, "description": s.description, "category": s.category}
            for s in settings_list
        ]
    }


@router.post("/settings", summary="Create or Update Platform Setting")
async def save_setting(
    payload: PlatformSettingRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    setting = db.query(PlatformSetting).filter(PlatformSetting.key == payload.key).first()
    if not setting:
        setting = PlatformSetting(
            key=payload.key,
            value=payload.value,
            description=payload.description,
            category=payload.category,
        )
        db.add(setting)
    else:
        setting.value = payload.value
        setting.description = payload.description or setting.description
        setting.category = payload.category

    db.commit()
    return {"success": True, "message": f"Setting '{payload.key}' saved successfully."}

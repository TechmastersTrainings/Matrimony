from typing import Any, Dict, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import AccountStatus, AuditAction, PaymentStatus, PhotoStatus, ProfileStatus, ReportStatus, UserRole
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


class PlatformSettingRequest(BaseModel):
    key: str
    value: str
    description: Optional[str] = None
    category: Optional[str] = "general"


def require_admin_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Forbidden: Administrative privileges required to access this resource.",
        )
    return current_user


# ------------------ DASHBOARD METRICS ------------------
@router.get("/dashboard", summary="Administrative Dashboard KPIs")
@router.get("/dashboard-metrics", summary="High-level Administrative KPIs")
async def get_dashboard_metrics(
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    return AdminService.get_dashboard_metrics(db)


# ------------------ USERS MANAGEMENT ------------------
@router.get("/users", summary="Search and List Registered Users")
async def list_users(
    search: Optional[str] = Query(None),
    status_filter: Optional[AccountStatus] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    query = db.query(User).filter(User.role != UserRole.SUPER_ADMIN)
    if search:
        s = f"%{search}%"
        query = query.filter(
            (User.email.ilike(s)) | (User.mobile_number.ilike(s))
        )
    if status_filter:
        query = query.filter(User.account_status == status_filter)

    total = query.count()
    users = query.order_by(User.id.desc()).offset(skip).limit(limit).all()

    results = []
    for u in users:
        profile = db.query(Profile).filter(Profile.user_id == u.id).first()
        sub = db.query(UserSubscription).filter(UserSubscription.user_id == u.id, UserSubscription.status == "ACTIVE").first()
        plan_name = None
        if sub:
            plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == sub.plan_id).first()
            plan_name = plan.name if plan else "VIP Active"

        results.append({
            "id": u.id,
            "email": u.email,
            "mobile_number": u.mobile_number,
            "role": u.role.value if hasattr(u.role, 'value') else str(u.role),
            "account_status": u.account_status.value if hasattr(u.account_status, 'value') else str(u.account_status),
            "is_mobile_verified": u.is_mobile_verified,
            "is_email_verified": u.is_email_verified,
            "first_name": profile.first_name if profile else "",
            "last_name": profile.last_name if profile else "",
            "denomination": profile.denomination.value if (profile and profile.denomination and hasattr(profile.denomination, 'value')) else (str(profile.denomination) if profile and profile.denomination else None),
            "city": profile.district if (profile and profile.district) else (profile.city if profile else "Bidar"),
            "created_at": u.created_at.isoformat() if u.created_at else None,
            "profile_status": (profile.status.value if hasattr(profile.status, 'value') else str(profile.status)) if profile else "NONE",
            "candidate_name": f"{profile.first_name} {profile.last_name}" if profile else None,
            "subscription_plan": plan_name,
        })

    return {"total": total, "users": results}


@router.put("/users/{user_id}/status", summary="Change User Account Status (SUSPENDED, BLOCKED, ACTIVE)")
async def update_user_status(
    user_id: int,
    payload: UserStatusChangeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    target_user = db.query(User).filter(User.id == user_id).first()
    if not target_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    old_status = target_user.account_status
    target_user.account_status = payload.status

    log = AuditLog(
        admin_user_id=current_user.id,
        action=AuditAction.ACCOUNT_STATUS_CHANGE,
        target_entity="User",
        target_id=user_id,
        old_value=old_status.value if hasattr(old_status, 'value') else str(old_status),
        new_value=payload.status.value if hasattr(payload.status, 'value') else str(payload.status),
        reason=f"Status changed to {payload.status.value if hasattr(payload.status, 'value') else str(payload.status)} by admin",
    )
    db.add(log)
    db.commit()

    return {"success": True, "message": f"User status updated to {payload.status.value if hasattr(payload.status, 'value') else str(payload.status)}."}


# ------------------ PROFILES MODERATION ------------------
@router.get("/profiles", summary="List Profiles by Moderation Status (SUBMITTED, UNDER_REVIEW, etc.)")
async def list_profiles(
    status_filter: Optional[ProfileStatus] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
    query = db.query(Profile)
    if status_filter:
        query = query.filter(Profile.status == status_filter)
    else:
        query = query.filter(Profile.status.in_([ProfileStatus.SUBMITTED, ProfileStatus.UNDER_REVIEW, ProfileStatus.CHANGES_REQUIRED]))

    total = query.count()
    profiles = query.order_by(Profile.submitted_at.desc(), Profile.id.desc()).offset(skip).limit(limit).all()

    results = []
    for p in profiles:
        u = db.query(User).filter(User.id == p.user_id).first()
        photos = db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == p.id).all()
        results.append({
            "id": p.id,
            "user_id": p.user_id,
            "name": f"{p.first_name} {p.last_name}",
            "first_name": p.first_name,
            "last_name": p.last_name,
            "mobile_number": u.mobile_number if u else "",
            "email": u.email if u else "",
            "gender": p.gender.value if hasattr(p.gender, 'value') else str(p.gender) if p.gender else None,
            "dob": p.dob.isoformat() if p.dob else None,
            "age": p.age,
            "marital_status": p.marital_status.value if hasattr(p.marital_status, 'value') else str(p.marital_status) if p.marital_status else None,
            "height_cm": p.height_cm,
            "physical_status": p.physical_status.value if hasattr(p.physical_status, 'value') else str(p.physical_status) if p.physical_status else None,
            "mother_tongue": p.mother_tongue,
            "denomination": p.denomination.value if hasattr(p.denomination, 'value') else str(p.denomination) if p.denomination else None,
            "sub_denomination": p.sub_denomination,
            "church_name": p.church_name,
            "parish_or_pastor": p.parish_or_pastor,
            "is_baptized": p.is_baptized,
            "faith_testimony": p.faith_testimony,
            "highest_education": p.highest_education,
            "occupation_title": p.occupation_title,
            "employed_in": p.employed_in,
            "annual_income_min": p.annual_income_min,
            "work_location": p.work_location,
            "father_name": p.father_name,
            "father_occupation": p.father_occupation,
            "mother_name": p.mother_name,
            "mother_occupation": p.mother_occupation,
            "family_status": p.family_status.value if hasattr(p.family_status, 'value') else str(p.family_status) if p.family_status else None,
            "family_values": p.family_values.value if hasattr(p.family_values, 'value') else str(p.family_values) if p.family_values else None,
            "native_place": p.native_place,
            "district": p.district,
            "state": p.state,
            "pincode": p.pincode,
            "bio": p.bio,
            "partner_preferences": p.partner_preferences,
            "status": p.status.value if hasattr(p.status, 'value') else str(p.status) if p.status else None,
            "photos_count": len(photos),
            "photos": [{"id": ph.id, "url": ph.r2_url, "is_primary": ph.is_primary} for ph in photos],
            "submitted_at": p.submitted_at.isoformat() if p.submitted_at else None,
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
    return {"success": True, "message": f"Profile #{p.id} successfully approved.", "status": p.status.value if hasattr(p.status, 'value') else str(p.status)}


@router.post("/profiles/{profile_id}/reject", summary="Reject Matrimonial Profile with Reason")
async def reject_profile(
    profile_id: int,
    payload: RejectProfileRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = AdminService.reject_profile(current_user, profile_id, payload.reason, db)
    return {"success": True, "message": f"Profile #{p.id} rejected.", "status": p.status.value if hasattr(p.status, 'value') else str(p.status)}


@router.post("/profiles/{profile_id}/request-changes", summary="Request Information / Photo Changes from Candidate")
async def request_changes(
    profile_id: int,
    payload: RequestChangesRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    p = AdminService.request_changes(current_user, profile_id, payload.notes, db)
    return {"success": True, "message": f"Changes requested for Profile #{p.id}.", "status": p.status.value if hasattr(p.status, 'value') else str(p.status)}


class DeleteProfilePayload(BaseModel):
    reason: Optional[str] = "Candidate decommissioned (found match / requested deletion)"
    delete_user_account: bool = True


@router.delete("/profiles/{profile_id}", summary="Permanently Delete Profile and Candidate Data (Super Admin / Admin)")
async def delete_profile(
    profile_id: int,
    payload: Optional[DeleteProfilePayload] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    reason = payload.reason if payload and payload.reason else "Candidate found match / decommissioned"
    del_acc = payload.delete_user_account if payload else True
    return AdminService.delete_profile(current_user, profile_id, reason, del_acc, db)


# ------------------ PHOTO MODERATION ------------------
@router.post("/photos/{photo_id}/moderate", summary="Approve or Reject a Specific Profile Photo")
async def moderate_photo(
    photo_id: int,
    payload: ModeratePhotoRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    photo = AdminService.moderate_photo(current_user, photo_id, payload.approved, db)
    return {"success": True, "photo_id": photo.id, "status": photo.status.value if hasattr(photo.status, 'value') else str(photo.status)}


# ------------------ REPORTS QUEUE ------------------
@router.get("/reports", summary="List Open User Reports")
async def list_reports(
    status_filter: Optional[ReportStatus] = Query(None),
    current_user: User = Depends(require_admin_user),
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
                "report_type": r.report_type.value if hasattr(r.report_type, 'value') else str(r.report_type),
                "description": r.description,
                "status": r.status.value if hasattr(r.status, 'value') else str(r.status),
                "created_at": r.created_at.isoformat() if r.created_at else None,
            }
            for r in reports
        ]
    }


# ------------------ AUDIT LOGS ------------------
@router.get("/audit-logs", summary="List Administrative Audit Trail Logs")
async def list_audit_logs(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(require_admin_user),
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
                "action": l.action.value if hasattr(l.action, 'value') else str(l.action),
                "target_entity": l.target_entity,
                "target_id": l.target_id,
                "old_value": l.old_value,
                "new_value": l.new_value,
                "reason": l.reason,
                "created_at": l.created_at.isoformat() if l.created_at else None,
            }
            for l in logs
        ],
    }


# ------------------ PLATFORM SETTINGS ------------------
@router.get("/settings", summary="Get Dynamic Platform Settings")
async def get_settings(
    current_user: User = Depends(require_admin_user),
    db: Session = Depends(get_db),
):
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

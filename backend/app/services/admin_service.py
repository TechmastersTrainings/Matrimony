from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.core.logger import logger
from backend.app.models.enums import AccountStatus, AuditAction, PhotoStatus, ProfileStatus, ReportStatus, UserRole
from backend.app.models.interaction import UserReport
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.settings import PlatformSetting
from backend.app.models.subscription import PaymentOrder, UserSubscription
from backend.app.models.user import User
from backend.app.models.verification import AuditLog, ProfileVerification


class AdminService:
    @staticmethod
    def log_audit(
        admin: User,
        action: AuditAction,
        target_entity: str,
        target_id: int,
        old_val: Optional[Dict[str, Any]],
        new_val: Optional[Dict[str, Any]],
        reason: Optional[str],
        db: Session,
    ) -> AuditLog:
        log = AuditLog(
            admin_user_id=admin.id,
            action=action,
            target_entity=target_entity,
            target_id=target_id,
            old_value=old_val,
            new_value=new_val,
            reason=reason,
        )
        db.add(log)
        db.commit()
        return log

    @staticmethod
    def get_dashboard_metrics(db: Session) -> Dict[str, Any]:
        total_users = db.query(User).count()
        active_users = db.query(User).filter(User.account_status == AccountStatus.ACTIVE).count()
        pending_profiles = db.query(Profile).filter(Profile.status.in_([ProfileStatus.SUBMITTED, ProfileStatus.UNDER_REVIEW])).count()
        approved_profiles = db.query(Profile).filter(Profile.status == ProfileStatus.APPROVED).count()
        rejected_profiles = db.query(Profile).filter(Profile.status == ProfileStatus.REJECTED).count()

        active_subs = db.query(UserSubscription).filter(UserSubscription.status == "ACTIVE").count()
        payments = db.query(PaymentOrder).filter(PaymentOrder.status == "PAID").all()
        total_revenue_inr = sum(p.amount_inr for p in payments)

        pending_reports = db.query(UserReport).filter(UserReport.status == ReportStatus.PENDING).count()

        return {
            "total_users": total_users,
            "active_users": active_users,
            "pending_profiles": pending_profiles,
            "approved_profiles": approved_profiles,
            "rejected_profiles": rejected_profiles,
            "active_subscriptions": active_subs,
            "total_revenue_inr": total_revenue_inr,
            "pending_reports": pending_reports,
            "target_region": "Bidar, Karnataka, India",
        }

    # ------------------ PROFILE MODERATION ------------------
    @staticmethod
    def approve_profile(admin: User, profile_id: int, db: Session) -> Profile:
        profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

        old_status = profile.status.value
        profile.status = ProfileStatus.APPROVED
        profile.approved_at = datetime.utcnow()
        profile.rejection_reason = None
        profile.changes_requested_notes = None

        # Auto-approve pending photos
        db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == profile_id).update({"status": PhotoStatus.APPROVED})

        # Save snapshot of approved data
        profile.approved_data_snapshot = {
            "first_name": profile.first_name,
            "last_name": profile.last_name,
            "denomination": profile.denomination.value if profile.denomination else None,
            "church_name": profile.church_name,
            "highest_education": profile.highest_education,
            "occupation_title": profile.occupation_title,
            "district": profile.district,
        }

        # Activate user account if pending
        user = db.query(User).filter(User.id == profile.user_id).first()
        if user and user.account_status == AccountStatus.PENDING_VERIFICATION:
            user.account_status = AccountStatus.ACTIVE

        db.commit()

        AdminService.log_audit(
            admin=admin,
            action=AuditAction.PROFILE_APPROVE,
            target_entity="PROFILE",
            target_id=profile.id,
            old_val={"status": old_status},
            new_val={"status": ProfileStatus.APPROVED.value},
            reason="Approved by pastoral / admin moderator",
            db=db,
        )

        return profile

    @staticmethod
    def reject_profile(admin: User, profile_id: int, reason: str, db: Session) -> Profile:
        if not reason.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Rejection reason is mandatory.")

        profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

        old_status = profile.status.value
        profile.status = ProfileStatus.REJECTED
        profile.rejection_reason = reason.strip()
        db.commit()

        AdminService.log_audit(
            admin=admin,
            action=AuditAction.PROFILE_REJECT,
            target_entity="PROFILE",
            target_id=profile.id,
            old_val={"status": old_status},
            new_val={"status": ProfileStatus.REJECTED.value},
            reason=reason,
            db=db,
        )

        return profile

    @staticmethod
    def request_changes(admin: User, profile_id: int, notes: str, db: Session) -> Profile:
        if not notes.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Notes describing requested changes are required.")

        profile = db.query(Profile).filter(Profile.id == profile_id).first()
        if not profile:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

        old_status = profile.status.value
        profile.status = ProfileStatus.CHANGES_REQUIRED
        profile.changes_requested_notes = notes.strip()
        db.commit()

        AdminService.log_audit(
            admin=admin,
            action=AuditAction.PROFILE_REQUEST_CHANGES,
            target_entity="PROFILE",
            target_id=profile.id,
            old_val={"status": old_status},
            new_val={"status": ProfileStatus.CHANGES_REQUIRED.value},
            reason=notes,
            db=db,
        )

        return profile

    # ------------------ PHOTO MODERATION ------------------
    @staticmethod
    def moderate_photo(admin: User, photo_id: int, approved: bool, db: Session) -> ProfilePhoto:
        photo = db.query(ProfilePhoto).filter(ProfilePhoto.id == photo_id).first()
        if not photo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found.")

        photo.status = PhotoStatus.APPROVED if approved else PhotoStatus.REJECTED
        db.commit()

        AdminService.log_audit(
            admin=admin,
            action=AuditAction.PHOTO_MODERATE,
            target_entity="PHOTO",
            target_id=photo.id,
            old_val=None,
            new_val={"status": photo.status.value},
            reason="Admin photo moderation",
            db=db,
        )
        return photo

    # ------------------ USER MANAGEMENT ------------------
    @staticmethod
    def change_user_status(admin: User, user_id: int, new_status: AccountStatus, reason: str, db: Session) -> User:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")

        old_status = user.account_status.value
        user.account_status = new_status
        db.commit()

        action = AuditAction.USER_SUSPEND if new_status == AccountStatus.SUSPENDED else AuditAction.USER_REACTIVATE
        AdminService.log_audit(
            admin=admin,
            action=action,
            target_entity="USER",
            target_id=user.id,
            old_val={"account_status": old_status},
            new_val={"account_status": new_status.value},
            reason=reason,
            db=db,
        )
        return user

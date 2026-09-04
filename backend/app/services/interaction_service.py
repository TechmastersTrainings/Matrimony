from datetime import datetime, timezone
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.models.enums import InterestStatus, ReportStatus, ReportType, UserRole
from backend.app.models.interaction import UserBlock, UserInterest, UserReport
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.subscription import UserSubscription
from backend.app.models.user import User


class InteractionService:
    # ------------------ INTERESTS & MATCHES ------------------
    @staticmethod
    def send_interest(sender: User, target_user_id: int, message: Optional[str], db: Session) -> UserInterest:
        if sender.id == target_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot send interest to yourself.")

        # Require active subscription for sender
        active_sub = db.query(UserSubscription).filter(
            UserSubscription.user_id == sender.id,
            UserSubscription.status == "ACTIVE"
        ).first()
        if not active_sub and sender.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="An active subscription plan is required to express interest in Christian matrimonial profiles."
            )

        # Strict Christian Matrimony gender validation: Groom matches Bride only
        sender_profile = db.query(Profile).filter(Profile.user_id == sender.id).first()
        target_profile = db.query(Profile).filter(Profile.user_id == target_user_id).first()
        if sender_profile and target_profile and sender.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            if sender_profile.gender and target_profile.gender and sender_profile.gender == target_profile.gender:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Christian Matrimony connects grooms with brides and brides with grooms. Matrimonial interests can only be sent to the opposite gender.",
                )

        # Check existing block
        blocked = db.query(UserBlock).filter(
            ((UserBlock.blocker_id == sender.id) & (UserBlock.blocked_id == target_user_id)) |
            ((UserBlock.blocker_id == target_user_id) & (UserBlock.blocked_id == sender.id))
        ).first()
        if blocked:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Cannot interact with this profile.")

        # Check existing interest
        existing = db.query(UserInterest).filter(
            UserInterest.sender_id == sender.id,
            UserInterest.receiver_id == target_user_id,
        ).first()

        if existing:
            if existing.status == InterestStatus.PENDING:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Interest is already pending.")
            setattr(existing, "status", InterestStatus.PENDING)
            setattr(existing, "message", message or "")
            setattr(existing, "created_at", datetime.now(timezone.utc).replace(tzinfo=None))
            db.commit()
            return existing

        interest = UserInterest(
            sender_id=sender.id,
            receiver_id=target_user_id,
            status=InterestStatus.PENDING,
            message=message,
        )
        db.add(interest)
        db.commit()
        db.refresh(interest)
        return interest

    @staticmethod
    def respond_interest(user: User, interest_id: int, accept: bool, db: Session) -> UserInterest:
        # Require active subscription to accept/decline match
        active_sub = db.query(UserSubscription).filter(
            UserSubscription.user_id == user.id,
            UserSubscription.status == "ACTIVE"
        ).first()
        if not active_sub and user.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            raise HTTPException(
                status_code=status.HTTP_402_PAYMENT_REQUIRED,
                detail="An active subscription plan is required to view candidate details and accept matches."
            )

        interest = db.query(UserInterest).filter(
            UserInterest.id == interest_id,
            UserInterest.receiver_id == user.id,
        ).first()

        if not interest:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interest request not found.")

        setattr(interest, "status", InterestStatus.ACCEPTED if accept else InterestStatus.DECLINED)
        setattr(interest, "responded_at", datetime.now(timezone.utc).replace(tzinfo=None))
        db.commit()
        db.refresh(interest)
        return interest

    @staticmethod
    def get_user_interests(user: User, tab: str, db: Session) -> List[Dict[str, Any]]:
        # Check receiver's subscription status
        active_sub = db.query(UserSubscription).filter(
            UserSubscription.user_id == user.id,
            UserSubscription.status == "ACTIVE"
        ).first()
        is_subscriber = active_sub is not None or user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]

        # tab: 'received', 'sent', 'matches'
        if tab == "received":
            query = db.query(UserInterest).filter(UserInterest.receiver_id == user.id)
        elif tab == "sent":
            query = db.query(UserInterest).filter(UserInterest.sender_id == user.id)
        elif tab == "matches":
            query = db.query(UserInterest).filter(
                ((UserInterest.receiver_id == user.id) | (UserInterest.sender_id == user.id)),
                UserInterest.status == InterestStatus.ACCEPTED,
            )
        else:
            query = db.query(UserInterest).filter(UserInterest.receiver_id == user.id)

        items = query.order_by(UserInterest.created_at.desc()).all()
        results = []
        for item in items:
            other_user_id = item.sender_id if item.receiver_id == user.id else item.receiver_id
            other_profile = db.query(Profile).filter(Profile.user_id == other_user_id).first()
            primary_photo = (
                db.query(ProfilePhoto)
                .filter(ProfilePhoto.profile_id == other_profile.id, ProfilePhoto.is_primary == True)
                .first()
                if other_profile
                else None
            )

            # If user is unpaid and viewing received interests, mask details according to business rule 8
            if tab == "received" and not is_subscriber:
                results.append({
                    "id": item.id,
                    "status": item.status.value,
                    "message": "🔒 Upgrade to view message",
                    "created_at": item.created_at.isoformat() if item.created_at else None,
                    "responded_at": item.responded_at.isoformat() if item.responded_at else None,
                    "is_locked": True,
                    "requires_subscription": True,
                    "other_user": {
                        "user_id": other_user_id,
                        "first_name": "Verified Member",
                        "last_name": "",
                        "age": other_profile.age if other_profile else None,
                        "denomination": other_profile.denomination.value if other_profile and other_profile.denomination else "Christian",
                        "district": other_profile.district if other_profile else "Karnataka",
                        "primary_photo": primary_photo.r2_url if primary_photo else None,
                    },
                })
            else:
                results.append({
                    "id": item.id,
                    "status": item.status.value,
                    "message": item.message,
                    "created_at": item.created_at.isoformat() if item.created_at else None,
                    "responded_at": item.responded_at.isoformat() if item.responded_at else None,
                    "is_locked": False,
                    "requires_subscription": False,
                    "other_user": {
                        "user_id": other_user_id,
                        "first_name": other_profile.first_name if other_profile else "Member",
                        "last_name": other_profile.last_name[0] + "." if other_profile and other_profile.last_name else "",
                        "age": other_profile.age if other_profile else None,
                        "gender": other_profile.gender.value if other_profile and other_profile.gender else None,
                        "denomination": other_profile.denomination.value if other_profile and other_profile.denomination else None,
                        "highest_education": other_profile.highest_education if other_profile else None,
                        "occupation_title": other_profile.occupation_title if other_profile else None,
                        "district": other_profile.district if other_profile else None,
                        "primary_photo": primary_photo.r2_url if primary_photo else None,
                    },
                })

        return results

    # ------------------ BLOCK & REPORT ------------------
    @staticmethod
    def block_user(blocker: User, target_user_id: int, reason: Optional[str], db: Session) -> UserBlock:
        if blocker.id == target_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot block yourself.")

        existing = db.query(UserBlock).filter(
            UserBlock.blocker_id == blocker.id,
            UserBlock.blocked_id == target_user_id,
        ).first()
        if existing:
            return existing

        block = UserBlock(blocker_id=blocker.id, blocked_id=target_user_id, reason=reason)
        db.add(block)
        db.commit()
        db.refresh(block)
        return block

    @staticmethod
    def unblock_user(blocker: User, target_user_id: int, db: Session):
        db.query(UserBlock).filter(
            UserBlock.blocker_id == blocker.id,
            UserBlock.blocked_id == target_user_id,
        ).delete()
        db.commit()

    @staticmethod
    def report_user(
        reporter: User,
        target_user_id: int,
        report_type: ReportType,
        description: str,
        evidence_url: Optional[str],
        db: Session,
    ) -> UserReport:
        if reporter.id == target_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot report yourself.")

        report = UserReport(
            reporter_id=reporter.id,
            reported_user_id=target_user_id,
            report_type=report_type,
            description=description,
            evidence_url=evidence_url,
            status=ReportStatus.PENDING,
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.models.enums import InterestStatus, ReportStatus, ReportType
from backend.app.models.interaction import UserBlock, UserInterest, UserReport
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User


class InteractionService:
    # ------------------ INTERESTS & MATCHES ------------------
    @staticmethod
    def send_interest(sender: User, target_user_id: int, message: Optional[str], db: Session) -> UserInterest:
        if sender.id == target_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot send interest to yourself.")

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
            existing.status = InterestStatus.PENDING
            existing.message = message
            existing.created_at = datetime.utcnow()
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
        interest = db.query(UserInterest).filter(
            UserInterest.id == interest_id,
            UserInterest.receiver_id == user.id,
        ).first()

        if not interest:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Interest request not found.")

        interest.status = InterestStatus.ACCEPTED if accept else InterestStatus.DECLINED
        interest.responded_at = datetime.utcnow()
        db.commit()
        db.refresh(interest)
        return interest

    @staticmethod
    def get_user_interests(user: User, tab: str, db: Session) -> List[Dict[str, Any]]:
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

            results.append({
                "id": item.id,
                "status": item.status.value,
                "message": item.message,
                "created_at": item.created_at,
                "responded_at": item.responded_at,
                "is_sender": item.sender_id == user.id,
                "other_user": {
                    "id": other_user_id,
                    "first_name": other_profile.first_name if other_profile else "User",
                    "last_name": other_profile.last_name[:1] + "." if other_profile and other_profile.last_name else "",
                    "age": other_profile.age if other_profile else None,
                    "denomination": other_profile.denomination.value if other_profile and other_profile.denomination else "Christian",
                    "district": other_profile.district if other_profile else "Bidar",
                    "primary_photo": primary_photo.r2_url if primary_photo else None,
                },
            })
        return results

    # ------------------ BLOCKING ------------------
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

        # Cancel any pending interests
        db.query(UserInterest).filter(
            ((UserInterest.sender_id == blocker.id) & (UserInterest.receiver_id == target_user_id)) |
            ((UserInterest.sender_id == target_user_id) & (UserInterest.receiver_id == blocker.id))
        ).update({"status": InterestStatus.CANCELLED})

        db.commit()
        return block

    @staticmethod
    def unblock_user(blocker: User, target_user_id: int, db: Session) -> bool:
        db.query(UserBlock).filter(
            UserBlock.blocker_id == blocker.id,
            UserBlock.blocked_id == target_user_id,
        ).delete()
        db.commit()
        return True

    # ------------------ REPORTING ------------------
    @staticmethod
    def report_user(
        reporter: User,
        reported_user_id: int,
        report_type: ReportType,
        description: str,
        evidence_url: Optional[str],
        db: Session,
    ) -> UserReport:
        report = UserReport(
            reporter_id=reporter.id,
            reported_user_id=reported_user_id,
            report_type=report_type,
            description=description,
            evidence_url=evidence_url,
            status=ReportStatus.PENDING,
        )
        db.add(report)
        db.commit()
        db.refresh(report)
        return report

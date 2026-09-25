from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.core.logger import logger
from backend.app.models.enums import InterestStatus, ModerationAction
from backend.app.models.interaction import ChatMessage, UserBlock, UserInterest
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.services.chat_policy_engine import ChatPolicyEngine


class ChatService:
    MESSAGE_TTL_HOURS = 4

    @staticmethod
    def purge_expired_messages(db: Session) -> int:
        """
        Permanently purges chat messages older than 4 hours from the database.
        Ensures zero lingering message history for regular users and administrators.
        """
        try:
            cutoff = datetime.utcnow() - timedelta(hours=ChatService.MESSAGE_TTL_HOURS)
            deleted_count = (
                db.query(ChatMessage)
                .filter(ChatMessage.created_at < cutoff)
                .delete(synchronize_session=False)
            )
            if deleted_count > 0:
                db.commit()
                logger.info(f"Purged {deleted_count} expired chat messages older than 4 hours.")
            return deleted_count
        except Exception as e:
            logger.warning(f"Error purging expired chat messages: {e}")
            db.rollback()
            return 0

    @staticmethod
    def check_chat_permission(user1_id: int, user2_id: int, db: Session) -> bool:
        """Ensures users are mutually connected (accepted interest) and neither is blocked."""
        # 1. Block check
        blocked = db.query(UserBlock).filter(
            ((UserBlock.blocker_id == user1_id) & (UserBlock.blocked_id == user2_id)) |
            ((UserBlock.blocker_id == user2_id) & (UserBlock.blocked_id == user1_id))
        ).first()
        if blocked:
            return False

        # 2. Connection check
        connection = db.query(UserInterest).filter(
            ((UserInterest.sender_id == user1_id) & (UserInterest.receiver_id == user2_id)) |
            ((UserInterest.sender_id == user2_id) & (UserInterest.receiver_id == user1_id)),
            UserInterest.status == InterestStatus.ACCEPTED,
        ).first()

        return connection is not None

    @staticmethod
    def send_message(
        sender: User,
        receiver_id: int,
        text: str,
        db: Session,
        attachment_url: Optional[str] = None,
        attachment_type: Optional[str] = None,
    ) -> ChatMessage:
        if (not text or not text.strip()) and not attachment_url:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty.")

        # Always purge expired messages prior to sending new ones
        ChatService.purge_expired_messages(db)

        if not ChatService.check_chat_permission(sender.id, receiver_id, db):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chat is restricted to mutually accepted matches.",
            )

        # Enforce Basic Christian Plan limit: In-app messaging with up to 5 matches
        from backend.app.models.subscription import UserSubscription
        from backend.app.models.enums import SubscriptionPlanCode, UserRole
        if sender.role not in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
            user_sub = db.query(UserSubscription).filter(
                UserSubscription.user_id == sender.id,
                UserSubscription.status == "ACTIVE"
            ).first()
            if user_sub and getattr(user_sub, "plan", None) and user_sub.plan.plan_code == SubscriptionPlanCode.BASIC:
                chatted_partners = db.query(ChatMessage.receiver_id).filter(
                    ChatMessage.sender_id == sender.id
                ).distinct().all()
                chatted_ids = {c[0] for c in chatted_partners}
                if receiver_id not in chatted_ids and len(chatted_ids) >= 5:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="Your Basic Christian Plan includes in-app messaging with up to 5 matches. Please upgrade to Standard or Premium for unlimited messaging with all matches.",
                    )

        # 3. Server-side Safety & Zero-Tolerance Contact Sharing Interception
        clean_text = text.strip() if text else ""
        safe_text = clean_text
        is_redacted = False
        redaction_reason = None

        if clean_text:
            safe_text, action, warning = ChatPolicyEngine.evaluate_and_enforce(
                text=clean_text,
                sender=sender,
                receiver_id=receiver_id,
                db=db,
            )
            is_redacted = action == ModerationAction.REDACT
            redaction_reason = "PROHIBITED_CONTACT_INFORMATION" if is_redacted else None

        # Persist ONLY the safe/redacted message (prohibited contact details NEVER touch the DB)
        msg = ChatMessage(
            sender_id=sender.id,
            receiver_id=receiver_id,
            message_text=safe_text,
            is_read=False,
            is_redacted=is_redacted,
            redaction_reason=redaction_reason,
            attachment_url=attachment_url,
            attachment_type=attachment_type,
        )
        db.add(msg)
        db.commit()
        db.refresh(msg)
        return msg

    @staticmethod
    def get_conversation(
        user: User,
        other_user_id: int,
        db: Session,
        skip: int = 0,
        limit: int = 50,
    ) -> List[Dict[str, Any]]:
        # 1. Purge expired messages older than 4 hours
        ChatService.purge_expired_messages(db)

        cutoff = datetime.utcnow() - timedelta(hours=ChatService.MESSAGE_TTL_HOURS)

        # 2. Mark received unread messages as read
        db.query(ChatMessage).filter(
            ChatMessage.sender_id == other_user_id,
            ChatMessage.receiver_id == user.id,
            ChatMessage.is_read == False,
            ChatMessage.created_at >= cutoff,
        ).update({"is_read": True, "read_at": datetime.utcnow()})
        db.commit()

        # 3. Fetch messages strictly within the 4-hour window
        messages = (
            db.query(ChatMessage)
            .filter(
                ((ChatMessage.sender_id == user.id) & (ChatMessage.receiver_id == other_user_id)) |
                ((ChatMessage.sender_id == other_user_id) & (ChatMessage.receiver_id == user.id)),
                ChatMessage.created_at >= cutoff,
            )
            .order_by(ChatMessage.created_at.asc())
            .offset(skip)
            .limit(limit)
            .all()
        )

        return [
            {
                "id": m.id,
                "sender_id": m.sender_id,
                "receiver_id": m.receiver_id,
                "message_text": m.message_text,
                "is_read": m.is_read,
                "is_redacted": m.is_redacted,
                "redaction_reason": m.redaction_reason,
                "attachment_url": m.attachment_url,
                "attachment_type": m.attachment_type,
                "created_at": m.created_at,
                "is_me": m.sender_id == user.id,
            }
            for m in messages
        ]

    @staticmethod
    def get_user_conversations(user: User, db: Session) -> List[Dict[str, Any]]:
        # Purge messages older than 4 hours
        ChatService.purge_expired_messages(db)
        cutoff = datetime.utcnow() - timedelta(hours=ChatService.MESSAGE_TTL_HOURS)

        # Find all accepted match partners
        matches = db.query(UserInterest).filter(
            ((UserInterest.receiver_id == user.id) | (UserInterest.sender_id == user.id)),
            UserInterest.status == InterestStatus.ACCEPTED,
        ).all()

        seen_partners = set()
        results = []
        for m in matches:
            other_id = m.sender_id if m.receiver_id == user.id else m.receiver_id
            if other_id in seen_partners:
                continue
            seen_partners.add(other_id)

            other_profile = db.query(Profile).filter(Profile.user_id == other_id).first()
            primary_photo = (
                db.query(ProfilePhoto)
                .filter(ProfilePhoto.profile_id == other_profile.id, ProfilePhoto.is_primary == True)
                .first()
                if other_profile
                else None
            )

            # Last message strictly within the 4-hour window
            last_msg = (
                db.query(ChatMessage)
                .filter(
                    ((ChatMessage.sender_id == user.id) & (ChatMessage.receiver_id == other_id)) |
                    ((ChatMessage.sender_id == other_id) & (ChatMessage.receiver_id == user.id)),
                    ChatMessage.created_at >= cutoff,
                )
                .order_by(ChatMessage.id.desc())
                .first()
            )

            unread_count = (
                db.query(ChatMessage)
                .filter(
                    ChatMessage.sender_id == other_id,
                    ChatMessage.receiver_id == user.id,
                    ChatMessage.is_read == False,
                    ChatMessage.created_at >= cutoff,
                )
                .count()
            )

            other_user_data = {
                "id": other_id,
                "profile_id": other_profile.id if other_profile else None,
                "first_name": other_profile.first_name if other_profile else "Member",
                "last_name": (other_profile.last_name[0] + ".") if (other_profile and other_profile.last_name) else "",
                "gender": str(getattr(other_profile.gender, "value", other_profile.gender) or "") if other_profile else "",
                "age": other_profile.age if other_profile else None,
                "height_cm": other_profile.height_cm if other_profile else None,
                "marital_status": str(getattr(other_profile.marital_status, "value", other_profile.marital_status) or "") if other_profile else "",
                "denomination": str(getattr(other_profile.denomination, "value", other_profile.denomination) or "") if other_profile else "Christian",
                "sub_denomination": other_profile.sub_denomination if other_profile else None,
                "church_name": other_profile.church_name if other_profile else None,
                "district": other_profile.district if other_profile else None,
                "state": other_profile.state if other_profile else None,
                "highest_education": other_profile.highest_education if other_profile else None,
                "occupation_title": other_profile.occupation_title if other_profile else None,
                "about_me": other_profile.bio if other_profile else None,
                "bio": other_profile.bio if other_profile else None,
                "primary_photo": primary_photo.r2_url if primary_photo else None,
            } if other_profile else None

            results.append({
                "other_user_id": other_id,
                "name": f"{other_profile.first_name} {other_profile.last_name[:1]}." if other_profile else "User",
                "denomination": other_profile.denomination.value if (other_profile and other_profile.denomination) else "Christian",
                "primary_photo": primary_photo.r2_url if primary_photo else None,
                "last_message": last_msg.message_text if last_msg else "No active messages (Auto-cleared after 4h)",
                "last_message_at": last_msg.created_at if last_msg else m.responded_at,
                "unread_count": unread_count,
                "other_user": other_user_data,
            })

        return results

    @staticmethod
    def get_partner_profile(user_id: int, other_user_id: int, db: Session) -> Optional[Dict[str, Any]]:
        """Returns verified candidate profile details for mutually accepted matches."""
        if not ChatService.check_chat_permission(user_id, other_user_id, db):
            return None
        profile = db.query(Profile).filter(Profile.user_id == other_user_id).first()
        if not profile:
            return None
        primary_photo = (
            db.query(ProfilePhoto)
            .filter(ProfilePhoto.profile_id == profile.id, ProfilePhoto.is_primary == True)
            .first()
        )
        return {
            "id": other_user_id,
            "profile_id": profile.id,
            "first_name": profile.first_name,
            "last_name": (profile.last_name[0] + ".") if profile.last_name else "",
            "gender": str(getattr(profile.gender, "value", profile.gender) or ""),
            "age": profile.age,
            "height_cm": profile.height_cm,
            "marital_status": str(getattr(profile.marital_status, "value", profile.marital_status) or ""),
            "denomination": str(getattr(profile.denomination, "value", profile.denomination) or "Christian"),
            "sub_denomination": profile.sub_denomination,
            "church_name": profile.church_name,
            "district": profile.district,
            "state": profile.state,
            "highest_education": profile.highest_education,
            "occupation_title": profile.occupation_title,
            "annual_income_min": profile.annual_income_min,
            "about_me": profile.bio,
            "bio": profile.bio,
            "primary_photo": primary_photo.r2_url if primary_photo else None,
        }

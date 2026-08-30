from datetime import datetime
from typing import Any, Dict, List, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.models.enums import InterestStatus
from backend.app.models.interaction import ChatMessage, UserBlock, UserInterest
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User


class ChatService:
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
    def send_message(sender: User, receiver_id: int, text: str, db: Session) -> ChatMessage:
        if not text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Message cannot be empty.")

        if not ChatService.check_chat_permission(sender.id, receiver_id, db):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Chat is restricted to mutually accepted matches.",
            )

        msg = ChatMessage(
            sender_id=sender.id,
            receiver_id=receiver_id,
            message_text=text.strip(),
            is_read=False,
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
        # Mark received unread messages as read
        db.query(ChatMessage).filter(
            ChatMessage.sender_id == other_user_id,
            ChatMessage.receiver_id == user.id,
            ChatMessage.is_read == False,
        ).update({"is_read": True, "read_at": datetime.utcnow()})
        db.commit()

        messages = (
            db.query(ChatMessage)
            .filter(
                ((ChatMessage.sender_id == user.id) & (ChatMessage.receiver_id == other_user_id)) |
                ((ChatMessage.sender_id == other_user_id) & (ChatMessage.receiver_id == user.id))
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
                "created_at": m.created_at,
                "is_me": m.sender_id == user.id,
            }
            for m in messages
        ]

    @staticmethod
    def get_user_conversations(user: User, db: Session) -> List[Dict[str, Any]]:
        # Find all accepted match partners
        matches = db.query(UserInterest).filter(
            ((UserInterest.receiver_id == user.id) | (UserInterest.sender_id == user.id)),
            UserInterest.status == InterestStatus.ACCEPTED,
        ).all()

        results = []
        for m in matches:
            other_id = m.sender_id if m.receiver_id == user.id else m.receiver_id
            other_profile = db.query(Profile).filter(Profile.user_id == other_id).first()
            primary_photo = (
                db.query(ProfilePhoto)
                .filter(ProfilePhoto.profile_id == other_profile.id, ProfilePhoto.is_primary == True)
                .first()
                if other_profile
                else None
            )

            last_msg = (
                db.query(ChatMessage)
                .filter(
                    ((ChatMessage.sender_id == user.id) & (ChatMessage.receiver_id == other_id)) |
                    ((ChatMessage.sender_id == other_id) & (ChatMessage.receiver_id == user.id))
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
                )
                .count()
            )

            results.append({
                "other_user_id": other_id,
                "name": f"{other_profile.first_name} {other_profile.last_name[:1]}." if other_profile else "User",
                "denomination": other_profile.denomination.value if other_profile and other_profile.denomination else "Methodist",
                "primary_photo": primary_photo.r2_url if primary_photo else None,
                "last_message": last_msg.message_text if last_msg else None,
                "last_message_at": last_msg.created_at if last_msg else m.responded_at,
                "unread_count": unread_count,
            })

        return results

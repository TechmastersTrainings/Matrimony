from datetime import datetime, timedelta
from typing import Dict, Optional, Tuple
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.logger import logger
from backend.app.models.enums import (
    AccountStatus,
    ContactRevealStatus,
    InterestStatus,
    ModerationAction,
    ModerationCategory,
    ModerationSeverity,
    ModerationStatus,
    UserRole,
)
from backend.app.models.interaction import ChatModerationEvent, UserChatRestriction, UserInterest
from backend.app.models.subscription import ContactRevealRequest
from backend.app.models.user import User
from backend.app.services.contact_detection_service import ContactDetectionService, DetectionResult
from backend.app.services.redis import get_redis_client


class ChatPolicyEngine:
    # Thresholds for violation escalation
    WARN_THRESHOLD = 1
    STERN_WARN_THRESHOLD = 2
    RESTRICT_THRESHOLD = 3
    SUSPEND_THRESHOLD = 5

    VIOLATION_WINDOW_SECONDS = 86400  # 24 hours
    RATE_LIMIT_PER_MINUTE = 30

    @staticmethod
    def is_contact_reveal_approved(user1_id: int, user2_id: int, db: Session) -> bool:
        """
        Checks if both parties have completed approved mutual contact reveal.
        Contact sharing is strictly prohibited prior to mutual approval.
        """
        reveal = (
            db.query(ContactRevealRequest)
            .filter(
                ((ContactRevealRequest.requester_id == user1_id) & (ContactRevealRequest.target_id == user2_id))
                | ((ContactRevealRequest.requester_id == user2_id) & (ContactRevealRequest.target_id == user1_id)),
                ContactRevealRequest.status.in_([ContactRevealStatus.COMPLETED, ContactRevealStatus.APPROVED_PENDING_PAYMENT]),
            )
            .first()
        )
        return reveal is not None

    @staticmethod
    def check_user_chat_restriction(user: User, db: Session) -> None:
        """Verifies whether the user is restricted or suspended from chatting."""
        if user.account_status in [AccountStatus.SUSPENDED, AccountStatus.BLOCKED]:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Your account has been suspended due to policy violations. Contact support for assistance.",
            )

        # Check DB-based chat restriction
        restriction = (
            db.query(UserChatRestriction)
            .filter(UserChatRestriction.user_id == user.id, UserChatRestriction.is_restricted == True)
            .first()
        )
        if restriction:
            if restriction.restricted_until and restriction.restricted_until < datetime.utcnow():
                # Restriction expired: lift it
                restriction.is_restricted = False
                db.commit()
            else:
                until_str = (
                    restriction.restricted_until.strftime("%d %b %Y %H:%M UTC")
                    if restriction.restricted_until
                    else "permanently"
                )
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail=f"Chat messaging is temporarily restricted ({restriction.reason}) until {until_str}.",
                )

    @staticmethod
    def enforce_rate_limit(user_id: int) -> None:
        """Enforces rate-limiting per minute using Redis where available."""
        client = get_redis_client()
        if client:
            try:
                key = f"chat:ratelimit:{user_id}"
                count = client.incr(key)
                if count == 1:
                    client.expire(key, 60)
                elif count > ChatPolicyEngine.RATE_LIMIT_PER_MINUTE:
                    raise HTTPException(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        detail="You are sending messages too quickly. Please wait a moment.",
                    )
            except HTTPException:
                raise
            except Exception as e:
                logger.debug(f"Redis rate limit check skipped: {e}")

    @staticmethod
    def increment_violation_count(user_id: int, db: Session) -> int:
        """Increments violation counter via Redis with MySQL fallback."""
        count = 1
        client = get_redis_client()
        if client:
            try:
                key = f"chat:violation:{user_id}"
                count = client.incr(key)
                if count == 1:
                    client.expire(key, ChatPolicyEngine.VIOLATION_WINDOW_SECONDS)
            except Exception as e:
                logger.debug(f"Redis violation increment fallback: {e}")

        # Sync with DB UserChatRestriction record
        restriction = db.query(UserChatRestriction).filter(UserChatRestriction.user_id == user_id).first()
        if not restriction:
            restriction = UserChatRestriction(
                user_id=user_id,
                is_restricted=False,
                reason="Policy violation recorded",
                violation_count=count,
            )
            db.add(restriction)
        else:
            restriction.violation_count = max(restriction.violation_count + 1, count)
            count = restriction.violation_count

        db.commit()
        return count

    @classmethod
    def evaluate_and_enforce(
        cls,
        text: str,
        sender: User,
        receiver_id: int,
        db: Session,
    ) -> Tuple[str, ModerationAction, Optional[str]]:
        """
        Executes server-side detection, policy decision, violation escalation, and audit logging.
        Returns: (safe_sanitized_text, action_taken, sender_warning_message)
        """
        # 1. Enforce rate limit & existing restrictions
        cls.check_user_chat_restriction(sender, db)
        cls.enforce_rate_limit(sender.id)

        # 2. Check if mutual contact reveal has already been approved
        contact_reveal_approved = cls.is_contact_reveal_approved(sender.id, receiver_id, db)
        if contact_reveal_approved:
            return text, ModerationAction.ALLOW, None

        # 3. Deterministic & heuristic detection
        detection = ContactDetectionService.evaluate_message(text)
        if not detection.is_violation:
            return text, ModerationAction.ALLOW, None

        # 4. Handle Violation Escalation
        violation_count = cls.increment_violation_count(sender.id, db)
        primary_cat = detection.categories[0] if detection.categories else ModerationCategory.PHONE_NUMBER

        # Determine policy action based on violation severity & count
        action = ModerationAction.REDACT
        severity = ModerationSeverity.HIGH

        if violation_count >= cls.SUSPEND_THRESHOLD:
            action = ModerationAction.SUSPEND
            severity = ModerationSeverity.CRITICAL
            sender.account_status = AccountStatus.SUSPENDED
            db.commit()
            warning = "⚠️ Severe Policy Violation: Your account has been suspended due to repeated attempts to exchange contact information or bypass matrimonial privacy rules."
        elif violation_count >= cls.RESTRICT_THRESHOLD:
            action = ModerationAction.RESTRICT_CHAT
            severity = ModerationSeverity.HIGH
            # Restrict chat for 1 hour
            restriction = db.query(UserChatRestriction).filter(UserChatRestriction.user_id == sender.id).first()
            if restriction:
                restriction.is_restricted = True
                restriction.restricted_until = datetime.utcnow() + timedelta(hours=1)
                restriction.reason = "Repeated contact sharing / code words attempts"
                db.commit()
            warning = "⚠️ Policy Warning: Chat messaging is restricted for 1 hour due to repeated attempts to share phone numbers or code words. Please use the approved Mutual Contact Exchange on the candidate's profile."
        elif violation_count >= cls.STERN_WARN_THRESHOLD:
            action = ModerationAction.BLOCK
            severity = ModerationSeverity.HIGH
            warning = "⚠️ Policy Violation: Sharing phone numbers or contact details (in digits, words, or code words) is strictly prohibited under our Sacred Privacy Policy. Further attempts will lead to chat restriction and permanent suspension."
        else:
            # 1st violation: Redact or block with educational warning
            action = ModerationAction.REDACT
            severity = ModerationSeverity.MEDIUM
            warning = "Notice: Direct contact numbers and emails are hidden under our Sacred Privacy Policy. Contact details can be exchanged once both families mutually accept interest on the profile."

        # 5. Record Chat Moderation Event (privacy-safe: NEVER stores prohibited numbers)
        safe_snippet = detection.sanitized_text[:120] if detection.sanitized_text else "prohibited content"
        event = ChatModerationEvent(
            sender_id=sender.id,
            receiver_id=receiver_id,
            event_type="CONTACT_SHARING_ATTEMPT",
            severity=severity,
            detection_source="DETERMINISTIC_RULES",
            detection_category=primary_cat,
            action_taken=action,
            redacted_snippet=safe_snippet,
            review_status=ModerationStatus.PENDING,
        )
        db.add(event)
        db.commit()

        # 6. Enforce Action
        if action in [ModerationAction.BLOCK, ModerationAction.RESTRICT_CHAT, ModerationAction.SUSPEND]:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=warning,
            )

        return detection.sanitized_text, action, warning

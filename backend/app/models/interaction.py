import datetime
from sqlalchemy import Boolean, Column, DateTime, Enum as SQLEnum, ForeignKey, Integer, String, Text
from sqlalchemy.orm import relationship
from backend.app.models.enums import (
    InterestStatus,
    ModerationAction,
    ModerationCategory,
    ModerationSeverity,
    ModerationStatus,
    ReportStatus,
    ReportType,
)
from backend.app.services.database import Base


class UserInterest(Base):
    __tablename__ = "user_interests"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    status = Column(SQLEnum(InterestStatus), default=InterestStatus.PENDING, nullable=False, index=True)
    message = Column(String(255), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    responded_at = Column(DateTime, nullable=True)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])


class UserBlock(Base):
    __tablename__ = "user_blocks"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    blocker_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    blocked_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    blocker = relationship("User", foreign_keys=[blocker_id])
    blocked = relationship("User", foreign_keys=[blocked_id])


class UserReport(Base):
    __tablename__ = "user_reports"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    reporter_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    reported_user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    report_type = Column(SQLEnum(ReportType), nullable=False, index=True)
    description = Column(Text, nullable=False)
    evidence_url = Column(String(500), nullable=True)

    status = Column(SQLEnum(ReportStatus), default=ReportStatus.PENDING, nullable=False, index=True)
    admin_notes = Column(Text, nullable=True)
    resolved_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False,
    )

    reporter = relationship("User", foreign_keys=[reporter_id])
    reported_user = relationship("User", foreign_keys=[reported_user_id])


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    message_text = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False, nullable=False)
    read_at = Column(DateTime, nullable=True)

    # Moderation & Redaction Status
    is_redacted = Column(Boolean, default=False, nullable=False)
    redaction_reason = Column(String(100), nullable=True)
    attachment_url = Column(String(500), nullable=True)
    attachment_type = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])


class ChatModerationEvent(Base):
    __tablename__ = "chat_moderation_events"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    message_id = Column(Integer, nullable=True, index=True)
    sender_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    receiver_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    event_type = Column(String(50), default="CONTACT_SHARING_ATTEMPT", nullable=False)
    severity = Column(SQLEnum(ModerationSeverity), default=ModerationSeverity.HIGH, nullable=False)
    detection_source = Column(String(50), default="DETERMINISTIC_RULES", nullable=False)
    detection_category = Column(SQLEnum(ModerationCategory), nullable=False)
    action_taken = Column(SQLEnum(ModerationAction), default=ModerationAction.REDACT, nullable=False)

    # Safe summary snippet with contact numbers completely removed (never raw numbers)
    redacted_snippet = Column(String(255), nullable=True)

    review_status = Column(SQLEnum(ModerationStatus), default=ModerationStatus.PENDING, nullable=False, index=True)
    reviewed_by = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    admin_notes = Column(Text, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)

    sender = relationship("User", foreign_keys=[sender_id])
    receiver = relationship("User", foreign_keys=[receiver_id])


class UserChatRestriction(Base):
    __tablename__ = "user_chat_restrictions"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    is_restricted = Column(Boolean, default=True, nullable=False)
    reason = Column(String(255), nullable=False)
    restricted_until = Column(DateTime, nullable=True)  # None = Permanent
    violation_count = Column(Integer, default=1, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    user = relationship("User", foreign_keys=[user_id])

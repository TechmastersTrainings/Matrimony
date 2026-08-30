import datetime
from sqlalchemy import Boolean, Column, DateTime, Enum as SQLEnum, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from backend.app.models.enums import AuditAction
from backend.app.services.database import Base


class ProfileVerification(Base):
    __tablename__ = "profile_verifications"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    automated_checks_passed = Column(Boolean, default=False, nullable=False)
    checks_detail = Column(JSON, default=dict, nullable=False)
    flagged_reasons = Column(JSON, default=list, nullable=False)

    moderator_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    moderator_notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    changes_requested_notes = Column(Text, nullable=True)

    verified_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    profile = relationship("Profile", back_populates="verifications")


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    admin_user_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action = Column(SQLEnum(AuditAction), nullable=False, index=True)

    target_entity = Column(String(50), nullable=False)  # PROFILE, USER, PHOTO, SETTING, etc.
    target_id = Column(Integer, nullable=False, index=True)

    old_value = Column(JSON, nullable=True)
    new_value = Column(JSON, nullable=True)
    reason = Column(Text, nullable=True)
    ip_address = Column(String(50), nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    admin_user = relationship("User", foreign_keys=[admin_user_id])

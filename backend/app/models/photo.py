import datetime
from sqlalchemy import Boolean, Column, DateTime, Enum as SQLEnum, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from backend.app.models.enums import PhotoStatus
from backend.app.services.database import Base


class ProfilePhoto(Base):
    __tablename__ = "profile_photos"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    profile_id = Column(Integer, ForeignKey("profiles.id", ondelete="CASCADE"), nullable=False, index=True)

    r2_key = Column(String(255), nullable=False)
    r2_url = Column(String(500), nullable=False)
    thumbnail_url = Column(String(500), nullable=True)

    is_primary = Column(Boolean, default=False, nullable=False)
    order_index = Column(Integer, default=0, nullable=False)
    status = Column(SQLEnum(PhotoStatus), default=PhotoStatus.PENDING_REVIEW, nullable=False, index=True)

    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    content_type = Column(String(50), default="image/jpeg", nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False,
    )

    profile = relationship("Profile", back_populates="photos")

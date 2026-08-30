import datetime
from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    Enum as SQLEnum,
    Float,
    ForeignKey,
    Integer,
    JSON,
    String,
    Text,
)
from sqlalchemy.orm import relationship
from backend.app.models.enums import (
    Denomination,
    Diet,
    FamilyStatus,
    FamilyValues,
    Gender,
    HabitStatus,
    MaritalStatus,
    OccupationType,
    PhysicalStatus,
    ProfileCreatedBy,
    ProfileStatus,
)
from backend.app.services.database import Base


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    profile_manager_id = Column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)

    profile_created_by = Column(SQLEnum(ProfileCreatedBy), default=ProfileCreatedBy.SELF, nullable=False)
    manager_name = Column(String(100), nullable=True)
    manager_relationship = Column(String(50), nullable=True)
    manager_contact = Column(String(20), nullable=True)

    # Basic Info
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    gender = Column(SQLEnum(Gender), nullable=False, index=True)
    dob = Column(Date, nullable=True)
    age = Column(Integer, nullable=True, index=True)
    marital_status = Column(SQLEnum(MaritalStatus), default=MaritalStatus.NEVER_MARRIED, nullable=True, index=True)
    height_cm = Column(Integer, nullable=True, index=True)
    weight_kg = Column(Integer, nullable=True)
    physical_status = Column(SQLEnum(PhysicalStatus), default=PhysicalStatus.NORMAL, nullable=True)
    mother_tongue = Column(String(50), default="Kannada", nullable=True)

    # Christian & Church Details
    denomination = Column(SQLEnum(Denomination), default=Denomination.METHODIST, nullable=True, index=True)
    sub_denomination = Column(String(100), nullable=True)
    church_name = Column(String(150), nullable=True)
    parish_or_pastor = Column(String(150), nullable=True)
    is_baptized = Column(Boolean, default=True, nullable=False)
    is_born_again = Column(Boolean, default=False, nullable=False)
    church_activity = Column(String(255), nullable=True)

    # Location Details
    state = Column(String(100), default="Karnataka", nullable=True)
    district = Column(String(100), default="Bidar", nullable=True, index=True)
    city = Column(String(100), default="Bidar", nullable=True)
    pincode = Column(String(10), nullable=True)
    native_place = Column(String(100), nullable=True)
    citizenship = Column(String(50), default="Indian", nullable=True)
    residence_type = Column(String(50), nullable=True)

    # Education & Career
    highest_education = Column(String(100), nullable=True, index=True)
    education_field = Column(String(100), nullable=True)
    institution = Column(String(150), nullable=True)
    occupation_type = Column(SQLEnum(OccupationType), default=OccupationType.PRIVATE, nullable=True, index=True)
    occupation_title = Column(String(100), nullable=True)
    employed_in = Column(String(150), nullable=True)
    annual_income_min = Column(Integer, nullable=True, index=True)
    annual_income_max = Column(Integer, nullable=True)
    annual_income_currency = Column(String(10), default="INR", nullable=True)
    work_location = Column(String(100), nullable=True)

    # Family Background
    father_name = Column(String(100), nullable=True)
    father_occupation = Column(String(100), nullable=True)
    mother_name = Column(String(100), nullable=True)
    mother_occupation = Column(String(100), nullable=True)
    family_status = Column(SQLEnum(FamilyStatus), default=FamilyStatus.MIDDLE_CLASS, nullable=True)
    family_values = Column(SQLEnum(FamilyValues), default=FamilyValues.TRADITIONAL, nullable=True)
    brothers_count = Column(Integer, default=0, nullable=True)
    married_brothers_count = Column(Integer, default=0, nullable=True)
    sisters_count = Column(Integer, default=0, nullable=True)
    married_sisters_count = Column(Integer, default=0, nullable=True)
    about_family = Column(Text, nullable=True)

    # Lifestyle & About
    diet = Column(SQLEnum(Diet), default=Diet.NON_VEGETARIAN, nullable=True)
    smoking = Column(SQLEnum(HabitStatus), default=HabitStatus.NO, nullable=True)
    drinking = Column(SQLEnum(HabitStatus), default=HabitStatus.NO, nullable=True)
    hobbies = Column(String(255), nullable=True)
    bio = Column(Text, nullable=True)
    faith_testimony = Column(Text, nullable=True)

    # Partner Preferences (JSON document)
    partner_preferences = Column(JSON, nullable=True)

    # Status & Progress
    status = Column(SQLEnum(ProfileStatus), default=ProfileStatus.DRAFT, nullable=False, index=True)
    completion_percentage = Column(Integer, default=15, nullable=False)
    submitted_at = Column(DateTime, nullable=True)
    approved_at = Column(DateTime, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    changes_requested_notes = Column(Text, nullable=True)

    # Frozen snapshot of approved state
    approved_data_snapshot = Column(JSON, nullable=True)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False,
    )

    # Relationships
    user = relationship("User", back_populates="profile", foreign_keys=[user_id])
    manager = relationship("User", back_populates="managed_profiles", foreign_keys=[profile_manager_id])
    photos = relationship("ProfilePhoto", back_populates="profile", cascade="all, delete-orphan", order_by="ProfilePhoto.order_index")
    verifications = relationship("ProfileVerification", back_populates="profile", cascade="all, delete-orphan", order_by="ProfileVerification.id.desc()")


class ProfileDraft(Base):
    __tablename__ = "profile_drafts"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    current_step = Column(Integer, default=1, nullable=False)
    draft_data = Column(JSON, default=dict, nullable=False)
    last_saved_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False,
    )

    user = relationship("User", back_populates="draft")

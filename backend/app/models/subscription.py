import datetime
from sqlalchemy import Boolean, Column, DateTime, Enum as SQLEnum, ForeignKey, Integer, JSON, String, Text
from sqlalchemy.orm import relationship
from backend.app.models.enums import ContactRevealStatus, PaymentPurpose, PaymentStatus, SubscriptionPlanCode
from backend.app.services.database import Base


class SubscriptionPlan(Base):
    __tablename__ = "subscription_plans"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    plan_code = Column(SQLEnum(SubscriptionPlanCode), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    price_inr = Column(Integer, default=0, nullable=False)
    duration_days = Column(Integer, default=30, nullable=False)
    contact_reveals_limit = Column(Integer, default=5, nullable=False)
    features = Column(JSON, default=list, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)


class UserSubscription(Base):
    __tablename__ = "user_subscriptions"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    plan_id = Column(Integer, ForeignKey("subscription_plans.id", ondelete="RESTRICT"), nullable=False)

    start_date = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    end_date = Column(DateTime, nullable=False)
    status = Column(String(20), default="ACTIVE", nullable=False)  # ACTIVE, EXPIRED, CANCELLED
    reveals_used = Column(Integer, default=0, nullable=False)

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    user = relationship("User")
    plan = relationship("SubscriptionPlan")


class PaymentOrder(Base):
    __tablename__ = "payment_orders"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    order_id = Column(String(100), unique=True, nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    amount_inr = Column(Integer, nullable=False)
    currency = Column(String(10), default="INR", nullable=False)
    purpose = Column(SQLEnum(PaymentPurpose), default=PaymentPurpose.SUBSCRIPTION, nullable=False)

    status = Column(SQLEnum(PaymentStatus), default=PaymentStatus.CREATED, nullable=False, index=True)
    gateway_payment_id = Column(String(100), nullable=True)
    gateway_signature = Column(String(255), nullable=True)

    reference_id = Column(String(100), nullable=True)  # Plan ID or Contact Reveal Request ID

    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    paid_at = Column(DateTime, nullable=True)

    user = relationship("User")


class ContactRevealRequest(Base):
    __tablename__ = "contact_reveal_requests"

    id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    requester_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    target_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)

    status = Column(SQLEnum(ContactRevealStatus), default=ContactRevealStatus.PENDING_APPROVAL, nullable=False, index=True)

    requester_paid = Column(Boolean, default=False, nullable=False)
    target_paid = Column(Boolean, default=False, nullable=False)
    fee_per_user_inr = Column(Integer, default=499, nullable=False)

    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow,
        nullable=False,
    )

    requester = relationship("User", foreign_keys=[requester_id])
    target = relationship("User", foreign_keys=[target_id])

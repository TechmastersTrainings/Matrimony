import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.security import get_current_user, get_optional_current_user
from backend.app.models.enums import PaymentPurpose, UserRole
from backend.app.models.subscription import SubscriptionPlan, UserSubscription
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.payment_service import PaymentService

router = APIRouter(tags=["Subscriptions & Razorpay Payments"])


class CreateOrderRequest(BaseModel):
    plan_id: Optional[int] = None
    amount: Optional[int] = None  # Amount in paise (minimum 100 paise)
    amount_paise: Optional[int] = None
    currency: Optional[str] = "INR"
    receipt: Optional[str] = None


class VerifyPaymentRequest(BaseModel):
    order_id: Optional[str] = None
    razorpay_order_id: Optional[str] = None
    payment_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None
    signature: Optional[str] = None
    razorpay_signature: Optional[str] = None
    gateway_payment_id: Optional[str] = None
    gateway_signature: Optional[str] = None


@router.get(
    "/subscriptions/plans",
    summary="List Available Subscription Plans",
)
async def get_plans(db: Session = Depends(get_db)):
    PaymentService.initialize_default_plans(db)
    plans = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).all()
    return {
        "plans": [
            {
                "id": p.id,
                "plan_code": p.plan_code.value if hasattr(p.plan_code, "value") else str(p.plan_code),
                "name": p.name,
                "price_inr": p.price_inr,
                "duration_days": p.duration_days,
                "contact_reveals_limit": p.contact_reveals_limit,
                "features": p.features or [],
                "is_active": p.is_active,
            }
            for p in plans
        ]
    }


@router.get(
    "/subscriptions/my-subscription",
    summary="Get Current User Subscription Status",
)
@router.get(
    "/subscriptions/my",
    summary="Get Current User Subscription Status (Alias)",
)
async def get_my_subscription(
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    if not current_user:
        return {
            "has_active_subscription": False,
            "plan_name": "Free Exploration",
            "reveals_remaining": 0,
            "can_reveal_contacts": False,
        }

    # Admin and Super Admin accounts get lifetime access
    if current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        return {
            "has_active_subscription": True,
            "plan_id": 999,
            "plan_name": "Super Admin All-Access",
            "plan_code": "PREMIUM",
            "start_date": datetime.datetime.utcnow().isoformat(),
            "end_date": (datetime.datetime.utcnow() + datetime.timedelta(days=3650)).isoformat(),
            "reveals_used": 0,
            "reveals_limit": 9999,
        }

    now = datetime.datetime.utcnow()
    sub = (
        db.query(UserSubscription)
        .filter(
            UserSubscription.user_id == current_user.id,
            UserSubscription.status == "ACTIVE",
            UserSubscription.end_date >= now,
        )
        .order_by(UserSubscription.created_at.desc())
        .first()
    )
    if not sub:
        return {
            "has_active_subscription": False,
            "plan_name": "Free Exploration",
            "reveals_remaining": 0,
            "can_reveal_contacts": False,
        }

    return {
        "has_active_subscription": True,
        "plan_id": sub.plan_id,
        "plan_name": sub.plan.name if sub.plan else "Active Plan",
        "plan_code": sub.plan.plan_code.value if (sub.plan and hasattr(sub.plan.plan_code, "value")) else "ACTIVE",
        "start_date": sub.start_date.isoformat() if hasattr(sub.start_date, "isoformat") else str(sub.start_date),
        "end_date": sub.end_date.isoformat() if hasattr(sub.end_date, "isoformat") else str(sub.end_date),
        "reveals_used": sub.reveals_used,
        "reveals_limit": sub.plan.contact_reveals_limit if sub.plan else 50,
    }


# Step 1: Create Razorpay Order Endpoints
@router.post("/subscriptions/create-order", summary="Create Razorpay Order for Subscription")
@router.post("/create-order", summary="Create Razorpay Order (Standard API)")
async def create_order(
    payload: CreateOrderRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    amount_paise = None
    ref_id = None

    if payload.plan_id:
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == payload.plan_id).first()
        if not plan:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription plan not found.")
        amount_paise = plan.price_inr * 100
        ref_id = str(plan.id)
    elif payload.amount_paise is not None:
        amount_paise = payload.amount_paise
    elif payload.amount is not None:
        amount_paise = payload.amount
    else:
        amount_paise = 29900  # Default Basic plan ₹299

    if amount_paise < 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Minimum order amount must be at least 100 paise (₹1).",
        )

    order_data = PaymentService.create_razorpay_order(
        user=current_user,
        amount_paise=amount_paise,
        currency=payload.currency or "INR",
        receipt=payload.receipt,
        purpose=PaymentPurpose.SUBSCRIPTION,
        reference_id=ref_id,
        db=db,
    )
    return order_data


# Step 3: Verify Razorpay Payment Signature Endpoints
@router.post("/subscriptions/verify-payment", summary="Verify Razorpay Payment Status")
@router.post("/verify-payment", summary="Verify Razorpay Payment (Standard API)")
async def verify_payment(
    payload: VerifyPaymentRequest,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db),
):
    order_id = payload.order_id or payload.razorpay_order_id
    payment_id = payload.payment_id or payload.gateway_payment_id or payload.razorpay_payment_id
    signature = payload.signature or payload.gateway_signature or payload.razorpay_signature

    if not order_id or not payment_id or not signature:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Missing required fields: order_id, payment_id, and signature are required.",
        )

    res = PaymentService.verify_and_complete_payment(
        order_id=order_id,
        gateway_payment_id=payment_id,
        gateway_signature=signature,
        db=db,
        user=current_user,
    )
    return res

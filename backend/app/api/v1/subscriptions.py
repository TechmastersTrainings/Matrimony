from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.config import settings
from backend.app.core.security import get_current_user
from backend.app.models.enums import PaymentPurpose
from backend.app.models.subscription import SubscriptionPlan, UserSubscription
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.payment_service import PaymentService

router = APIRouter(tags=["Subscriptions & Razorpay Payments"])


class CreateOrderRequest(BaseModel):
    plan_id: Optional[int] = None
    amount: Optional[int] = None
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
                "plan_code": p.plan_code.value,
                "name": p.name,
                "price_inr": p.price_inr,
                "duration_days": p.duration_days,
                "contact_reveals_limit": p.contact_reveals_limit,
                "features": p.features,
            }
            for p in plans
        ]
    }


@router.get(
    "/subscriptions/my",
    summary="Get Current User Active Subscription",
)
async def get_my_subscription(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    sub = (
        db.query(UserSubscription)
        .filter(UserSubscription.user_id == current_user.id, UserSubscription.status == "ACTIVE")
        .order_by(UserSubscription.id.desc())
        .first()
    )
    if not sub:
        return {"has_active_subscription": False, "plan": None}

    return {
        "has_active_subscription": True,
        "subscription_id": sub.id,
        "plan_name": sub.plan.name,
        "start_date": sub.start_date,
        "end_date": sub.end_date,
        "reveals_used": sub.reveals_used,
        "reveals_limit": sub.plan.contact_reveals_limit,
    }


# Step 1: Create Razorpay Order Endpoints
@router.post("/subscriptions/create-order", summary="Create Razorpay Order for Subscription")
@router.post("/create-order", summary="Create Razorpay Order (Standard API)")
async def create_order(
    payload: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    amount_inr = 499
    ref_id = None

    if payload.plan_id:
        plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == payload.plan_id).first()
        if not plan:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription plan not found.")
        amount_inr = plan.price_inr
        ref_id = str(plan.id)
    elif payload.amount:
        # Amount supplied directly in paise or INR
        amount_inr = payload.amount // 100 if payload.amount >= 1000 else payload.amount

    order_data = PaymentService.create_razorpay_order(
        user=current_user,
        amount_inr=amount_inr,
        purpose=PaymentPurpose.SUBSCRIPTION,
        reference_id=ref_id,
        db=db,
    )
    return order_data


# Step 3: Verify Razorpay Payment Signature Endpoints
@router.post("/subscriptions/verify-payment", summary="Verify Razorpay Payment Signature")
@router.post("/verify-payment", summary="Verify Razorpay Payment (Standard API)")
async def verify_payment(
    payload: VerifyPaymentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    order_id = payload.razorpay_order_id or payload.order_id
    payment_id = payload.razorpay_payment_id or payload.gateway_payment_id or payload.payment_id
    signature = payload.razorpay_signature or payload.gateway_signature or payload.signature

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

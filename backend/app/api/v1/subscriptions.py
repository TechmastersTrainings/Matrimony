from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import PaymentPurpose
from backend.app.models.subscription import SubscriptionPlan, UserSubscription
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.payment_service import PaymentService

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions & UPI Payments"])


class CreateOrderRequest(BaseModel):
    plan_id: int


class VerifyPaymentRequest(BaseModel):
    order_id: str
    gateway_payment_id: str
    gateway_signature: str


@router.get(
    "/plans",
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
    "/my",
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


@router.post(
    "/create-order",
    summary="Create UPI Payment Order for Subscription",
)
async def create_subscription_order(
    payload: CreateOrderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == payload.plan_id).first()
    if not plan:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subscription plan not found.")

    order = PaymentService.create_upi_payment_order(
        user=current_user,
        amount_inr=plan.price_inr,
        purpose=PaymentPurpose.SUBSCRIPTION,
        reference_id=str(plan.id),
        db=db,
    )

    return {
        "order_id": order.order_id,
        "amount_inr": order.amount_inr,
        "currency": order.currency,
        "plan_name": plan.name,
    }


@router.post(
    "/verify-payment",
    summary="Verify Payment Signature & Activate Subscription",
)
async def verify_payment(
    payload: VerifyPaymentRequest,
    db: Session = Depends(get_db),
):
    order = PaymentService.verify_and_complete_payment(
        order_id=payload.order_id,
        gateway_payment_id=payload.gateway_payment_id,
        gateway_signature=payload.gateway_signature,
        db=db,
    )
    return {"success": True, "message": "Payment verified and activated successfully.", "status": order.status.value}

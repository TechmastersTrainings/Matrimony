from datetime import datetime, timedelta
import hashlib
import hmac
from typing import Any, Dict, List, Optional, Tuple
import uuid
import razorpay
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.core.config import settings
from backend.app.core.logger import logger
from backend.app.models.enums import ContactRevealStatus, PaymentPurpose, PaymentStatus, SubscriptionPlanCode, UserRole
from backend.app.models.profile import Profile
from backend.app.models.subscription import ContactRevealRequest, PaymentOrder, SubscriptionPlan, UserSubscription
from backend.app.models.user import User


class PaymentService:
    @staticmethod
    def get_razorpay_client() -> razorpay.Client:
        return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

    @staticmethod
    def initialize_default_plans(db: Session):
        """Seeds and syncs default subscription plans: BASIC (499), STANDARD (1499), PREMIUM (2999)."""
        # Delete legacy FREE plan records from SubscriptionPlan table if any exist
        db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == "FREE").delete(synchronize_session=False)
        db.commit()

        # 1. BASIC PLAN (₹ 499 / 30 Days)
        basic = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == SubscriptionPlanCode.BASIC).first()
        if not basic:
            basic = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.BASIC,
                name="Basic Christian Plan",
                price_inr=499,
                duration_days=30,
                contact_reveals_limit=3,
                features=[
                    "3 Contact Phone/Email Reveals",
                    "Browse verified profiles & full candidate bios",
                    "Express unlimited matrimonial interests",
                    "5 Photo uploads",
                    "Unlimited In-App Messaging with Matches",
                    "Verified Profile Badge",
                ],
                is_active=True,
            )
            db.add(basic)
        else:
            basic.name = "Basic Christian Plan"
            basic.price_inr = 499
            basic.duration_days = 30
            basic.contact_reveals_limit = 3
            basic.features = [
                "3 Contact Phone/Email Reveals",
                "Browse verified profiles & full candidate bios",
                "Express unlimited matrimonial interests",
                "5 Photo uploads",
                "Unlimited In-App Messaging with Matches",
                "Verified Profile Badge",
            ]

        # 2. STANDARD PLAN (₹ 1,499 / 90 Days)
        std = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == SubscriptionPlanCode.STANDARD).first()
        if not std:
            std = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.STANDARD,
                name="Standard Christian Plan",
                price_inr=1499,
                duration_days=90,
                contact_reveals_limit=15,
                features=[
                    "15 Contact Phone/Email Reveals",
                    "Send unlimited interests",
                    "15 Direct contact reveals",
                    "Priority Christian matching",
                    "Bidar Parish support",
                    "Unlimited In-App Messaging with Matches",
                    "Verified Profile Badge",
                ],
                is_active=True,
            )
            db.add(std)
        else:
            std.name = "Standard Christian Plan"
            std.price_inr = 1499
            std.duration_days = 90
            std.contact_reveals_limit = 15
            std.features = [
                "15 Contact Phone/Email Reveals",
                "Send unlimited interests",
                "15 Direct contact reveals",
                "Priority Christian matching",
                "Bidar Parish support",
                "Unlimited In-App Messaging with Matches",
                "Verified Profile Badge",
            ]

        # 3. PREMIUM BLESSED MATRIMONY (₹ 2,999 / 180 Days)
        prem = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == SubscriptionPlanCode.PREMIUM).first()
        if not prem:
            prem = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.PREMIUM,
                name="Premium Blessed Matrimony",
                price_inr=2999,
                duration_days=180,
                contact_reveals_limit=40,
                features=[
                    "40 Contact Phone/Email Reveals",
                    "Unlimited direct messaging",
                    "40 Contact reveals",
                    "Featured profile placement",
                    "Personal relationship manager",
                    "Unlimited In-App Messaging with Matches",
                    "Verified Profile Badge",
                ],
                is_active=True,
            )
            db.add(prem)
        else:
            prem.name = "Premium Blessed Matrimony"
            prem.price_inr = 2999
            prem.duration_days = 180
            prem.contact_reveals_limit = 40
            prem.features = [
                "40 Contact Phone/Email Reveals",
                "Unlimited direct messaging",
                "40 Contact reveals",
                "Featured profile placement",
                "Personal relationship manager",
                "Unlimited In-App Messaging with Matches",
                "Verified Profile Badge",
            ]

        db.commit()
        logger.info("Synchronized subscription plans in database (BASIC ₹499, STANDARD ₹1499, PREMIUM ₹2999).")

    @staticmethod
    def create_razorpay_order(
        user: User,
        amount_inr: int,
        purpose: PaymentPurpose = PaymentPurpose.SUBSCRIPTION,
        reference_id: Optional[str] = None,
        db: Session = None,
    ) -> Dict[str, Any]:
        amount_paise = amount_inr * 100
        if amount_paise < 100:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Minimum order amount must be at least 100 paise (₹1).")

        receipt_id = f"CM_RC_KEY_{uuid.uuid4().hex[:10].upper()}"

        try:
            client = PaymentService.get_razorpay_client()
            razorpay_order = client.order.create({
                "amount": amount_paise,
                "currency": "INR",
                "receipt": receipt_id,
                "notes": {
                    "user_id": str(user.id),
                    "user_email": user.email or "",
                    "purpose": purpose.value,
                    "reference_id": str(reference_id or ""),
                },
            })
        except Exception as err:
            logger.error(f"Razorpay API Order Creation Failed: {str(err)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create Razorpay payment order: {str(err)}",
            )

        if db is not None:
            order = PaymentOrder(
                order_id=razorpay_order["id"],
                user_id=user.id,
                amount_inr=amount_inr,
                currency="INR",
                purpose=purpose,
                reference_id=str(reference_id or ""),
                status=PaymentStatus.CREATED,
            )
            db.add(order)
            db.commit()

        return {
            "order_id": razorpay_order["id"],
            "amount": razorpay_order["amount"],
            "amount_inr": amount_inr,
            "currency": razorpay_order["currency"],
            "key_id": settings.RAZORPAY_KEY_ID,
            "receipt": receipt_id,
        }

    @staticmethod
    def verify_razorpay_signature(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        if not razorpay_order_id or not razorpay_payment_id or not razorpay_signature:
            return False

        try:
            client = PaymentService.get_razorpay_client()
            client.utility.verify_payment_signature({
                "razorpay_order_id": razorpay_order_id,
                "razorpay_payment_id": razorpay_payment_id,
                "razorpay_signature": razorpay_signature,
            })
            return True
        except Exception:
            # Fallback HMAC SHA256 verification
            generated_signature = hmac.new(
                settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
                f"{razorpay_order_id}|{razorpay_payment_id}".encode("utf-8"),
                hashlib.sha256,
            ).hexdigest()
            return hmac.compare_digest(generated_signature, razorpay_signature)

    @staticmethod
    def verify_and_complete_payment(
        order_id: str,
        gateway_payment_id: str,
        gateway_signature: str,
        db: Session,
        user: Optional[User] = None,
    ) -> Dict[str, Any]:
        if not PaymentService.verify_razorpay_signature(order_id, gateway_payment_id, gateway_signature):
            logger.warning(f"Signature mismatch for Razorpay order {order_id}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Razorpay payment signature mismatch. Payment not verified.",
            )

        order = db.query(PaymentOrder).filter(PaymentOrder.order_id == order_id).first()
        if not order:
            # Create completed order if not recorded earlier
            order = PaymentOrder(
                order_id=order_id,
                user_id=user.id if user else 1,
                amount_inr=499,
                currency="INR",
                purpose=PaymentPurpose.SUBSCRIPTION,
                status=PaymentStatus.PAID,
                gateway_payment_id=gateway_payment_id,
                gateway_signature=gateway_signature,
                paid_at=datetime.utcnow(),
            )
            db.add(order)
        else:
            order.status = PaymentStatus.PAID
            order.gateway_payment_id = gateway_payment_id
            order.gateway_signature = gateway_signature
            order.paid_at = datetime.utcnow()

        # Target user for subscription activation
        target_user_id = order.user_id if order.user_id else (user.id if user else None)

        if order.purpose == PaymentPurpose.SUBSCRIPTION and target_user_id:
            try:
                plan_id = int(order.reference_id)
                plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
            except (ValueError, TypeError):
                plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).first()

            if plan:
                # Expire existing active subscriptions
                db.query(UserSubscription).filter(
                    UserSubscription.user_id == target_user_id,
                    UserSubscription.status == "ACTIVE",
                ).update({"status": "EXPIRED"})

                start_date = datetime.utcnow()
                end_date = start_date + timedelta(days=plan.duration_days)

                sub = UserSubscription(
                    user_id=target_user_id,
                    plan_id=plan.id,
                    status="ACTIVE",
                    start_date=start_date,
                    end_date=end_date,
                    reveals_used=0,
                )
                db.add(sub)
                db.commit()

                return {
                    "success": True,
                    "message": f"Payment verified! {plan.name} is now ACTIVE until {end_date.strftime('%d %b %Y')}.",
                    "subscription_id": sub.id,
                    "plan_name": plan.name,
                    "end_date": end_date.isoformat(),
                }

        db.commit()
        return {"success": True, "message": "Payment verified and completed successfully."}

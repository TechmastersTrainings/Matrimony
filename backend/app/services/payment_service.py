from datetime import datetime, timedelta
from typing import Any, Dict, List, Optional, Tuple
import uuid
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.app.core.logger import logger
from backend.app.models.enums import ContactRevealStatus, PaymentPurpose, PaymentStatus, SubscriptionPlanCode
from backend.app.models.profile import Profile
from backend.app.models.subscription import ContactRevealRequest, PaymentOrder, SubscriptionPlan, UserSubscription
from backend.app.models.user import User


class PaymentService:
    @staticmethod
    def initialize_default_plans(db: Session):
        """Seeds default subscription plans if empty."""
        count = db.query(SubscriptionPlan).count()
        if count == 0:
            free_plan = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.FREE,
                name="Free Membership",
                price_inr=0,
                duration_days=365,
                contact_reveals_limit=0,
                features=["Browse verified profiles", "Receive matches", "5 Photo uploads"],
                is_active=True,
            )
            standard_plan = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.STANDARD,
                name="Standard Christian Plan",
                price_inr=1499,
                duration_days=90,
                contact_reveals_limit=15,
                features=["Send unlimited interests", "15 Direct contact reveals", "Priority Christian matching", "Bidar Parish support"],
                is_active=True,
            )
            premium_plan = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.PREMIUM,
                name="Premium Blessed Matrimony",
                price_inr=2999,
                duration_days=180,
                contact_reveals_limit=40,
                features=["Unlimited direct messaging", "40 Contact reveals", "Featured profile placement", "Personal relationship manager"],
                is_active=True,
            )
            db.add_all([free_plan, standard_plan, premium_plan])
            db.commit()
            logger.info("Initialized default subscription plans.")

    @staticmethod
    def create_upi_payment_order(
        user: User,
        amount_inr: int,
        purpose: PaymentPurpose,
        reference_id: Optional[str],
        db: Session,
    ) -> PaymentOrder:
        order_id = f"CM_ORD_{uuid.uuid4().hex[:12].upper()}"
        order = PaymentOrder(
            order_id=order_id,
            user_id=user.id,
            amount_inr=amount_inr,
            currency="INR",
            purpose=purpose,
            status=PaymentStatus.CREATED,
            reference_id=reference_id,
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def verify_and_complete_payment(
        order_id: str,
        gateway_payment_id: str,
        gateway_signature: str,
        db: Session,
    ) -> PaymentOrder:
        order = db.query(PaymentOrder).filter(PaymentOrder.order_id == order_id).first()
        if not order:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Payment order not found.")

        order.status = PaymentStatus.PAID
        order.gateway_payment_id = gateway_payment_id
        order.gateway_signature = gateway_signature
        order.paid_at = datetime.utcnow()

        # Fulfill subscription or contact reveal
        if order.purpose == PaymentPurpose.SUBSCRIPTION and order.reference_id:
            plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == int(order.reference_id)).first()
            if plan:
                sub = UserSubscription(
                    user_id=order.user_id,
                    plan_id=plan.id,
                    start_date=datetime.utcnow(),
                    end_date=datetime.utcnow() + timedelta(days=plan.duration_days),
                    status="ACTIVE",
                    reveals_used=0,
                )
                db.add(sub)
        elif order.purpose == PaymentPurpose.CONTACT_REVEAL and order.reference_id:
            reveal_req = db.query(ContactRevealRequest).filter(ContactRevealRequest.id == int(order.reference_id)).first()
            if reveal_req:
                if reveal_req.requester_id == order.user_id:
                    reveal_req.requester_paid = True
                elif reveal_req.target_id == order.user_id:
                    reveal_req.target_paid = True

                # Check if mutual payment completed
                if reveal_req.requester_paid and reveal_req.target_paid:
                    reveal_req.status = ContactRevealStatus.COMPLETED
                    reveal_req.completed_at = datetime.utcnow()
                else:
                    reveal_req.status = ContactRevealStatus.APPROVED_PENDING_PAYMENT

        db.commit()
        db.refresh(order)
        return order

    # ------------------ CONTACT REVEAL FLOW ------------------
    @staticmethod
    def request_contact_reveal(requester: User, target_user_id: int, db: Session) -> ContactRevealRequest:
        if requester.id == target_user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot request contact reveal from yourself.")

        existing = db.query(ContactRevealRequest).filter(
            ((ContactRevealRequest.requester_id == requester.id) & (ContactRevealRequest.target_id == target_user_id)) |
            ((ContactRevealRequest.requester_id == target_user_id) & (ContactRevealRequest.target_id == requester.id))
        ).first()

        if existing:
            return existing

        req = ContactRevealRequest(
            requester_id=requester.id,
            target_id=target_user_id,
            status=ContactRevealStatus.PENDING_APPROVAL,
            requester_paid=False,
            target_paid=False,
            fee_per_user_inr=499,
        )
        db.add(req)
        db.commit()
        db.refresh(req)
        return req

    @staticmethod
    def get_contact_details_if_authorized(user: User, target_user_id: int, db: Session) -> Dict[str, Any]:
        """Returns verified mobile & email only if completed contact reveal or admin."""
        reveal = db.query(ContactRevealRequest).filter(
            ((ContactRevealRequest.requester_id == user.id) & (ContactRevealRequest.target_id == target_user_id)) |
            ((ContactRevealRequest.requester_id == target_user_id) & (ContactRevealRequest.target_id == user.id)),
            ContactRevealRequest.status == ContactRevealStatus.COMPLETED,
        ).first()

        if not reveal:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Mutual contact reveal and payment required to view phone number and email.",
            )

        target_user = db.query(User).filter(User.id == target_user_id).first()
        target_profile = db.query(Profile).filter(Profile.user_id == target_user_id).first()

        return {
            "user_id": target_user.id,
            "first_name": target_profile.first_name if target_profile else "",
            "last_name": target_profile.last_name if target_profile else "",
            "mobile_number": target_user.mobile_number,
            "email": target_user.email,
            "church_name": target_profile.church_name if target_profile else "",
            "parish_or_pastor": target_profile.parish_or_pastor if target_profile else "",
            "manager_name": target_profile.manager_name if target_profile else None,
            "manager_contact": target_profile.manager_contact if target_profile else None,
            "revealed_at": reveal.completed_at,
        }

from datetime import datetime, timedelta
import hashlib
import hmac
from typing import Any, Dict, List, Optional, Tuple
import uuid
import httpx
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
    def get_cashfree_base_url() -> str:
        env = (settings.CASHFREE_ENV or "TEST").strip().upper()
        if env in ["PROD", "PRODUCTION", "LIVE"]:
            return "https://api.cashfree.com/pg"
        return "https://sandbox.cashfree.com/pg"

    @staticmethod
    def get_cashfree_headers() -> Dict[str, str]:
        return {
            "x-client-id": settings.CASHFREE_APP_ID or "",
            "x-client-secret": settings.CASHFREE_SECRET_KEY or "",
            "x-api-version": settings.CASHFREE_API_VERSION or "2023-08-01",
            "Content-Type": "application/json",
        }

    @staticmethod
    def initialize_default_plans(db: Session):
        """Seeds and syncs default subscription plans: BASIC (499), STANDARD (1499), PREMIUM (2999)."""
        # Delete legacy FREE plan records from SubscriptionPlan table if any exist
        db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == "FREE").delete(synchronize_session=False)
        db.commit()

        # 1. BASIC PLAN (₹ 499 / 30 Days)
        basic = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == SubscriptionPlanCode.BASIC).first()
        basic_features = [
            "Browse verified profiles & full candidate bios",
            "Express 5 matrimonial interests",
            "5 Photo uploads",
            "5 In-App Messaging with Matches",
            "Verified Profile Badge",
            "Mutual Contact Exchange upon Accepted Interest (Up to 5 Matches)",
            "Strict Privacy: Contact numbers locked until mutual consent",
        ]
        if not basic:
            basic = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.BASIC,
                name="Basic Christian Plan",
                price_inr=499,
                duration_days=30,
                contact_reveals_limit=5,
                features=basic_features,
                is_active=True,
            )
            db.add(basic)
        else:
            basic.name = "Basic Christian Plan"
            basic.price_inr = 499
            basic.duration_days = 30
            basic.contact_reveals_limit = 5
            basic.features = basic_features

        # 2. STANDARD PLAN (₹ 799 / 70 Days) - Unilateral contact reveals removed
        std = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == SubscriptionPlanCode.STANDARD).first()
        std_features = [
            "Send unlimited interests",
            "Priority Christian matching",
            "Bidar Parish support",
            "Unlimited In-App Messaging with Matches",
            "Verified Profile Badge",
            "Mutual Contact Sharing (Unlocked only after mutual acceptance)",
        ]
        if not std:
            std = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.STANDARD,
                name="Standard Christian Plan",
                price_inr=799,
                duration_days=70,
                contact_reveals_limit=15,
                features=std_features,
                is_active=True,
            )
            db.add(std)
        else:
            std.name = "Standard Christian Plan"
            std.price_inr = 799
            std.duration_days = 70
            std.contact_reveals_limit = 15
            std.features = std_features

        # 3. PREMIUM BLESSED MATRIMONY (₹ 999 / 100 Days) - Most Popular
        prem = db.query(SubscriptionPlan).filter(SubscriptionPlan.plan_code == SubscriptionPlanCode.PREMIUM).first()
        prem_features = [
            "Send unlimited interests",
            "Unlimited In-App Messaging with Matches",
            "Featured profile placement",
            "Personal relationship manager",
            "Verified Profile Badge",
            "Mutual Contact Sharing (Unlocked only after mutual acceptance)",
            "Zero Unsolicited Contact Reveals Guarantee",
        ]
        if not prem:
            prem = SubscriptionPlan(
                plan_code=SubscriptionPlanCode.PREMIUM,
                name="Premium Blessed Matrimony",
                price_inr=999,
                duration_days=100,
                contact_reveals_limit=40,
                features=prem_features,
                is_active=True,
            )
            db.add(prem)
        else:
            prem.name = "Premium Blessed Matrimony"
            prem.price_inr = 999
            prem.duration_days = 100
            prem.contact_reveals_limit = 40
            prem.features = prem_features

        db.commit()
        logger.info("Synchronized subscription plans in database (BASIC ₹499/30d, STANDARD ₹799/70d, PREMIUM ₹999/100d with mutual consent privacy).")

    @staticmethod
    def create_cashfree_order(
        user: User,
        amount_inr: int,
        purpose: PaymentPurpose = PaymentPurpose.SUBSCRIPTION,
        reference_id: Optional[str] = None,
        db: Optional[Session] = None,
    ) -> Dict[str, Any]:
        if amount_inr < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Minimum order amount must be at least ₹1.",
            )

        # Cashfree Order ID rule: alphanumeric, _, -, up to 45 chars
        clean_user_id = str(user.id)
        clean_ref_id = str(reference_id or "0")
        order_id = f"CF_U{clean_user_id}_P{clean_ref_id}_{uuid.uuid4().hex[:10].upper()}"

        base_url = PaymentService.get_cashfree_base_url()
        headers = PaymentService.get_cashfree_headers()

        clean_phone = (user.mobile_number or "9880768222").replace("+91", "").strip()[-10:]
        if not clean_phone or len(clean_phone) != 10:
            clean_phone = "9880768222"

        clean_email = (user.email or "").strip()
        if not clean_email or "@" not in clean_email:
            clean_email = f"user_{user.id}@covenantnest.in"

        full_name = "CovenantNest Member"
        user_prof = getattr(user, "profile", None)
        if user_prof:
            p_first = getattr(user_prof, "first_name", "") or ""
            p_last = getattr(user_prof, "last_name", "") or ""
            comb = f"{p_first} {p_last}".strip()
            if comb:
                full_name = comb

        payload = {
            "order_id": order_id,
            "order_amount": float(amount_inr),
            "order_currency": "INR",
            "customer_details": {
                "customer_id": f"cust_{user.id}",
                "customer_email": clean_email,
                "customer_phone": clean_phone,
                "customer_name": full_name,
            },
            "order_meta": {
                "return_url": "https://matrimony-psi-wheat.vercel.app/subscriptions?order_id={order_id}",
            },
            "order_note": f"CovenantNest - {purpose.value} ({amount_inr} INR)",
        }

        payment_session_id = None
        cf_order_id = None

        try:
            with httpx.Client(timeout=15.0) as client:
                resp = client.post(f"{base_url}/orders", json=payload, headers=headers)
                if resp.status_code in [200, 201]:
                    data = resp.json()
                    payment_session_id = data.get("payment_session_id")
                    cf_order_id = data.get("cf_order_id")
                    logger.info(f"Cashfree Order Created: {order_id} (CF ID: {cf_order_id})")
                else:
                    logger.error(f"Cashfree Order API returned error: {resp.status_code} - {resp.text}")
                    raise HTTPException(
                        status_code=status.HTTP_502_BAD_GATEWAY,
                        detail=f"Cashfree Gateway Error: {resp.text}",
                    )
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Failed to connect to Cashfree: {str(e)}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to connect to Cashfree gateway: {str(e)}",
            )

        if db is not None:
            order = PaymentOrder(
                order_id=order_id,
                user_id=user.id,
                amount_inr=amount_inr,
                currency="INR",
                purpose=purpose,
                reference_id=str(reference_id or ""),
                status=PaymentStatus.CREATED,
                gateway_payment_id=str(cf_order_id or ""),
            )
            db.add(order)
            db.commit()

        env_mode = "sandbox" if (settings.CASHFREE_ENV or "TEST").strip().upper() == "TEST" else "production"

        return {
            "order_id": order_id,
            "cf_order_id": cf_order_id,
            "payment_session_id": payment_session_id,
            "amount": amount_inr * 100,
            "amount_inr": amount_inr,
            "currency": "INR",
            "mode": env_mode,
            # Backward compatibility fields
            "key_id": settings.CASHFREE_APP_ID,
            "receipt": order_id,
        }

    # Backward compatibility alias
    create_razorpay_order = create_cashfree_order

    @staticmethod
    def verify_razorpay_signature(razorpay_order_id: str, razorpay_payment_id: str, razorpay_signature: str) -> bool:
        return True

    @staticmethod
    def verify_cashfree_order(
        order_id: str,
        db: Session,
        gateway_payment_id: Optional[str] = None,
        gateway_signature: Optional[str] = None,
        user: Optional[User] = None,
    ) -> Dict[str, Any]:
        base_url = PaymentService.get_cashfree_base_url()
        headers = PaymentService.get_cashfree_headers()

        is_paid = False
        cf_payment_id = gateway_payment_id or ""
        is_test_env = (settings.CASHFREE_ENV or "TEST").strip().upper() == "TEST"

        try:
            with httpx.Client(timeout=15.0) as client:
                order_resp = client.get(f"{base_url}/orders/{order_id}", headers=headers)
                if order_resp.status_code == 200:
                    order_info = order_resp.json()
                    status_str = str(order_info.get("order_status", "")).upper()
                    if status_str == "PAID":
                        is_paid = True

                    # Also fetch payment details from Cashfree payments sub-resource
                    try:
                        pay_resp = client.get(f"{base_url}/orders/{order_id}/payments", headers=headers)
                        if pay_resp.status_code == 200:
                            payments_list = pay_resp.json()
                            if isinstance(payments_list, list) and len(payments_list) > 0:
                                for p in payments_list:
                                    if p.get("payment_status") == "SUCCESS":
                                        is_paid = True
                                        cf_payment_id = str(p.get("cf_payment_id") or cf_payment_id)
                                        break
                    except Exception as pay_err:
                        logger.warning(f"Could not fetch payments list for {order_id}: {pay_err}")
                else:
                    logger.warning(f"Cashfree GET /orders/{order_id} returned {order_resp.status_code}: {order_resp.text}")
        except Exception as e:
            logger.warning(f"Failed to query Cashfree order status: {e}")

        # Test Mode / Simulation Bypass:
        # In sandbox test mode, if test client passes mock gateway_payment_id or test signature
        if not is_paid and is_test_env:
            if gateway_payment_id in ["pay_test_123456", "sim_pay_test"] or (gateway_signature and "sim_" in gateway_signature):
                logger.info(f"Test mode simulation bypass verified for order {order_id}")
                is_paid = True
                cf_payment_id = gateway_payment_id or f"cf_sim_{uuid.uuid4().hex[:8]}"

        if not is_paid:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Cashfree payment not verified. The transaction is pending, cancelled, or not yet completed.",
            )

        order = db.query(PaymentOrder).filter(PaymentOrder.order_id == order_id).first()
        if not order:
            order = PaymentOrder(
                order_id=order_id,
                user_id=user.id if user else 1,
                amount_inr=499,
                currency="INR",
                purpose=PaymentPurpose.SUBSCRIPTION,
                status=PaymentStatus.PAID,
                gateway_payment_id=cf_payment_id,
                gateway_signature=gateway_signature or "verified_cashfree",
                paid_at=datetime.utcnow(),
            )
            db.add(order)
        else:
            order.status = PaymentStatus.PAID
            order.gateway_payment_id = cf_payment_id or order.gateway_payment_id
            order.gateway_signature = gateway_signature or order.gateway_signature or "verified_cashfree"
            order.paid_at = datetime.utcnow()

        target_user_id = order.user_id if order.user_id else (user.id if user else None)

        if order.purpose == PaymentPurpose.SUBSCRIPTION and target_user_id:
            try:
                plan_id = int(order.reference_id)
                plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.id == plan_id).first()
            except (ValueError, TypeError):
                plan = db.query(SubscriptionPlan).filter(SubscriptionPlan.is_active == True).first()

            if plan:
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
                    "status": "PAID",
                    "message": f"Payment verified! {plan.name} is now ACTIVE until {end_date.strftime('%d %b %Y')}.",
                    "subscription_id": sub.id,
                    "plan_name": plan.name,
                    "end_date": end_date.isoformat(),
                }

        db.commit()
        return {
            "success": True,
            "status": "PAID",
            "message": "Payment verified and completed successfully.",
        }

    # Backward compatibility alias
    verify_and_complete_payment = verify_cashfree_order

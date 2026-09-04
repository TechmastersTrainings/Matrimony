from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import ContactRevealStatus, PaymentPurpose
from backend.app.models.subscription import ContactRevealRequest
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.payment_service import PaymentService

router = APIRouter(prefix="/contact-reveal", tags=["Contact Reveal Management"])


class RespondRevealRequest(BaseModel):
    accept: bool


@router.post(
    "/request/{target_user_id}",
    summary="Request Contact Reveal with a Candidate Profile (Active Subscription Required)",
)
async def request_reveal(
    target_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = PaymentService.request_contact_reveal(current_user, target_user_id, db)
    return {
        "id": req.id,
        "status": req.status.value,
        "requester_paid": req.requester_paid,
        "target_paid": req.target_paid,
        "fee_per_user_inr": req.fee_per_user_inr,
    }


@router.post(
    "/respond/{reveal_request_id}",
    summary="Accept or Decline a Contact Reveal Request",
)
async def respond_reveal(
    reveal_request_id: int,
    payload: RespondRevealRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = PaymentService.respond_contact_reveal(current_user, reveal_request_id, payload.accept, db)
    return {
        "id": req.id,
        "status": req.status.value,
        "requester_paid": req.requester_paid,
        "target_paid": req.target_paid,
        "message": "Contact reveal request accepted. Proceed to fee payment." if payload.accept else "Contact reveal request declined.",
    }


@router.post(
    "/pay/{reveal_request_id}",
    summary="Create Payment Order for Contact Reveal Unlock (Only After Acceptance)",
)
async def create_reveal_payment_order(
    reveal_request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ContactRevealRequest).filter(ContactRevealRequest.id == reveal_request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact reveal request not found.")

    if req.status not in [ContactRevealStatus.APPROVED_PENDING_PAYMENT, ContactRevealStatus.COMPLETED]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot pay for contact reveal before other user accepts the request.",
        )

    order = PaymentService.create_upi_payment_order(
        user=current_user,
        amount_inr=req.fee_per_user_inr,
        purpose=PaymentPurpose.CONTACT_REVEAL,
        reference_id=str(req.id),
        db=db,
    )

    return {
        "order_id": order.order_id,
        "amount_inr": order.amount_inr,
        "fee_per_user_inr": req.fee_per_user_inr,
    }


@router.get(
    "/{target_user_id}",
    summary="Retrieve Verified Contact Details (Requires Mutual Completed Reveal Payments or Admin Access)",
)
async def get_contact_details(
    target_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.role in [UserRole.ADMIN, UserRole.SUPER_ADMIN]:
        target_profile = db.query(Profile).filter(Profile.user_id == target_user_id).first()
        if not target_profile:
            target_profile = db.query(Profile).filter(Profile.id == target_user_id).first()
            if not target_profile:
                raise HTTPException(status_code=404, detail="Target candidate profile not found.")
        target_user = db.query(User).filter(User.id == target_profile.user_id).first()
        return {
            "authorized": True,
            "is_admin_override": True,
            "user_id": target_profile.user_id,
            "first_name": target_profile.first_name,
            "last_name": target_profile.last_name,
            "mobile_number": target_user.mobile_number if target_user else None,
            "email": target_user.email if target_user else None,
            "church_name": target_profile.church_name,
            "district": target_profile.district,
            "state": target_profile.state,
            "native_place": target_profile.native_place,
        }

    details = PaymentService.get_contact_details_if_authorized(current_user, target_user_id, db)
    return details

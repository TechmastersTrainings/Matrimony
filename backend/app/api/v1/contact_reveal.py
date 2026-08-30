from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import PaymentPurpose
from backend.app.models.subscription import ContactRevealRequest
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.payment_service import PaymentService

router = APIRouter(prefix="/contact-reveal", tags=["Contact Reveal Management"])


@router.post(
    "/request/{target_user_id}",
    summary="Request Contact Reveal with a Candidate Profile",
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
    "/pay/{reveal_request_id}",
    summary="Create Payment Order for Contact Reveal Unlock",
)
async def create_reveal_payment_order(
    reveal_request_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    req = db.query(ContactRevealRequest).filter(ContactRevealRequest.id == reveal_request_id).first()
    if not req:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Contact reveal request not found.")

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
    summary="Retrieve Verified Contact Details (Requires Mutual Completed Reveal)",
)
async def get_contact_details(
    target_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    details = PaymentService.get_contact_details_if_authorized(current_user, target_user_id, db)
    return details

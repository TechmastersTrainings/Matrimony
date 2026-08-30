from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.interaction_service import InteractionService

router = APIRouter(prefix="/interests", tags=["Interests & Matching"])


class SendInterestRequest(BaseModel):
    target_user_id: int
    message: Optional[str] = "Praise the Lord! I am interested in your matrimony profile."


class RespondInterestRequest(BaseModel):
    accept: bool


@router.post(
    "/send",
    summary="Express Matrimonial Interest in a Candidate Profile",
)
async def send_interest(
    payload: SendInterestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interest = InteractionService.send_interest(
        sender=current_user,
        target_user_id=payload.target_user_id,
        message=payload.message,
        db=db,
    )
    return {"success": True, "message": "Interest sent successfully.", "id": interest.id, "status": interest.status.value}


@router.post(
    "/{interest_id}/respond",
    summary="Accept or Decline Received Matrimonial Interest",
)
async def respond_interest(
    interest_id: int,
    payload: RespondInterestRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    interest = InteractionService.respond_interest(
        user=current_user,
        interest_id=interest_id,
        accept=payload.accept,
        db=db,
    )
    action = "accepted" if payload.accept else "declined"
    return {"success": True, "message": f"Interest {action} successfully.", "status": interest.status.value}


@router.get(
    "",
    summary="Get Interests (Received, Sent, or Mutual Matches)",
)
async def get_interests(
    tab: str = Query("received", regex="^(received|sent|matches)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = InteractionService.get_user_interests(current_user, tab, db)
    return {"tab": tab, "count": len(results), "items": results}

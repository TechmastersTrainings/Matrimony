from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.enums import ReportType
from backend.app.models.interaction import UserBlock
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.interaction_service import InteractionService

router = APIRouter(tags=["User Safety, Reporting & Blocking"])


class ReportUserRequest(BaseModel):
    reported_user_id: int
    report_type: ReportType = ReportType.PROFILE
    description: str
    evidence_url: Optional[str] = None


class BlockUserRequest(BaseModel):
    reason: Optional[str] = None


@router.post(
    "/reports/user",
    summary="Report an Inappropriate Profile, Photo, Message, or Behavior",
)
async def report_user(
    payload: ReportUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = InteractionService.report_user(
        reporter=current_user,
        reported_user_id=payload.reported_user_id,
        report_type=payload.report_type,
        description=payload.description,
        evidence_url=payload.evidence_url,
        db=db,
    )
    return {"success": True, "message": "Report submitted to admin team.", "report_id": report.id}


@router.post(
    "/blocks/{target_user_id}",
    summary="Block a User Profile from All Discoveries and Interactions",
)
async def block_user(
    target_user_id: int,
    payload: BlockUserRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    block = InteractionService.block_user(
        blocker=current_user,
        target_user_id=target_user_id,
        reason=payload.reason,
        db=db,
    )
    return {"success": True, "message": "User blocked successfully."}


@router.delete(
    "/blocks/{target_user_id}",
    summary="Unblock a User Profile",
)
async def unblock_user(
    target_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    InteractionService.unblock_user(
        blocker=current_user,
        target_user_id=target_user_id,
        db=db,
    )
    return {"success": True, "message": "User unblocked."}


@router.get(
    "/blocks/my",
    summary="Get List of Blocked Users",
)
async def get_my_blocks(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    blocks = db.query(UserBlock).filter(UserBlock.blocker_id == current_user.id).all()
    return {
        "blocked_users": [
            {"blocked_id": b.blocked_id, "reason": b.reason, "created_at": b.created_at}
            for b in blocks
        ]
    }

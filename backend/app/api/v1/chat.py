from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.services.chat_service import ChatService
from backend.app.services.database import get_db

router = APIRouter(prefix="/chat", tags=["Realtime Chat & Messaging"])


class SendMessageRequest(BaseModel):
    message_text: str


@router.get(
    "/conversations",
    summary="Get List of Active Matched Chat Conversations",
)
async def get_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = ChatService.get_user_conversations(current_user, db)
    return {"conversations": results}


@router.get(
    "/{other_user_id}",
    summary="Get Chat Messages History with a Specific Matched User",
)
async def get_chat_history(
    other_user_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    messages = ChatService.get_conversation(
        user=current_user,
        other_user_id=other_user_id,
        db=db,
        skip=skip,
        limit=limit,
    )
    return {"other_user_id": other_user_id, "messages": messages}


@router.post(
    "/{other_user_id}",
    summary="Send Direct Message to a Matched User",
)
async def send_message(
    other_user_id: int,
    payload: SendMessageRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    msg = ChatService.send_message(
        sender=current_user,
        receiver_id=other_user_id,
        text=payload.message_text,
        db=db,
    )
    return {
        "id": msg.id,
        "sender_id": msg.sender_id,
        "receiver_id": msg.receiver_id,
        "message_text": msg.message_text,
        "created_at": msg.created_at,
    }

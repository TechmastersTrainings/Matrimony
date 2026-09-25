import uuid
from typing import Optional
from fastapi import APIRouter, Depends, File, HTTPException, Query, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.user import User
from backend.app.services.ai_chat_safety_service import AIChatSafetyService
from backend.app.services.chat_service import ChatService
from backend.app.services.database import get_db
from backend.app.services.media_moderation_service import MediaModerationService
from backend.app.services.photo_service import PhotoService
from backend.app.services.storage import get_storage_service

router = APIRouter(prefix="/chat", tags=["Realtime Chat & Messaging"])


class SendMessageRequest(BaseModel):
    message_text: str
    attachment_url: Optional[str] = None
    attachment_type: Optional[str] = None


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
    "/{other_user_id}/suggestions",
    summary="Get Context-Aware AI Matrimonial Conversation Prompts",
)
async def get_chat_suggestions(
    other_user_id: int,
    language: str = Query("en", pattern="^(en|kn|hi)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if not ChatService.check_chat_permission(current_user.id, other_user_id, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Chat suggestions are only available for mutually accepted connections.",
        )
    return AIChatSafetyService.get_conversation_suggestions(
        user=current_user,
        other_user_id=other_user_id,
        db=db,
        language=language,
    )


@router.post(
    "/upload-attachment",
    summary="Upload & Inspect Chat Image Attachment for Prohibited Contacts & QR Codes",
)
async def upload_chat_attachment(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported attachment type: {file.content_type}. Allowed formats: JPEG, PNG, WebP.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > 5 * 1024 * 1024:  # 5MB attachment limit
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Chat attachment image cannot exceed 5MB.",
        )

    # Inspect image for contact info / QR codes
    is_allowed, failure_reason, category = MediaModerationService.inspect_image_content(file_bytes)
    if not is_allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=failure_reason or "Uploaded image contains prohibited contact details or external phone numbers.",
        )

    # Process and upload
    compressed_bytes, _, _ = PhotoService.process_and_compress_image(file_bytes, max_dimension=1080, quality=80)
    attach_id = uuid.uuid4().hex[:12]
    storage_key = f"chat/attachments/{current_user.id}/{attach_id}.jpg"
    storage = get_storage_service()
    attachment_url = storage.upload_file(compressed_bytes, storage_key, "image/jpeg")

    return {
        "attachment_url": attachment_url,
        "attachment_type": "image",
    }


@router.get(
    "/{other_user_id}",
    summary="Get Chat Messages History with a Specific Matched User (Strict 4-Hour Window)",
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
    summary="Send Direct Message to a Matched User with Realtime Safety Interception",
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
        attachment_url=payload.attachment_url,
        attachment_type=payload.attachment_type,
    )
    return {
        "id": msg.id,
        "sender_id": msg.sender_id,
        "receiver_id": msg.receiver_id,
        "message_text": msg.message_text,
        "is_read": msg.is_read,
        "is_redacted": msg.is_redacted,
        "redaction_reason": msg.redaction_reason,
        "attachment_url": msg.attachment_url,
        "attachment_type": msg.attachment_type,
        "created_at": msg.created_at,
    }


@router.get(
    "/{other_user_id}/partner-profile",
    summary="Get Matched Candidate Profile for Chatbox Display",
)
async def get_partner_profile(
    other_user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile_data = ChatService.get_partner_profile(current_user.id, other_user_id, db)
    if not profile_data:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Candidate profile is only accessible for mutually accepted matches.",
        )
    return profile_data

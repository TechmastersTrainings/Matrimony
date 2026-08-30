from typing import List
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.app.core.security import get_current_user
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.models.user import User
from backend.app.services.database import get_db
from backend.app.services.photo_service import PhotoService

router = APIRouter(prefix="/photos", tags=["Profile Photos"])


class PhotoReorderRequest(BaseModel):
    photo_ids: List[int]


class PhotoResponse(BaseModel):
    id: int
    r2_url: str
    thumbnail_url: Optional[str] = None
    is_primary: bool
    order_index: int
    status: str
    width: Optional[int] = None
    height: Optional[int] = None
    file_size_bytes: Optional[int] = None


@router.post(
    "/upload",
    summary="Upload & Compress Profile Photo to Cloudflare R2",
)
async def upload_photo(
    file: UploadFile = File(...),
    is_primary: bool = False,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not initialized.")

    photo = await PhotoService.upload_profile_photo(profile, file, db, is_primary)
    return {
        "id": photo.id,
        "r2_url": photo.r2_url,
        "thumbnail_url": photo.thumbnail_url,
        "is_primary": photo.is_primary,
        "order_index": photo.order_index,
        "status": photo.status.value,
    }


@router.get(
    "/my",
    summary="Get Current User Uploaded Profile Photos",
)
async def get_my_photos(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        return {"photos": [], "count": 0, "has_min_5": False}

    photos = (
        db.query(ProfilePhoto)
        .filter(ProfilePhoto.profile_id == profile.id)
        .order_by(ProfilePhoto.order_index.asc())
        .all()
    )
    has_min_5 = len(photos) >= 5

    return {
        "photos": [
            {
                "id": p.id,
                "r2_url": p.r2_url,
                "thumbnail_url": p.thumbnail_url,
                "is_primary": p.is_primary,
                "order_index": p.order_index,
                "status": p.status.value,
            }
            for p in photos
        ],
        "count": len(photos),
        "has_min_5": has_min_5,
    }


@router.put(
    "/{photo_id}/primary",
    summary="Set Selected Photo as Primary/Main Profile Picture",
)
async def set_primary(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

    PhotoService.set_primary_photo(profile.id, photo_id, db)
    return {"success": True, "message": "Primary photo updated."}


@router.put(
    "/reorder",
    summary="Reorder Photo Indices",
)
async def reorder_photos(
    payload: PhotoReorderRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

    PhotoService.reorder_photos(profile.id, payload.photo_ids, db)
    return {"success": True, "message": "Photos reordered."}


@router.delete(
    "/{photo_id}",
    summary="Delete Profile Photo & Clean R2 Storage",
)
async def delete_photo(
    photo_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Profile not found.")

    PhotoService.delete_profile_photo(profile.id, photo_id, db)
    return {"success": True, "message": "Photo deleted successfully."}

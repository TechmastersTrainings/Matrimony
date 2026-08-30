import io
import os
import uuid
from typing import BinaryIO, List, Optional, Tuple, Union
from PIL import Image
from sqlalchemy.orm import Session
from fastapi import HTTPException, UploadFile, status

from backend.app.core.config import settings
from backend.app.core.logger import logger
from backend.app.models.enums import PhotoStatus, ProfileStatus
from backend.app.models.photo import ProfilePhoto
from backend.app.models.profile import Profile
from backend.app.services.storage import get_storage_service

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10MB
ALLOWED_MIME_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MIN_PHOTOS_REQUIRED = 5


class PhotoService:
    @staticmethod
    def process_and_compress_image(
        file_bytes: bytes,
        max_dimension: int = 1200,
        quality: int = 85,
    ) -> Tuple[bytes, int, int]:
        """Validates, resizes, and compresses image using Pillow."""
        try:
            image = Image.open(io.BytesIO(file_bytes))
            # Convert RGBA / CMYK to RGB
            if image.mode in ("RGBA", "P", "LA", "CMYK"):
                image = image.convert("RGB")

            # Resize if exceeding max dimensions while preserving aspect ratio
            width, height = image.size
            if width > max_dimension or height > max_dimension:
                image.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
                width, height = image.size

            output_buffer = io.BytesIO()
            image.save(output_buffer, format="JPEG", quality=quality, optimize=True)
            compressed_bytes = output_buffer.getvalue()
            return compressed_bytes, width, height
        except Exception as e:
            logger.error(f"Image compression failed: {e}")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid image format or corrupted file.",
            )

    @staticmethod
    def generate_thumbnail(file_bytes: bytes, thumb_dimension: int = 300) -> bytes:
        compressed_thumb, _, _ = PhotoService.process_and_compress_image(
            file_bytes, max_dimension=thumb_dimension, quality=80
        )
        return compressed_thumb

    @staticmethod
    async def upload_profile_photo(
        profile: Profile,
        file: UploadFile,
        db: Session,
        is_primary: bool = False,
    ) -> ProfilePhoto:
        # Validate content type
        if file.content_type not in ALLOWED_MIME_TYPES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Unsupported file type: {file.content_type}. Allowed: JPEG, PNG, WebP.",
            )

        file_bytes = await file.read()
        if len(file_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Image file exceeds maximum limit of 10MB.",
            )

        # Process and compress
        compressed_bytes, width, height = PhotoService.process_and_compress_image(file_bytes)
        thumb_bytes = PhotoService.generate_thumbnail(file_bytes)

        photo_id = uuid.uuid4().hex[:12]
        r2_main_key = f"profiles/{profile.id}/photos/{photo_id}.jpg"
        r2_thumb_key = f"profiles/{profile.id}/photos/thumbs/{photo_id}.jpg"

        storage = get_storage_service()
        main_url = storage.upload_file(compressed_bytes, r2_main_key, "image/jpeg")
        thumb_url = storage.upload_file(thumb_bytes, r2_thumb_key, "image/jpeg")

        # Determine order index
        current_photos_count = db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == profile.id).count()
        if current_photos_count == 0 or is_primary:
            # First photo is primary by default
            is_primary = True
            db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == profile.id).update({"is_primary": False})

        new_photo = ProfilePhoto(
            profile_id=profile.id,
            r2_key=r2_main_key,
            r2_url=main_url,
            thumbnail_url=thumb_url,
            is_primary=is_primary,
            order_index=current_photos_count,
            status=PhotoStatus.PENDING_REVIEW,
            width=width,
            height=height,
            file_size_bytes=len(compressed_bytes),
            content_type="image/jpeg",
        )
        db.add(new_photo)

        # Frozen profile rule: If profile was already approved, putting a new photo moves review state
        if profile.status == ProfileStatus.APPROVED:
            profile.status = ProfileStatus.UNDER_REVIEW
            logger.info(f"Profile {profile.id} moved to UNDER_REVIEW due to new photo upload.")

        db.commit()
        db.refresh(new_photo)
        return new_photo

    @staticmethod
    def set_primary_photo(profile_id: int, photo_id: int, db: Session) -> bool:
        photo = db.query(ProfilePhoto).filter(
            ProfilePhoto.id == photo_id,
            ProfilePhoto.profile_id == profile_id,
        ).first()
        if not photo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found.")

        db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == profile_id).update({"is_primary": False})
        photo.is_primary = True
        db.commit()
        return True

    @staticmethod
    def delete_profile_photo(profile_id: int, photo_id: int, db: Session) -> bool:
        photo = db.query(ProfilePhoto).filter(
            ProfilePhoto.id == photo_id,
            ProfilePhoto.profile_id == profile_id,
        ).first()
        if not photo:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Photo not found.")

        # Cleanup R2 storage
        storage = get_storage_service()
        try:
            storage.delete_file(photo.r2_key)
            if photo.thumbnail_url:
                thumb_key = photo.r2_key.replace("/photos/", "/photos/thumbs/")
                storage.delete_file(thumb_key)
        except Exception as e:
            logger.warning(f"R2 deletion warning for {photo.r2_key}: {e}")

        db.delete(photo)

        # If deleted photo was primary, assign primary to next available photo
        remaining_photos = db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == profile_id).order_by(ProfilePhoto.order_index).all()
        if remaining_photos and photo.is_primary:
            remaining_photos[0].is_primary = True

        db.commit()
        return True

    @staticmethod
    def reorder_photos(profile_id: int, photo_ids: List[int], db: Session) -> bool:
        for idx, p_id in enumerate(photo_ids):
            db.query(ProfilePhoto).filter(
                ProfilePhoto.id == p_id,
                ProfilePhoto.profile_id == profile_id,
            ).update({"order_index": idx})
        db.commit()
        return True

    @staticmethod
    def check_min_photos(profile_id: int, db: Session) -> Tuple[bool, int]:
        count = db.query(ProfilePhoto).filter(ProfilePhoto.profile_id == profile_id).count()
        return count >= MIN_PHOTOS_REQUIRED, count

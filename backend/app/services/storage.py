from abc import ABC, abstractmethod
import io
import os
from typing import BinaryIO, Dict, Optional, Tuple, Union
import boto3
from botocore.config import Config
from botocore.exceptions import ClientError
from PIL import Image, ImageDraw, ImageFont

from backend.app.core.config import settings
from backend.app.core.logger import logger
from backend.app.core.exceptions import StorageServiceException

UPLOAD_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "uploads"))
os.makedirs(UPLOAD_DIR, exist_ok=True)


class IStorageService(ABC):
    """Abstract interface for object/media storage services."""

    @abstractmethod
    def upload_file(
        self,
        file_obj: Union[BinaryIO, bytes],
        destination_path: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        """Uploads a file and returns its URL/Key."""
        pass

    @abstractmethod
    def get_file(self, file_path: str) -> bytes:
        """Retrieves file bytes from storage."""
        pass

    @abstractmethod
    def delete_file(self, file_path: str) -> bool:
        """Deletes a file from storage."""
        pass

    @abstractmethod
    def generate_presigned_url(self, file_path: str, expiration: int = 3600) -> str:
        """Generates a presigned URL for private file access."""
        pass

    @abstractmethod
    def check_health(self) -> Tuple[bool, str]:
        """Checks storage service connectivity."""
        pass


class CloudflareR2StorageService(IStorageService):
    """Cloudflare R2 storage implementation using S3-compatible Boto3 client."""

    def __init__(self):
        self.account_id = settings.R2_ACCOUNT_ID
        self.access_key_id = settings.R2_ACCESS_KEY_ID
        self.secret_access_key = settings.R2_SECRET_ACCESS_KEY
        self.bucket_name = settings.R2_BUCKET_NAME
        self.public_url = settings.R2_PUBLIC_URL

        self._client = None
        if self.account_id and self.access_key_id and self.secret_access_key:
            endpoint_url = f"https://{self.account_id}.r2.cloudflarestorage.com"
            self._client = boto3.client(
                "s3",
                endpoint_url=endpoint_url,
                aws_access_key_id=self.access_key_id,
                aws_secret_access_key=self.secret_access_key,
                config=Config(signature_version="s3v4"),
                region_name="auto",
            )
            logger.info("Cloudflare R2 S3 client initialized.")

    @property
    def client(self):
        if self._client is None:
            if settings.R2_ACCOUNT_ID and settings.R2_ACCESS_KEY_ID and settings.R2_SECRET_ACCESS_KEY:
                endpoint_url = f"https://{settings.R2_ACCOUNT_ID}.r2.cloudflarestorage.com"
                self._client = boto3.client(
                    "s3",
                    endpoint_url=endpoint_url,
                    aws_access_key_id=settings.R2_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.R2_SECRET_ACCESS_KEY,
                    config=Config(signature_version="s3v4"),
                    region_name="auto",
                )
                self.bucket_name = settings.R2_BUCKET_NAME
                self.public_url = settings.R2_PUBLIC_URL
            else:
                raise StorageServiceException("Cloudflare R2 credentials are not configured.")
        return self._client

    def upload_file(
        self,
        file_obj: Union[BinaryIO, bytes],
        destination_path: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        try:
            body = file_obj if isinstance(file_obj, (bytes, bytearray)) else file_obj.read()
            self.client.put_object(
                Bucket=self.bucket_name,
                Key=destination_path,
                Body=body,
                ContentType=content_type,
            )
            if self.public_url and self.public_url.strip():
                return f"{self.public_url.rstrip('/')}/{destination_path.lstrip('/')}"
            backend_url = os.getenv("RENDER_EXTERNAL_URL") or os.getenv("API_BASE_URL") or "https://matrimony-hxs5.onrender.com"
            return f"{backend_url.rstrip('/')}/media/{destination_path.lstrip('/')}"
        except ClientError as e:
            logger.error(f"R2 upload error for {destination_path}: {e}")
            raise StorageServiceException(f"Failed to upload file to R2: {str(e)}")

    def get_file(self, file_path: str) -> bytes:
        try:
            response = self.client.get_object(
                Bucket=self.bucket_name,
                Key=file_path,
            )
            return response["Body"].read()
        except ClientError as e:
            logger.error(f"R2 get_file error for {file_path}: {e}")
            raise StorageServiceException(f"Failed to retrieve file from R2: {str(e)}")

    def delete_file(self, file_path: str) -> bool:
        try:
            self.client.delete_object(
                Bucket=self.bucket_name,
                Key=file_path,
            )
            return True
        except ClientError as e:
            logger.error(f"R2 delete_file error for {file_path}: {e}")
            raise StorageServiceException(f"Failed to delete file from R2: {str(e)}")

    def generate_presigned_url(self, file_path: str, expiration: int = 3600) -> str:
        try:
            url = self.client.generate_presigned_url(
                "get_object",
                Params={"Bucket": self.bucket_name, "Key": file_path},
                ExpiresIn=expiration,
            )
            return url
        except ClientError as e:
            logger.error(f"R2 presigned URL generation error: {e}")
            raise StorageServiceException(f"Failed to generate presigned URL: {str(e)}")

    def check_health(self) -> Tuple[bool, str]:
        if not (settings.R2_ACCOUNT_ID and settings.R2_ACCESS_KEY_ID and settings.R2_SECRET_ACCESS_KEY):
            return False, "Cloudflare R2 credentials not configured"
        try:
            self.client.head_bucket(Bucket=self.bucket_name)
            return True, "Cloudflare R2 connected (healthy)"
        except Exception as e:
            logger.error(f"Cloudflare R2 health check failed: {e}")
            return False, f"Cloudflare R2 error: {str(e)}"


class LocalStorageService(IStorageService):
    """Local disk storage for development and offline testing."""

    def __init__(self):
        self.upload_dir = UPLOAD_DIR
        self.base_url = "http://localhost:8000/media"

    def upload_file(
        self,
        file_obj: Union[BinaryIO, bytes],
        destination_path: str,
        content_type: str = "application/octet-stream",
    ) -> str:
        body = file_obj if isinstance(file_obj, (bytes, bytearray)) else file_obj.read()
        full_path = os.path.join(self.upload_dir, destination_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        with open(full_path, "wb") as f:
            f.write(body)
        return f"{self.base_url}/{destination_path.lstrip('/')}"

    def get_file(self, file_path: str) -> bytes:
        full_path = os.path.join(self.upload_dir, file_path)
        if os.path.exists(full_path):
            with open(full_path, "rb") as f:
                return f.read()

        # Generate a high quality fallback placeholder image on the fly
        img = Image.new("RGB", (600, 750), color=(15, 23, 42))
        draw = ImageDraw.Draw(img)
        # Draw elegant decorative frame
        draw.rectangle([(20, 20), (580, 730)], outline=(245, 158, 11), width=3)
        draw.ellipse([(200, 200), (400, 400)], fill=(30, 41, 59), outline=(245, 158, 11), width=2)
        # Save to memory
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=90)
        return buf.getvalue()

    def delete_file(self, file_path: str) -> bool:
        full_path = os.path.join(self.upload_dir, file_path)
        if os.path.exists(full_path):
            os.remove(full_path)
        return True

    def generate_presigned_url(self, file_path: str, expiration: int = 3600) -> str:
        return f"{self.base_url}/{file_path.lstrip('/')}"

    def check_health(self) -> Tuple[bool, str]:
        return True, "Local Storage connected (healthy)"


# Storage singletons
_real_storage = CloudflareR2StorageService()
_local_storage = LocalStorageService()


def get_storage_service() -> IStorageService:
    """Dependency injector for storage service."""
    if settings.R2_ACCOUNT_ID and settings.R2_ACCESS_KEY_ID and settings.R2_SECRET_ACCESS_KEY:
        return _real_storage
    return _local_storage

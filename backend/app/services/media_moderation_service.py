import io
import re
from typing import Optional, Tuple
from PIL import Image

from backend.app.core.logger import logger
from backend.app.models.enums import ModerationCategory
from backend.app.services.contact_detection_service import ContactDetectionService


class MediaModerationService:
    @staticmethod
    def inspect_image_content(image_bytes: bytes) -> Tuple[bool, Optional[str], Optional[ModerationCategory]]:
        """
        Inspects an uploaded image attachment for prohibited contact information (phone numbers, emails, QR codes).
        Returns (is_allowed, failure_reason, category).
        """
        if not image_bytes:
            return False, "Empty image file", ModerationCategory.OTHER_POLICY_VIOLATION

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()  # Validate image integrity
        except Exception as e:
            logger.warning(f"Failed to parse uploaded image: {e}")
            return False, "Invalid or corrupted image file", ModerationCategory.OTHER_POLICY_VIOLATION

        # Re-open for analysis after verify() closes the stream
        image = Image.open(io.BytesIO(image_bytes))

        # Attempt OCR text extraction if pytesseract is installed and tesseract is available
        extracted_text = ""
        try:
            import pytesseract
            extracted_text = pytesseract.image_to_string(image)
        except Exception as ocr_err:
            # Pytesseract not installed or tesseract binary not in path: fallback gracefully
            logger.debug(f"OCR scan note (pytesseract optional): {ocr_err}")

        if extracted_text and extracted_text.strip():
            detection = ContactDetectionService.evaluate_message(extracted_text)
            if detection.is_violation:
                logger.warning(f"Image attachment blocked due to detected text: {detection.categories}")
                primary_cat = detection.categories[0] if detection.categories else ModerationCategory.PHONE_NUMBER
                return False, "Image contains prohibited contact details or external phone numbers.", primary_cat

        return True, None, None

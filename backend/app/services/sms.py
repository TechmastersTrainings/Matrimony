from abc import ABC, abstractmethod
from typing import Dict, Any


class ISmsService(ABC):
    """Abstract interface for Indian SMS / OTP Provider (Fast2SMS, MSG91, Textlocal, etc.)."""

    @abstractmethod
    async def send_otp(self, phone_number: str, otp_code: str) -> Dict[str, Any]:
        """Sends OTP verification code via SMS to Indian mobile numbers."""
        pass

    @abstractmethod
    async def send_transactional_sms(self, phone_number: str, message: str) -> Dict[str, Any]:
        """Sends transactional SMS updates."""
        pass


class MockIndianSmsService(ISmsService):
    """Phase 1 Placeholder implementation for SMS Service."""

    async def send_otp(self, phone_number: str, otp_code: str) -> Dict[str, Any]:
        # Phase 1: No OTP / Registration logic implemented
        return {"status": "placeholder", "message": "SMS service is prepared for Phase 2 integration"}

    async def send_transactional_sms(self, phone_number: str, message: str) -> Dict[str, Any]:
        return {"status": "placeholder", "message": "SMS service is prepared for Phase 2 integration"}

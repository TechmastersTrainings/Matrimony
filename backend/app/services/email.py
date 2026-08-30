from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class IEmailService(ABC):
    """Abstract interface for Transactional Email (Resend, AWS SES, SMTP)."""

    @abstractmethod
    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        from_email: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Sends transactional email."""
        pass


class MockEmailService(IEmailService):
    """Phase 1 Placeholder implementation for Email Service."""

    async def send_email(
        self,
        to_email: str,
        subject: str,
        html_content: str,
        from_email: Optional[str] = None,
    ) -> Dict[str, Any]:
        return {"status": "placeholder", "message": "Email service prepared for future phases"}

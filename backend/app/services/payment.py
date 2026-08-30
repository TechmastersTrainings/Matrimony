from abc import ABC, abstractmethod
from typing import Dict, Any


class IPaymentService(ABC):
    """Abstract interface for Indian UPI / Payment Gateway (Razorpay, Cashfree, PhonePe)."""

    @abstractmethod
    async def create_order(self, amount_in_paise: int, currency: str = "INR", receipt: str = "") -> Dict[str, Any]:
        """Creates a payment order."""
        pass

    @abstractmethod
    async def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        """Verifies HMAC SHA256 payment signature from gateway."""
        pass


class MockUpiPaymentService(IPaymentService):
    """Phase 1 Placeholder implementation for UPI Payment Service."""

    async def create_order(self, amount_in_paise: int, currency: str = "INR", receipt: str = "") -> Dict[str, Any]:
        return {"status": "placeholder", "message": "Payment service is prepared for future phases"}

    async def verify_payment_signature(self, order_id: str, payment_id: str, signature: str) -> bool:
        return True

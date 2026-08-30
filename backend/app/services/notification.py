from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional


class INotificationService(ABC):
    """Abstract interface for Push Notifications (Firebase Cloud Messaging)."""

    @abstractmethod
    async def send_push_notification(
        self,
        token: str,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Sends push notification to target device token."""
        pass

    @abstractmethod
    async def send_multicast_notification(
        self,
        tokens: List[str],
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        """Sends push notification to multiple devices."""
        pass


class MockNotificationService(INotificationService):
    """Phase 1 Placeholder implementation for FCM Notification Service."""

    async def send_push_notification(
        self,
        token: str,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        return {"status": "placeholder", "message": "Notification service prepared for future phases"}

    async def send_multicast_notification(
        self,
        tokens: List[str],
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None,
    ) -> Dict[str, Any]:
        return {"status": "placeholder", "message": "Notification service prepared for future phases"}

from typing import Optional, Tuple
import redis
from backend.app.core.config import settings
from backend.app.core.logger import logger

_redis_client: Optional[redis.Redis] = None


def get_redis_client() -> Optional[redis.Redis]:
    """Provides a singleton Redis client instance supporting Upstash Redis."""
    global _redis_client
    if _redis_client is None and settings.REDIS_URL:
        try:
            # If using Upstash Redis token/URL
            _redis_client = redis.from_url(
                settings.REDIS_URL,
                decode_responses=True,
                socket_timeout=5.0,
                socket_connect_timeout=5.0,
            )
            logger.info("Redis client connected.")
        except Exception as e:
            logger.error(f"Failed to initialize Redis client: {e}")
            _redis_client = None
    return _redis_client


def check_redis_health() -> Tuple[bool, str]:
    """Pings Redis to ensure Upstash connectivity."""
    if not settings.REDIS_URL:
        return False, "REDIS_URL not configured"

    try:
        client = get_redis_client()
        if client is None:
            return False, "Redis client not initialized"
        pong = client.ping()
        if pong:
            return True, "Redis connected (healthy)"
        return False, "Redis ping returned false"
    except Exception as e:
        logger.error(f"Redis health check failed: {e}")
        return False, f"Redis connection error: {str(e)}"

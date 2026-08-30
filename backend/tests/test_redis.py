from unittest.mock import patch, MagicMock
from backend.app.services.redis import check_redis_health, get_redis_client


def test_redis_health_unconfigured():
    with patch("backend.app.services.redis.settings.REDIS_URL", None):
        ok, msg = check_redis_health()
        assert ok is False
        assert "not configured" in msg


def test_redis_health_success():
    mock_redis = MagicMock()
    mock_redis.ping.return_value = True
    with patch("backend.app.services.redis.get_redis_client", return_value=mock_redis), \
         patch("backend.app.services.redis.settings.REDIS_URL", "rediss://localhost:6379"):
        ok, msg = check_redis_health()
        assert ok is True
        assert "healthy" in msg

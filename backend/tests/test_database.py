from unittest.mock import patch, MagicMock
from backend.app.services.database import check_database_health, get_db


def test_database_health_unconfigured():
    with patch("backend.app.services.database.settings.DATABASE_URL", None):
        ok, msg = check_database_health()
        assert ok is False
        assert "not configured" in msg


def test_database_session_generator_unconfigured():
    with patch("backend.app.services.database.settings.DATABASE_URL", None):
        gen = get_db()
        session = next(gen)
        assert session is None

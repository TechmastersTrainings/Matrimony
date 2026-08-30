import os
import sys
import pytest
from fastapi.testclient import TestClient

# Ensure root directory is on PYTHONPATH
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

from backend.app.main import app
from backend.app.core.config import settings


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def test_settings():
    return settings

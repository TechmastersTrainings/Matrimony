from fastapi import status


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert "app" in data
    assert "docs" in data
    assert data["docs"] == "/docs"


def test_health_endpoint(client):
    response = client.get("/health")
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_503_SERVICE_UNAVAILABLE]
    data = response.json()
    assert "status" in data
    assert "services" in data
    assert "database" in data["services"]
    assert "redis" in data["services"]
    assert "storage" in data["services"]


def test_api_v1_health_endpoint(client):
    response = client.get("/api/v1/health")
    assert response.status_code in [status.HTTP_200_OK, status.HTTP_503_SERVICE_UNAVAILABLE]
    data = response.json()
    assert "status" in data
    assert data["version"] == "1.0.0"

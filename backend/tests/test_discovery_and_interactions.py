import pytest
from fastapi import status


@pytest.fixture
def groom_client(client):
    reg = {
        "mobile_number": "9876543501",
        "email": "groom@example.com",
        "password": "Password123!",
        "first_name": "Groom",
        "last_name": "David",
        "gender": "MALE",
    }
    client.post("/api/v1/auth/register", json=reg)
    verify = client.post("/api/v1/auth/verify-otp", json={"target": "9876543501", "otp_code": "123456"})
    token = verify.json()["access_token"]
    user_id = verify.json()["user_id"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fill and submit profile
    client.put(
        "/api/v1/profile/draft",
        json={"current_step": 6, "draft_data": {"denomination": "METHODIST", "district": "Bidar", "age": 28}},
        headers=headers,
    )
    client.post("/api/v1/registration/submit", json={"confirmed": True}, headers=headers)
    # Admin approve
    me = client.get("/api/v1/registration/me", headers=headers).json()
    client.post(f"/api/v1/admin/profiles/{me['profile']['id']}/approve", headers=headers)
    return {"headers": headers, "user_id": user_id}


@pytest.fixture
def bride_client(client):
    reg = {
        "mobile_number": "9876543502",
        "email": "bride@example.com",
        "password": "Password123!",
        "first_name": "Bride",
        "last_name": "Mary",
        "gender": "FEMALE",
    }
    client.post("/api/v1/auth/register", json=reg)
    verify = client.post("/api/v1/auth/verify-otp", json={"target": "9876543502", "otp_code": "123456"})
    token = verify.json()["access_token"]
    user_id = verify.json()["user_id"]
    headers = {"Authorization": f"Bearer {token}"}

    # Fill and submit profile
    client.put(
        "/api/v1/profile/draft",
        json={"current_step": 6, "draft_data": {"denomination": "METHODIST", "district": "Bidar", "age": 25}},
        headers=headers,
    )
    client.post("/api/v1/registration/submit", json={"confirmed": True}, headers=headers)
    # Admin approve
    me = client.get("/api/v1/registration/me", headers=headers).json()
    client.post(f"/api/v1/admin/profiles/{me['profile']['id']}/approve", headers=headers)
    return {"headers": headers, "user_id": user_id}


def test_discovery_interest_and_chat_flow(client, groom_client, bride_client):
    # 1. Groom searches for profiles (Bride should be found)
    search_res = client.get("/api/v1/discovery/search", headers=groom_client["headers"])
    assert search_res.status_code == status.HTTP_200_OK
    search_data = search_res.json()
    assert search_data["total"] >= 1
    bride_found = [p for p in search_data["profiles"] if p["user_id"] == bride_client["user_id"]]
    assert len(bride_found) == 1

    # 2. Groom sends interest to Bride
    send_interest_res = client.post(
        "/api/v1/interests/send",
        json={"target_user_id": bride_client["user_id"], "message": "Praise the Lord! Would like to connect."},
        headers=groom_client["headers"],
    )
    assert send_interest_res.status_code == status.HTTP_200_OK
    interest_id = send_interest_res.json()["id"]

    # 3. Bride views received interests
    received_res = client.get("/api/v1/interests?tab=received", headers=bride_client["headers"])
    assert received_res.status_code == status.HTTP_200_OK
    assert received_res.json()["count"] >= 1

    # 4. Bride accepts interest -> creates mutual MATCH
    respond_res = client.post(
        f"/api/v1/interests/{interest_id}/respond",
        json={"accept": True},
        headers=bride_client["headers"],
    )
    assert respond_res.status_code == status.HTTP_200_OK
    assert respond_res.json()["status"] == "ACCEPTED"

    # 5. Groom sends realtime chat message to Bride
    chat_res = client.post(
        f"/api/v1/chat/{bride_client['user_id']}",
        json={"message_text": "Hello, thank you for accepting my interest!"},
        headers=groom_client["headers"],
    )
    assert chat_res.status_code == status.HTTP_200_OK
    assert chat_res.json()["message_text"] == "Hello, thank you for accepting my interest!"

    # 6. Bride reads conversation history
    history_res = client.get(f"/api/v1/chat/{groom_client['user_id']}", headers=bride_client["headers"])
    assert history_res.status_code == status.HTTP_200_OK
    assert len(history_res.json()["messages"]) >= 1

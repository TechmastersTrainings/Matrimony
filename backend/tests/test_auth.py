import pytest
from fastapi import status


def test_register_success(client):
    payload = {
        "mobile_number": "9876543210",
        "email": "candidate1@example.com",
        "password": "SecurePassword123!",
        "role": "CANDIDATE",
        "profile_created_by": "SELF",
        "first_name": "Joshua",
        "last_name": "Fernandes",
        "gender": "MALE",
    }
    response = client.post("/api/v1/auth/register", json=payload)
    assert response.status_code == status.HTTP_201_CREATED
    data = response.json()
    assert data["success"] is True
    assert "Registration initiated" in data["message"]
    assert data["debug_otp"] == "123456"  # In test mode


def test_duplicate_mobile_blocked(client):
    payload1 = {
        "mobile_number": "9876543211",
        "email": "user1@example.com",
        "password": "Password123!",
        "first_name": "David",
        "last_name": "Paul",
        "gender": "MALE",
    }
    res1 = client.post("/api/v1/auth/register", json=payload1)
    assert res1.status_code == status.HTTP_201_CREATED

    payload2 = {
        "mobile_number": "9876543211",
        "email": "user2@example.com",
        "password": "Password123!",
        "first_name": "Jonathan",
        "last_name": "Paul",
        "gender": "MALE",
    }
    res2 = client.post("/api/v1/auth/register", json=payload2)
    assert res2.status_code == status.HTTP_400_BAD_REQUEST
    err_json = res2.json()
    msg = err_json.get("error", {}).get("message") or err_json.get("detail", "")
    assert "mobile number already exists" in msg


def test_duplicate_email_blocked(client):
    payload1 = {
        "mobile_number": "9876543212",
        "email": "grace@example.com",
        "password": "Password123!",
        "first_name": "Grace",
        "last_name": "D'Souza",
        "gender": "FEMALE",
    }
    res1 = client.post("/api/v1/auth/register", json=payload1)
    assert res1.status_code == status.HTTP_201_CREATED

    payload2 = {
        "mobile_number": "9876543213",
        "email": "grace@example.com",
        "password": "Password123!",
        "first_name": "Ruth",
        "last_name": "D'Souza",
        "gender": "FEMALE",
    }
    res2 = client.post("/api/v1/auth/register", json=payload2)
    assert res2.status_code == status.HTTP_400_BAD_REQUEST
    err_json = res2.json()
    msg = err_json.get("error", {}).get("message") or err_json.get("detail", "")
    assert "email address already exists" in msg


def test_otp_verify_and_login_flow(client):
    # 1. Register
    reg_payload = {
        "mobile_number": "9876543214",
        "email": "samuel@example.com",
        "password": "Password123!",
        "first_name": "Samuel",
        "last_name": "Kumar",
        "gender": "MALE",
    }
    reg_res = client.post("/api/v1/auth/register", json=reg_payload)
    assert reg_res.status_code == status.HTTP_201_CREATED

    # 2. Verify OTP
    verify_payload = {
        "target": "9876543214",
        "otp_code": "123456",
        "otp_type": "REGISTRATION",
    }
    verify_res = client.post("/api/v1/auth/verify-otp", json=verify_payload)
    assert verify_res.status_code == status.HTTP_200_OK
    token_data = verify_res.json()
    assert "access_token" in token_data
    assert "refresh_token" in token_data
    assert token_data["is_mobile_verified"] is True
    access_token = token_data["access_token"]

    # 3. Password Login
    login_pwd_payload = {
        "identifier": "9876543214",
        "password": "Password123!",
        "login_type": "password",
    }
    login_pwd_res = client.post("/api/v1/auth/login", json=login_pwd_payload)
    assert login_pwd_res.status_code == status.HTTP_200_OK
    assert "access_token" in login_pwd_res.json()

    # 4. OTP Login
    login_otp_payload = {
        "identifier": "samuel@example.com",
        "otp_code": "123456",
        "login_type": "otp",
    }
    login_otp_res = client.post("/api/v1/auth/login", json=login_otp_payload)
    assert login_otp_res.status_code == status.HTTP_200_OK
    assert "access_token" in login_otp_res.json()

    # 5. Access Protected Route
    auth_headers = {"Authorization": f"Bearer {access_token}"}
    me_res = client.get("/api/v1/registration/me", headers=auth_headers)
    assert me_res.status_code == status.HTTP_200_OK
    me_data = me_res.json()
    assert me_data["email"] == "samuel@example.com"
    assert me_data["current_step"] == 1

    # 6. Logout
    logout_res = client.post("/api/v1/auth/logout", headers=auth_headers)
    assert logout_res.status_code == status.HTTP_200_OK
    assert logout_res.json()["success"] is True

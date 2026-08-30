import pytest
from fastapi import status


@pytest.fixture
def auth_token(client):
    reg_payload = {
        "mobile_number": "9876543220",
        "email": "sarah@example.com",
        "password": "Password123!",
        "first_name": "Sarah",
        "last_name": "Mathew",
        "gender": "FEMALE",
    }
    client.post("/api/v1/auth/register", json=reg_payload)
    verify_payload = {
        "target": "9876543220",
        "otp_code": "123456",
        "otp_type": "REGISTRATION",
    }
    verify_res = client.post("/api/v1/auth/verify-otp", json=verify_payload)
    return verify_res.json()["access_token"]


def test_draft_save_resume_and_submit_lifecycle(client, auth_token):
    headers = {"Authorization": f"Bearer {auth_token}"}

    # 1. Fetch initial draft
    res1 = client.get("/api/v1/profile/draft", headers=headers)
    assert res1.status_code == status.HTTP_200_OK
    data1 = res1.json()
    assert data1["current_step"] == 1
    assert data1["draft_data"]["first_name"] == "Sarah"

    # 2. Save Step 2: Faith & Church
    step2_payload = {
        "current_step": 2,
        "draft_data": {
            "denomination": "METHODIST",
            "church_name": "Centenary Methodist Church",
            "parish_or_pastor": "Rev. Johnson",
            "is_baptized": True,
            "is_born_again": True,
        },
    }
    res2 = client.put("/api/v1/profile/draft", json=step2_payload, headers=headers)
    assert res2.status_code == status.HTTP_200_OK
    assert res2.json()["current_step"] == 2
    assert res2.json()["draft_data"]["denomination"] == "METHODIST"

    # 3. Save Step 3: Education & Career
    step3_payload = {
        "current_step": 3,
        "draft_data": {
            "highest_education": "B.Tech Computer Science",
            "occupation_type": "IT_SOFTWARE",
            "occupation_title": "Software Engineer",
            "annual_income_min": 1200000,
            "work_location": "Bangalore / Bidar",
        },
    }
    res3 = client.put("/api/v1/profile/draft", json=step3_payload, headers=headers)
    assert res3.status_code == status.HTTP_200_OK
    assert res3.json()["current_step"] == 3

    # 4. Check /registration/me progress
    me_res = client.get("/api/v1/registration/me", headers=headers)
    assert me_res.status_code == status.HTTP_200_OK
    me_data = me_res.json()
    assert me_data["completion_percentage"] > 20
    assert me_data["profile_status"] == "DRAFT"

    # 5. Submit Profile
    submit_payload = {"confirmed": True}
    submit_res = client.post("/api/v1/registration/submit", json=submit_payload, headers=headers)
    assert submit_res.status_code == status.HTTP_200_OK
    submit_data = submit_res.json()
    assert submit_data["status"] == "SUBMITTED"
    assert submit_data["denomination"] == "METHODIST"
    assert submit_data["submitted_at"] is not None


def test_admin_list_users(client, auth_token):
    res = client.get("/api/v1/admin/users")
    assert res.status_code == status.HTTP_200_OK
    data = res.json()
    assert "total" in data
    assert "users" in data
    assert len(data["users"]) > 0

import pytest
from fastapi import status


@pytest.fixture
def candidate_token(client):
    reg_payload = {
        "mobile_number": "9876543401",
        "email": "candidate_admin_test@example.com",
        "password": "Password123!",
        "first_name": "Elijah",
        "last_name": "Thomas",
        "gender": "MALE",
    }
    client.post("/api/v1/auth/register", json=reg_payload)
    verify_res = client.post(
        "/api/v1/auth/verify-otp",
        json={"target": "9876543401", "otp_code": "123456", "otp_type": "REGISTRATION"},
    )
    return verify_res.json()["access_token"]


def test_verification_status_and_admin_moderation(client, candidate_token):
    headers = {"Authorization": f"Bearer {candidate_token}"}

    # 1. Update Draft and Submit Profile
    step_payload = {
        "current_step": 6,
        "draft_data": {
            "denomination": "CSI",
            "church_name": "St. Paul's Church, Bidar",
            "highest_education": "Master of Divinity",
            "occupation_title": "Church Minister",
            "dob": "1994-08-20",
            "age": 32,
            "district": "Bidar",
            "state": "Karnataka",
        },
    }
    client.put("/api/v1/profile/draft", json=step_payload, headers=headers)
    submit_res = client.post("/api/v1/registration/submit", json={"confirmed": True}, headers=headers)
    assert submit_res.status_code == status.HTTP_200_OK

    # 2. Check Verification Status (Flagged for <5 photos initially)
    verif_res = client.get("/api/v1/verification/status", headers=headers)
    assert verif_res.status_code == status.HTTP_200_OK
    verif_data = verif_res.json()
    assert verif_data["status"] == "SUBMITTED"

    profile_id = verif_data["profile_id"]

    # 3. Admin list profiles
    admin_profiles_res = client.get("/api/v1/admin/profiles?status_filter=SUBMITTED")
    assert admin_profiles_res.status_code == status.HTTP_200_OK
    assert len(admin_profiles_res.json()["profiles"]) > 0

    # 4. Admin Request Changes
    req_changes_payload = {"notes": "Please upload 5 clear photos of the candidate."}
    req_changes_res = client.post(
        f"/api/v1/admin/profiles/{profile_id}/request-changes",
        json=req_changes_payload,
        headers=headers,
    )
    assert req_changes_res.status_code == status.HTTP_200_OK
    assert req_changes_res.json()["status"] == "CHANGES_REQUIRED"

    # 5. Admin Approve Profile
    approve_res = client.post(f"/api/v1/admin/profiles/{profile_id}/approve", headers=headers)
    assert approve_res.status_code == status.HTTP_200_OK
    assert approve_res.json()["status"] == "APPROVED"

    # 6. Verify Audit Logs Recorded
    audit_res = client.get("/api/v1/admin/audit-logs")
    assert audit_res.status_code == status.HTTP_200_OK
    logs = audit_res.json()["logs"]
    assert len(logs) >= 2
    actions = [l["action"] for l in logs]
    assert "PROFILE_APPROVE" in actions

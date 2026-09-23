import pytest
from fastapi import status


@pytest.fixture
def test_user(client):
    reg = {
        "mobile_number": "9876543601",
        "email": "payment_user@example.com",
        "password": "Password123!",
        "first_name": "Peter",
        "last_name": "Lobo",
        "gender": "MALE",
    }
    client.post("/api/v1/auth/register", json=reg)
    verify = client.post("/api/v1/auth/verify-otp", json={"target": "9876543601", "otp_code": "123456"})
    token = verify.json()["access_token"]
    user_id = verify.json()["user_id"]
    return {"headers": {"Authorization": f"Bearer {token}"}, "user_id": user_id}


def test_subscription_and_payment_flow(client, test_user):
    headers = test_user["headers"]

    # 1. Fetch Plans
    plans_res = client.get("/api/v1/subscriptions/plans")
    assert plans_res.status_code == status.HTTP_200_OK
    plans = plans_res.json()["plans"]
    assert len(plans) >= 3
    std_plan = [p for p in plans if p["plan_code"] == "STANDARD"][0]

    # 2. Create UPI Order
    order_res = client.post(
        "/api/v1/subscriptions/create-order",
        json={"plan_id": std_plan["id"]},
        headers=headers,
    )
    assert order_res.status_code == status.HTTP_200_OK
    order_data = order_res.json()
    assert "order_id" in order_data
    assert order_data["amount_inr"] == std_plan["price_inr"]
    order_id = order_data["order_id"]

    # 3. Verify Payment
    verify_res = client.post(
        "/api/v1/subscriptions/verify-payment",
        json={
            "order_id": order_id,
            "gateway_payment_id": "pay_test_123456",
            "gateway_signature": "sig_test_abcdef",
        },
        headers=headers,
    )
    assert verify_res.status_code == status.HTTP_200_OK
    assert verify_res.json()["status"] == "PAID"

    # 4. Check active subscription
    my_sub_res = client.get("/api/v1/subscriptions/my", headers=headers)
    assert my_sub_res.status_code == status.HTTP_200_OK
    assert my_sub_res.json()["has_active_subscription"] is True
    assert my_sub_res.json()["plan_name"] == std_plan["name"]


def test_same_gender_matchmaking_rejected(client, test_user):
    headers = test_user["headers"]

    # Register another MALE user
    groom2 = {
        "mobile_number": "9876543602",
        "email": "groom2@example.com",
        "password": "Password123!",
        "first_name": "Thomas",
        "last_name": "Mathew",
        "gender": "MALE",
    }
    client.post("/api/v1/auth/register", json=groom2)
    verify = client.post("/api/v1/auth/verify-otp", json={"target": "9876543602", "otp_code": "123456"})
    groom2_user_id = verify.json()["user_id"]

    # 1. Attempt to send interest to fellow Groom (should fail with 400 Bad Request)
    interest_res = client.post(
        "/api/v1/interests/send",
        json={"target_user_id": groom2_user_id, "message": "Hello"},
        headers=headers,
    )
    assert interest_res.status_code == status.HTTP_400_BAD_REQUEST
    assert "opposite gender" in interest_res.json()["detail"].lower()

    # 2. Attempt to request contact reveal to fellow Groom (should fail with 400 Bad Request)
    reveal_res = client.post(
        f"/api/v1/contact-reveal/request/{groom2_user_id}",
        headers=headers,
    )
    assert reveal_res.status_code == status.HTTP_400_BAD_REQUEST
    assert "opposite gender" in reveal_res.json()["detail"].lower()


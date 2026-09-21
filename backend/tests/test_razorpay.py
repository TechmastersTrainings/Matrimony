import hmac
import hashlib
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.core.config import settings

client = TestClient(app)


def test_create_razorpay_order_valid():
    response = client.post(
        "/api/create-order",
        json={"amount": 29900, "currency": "INR", "receipt": "test_rcpt_001"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "order_id" in data
    assert data["order_id"].startswith("order_")
    assert data["amount"] == 29900
    assert data["currency"] == "INR"
    assert data["key_id"] == settings.RAZORPAY_KEY_ID


def test_create_razorpay_order_minimum_amount_validation():
    # Amounts under 100 paise must be rejected with 400
    response = client.post(
        "/api/create-order",
        json={"amount": 50, "currency": "INR"},
    )
    assert response.status_code == 400
    assert "at least 100 paise" in response.json()["detail"]


def test_verify_razorpay_payment_missing_fields():
    # Missing order_id, payment_id, or signature must return 400
    response = client.post(
        "/api/verify-payment",
        json={"order_id": "order_123"},
    )
    assert response.status_code == 400
    assert "Missing required fields" in response.json()["detail"]


def test_verify_razorpay_payment_signature_mismatch():
    # Signature mismatch must return 400 and reject payment
    response = client.post(
        "/api/verify-payment",
        json={
            "order_id": "order_test_999",
            "payment_id": "pay_test_999",
            "signature": "invalid_signature_hash_12345",
        },
    )
    assert response.status_code == 400
    assert "signature mismatch" in response.json()["detail"].lower()


def test_verify_razorpay_payment_valid_signature():
    # Create valid order
    order_res = client.post(
        "/api/create-order",
        json={"amount": 10000, "currency": "INR"},
    )
    assert order_res.status_code == 200
    order_id = order_res.json()["order_id"]
    payment_id = "pay_test_valid_123"

    # Compute valid HMAC-SHA256 signature
    generated_sig = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
        f"{order_id}|{payment_id}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    verify_res = client.post(
        "/api/verify-payment",
        json={
            "order_id": order_id,
            "payment_id": payment_id,
            "signature": generated_sig,
        },
    )
    assert verify_res.status_code == 200
    data = verify_res.json()
    assert data["status"] == "success"
    assert data["order_id"] == order_id


def test_api_v1_endpoints_compatibility():
    # Verify /api/v1/create-order and /api/v1/verify-payment compatibility
    res = client.post(
        "/api/v1/create-order",
        json={"amount": 29900, "currency": "INR"},
    )
    assert res.status_code == 200
    order_id = res.json()["order_id"]

    payment_id = "pay_test_v1_456"
    sig = hmac.new(
        settings.RAZORPAY_KEY_SECRET.encode("utf-8"),
        f"{order_id}|{payment_id}".encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()

    v_res = client.post(
        "/api/v1/verify-payment",
        json={
            "order_id": order_id,
            "payment_id": payment_id,
            "signature": sig,
        },
    )
    assert v_res.status_code == 200
    assert v_res.json()["status"] == "success"

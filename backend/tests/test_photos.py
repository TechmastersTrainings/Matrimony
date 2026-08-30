import io
import pytest
from PIL import Image
from fastapi import status


@pytest.fixture
def auth_headers(client):
    reg_payload = {
        "mobile_number": "9876543301",
        "email": "photo_user@example.com",
        "password": "Password123!",
        "first_name": "Daniel",
        "last_name": "Kruger",
        "gender": "MALE",
    }
    client.post("/api/v1/auth/register", json=reg_payload)
    verify_payload = {
        "target": "9876543301",
        "otp_code": "123456",
        "otp_type": "REGISTRATION",
    }
    verify_res = client.post("/api/v1/auth/verify-otp", json=verify_payload)
    token = verify_res.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def create_dummy_image(color="blue", size=(400, 400)):
    buf = io.BytesIO()
    img = Image.new("RGB", size, color=color)
    img.save(buf, format="JPEG")
    buf.seek(0)
    return buf


def test_photo_upload_compress_and_delete_flow(client, auth_headers):
    # 1. Upload 5 photos to fulfill minimum 5 requirement
    photo_ids = []
    for i in range(5):
        img_buf = create_dummy_image(color="green", size=(800, 800))
        files = {"file": (f"test_photo_{i}.jpg", img_buf, "image/jpeg")}
        upload_res = client.post("/api/v1/photos/upload", files=files, headers=auth_headers)
        assert upload_res.status_code == status.HTTP_200_OK
        data = upload_res.json()
        assert "r2_url" in data
        assert data["order_index"] == i
        photo_ids.append(data["id"])

    # 2. Get my photos
    my_photos_res = client.get("/api/v1/photos/my", headers=auth_headers)
    assert my_photos_res.status_code == status.HTTP_200_OK
    my_photos = my_photos_res.json()
    assert my_photos["count"] == 5
    assert my_photos["has_min_5"] is True
    assert my_photos["photos"][0]["is_primary"] is True

    # 3. Set photo 2 as primary
    second_id = photo_ids[1]
    primary_res = client.put(f"/api/v1/photos/{second_id}/primary", headers=auth_headers)
    assert primary_res.status_code == status.HTTP_200_OK

    # Verify primary changed
    my_photos_res2 = client.get("/api/v1/photos/my", headers=auth_headers)
    for p in my_photos_res2.json()["photos"]:
        if p["id"] == second_id:
            assert p["is_primary"] is True

    # 4. Delete one photo
    del_id = photo_ids[4]
    del_res = client.delete(f"/api/v1/photos/{del_id}", headers=auth_headers)
    assert del_res.status_code == status.HTTP_200_OK

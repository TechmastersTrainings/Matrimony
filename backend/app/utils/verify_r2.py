"""
Verification utility to test live Cloudflare R2 operations:
1. Upload test file
2. Retrieve / read test file
3. Delete test file
"""
import sys
import uuid
from backend.app.core.config import settings
from backend.app.core.logger import logger
from backend.app.services.storage import get_storage_service


def verify_cloudflare_r2_live() -> bool:
    print("\n--- Cloudflare R2 Storage Verification ---")
    if not (settings.R2_ACCOUNT_ID and settings.R2_ACCESS_KEY_ID and settings.R2_SECRET_ACCESS_KEY):
        print("⚠️ Cloudflare R2 credentials not set in .env. Skipping live remote probe.")
        return True

    storage = get_storage_service()
    test_id = str(uuid.uuid4())[:8]
    test_key = f"diagnostics/test_{test_id}.txt"
    test_data = f"Christian Matrimony Diagnostic Test Payload {test_id}".encode("utf-8")

    try:
        print(f"1. Uploading test file: {test_key}...")
        url = storage.upload_file(test_data, test_key, "text/plain")
        print(f"   ✓ Upload successful. URL/Key: {url}")

        print(f"2. Retrieving test file: {test_key}...")
        retrieved = storage.get_file(test_key)
        assert retrieved == test_data, "Retrieved data does not match uploaded payload!"
        print(f"   ✓ Retrieval verified ({len(retrieved)} bytes match).")

        print(f"3. Deleting test file: {test_key}...")
        deleted = storage.delete_file(test_key)
        print(f"   ✓ Deletion verified: {deleted}")

        print("🎉 Cloudflare R2 live test suite passed successfully!\n")
        return True
    except Exception as e:
        print(f"❌ Cloudflare R2 live verification failed: {e}\n")
        return False


if __name__ == "__main__":
    success = verify_cloudflare_r2_live()
    sys.exit(0 if success else 1)

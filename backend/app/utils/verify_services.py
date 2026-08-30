"""
Verification utility to test live Aiven MySQL and Upstash Redis connections.
"""
import sys
from backend.app.core.config import settings
from backend.app.services.database import check_database_health
from backend.app.services.redis import check_redis_health
from backend.app.utils.verify_r2 import verify_cloudflare_r2_live


def verify_all_external_services():
    print("==================================================")
    print("Christian Matrimony - Phase 1 Services Health Check")
    print("==================================================")

    print("\n--- 1. Aiven MySQL Database ---")
    if not settings.DATABASE_URL:
        print("⚠️ DATABASE_URL not set in .env. Skipping live probe.")
    else:
        db_ok, db_msg = check_database_health()
        status_icon = "✓" if db_ok else "❌"
        print(f"[{status_icon}] {db_msg}")

    print("\n--- 2. Upstash Redis ---")
    if not settings.REDIS_URL:
        print("⚠️ REDIS_URL not set in .env. Skipping live probe.")
    else:
        redis_ok, redis_msg = check_redis_health()
        status_icon = "✓" if redis_ok else "❌"
        print(f"[{status_icon}] {redis_msg}")

    print("\n--- 3. Cloudflare R2 Storage ---")
    verify_cloudflare_r2_live()

    print("==================================================")


if __name__ == "__main__":
    verify_all_external_services()

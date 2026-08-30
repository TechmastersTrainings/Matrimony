from fastapi import APIRouter, status
from fastapi.responses import JSONResponse
from backend.app.core.config import settings
from backend.app.schemas.health import HealthResponse, ServiceHealth
from backend.app.services.database import check_database_health
from backend.app.services.redis import check_redis_health
from backend.app.services.storage import get_storage_service

router = APIRouter()


@router.get(
    "/health",
    response_model=HealthResponse,
    summary="Comprehensive System Health Check",
    description="Probes system readiness including API, Aiven MySQL database, Upstash Redis, and Cloudflare R2 object storage.",
)
async def health_check():
    db_ok, db_msg = check_database_health()
    redis_ok, redis_msg = check_redis_health()
    storage_service = get_storage_service()
    storage_ok, storage_msg = storage_service.check_health()

    services = {
        "database": ServiceHealth(
            status="healthy" if db_ok else ("not_configured" if not settings.DATABASE_URL else "degraded"),
            message=db_msg,
        ),
        "redis": ServiceHealth(
            status="healthy" if redis_ok else ("not_configured" if not settings.REDIS_URL else "degraded"),
            message=redis_msg,
        ),
        "storage": ServiceHealth(
            status="healthy" if storage_ok else ("not_configured" if not (settings.R2_ACCOUNT_ID and settings.R2_ACCESS_KEY_ID) else "degraded"),
            message=storage_msg,
        ),
    }

    # Overall system health: in dev/initial phase, degraded if configured services fail
    is_healthy = True
    if settings.DATABASE_URL and not db_ok:
        is_healthy = False
    if settings.REDIS_URL and not redis_ok:
        is_healthy = False

    overall_status = "healthy" if is_healthy else "degraded"
    status_code = status.HTTP_200_OK if is_healthy else status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(
        status_code=status_code,
        content=HealthResponse(
            status=overall_status,
            app_name=settings.APP_NAME,
            environment=settings.ENVIRONMENT,
            version="1.0.0",
            services=services,
        ).model_dump(),
    )

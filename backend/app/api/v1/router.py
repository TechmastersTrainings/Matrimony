from fastapi import APIRouter
from backend.app.api.v1.admin import router as admin_router
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.profile import router as profile_router
from backend.app.api.v1.registration import router as registration_router

api_v1_router = APIRouter()

# Register core endpoint routers
api_v1_router.include_router(health_router, tags=["Health"])
api_v1_router.include_router(auth_router)
api_v1_router.include_router(registration_router)
api_v1_router.include_router(profile_router)
api_v1_router.include_router(admin_router)

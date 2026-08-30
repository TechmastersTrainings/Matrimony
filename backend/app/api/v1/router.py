from fastapi import APIRouter
from backend.app.api.v1.admin import router as admin_router
from backend.app.api.v1.auth import router as auth_router
from backend.app.api.v1.chat import router as chat_router
from backend.app.api.v1.contact_reveal import router as contact_reveal_router
from backend.app.api.v1.discovery import router as discovery_router
from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.interests import router as interests_router
from backend.app.api.v1.photos import router as photos_router
from backend.app.api.v1.profile import router as profile_router
from backend.app.api.v1.registration import router as registration_router
from backend.app.api.v1.reports import router as reports_router
from backend.app.api.v1.subscriptions import router as subscriptions_router
from backend.app.api.v1.verification import router as verification_router

api_v1_router = APIRouter()

# Register core endpoint routers
api_v1_router.include_router(health_router, tags=["Health"])
api_v1_router.include_router(auth_router)
api_v1_router.include_router(registration_router)
api_v1_router.include_router(profile_router)
api_v1_router.include_router(photos_router)
api_v1_router.include_router(verification_router)
api_v1_router.include_router(discovery_router)
api_v1_router.include_router(interests_router)
api_v1_router.include_router(chat_router)
api_v1_router.include_router(subscriptions_router)
api_v1_router.include_router(contact_reveal_router)
api_v1_router.include_router(reports_router)
api_v1_router.include_router(admin_router)

from fastapi import APIRouter
from backend.app.api.v1.health import router as health_router

api_v1_router = APIRouter()

# Register core endpoints
api_v1_router.include_router(health_router, tags=["Health"])

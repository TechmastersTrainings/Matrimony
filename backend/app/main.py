import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
import sentry_sdk
from sqlalchemy.orm import Session

from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.router import api_v1_router
from backend.app.core.config import settings
from backend.app.core.exceptions import (
    AppException,
    app_exception_handler,
    global_exception_handler,
    http_exception_handler,
    validation_exception_handler,
)
from backend.app.core.logger import logger
from backend.app.core.security import hash_password
from backend.app.models import *  # Import all models to register with Base
from backend.app.models.enums import AccountStatus, UserRole
from backend.app.models.user import User
from backend.app.services.database import Base, get_engine, get_session_factory
from backend.app.services.payment_service import PaymentService

# Initialize Sentry Monitoring
sentry_dsn = os.getenv("SENTRY_DSN") or settings.SENTRY_DSN
if sentry_dsn:
    sentry_sdk.init(
        dsn=sentry_dsn,
        send_default_pii=True,
        environment=settings.ENVIRONMENT,
        traces_sample_rate=1.0 if settings.ENVIRONMENT == "development" else 0.1,
    )
    logger.info("Sentry monitoring initialized successfully.")


def seed_default_admin(db: Session):
    admin_email = getattr(settings, "ADMIN_EMAIL", "techmastersinnovations@gmail.com")
    admin_mobile = getattr(settings, "ADMIN_MOBILE", "9876598765")
    admin_password = getattr(settings, "ADMIN_PASSWORD", "Fri10Feb@2023")
    hashed = hash_password(admin_password)

    admin_user = db.query(User).filter(
        (User.email == admin_email) | (User.role == UserRole.SUPER_ADMIN)
    ).first()
    if not admin_user:
        admin_user = User(
            email=admin_email,
            mobile_number=admin_mobile,
            password_hash=hashed,
            role=UserRole.SUPER_ADMIN,
            account_status=AccountStatus.ACTIVE,
            is_mobile_verified=True,
            is_email_verified=True,
        )
        db.add(admin_user)
        db.commit()
        logger.info(f"Default Super Admin configured: {admin_email}")
    else:
        setattr(admin_user, "password_hash", hashed)
        setattr(admin_user, "email", str(admin_email))
        setattr(admin_user, "mobile_number", str(admin_mobile))
        db.commit()
        logger.info(f"Super Admin password updated: {admin_email}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in [{settings.ENVIRONMENT}] environment.")
    # Initialize DB schema
    try:
        engine = get_engine()
        if engine:
            Base.metadata.create_all(bind=engine)
            logger.info("Database tables verified and created successfully.")
            factory = get_session_factory()
            if factory:
                with factory() as db:
                    PaymentService.initialize_default_plans(db)
                    seed_default_admin(db)
    except Exception as e:
        logger.warning(f"Database table initialization notice: {e}")

    yield
    logger.info(f"Shutting down {settings.APP_NAME}.")


app = FastAPI(
    title=settings.APP_NAME,
    description="Production-ready Christian Matrimony REST API platform initially serving Bidar, Karnataka, India.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# HTTP Anti-Leak & Security Headers Middleware
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    response.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
    return response

# Exception Handlers
app.add_exception_handler(AppException, app_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Top-level Health Check
app.include_router(health_router, prefix="", tags=["Health"])

# API v1 Router
app.include_router(api_v1_router, prefix=settings.API_V1_STR)


@app.api_route("/media/{file_path:path}", methods=["GET", "HEAD"], tags=["Media"])
async def serve_media(file_path: str):
    from fastapi.responses import Response
    from backend.app.services.storage import get_storage_service

    storage = get_storage_service()
    content = storage.get_file(file_path)
    return Response(
        content=content,
        media_type="image/jpeg",
        headers={
            "Cache-Control": "public, max-age=86400",
            "Access-Control-Allow-Origin": "*",
        },
    )


@app.get("/", tags=["Root"])
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health",
        "api_v1": settings.API_V1_STR,
    }

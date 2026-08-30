from typing import Any, Dict, Optional
from fastapi import HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from backend.app.core.logger import logger


class AppException(Exception):
    """Base application exception."""

    def __init__(
        self,
        message: str,
        status_code: int = status.HTTP_400_BAD_REQUEST,
        details: Optional[Dict[str, Any]] = None,
    ):
        self.message = message
        self.status_code = status_code
        self.details = details or {}
        super().__init__(message)


class DatabaseConnectionException(AppException):
    """Raised when database connection fails."""

    def __init__(self, message: str = "Database connection error"):
        super().__init__(message=message, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)


class RedisConnectionException(AppException):
    """Raised when Redis connection fails."""

    def __init__(self, message: str = "Redis cache connection error"):
        super().__init__(message=message, status_code=status.HTTP_503_SERVICE_UNAVAILABLE)


class StorageServiceException(AppException):
    """Raised when Cloudflare R2 / Storage operation fails."""

    def __init__(self, message: str = "Storage service error"):
        super().__init__(message=message, status_code=status.HTTP_502_BAD_GATEWAY)


async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    logger.warning(f"AppException: {exc.message} on {request.method} {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.message,
                "type": exc.__class__.__name__,
                "details": exc.details,
            },
        },
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    logger.warning(f"HTTPException: {exc.detail} on {request.method} {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "message": exc.detail,
                "type": "HTTPException",
                "details": {},
            },
        },
    )


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    logger.warning(f"Validation error on {request.method} {request.url}: {exc.errors()}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "message": "Validation Error",
                "type": "RequestValidationError",
                "details": {"errors": exc.errors()},
            },
        },
    )


async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.error(f"Unhandled exception on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "message": "Internal server error occurred.",
                "type": "InternalServerError",
                "details": {},
            },
        },
    )

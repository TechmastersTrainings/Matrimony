from typing import Any, Dict, Optional
from fastapi import HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from backend.app.core.logger import logger


def _cors_headers(request: Request) -> Dict[str, str]:
    origin = request.headers.get("origin")
    return {
        "Access-Control-Allow-Origin": origin or "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "*",
        "Access-Control-Allow-Headers": "*",
    }


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


async def app_exception_handler(request: Request, exc: Any) -> JSONResponse:
    message = getattr(exc, "message", str(exc))
    status_code = getattr(exc, "status_code", status.HTTP_400_BAD_REQUEST)
    details = getattr(exc, "details", {})
    logger.warning(f"AppException: {message} on {request.method} {request.url}")
    return JSONResponse(
        status_code=status_code,
        headers=_cors_headers(request),
        content={
            "success": False,
            "error": {
                "message": message,
                "type": exc.__class__.__name__,
                "details": details,
            },
        },
    )


async def http_exception_handler(request: Request, exc: Any) -> JSONResponse:
    detail = getattr(exc, "detail", str(exc))
    status_code = getattr(exc, "status_code", status.HTTP_400_BAD_REQUEST)
    logger.warning(f"HTTPException: {detail} on {request.method} {request.url}")
    return JSONResponse(
        status_code=status_code,
        headers=_cors_headers(request),
        content={
            "success": False,
            "error": {
                "message": detail,
                "type": "HTTPException",
                "details": {},
            },
        },
    )


async def validation_exception_handler(request: Request, exc: Any) -> JSONResponse:
    errors = exc.errors() if hasattr(exc, "errors") else []
    logger.warning(f"Validation error on {request.method} {request.url}: {errors}")
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        headers=_cors_headers(request),
        content={
            "success": False,
            "error": {
                "message": "Validation Error",
                "type": "RequestValidationError",
                "details": {"errors": errors},
            },
        },
    )


async def global_exception_handler(request: Request, exc: Any) -> JSONResponse:
    logger.error(f"Unhandled exception on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        headers=_cors_headers(request),
        content={
            "success": False,
            "error": {
                "message": f"Internal server error: {str(exc)}",
                "type": "InternalServerError",
                "details": {},
            },
        },
    )

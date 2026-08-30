from typing import List, Optional, Union
from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Application Info
    APP_NAME: str = "Christian Matrimony Backend API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"
    LOG_LEVEL: str = "INFO"

    # Security & JWT
    JWT_SECRET_KEY: str = "christian-matrimony-secret-key-change-in-prod-2026"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
    REFRESH_TOKEN_EXPIRE_DAYS: int = 30

    # OTP Configuration
    OTP_EXPIRE_MINUTES: int = 10
    OTP_TEST_MODE: bool = True
    DEFAULT_TEST_OTP: str = "123456"

    # CORS Settings
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",") if i.strip()]
        return v

    # Database Configuration (Aiven MySQL)
    DATABASE_URL: Optional[str] = None
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_POOL_RECYCLE: int = 1800

    # Redis Configuration (Upstash Redis)
    REDIS_URL: Optional[str] = None
    REDIS_TOKEN: Optional[str] = None

    # Object Storage Configuration (Cloudflare R2)
    R2_ACCOUNT_ID: Optional[str] = None
    R2_ACCESS_KEY_ID: Optional[str] = None
    R2_SECRET_ACCESS_KEY: Optional[str] = None
    R2_BUCKET_NAME: Optional[str] = "christian-matrimony-media"
    R2_PUBLIC_URL: Optional[str] = None

    # Monitoring & Error Reporting
    SENTRY_DSN: Optional[str] = None

    # Future Service Abstraction Placeholders
    INDIAN_SMS_PROVIDER_API_KEY: Optional[str] = None
    UPI_PAYMENT_GATEWAY_KEY: Optional[str] = None
    UPI_PAYWAY_SECRET: Optional[str] = None
    FIREBASE_CREDENTIALS_PATH: Optional[str] = None
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=(".env", "backend/.env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )


settings = Settings()

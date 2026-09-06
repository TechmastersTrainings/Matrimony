import os
from typing import Any, Dict, Generator, Optional, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.core.config import settings
from backend.app.core.logger import logger

Base = declarative_base()

_engine = None
_SessionFactory = None


def get_engine():
    global _engine, _SessionFactory
    if _engine is None and settings.DATABASE_URL:
        db_url = settings.DATABASE_URL
        connect_args: Dict[str, Any] = {}
        if "sqlite" in db_url:
            connect_args["check_same_thread"] = False
        elif "mysql" in db_url:
            if "ssl-mode=" in db_url or "ssl_mode=" in db_url:
                db_url = db_url.replace("?ssl-mode=REQUIRED", "").replace("&ssl-mode=REQUIRED", "")
                db_url = db_url.replace("?ssl_mode=REQUIRED", "").replace("&ssl_mode=REQUIRED", "")
                connect_args["ssl"] = {}

        try:
            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=settings.DB_POOL_SIZE if "sqlite" not in db_url else 5,
                max_overflow=settings.DB_MAX_OVERFLOW if "sqlite" not in db_url else 10,
                pool_timeout=5,
                pool_recycle=settings.DB_POOL_RECYCLE,
                connect_args=connect_args,
            )
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            _engine = test_engine
            logger.info("Database engine initialized successfully.")
        except Exception as e:
            logger.error(f"Primary database connection error: {e}")
            if settings.ENVIRONMENT == "production":
                logger.critical("Refusing to silently fall back to ephemeral SQLite in production mode.")
                raise e
            fallback_path = "./backend/matrimony.db" if os.path.isdir("./backend") else "./matrimony.db"
            _engine = create_engine(
                f"sqlite:///{fallback_path}",
                connect_args={"check_same_thread": False},
                pool_pre_ping=True,
            )
        _SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
    return _engine


def get_session_factory():
    global _SessionFactory
    if _SessionFactory is None:
        get_engine()
    return _SessionFactory


def get_db() -> Generator[Optional[Session], None, None]:
    """FastAPI dependency for obtaining a database session."""
    factory = get_session_factory()
    if factory is None:
        yield None
        return

    session = factory()
    try:
        yield session
    finally:
        session.close()


def check_database_health() -> Tuple[bool, str]:
    """Checks database connectivity by executing a lightweight SELECT 1 query."""
    if not settings.DATABASE_URL:
        return False, "DATABASE_URL not configured"

    try:
        engine = get_engine()
        if engine is None:
            return False, "Failed to initialize engine"
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        dialect = engine.dialect.name
        return True, f"Database connected ({dialect})"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False, f"Database connection error: {str(e)}"

from typing import Generator, Optional, Tuple
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
        # Connect to MySQL (e.g. Aiven MySQL) or SQLite fallback if none provided
        connect_args = {}
        if "sqlite" in settings.DATABASE_URL:
            connect_args["check_same_thread"] = False

        _engine = create_engine(
            settings.DATABASE_URL,
            pool_pre_ping=True,
            pool_size=settings.DB_POOL_SIZE if "sqlite" not in settings.DATABASE_URL else 5,
            max_overflow=settings.DB_MAX_OVERFLOW if "sqlite" not in settings.DATABASE_URL else 10,
            pool_timeout=settings.DB_POOL_TIMEOUT,
            pool_recycle=settings.DB_POOL_RECYCLE,
            connect_args=connect_args,
        )
        _SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=_engine)
        logger.info("Database engine initialized.")
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
        return True, "Database connected (healthy)"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False, f"Database connection error: {str(e)}"

import os
import re
from typing import Any, Dict, Generator, Optional, Tuple
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from backend.app.core.config import settings
from backend.app.core.logger import logger

Base = declarative_base()

_engine = None
_SessionFactory = None

def clean_db_url(raw_input: Optional[str]) -> Optional[str]:
    """Sanitizes raw database URL string against quotes, prefixes (like ServiceURI/Service URI:), newlines, and dialect incompatibilities."""
    if not raw_input:
        return None
    u = raw_input.strip().strip("'\x22`\u201c\u201d\u2018\u2019")
    if "DATABASE_URL=" in u:
        u = u.split("DATABASE_URL=", 1)[-1].strip().strip("'\x22`\u201c\u201d\u2018\u2019")
    # Strip any prefix like "Service URI:", "ServiceURI", etc. before the dialect scheme
    for marker in ["mysql+pymysql://", "mysql://", "postgresql://", "postgres://"]:
        if marker in u:
            u = u[u.find(marker):]
            break
    # Remove any internal whitespace or newlines that might have been accidentally pasted
    u = re.sub(r"\s+", "", u)
    if u.startswith("mysql://"):
        u = u.replace("mysql://", "mysql+pymysql://", 1)
    if "://" not in u and ("@" in u or "aivencloud" in u):
        u = f"mysql+pymysql://{u}"
    if "ssl-mode=" in u or "ssl_mode=" in u:
        u = re.sub(r"[?&]ssl[-_]mode=[^&]*", "", u, flags=re.IGNORECASE)

    try:
        parsed = make_url(u)
        if not parsed.drivername:
            return None
        return u
    except Exception:
        return None


_primary_db_diag = "Uninitialized"


def get_engine():
    global _engine, _SessionFactory, _primary_db_diag
    if _engine is not None:
        return _engine

    raw_url = (
        os.environ.get("DATABASE_URL")
        or os.environ.get("database_url")
        or (settings.get_database_url() if hasattr(settings, "get_database_url") else None)
        or getattr(settings, "DATABASE_URL", None)
    )
    db_url = clean_db_url(raw_url)
    if not db_url:
        _primary_db_diag = "DATABASE_URL is not set. Please configure DATABASE_URL for Aiven MySQL."
        logger.error(_primary_db_diag)
        raise RuntimeError("DATABASE_URL is required to connect to Aiven MySQL.")

    connect_args: Dict[str, Any] = {"ssl": {"ssl_mode": "REQUIRED"}}
    _primary_db_diag = f"Configured as Persistent Aiven MySQL: {db_url.split('@')[-1] if '@' in db_url else 'aivencloud'}"

    try:
        _engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_size=settings.DB_POOL_SIZE,
            max_overflow=settings.DB_MAX_OVERFLOW,
            pool_timeout=settings.DB_POOL_TIMEOUT,
            pool_recycle=settings.DB_POOL_RECYCLE,
            connect_args=connect_args,
        )
        with _engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        dialect = _engine.dialect.name
        _primary_db_diag = f"Connected to persistent {dialect} ({db_url.split('@')[-1] if '@' in db_url else 'aivencloud'})"
        logger.info(f"Database engine initialized successfully ({dialect}) connected to Aiven Cloud MySQL.")
    except Exception as e:
        err_msg = f"{type(e).__name__}: {str(e)}"
        _primary_db_diag = f"Aiven MySQL connection failed ({err_msg})."
        logger.error(f"Critical database connection error on {db_url}: {e}")
        raise RuntimeError(f"Could not connect to Aiven MySQL database: {e}")

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
        return True, f"Database connected ({dialect}) [{_primary_db_diag}]"
    except Exception as e:
        logger.error(f"Database health check failed: {e}")
        return False, f"Database connection error: {str(e)}"

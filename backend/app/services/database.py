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
    """Sanitizes raw database URL string against quotes, prefixes, and dialect incompatibilities."""
    if not raw_input:
        return None
    u = str(raw_input).strip().strip("'\x22`\u201c\u201d\u2018\u2019")
    if "DATABASE_URL=" in u:
        u = u.split("DATABASE_URL=", 1)[-1].strip().strip("'\x22`\u201c\u201d\u2018\u2019")
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


def get_engine():
    global _engine, _SessionFactory
    if _engine is not None:
        return _engine

    db_url = clean_db_url(settings.DATABASE_URL)
    fallback_path = "./backend/matrimony.db" if os.path.isdir("./backend") else "./matrimony.db"

    if db_url:
        connect_args: Dict[str, Any] = {}
        if "sqlite" in db_url:
            connect_args["check_same_thread"] = False
        elif "mysql" in db_url:
            connect_args["ssl"] = {}

        try:
            test_engine = create_engine(
                db_url,
                pool_pre_ping=True,
                pool_size=settings.DB_POOL_SIZE if "sqlite" not in db_url else 5,
                max_overflow=settings.DB_MAX_OVERFLOW if "sqlite" not in db_url else 10,
                pool_timeout=10,
                pool_recycle=settings.DB_POOL_RECYCLE,
                connect_args=connect_args,
            )
            with test_engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            _engine = test_engine
            logger.info(f"Database engine initialized successfully ({test_engine.dialect.name}).")
        except Exception as e:
            logger.error(f"Primary database connection error on {db_url}: {e}")
            logger.warning("Falling back to local SQLite engine to keep API operational.")
            _engine = create_engine(
                f"sqlite:///{fallback_path}",
                connect_args={"check_same_thread": False},
                pool_pre_ping=True,
            )
    else:
        logger.warning(f"No valid database URL parsed from settings. Using SQLite at {fallback_path}.")
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

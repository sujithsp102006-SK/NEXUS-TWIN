
"""SQLAlchemy 2.0 Async Session and Database Engine Management for MySQL."""

import logging
import socket
from typing import AsyncGenerator, Dict, Any, List

from sqlalchemy import text
from sqlalchemy.ext.asyncio import (
    AsyncSession,
    AsyncEngine,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import settings

logger = logging.getLogger(__name__)

# Primary Async Engine for MySQL
engine: AsyncEngine = create_async_engine(
    settings.async_database_url,
    echo=settings.DB_ECHO,
    pool_size=settings.DB_POOL_SIZE,
    max_overflow=settings.DB_MAX_OVERFLOW,
    pool_timeout=settings.DB_POOL_TIMEOUT,
    pool_recycle=3600,
    pool_pre_ping=True,
    connect_args={"connect_timeout": 3},
)

async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)


def is_mysql_port_reachable(
    host: str,
    port: int,
    timeout: float = 0.5
) -> bool:
    """Check whether the MySQL server port is reachable."""

    target_host = (
        "127.0.0.1"
        if host in ("localhost", "0.0.0.0")
        else host
    )

    try:
        with socket.create_connection(
            (target_host, port),
            timeout=timeout
        ):
            return True

    except (socket.error, OSError, PermissionError):
        return False


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """FastAPI dependency for obtaining a database session."""

    async with async_session_maker() as session:
        try:
            yield session
            await session.commit()

        except Exception:
            await session.rollback()
            raise

        finally:
            await session.close()


async def verify_database_connection() -> Dict[str, Any]:
    """
    Verify MySQL connectivity, version and available schema tables.
    Returns structured database status.
    """

    # Check whether MySQL port is reachable.
    if not is_mysql_port_reachable(
        settings.DB_HOST,
        settings.DB_PORT,
        timeout=0.3
    ):
        return {
            "status": "DISCONNECTED",
            "database_engine": "MySQL",
            "database_name": settings.DB_NAME,
            "database_user": settings.DB_USER,
            "version": None,
            "table_count": 0,
            "tables": [],
            "error": "MySQL port is unreachable or service is not active",
        }

    try:
        async with engine.connect() as conn:

            # Verify database connection.
            result = await conn.execute(
                text(
                    "SELECT "
                    "DATABASE() AS current_database, "
                    "USER() AS db_user, "
                    "VERSION() AS version"
                )
            )

            row = result.mappings().one()

            # Retrieve available tables.
            tables_result = await conn.execute(
                text(
                    "SELECT table_name "
                    "FROM information_schema.tables "
                    "WHERE table_schema = DATABASE() "
                    "ORDER BY table_name"
                )
            )

            tables: List[str] = [
                r[0] for r in tables_result.fetchall()
            ]

            logger.info(
                "MySQL database connection verified successfully."
            )

            return {
                "status": "CONNECTED",
                "database_engine": "MySQL",
                "database_name": (
                    row["current_database"] or settings.DB_NAME
                ),
                "database_user": row["db_user"],
                "version": row["version"],
                "table_count": len(tables),
                "tables": tables,
                "error": None,
            }

    except Exception as exc:

        logger.exception(
            "Database connection verification failed."
        )

        return {
            "status": "DISCONNECTED",
            "database_engine": "MySQL",
            "database_name": settings.DB_NAME,
            "database_user": settings.DB_USER,
            "version": None,
            "table_count": 0,
            "tables": [],
            "error": str(exc),
        }

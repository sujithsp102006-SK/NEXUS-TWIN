"""Database Creation and Schema Bootstrap Utility for MySQL 8.4 LTS."""

import sys
import pymysql
from app.core.config import settings
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("db_init")


def ensure_database_exists() -> bool:
    """
    Connects to MySQL server root instance and creates the target database
    `nexus-twin` if it does not yet exist.
    """
    logger.info(f"Connecting to MySQL at {settings.DB_HOST}:{settings.DB_PORT} as {settings.DB_USER}...")
    try:
        conn = pymysql.connect(
            host=settings.DB_HOST,
            port=settings.DB_PORT,
            user=settings.DB_USER,
            password=settings.DB_PASSWORD,
            charset="utf8mb4",
            autocommit=True,
        )
        with conn.cursor() as cursor:
            # Use backticks for hyphenated database name `nexus-twin`
            db_name = settings.DB_NAME
            cursor.execute(
                f"CREATE DATABASE IF NOT EXISTS `{db_name}` "
                "CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
            )
            logger.info(f"Successfully verified database `{db_name}` exists on MySQL server.")
        conn.close()
        return True
    except pymysql.MySQLError as err:
        logger.warning(f"Could not automatically create MySQL database: {err}")
        return False


if __name__ == "__main__":
    success = ensure_database_exists()
    sys.exit(0 if success else 1)


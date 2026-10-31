"""NEXUS TWIN: Autonomous Supply Chain Digital Twin Recovery Platform.
FastAPI Application Entrypoint with Embedded Enterprise Frontend.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse, FileResponse
from app.core.config import settings
from app.core.logging import setup_logging
from app.database.session import verify_database_connection
from app.api.v1.router import api_router
import logging

setup_logging()
logger = logging.getLogger("nexus-twin")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application startup and shutdown lifecycle management."""
    logger.info("Initializing NEXUS TWIN Autonomous Engine...")
    logger.info(f"Target Database: {settings.DB_NAME} at {settings.DB_HOST}:{settings.DB_PORT}")

    # Verify live database status on startup
    db_status = await verify_database_connection()
    if db_status["status"] == "CONNECTED":
        logger.info(
            f"MySQL connection verified successfully: {db_status['database_engine']} "
            f"v{db_status['version']} ({db_status['table_count']} active tables)"
        )
    else:
        logger.info(
            f"MySQL connection offline or pending initialization: {db_status['error']}. "
            "Engine running in resilient mode."
        )

    yield

    logger.info("Shutting down NEXUS TWIN Engine.")


def create_application() -> FastAPI:
    """Application factory for NEXUS TWIN backend."""
    app = FastAPI(
        title=settings.PROJECT_NAME,
        version=settings.VERSION,
        description=settings.DESCRIPTION,
        openapi_url="/openapi.json",
        docs_url="/docs",
        redoc_url="/redoc",
        lifespan=lifespan,
    )

    # Configure CORS for Vite Frontend development server
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.CORS_ORIGINS,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Mount API v1 router under /api/v1
    app.include_router(api_router, prefix=settings.API_V1_STR)

    # Legacy compatibility endpoint
    @app.get("/api/health", include_in_schema=False)
    async def legacy_health_redirect():
        from app.api.v1.endpoints.health import get_health
        return await get_health()

    # Serve built frontend if dist exists
    frontend_dist = Path(__file__).resolve().parents[2] / "frontend" / "dist"
    if frontend_dist.exists():
        app.mount("/assets", StaticFiles(directory=str(frontend_dist / "assets")), name="assets")

        @app.get("/", include_in_schema=False)
        async def serve_index():
            return FileResponse(str(frontend_dist / "index.html"))

        @app.get("/{catchall:path}", include_in_schema=False)
        async def serve_spa(catchall: str):
            if catchall.startswith("api/") or catchall in ("docs", "redoc", "openapi.json"):
                return None
            target = frontend_dist / catchall
            if target.is_file():
                return FileResponse(str(target))
            return FileResponse(str(frontend_dist / "index.html"))
    else:
        @app.get("/", include_in_schema=False)
        async def root_redirect():
            return RedirectResponse(url="/docs")

    return app


app = create_application()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)

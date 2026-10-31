"""Application configuration management using Pydantic v2 Settings."""

from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # Project metadata
    PROJECT_NAME: str = "NEXUS TWIN"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = (
        "Autonomous Supply Chain Digital Twin Recovery Platform — "
        "Deterministic topological impact analysis, multi-objective recovery "
        "optimization, and LangGraph-powered recovery orchestration."
    )
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api/v1"

    # MySQL 8.4 LTS Database Configuration
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_NAME: str = "nexus-twin"
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    DB_POOL_TIMEOUT: int = 30
    DB_ECHO: bool = False

    # AI & Agent Configuration
    LLM_PROVIDER: str = "mock"  # 'mock', 'openai', 'gemini'
    OPENAI_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    MODEL_NAME: str = "gpt-4o-mini"
    AGENT_TEMPERATURE: float = 0.0

    # CORS Origins
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8080",
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, list):
            return v
        return ["*"]

    @property
    def async_database_url(self) -> str:
        """Construct the async MySQL database connection URL."""
        pwd = f":{self.DB_PASSWORD}" if self.DB_PASSWORD else ""
        return (
            f"mysql+aiomysql://{self.DB_USER}{pwd}@{self.DB_HOST}:{self.DB_PORT}/"
            f"{self.DB_NAME}?charset=utf8mb4"
        )

    @property
    def sync_database_url(self) -> str:
        """Construct the synchronous MySQL database URL for migrations / Alembic."""
        pwd = f":{self.DB_PASSWORD}" if self.DB_PASSWORD else ""
        return (
            f"mysql+pymysql://{self.DB_USER}{pwd}@{self.DB_HOST}:{self.DB_PORT}/"
            f"{self.DB_NAME}?charset=utf8mb4"
        )


settings = Settings()


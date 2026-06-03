import os
from pydantic_settings import BaseSettings

# Resolve .env path — works both locally and in Docker
_ENV_PATH = os.path.join(os.path.dirname(__file__), "..", "..", ".env")


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:password@localhost:5432/agentic_tree"

    # JWT
    secret_key: str = "change-this-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 24 hours

    # Gemini (kept for reference)
    gemini_api_key: str = ""

    # Groq
    groq_api_key: str = ""

    # CORS — allow all localhost variants by default
    cors_origins: str = "http://localhost,http://localhost:80,http://localhost:5173,http://localhost:3000,http://127.0.0.1"

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",")]

    model_config = {
        "env_file": _ENV_PATH,
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


def get_settings() -> Settings:
    return Settings()

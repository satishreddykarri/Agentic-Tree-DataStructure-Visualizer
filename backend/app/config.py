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
    groq_model: str = "groq/compound"

    # CORS — include localhost and the deployed Render app origins
    cors_origins: str = (
        "http://localhost,http://localhost:80,http://localhost:5173,http://localhost:3000,"
        "http://127.0.0.1,https://agentic-tree-datastructure-visualizer-1.onrender.com,"
        "https://agentic-tree-datastructure-visualizer.onrender.com"
    )

    @property
    def cors_origins_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def cors_origin_regex(self) -> str:
        return r"https://.*\.onrender\.com|http://localhost(:\d+)?|http://127\.0\.0\.1(:\d+)?|https://localhost(:\d+)?"

    model_config = {
        "env_file": _ENV_PATH,
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


def get_settings() -> Settings:
    return Settings()

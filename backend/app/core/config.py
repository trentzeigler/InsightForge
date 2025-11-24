from functools import lru_cache
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    app_name: str = "InsightForge"
    environment: str = "local"
    api_base_url: str = "http://localhost:8000"
    frontend_url: str = "http://localhost:3000"
    cors_origins: List[str] = ["http://localhost:3000"]

    database_url: str = "postgresql+psycopg2://postgres:postgres@localhost:5432/insightforge"

    jwt_secret_key: str = "super-secret-key-change"
    jwt_algorithm: str = "HS256"
    session_cookie_name: str = "insightforge_session"
    session_lifetime_minutes: int = 60 * 24

    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    s3_bucket: str = "insightforge-datasets"
    s3_region: str = "us-east-1"

    openai_api_key: str = ""

    class Config:
        env_file = ".env"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()

"""
Application configuration using pydantic-settings.

Loads configuration from environment variables with validation.
"""
import os
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )

    # Database
    database_url: str

    # Better Auth JWT Configuration
    better_auth_secret: str
    better_auth_url: str = "http://localhost:3000"

    # JWT Settings
    jwt_algorithm: str = "HS256"

    # OpenRouter API Configuration
    openrouter_api_key: str = ""

    # Model Configuration
    model_name: str = "qwen/qwen-2.5-7b-instruct"


# Create a global settings instance
settings = Settings()

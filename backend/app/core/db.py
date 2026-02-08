"""
Database configuration and session management.

Provides database engine creation and session dependency for FastAPI.
Uses DATABASE_URL from environment variables for Neon PostgreSQL connection.
"""

import os
from typing import Generator

from dotenv import load_dotenv
from sqlmodel import Session, SQLModel, create_engine

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Create database engine with Neon-specific configurations
# These settings are important for Neon's serverless architecture
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for debugging SQL queries
    pool_recycle=300,      # Recycle connections every 5 minutes
    pool_pre_ping=True,    # Verify connection before use (important for serverless)
    pool_size=5,           # Number of connections to maintain in pool
    max_overflow=10,       # Additional connections beyond pool_size
    pool_timeout=30,       # Timeout for getting connection from pool
    connect_args={
        "connect_timeout": 10,  # Connection timeout
    }
)


def create_db_and_tables() -> None:
    """Create all database tables from SQLModel metadata."""
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Dependency that provides a database session.

    Yields a SQLModel Session and ensures proper cleanup after request.
    Use with FastAPI's Depends() for dependency injection.
    """
    with Session(engine) as session:
        yield session

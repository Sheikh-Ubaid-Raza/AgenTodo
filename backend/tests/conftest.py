"""
Pytest configuration and fixtures for backend tests.
"""

import pytest
from datetime import datetime, timedelta
from jose import jwt
from fastapi.testclient import TestClient

# Set test environment variables before importing app
import os
os.environ["DATABASE_URL"] = "sqlite:///./test.db"
os.environ["BETTER_AUTH_SECRET"] = "test-secret-key-for-testing-only"
os.environ["BETTER_AUTH_URL"] = "http://localhost:3000"

from app.main import app
from app.core.config import settings


@pytest.fixture
def client():
    """Create a test client for the FastAPI app."""
    return TestClient(app)


@pytest.fixture
def valid_token():
    """Generate a valid JWT token for testing."""
    payload = {
        "sub": "test-user-123",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1),
        "email": "test@example.com",
    }
    return jwt.encode(
        payload,
        settings.better_auth_secret,
        algorithm=settings.jwt_algorithm,
    )


@pytest.fixture
def expired_token():
    """Generate an expired JWT token for testing."""
    payload = {
        "sub": "test-user-123",
        "iat": datetime.utcnow() - timedelta(hours=2),
        "exp": datetime.utcnow() - timedelta(hours=1),
    }
    return jwt.encode(
        payload,
        settings.better_auth_secret,
        algorithm=settings.jwt_algorithm,
    )


@pytest.fixture
def invalid_signature_token():
    """Generate a token with invalid signature."""
    payload = {
        "sub": "test-user-123",
        "iat": datetime.utcnow(),
        "exp": datetime.utcnow() + timedelta(hours=1),
    }
    return jwt.encode(
        payload,
        "wrong-secret-key",  # Different secret
        algorithm="HS256",
    )


@pytest.fixture
def auth_headers(valid_token):
    """Create authorization headers with valid token."""
    return {"Authorization": f"Bearer {valid_token}"}

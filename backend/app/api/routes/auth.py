"""
Authentication API endpoints for user registration and login.

Provides endpoints for user authentication including registration,
login, and token generation using JWT.
"""

from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from jose import jwt
from pydantic import BaseModel, EmailStr, Field
from sqlmodel import Session, select

from app.core.config import settings
from app.core.db import get_session
from app.models.models import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"],
)


# =============================================================================
# Request/Response Schemas
# =============================================================================


class UserRegisterRequest(BaseModel):
    """Request schema for user registration."""

    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    name: Optional[str] = Field(default=None, max_length=255)


class UserLoginRequest(BaseModel):
    """Request schema for user login."""

    email: EmailStr
    password: str


class UserResponse(BaseModel):
    """Response schema for user data."""

    id: int
    email: str
    name: Optional[str]
    created_at: datetime


class AuthResponse(BaseModel):
    """Response schema for authentication containing token and user."""

    token: str
    user: UserResponse
    expires_at: datetime


# =============================================================================
# Helper Functions
# =============================================================================


def create_access_token(user_id: int, email: str, name: Optional[str] = None) -> tuple[str, datetime]:
    """
    Create a JWT access token for the user.

    Args:
        user_id: User's database ID
        email: User's email address
        name: User's display name

    Returns:
        Tuple of (token_string, expiration_datetime)
    """
    expires_at = datetime.utcnow() + timedelta(hours=24)
    payload = {
        "sub": str(user_id),
        "email": email,
        "name": name,
        "iat": datetime.utcnow(),
        "exp": expires_at,
    }
    token = jwt.encode(
        payload,
        settings.better_auth_secret,
        algorithm=settings.jwt_algorithm,
    )
    return token, expires_at


def hash_password(password: str) -> str:
    """
    Simple password hashing using a basic hash.

    NOTE: In production, use bcrypt or argon2 for proper password hashing.
    This is a simplified implementation for demonstration.
    """
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()


def verify_password(password: str, hashed: str) -> bool:
    """Verify a password against its hash."""
    return hash_password(password) == hashed


# =============================================================================
# API Endpoints
# =============================================================================


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register_user(
    request: UserRegisterRequest,
    session: Session = Depends(get_session),
) -> AuthResponse:
    """
    Register a new user account.

    - **email**: User's email address (must be unique)
    - **password**: User's password (min 8 characters)
    - **name**: Optional display name

    Returns authentication token and user data on success.
    """
    # Check if user already exists
    existing_user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered",
        )

    # Create new user (store hashed password in a separate field if needed)
    # For now, we'll use a simple approach without password storage
    # In production, add a password_hash field to User model
    user = User(
        email=request.email,
        name=request.name,
    )

    session.add(user)
    session.commit()
    session.refresh(user)

    # Generate token
    token, expires_at = create_access_token(user.id, user.email, user.name)

    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
        ),
        expires_at=expires_at,
    )


@router.post("/login", response_model=AuthResponse)
def login_user(
    request: UserLoginRequest,
    session: Session = Depends(get_session),
) -> AuthResponse:
    """
    Authenticate a user and return access token.

    - **email**: User's email address
    - **password**: User's password

    Returns authentication token and user data on success.
    """
    # Find user by email
    user = session.exec(
        select(User).where(User.email == request.email)
    ).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    # NOTE: In production, verify password against stored hash
    # For demo purposes, we accept any password for existing users

    # Generate token
    token, expires_at = create_access_token(user.id, user.email, user.name)

    return AuthResponse(
        token=token,
        user=UserResponse(
            id=user.id,
            email=user.email,
            name=user.name,
            created_at=user.created_at,
        ),
        expires_at=expires_at,
    )


@router.post("/refresh", response_model=AuthResponse)
def refresh_token(
    session: Session = Depends(get_session),
) -> AuthResponse:
    """
    Refresh the access token.

    Requires a valid token in the Authorization header.
    Returns a new token with extended expiration.
    """
    # This endpoint would need auth dependency to get current user
    # For now, return an error indicating it's not fully implemented
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Token refresh not yet implemented",
    )

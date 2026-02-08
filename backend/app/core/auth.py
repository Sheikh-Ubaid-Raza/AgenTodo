"""
JWT verification utilities for Better Auth integration.

Provides functions to decode and verify JWT tokens issued by Better Auth
using the shared BETTER_AUTH_SECRET.
"""

from datetime import datetime
from typing import Any

from jose import JWTError, jwt

from app.core.config import settings


class JWTVerificationError(Exception):
    """Raised when JWT verification fails."""

    pass


def verify_jwt_token(token: str) -> dict[str, Any]:
    """
    Verify and decode a JWT token.

    Validates the signature using BETTER_AUTH_SECRET and decodes claims.
    The signature verification happens during jwt.decode() - if the token
    was tampered with or signed with a different secret, it will fail.

    Args:
        token: JWT token string from Authorization header

    Returns:
        Decoded JWT claims dictionary

    Raises:
        JWTVerificationError: If token is invalid, expired, or tampered
    """
    if not token or not isinstance(token, str):
        raise JWTVerificationError("Token is required")

    # Check basic JWT structure (header.payload.signature)
    parts = token.split(".")
    if len(parts) != 3:
        raise JWTVerificationError("Invalid token format")

    try:
        # jwt.decode() verifies the signature using the secret and algorithm
        # If verification fails, it raises JWTError
        payload = jwt.decode(
            token,
            settings.better_auth_secret,
            algorithms=[settings.jwt_algorithm],
            options={
                "verify_signature": True,
                "verify_exp": False,  # We handle expiration check separately
                "verify_iat": True,
                "require_sub": True,
            },
        )
        return payload
    except JWTError as e:
        raise JWTVerificationError(f"Invalid token: {str(e)}")


def is_token_expired(payload: dict[str, Any]) -> bool:
    """
    Check if a JWT token has expired.

    Args:
        payload: Decoded JWT payload

    Returns:
        True if token is expired, False otherwise
    """
    exp = payload.get("exp")
    if exp is None:
        return True
    return datetime.utcnow().timestamp() > exp


def extract_user_id(payload: dict[str, Any]) -> str:
    """
    Extract user ID from JWT claims.

    Args:
        payload: Decoded JWT payload

    Returns:
        User ID from 'sub' claim

    Raises:
        JWTVerificationError: If 'sub' claim is missing
    """
    user_id = payload.get("sub")
    if not user_id:
        raise JWTVerificationError("Token missing 'sub' claim")
    return user_id

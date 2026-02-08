"""
Authentication security dependencies for FastAPI.

Provides HTTPBearer security scheme and dependency to extract
and validate JWT tokens from Authorization headers.
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.auth import (
    JWTVerificationError,
    extract_user_id,
    is_token_expired,
    verify_jwt_token,
)
from app.models.user import CurrentUser

# HTTPBearer security scheme - extracts Bearer token from Authorization header
http_bearer = HTTPBearer(auto_error=True)


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),
) -> CurrentUser:
    """
    FastAPI dependency to get the current authenticated user.

    Extracts the JWT token from the Authorization header, verifies it,
    and returns a CurrentUser instance with user context.

    Args:
        credentials: HTTPBearer credentials with the JWT token

    Returns:
        CurrentUser instance with authenticated user context

    Raises:
        HTTPException: 401 if token is missing, invalid, or expired
    """
    token = credentials.credentials

    try:
        # Verify and decode the token
        payload = verify_jwt_token(token)

        # Check if token is expired
        if is_token_expired(payload):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # Extract user ID from claims
        user_id = extract_user_id(payload)

        return CurrentUser(
            user_id=user_id,
            raw_token=token,
            claims=payload,
        )

    except JWTVerificationError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )

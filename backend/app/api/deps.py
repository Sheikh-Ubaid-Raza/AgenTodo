"""
API dependencies for FastAPI dependency injection.

Provides reusable dependencies for authentication and validation.
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

# Optional HTTPBearer - doesn't auto-error, allows checking if token present
http_bearer_optional = HTTPBearer(auto_error=False)


async def get_current_user_optional(
    credentials: HTTPAuthorizationCredentials | None = Depends(http_bearer_optional),
) -> CurrentUser | None:
    """
    FastAPI dependency to optionally get the current user.

    Returns None if no token is provided, otherwise validates
    and returns CurrentUser.

    Args:
        credentials: Optional HTTPBearer credentials

    Returns:
        CurrentUser if valid token provided, None otherwise

    Raises:
        HTTPException: 401 if token is provided but invalid
    """
    if credentials is None:
        return None

    token = credentials.credentials

    try:
        payload = verify_jwt_token(token)

        if is_token_expired(payload):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )

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


def validate_token_claims(
    required_claims: list[str],
) -> callable:
    """
    Factory to create a dependency that validates required JWT claims.

    Args:
        required_claims: List of claim names that must be present

    Returns:
        Dependency function that validates claims
    """

    async def _validate_claims(
        current_user: CurrentUser = Depends(get_current_user_optional),
    ) -> CurrentUser:
        if current_user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
                headers={"WWW-Authenticate": "Bearer"},
            )

        missing_claims = [
            claim for claim in required_claims if claim not in current_user.claims
        ]
        if missing_claims:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail=f"Token missing required claims: {', '.join(missing_claims)}",
                headers={"WWW-Authenticate": "Bearer"},
            )

        return current_user

    return _validate_claims

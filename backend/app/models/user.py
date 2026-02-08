"""
User context models for authenticated requests.

Provides the CurrentUser model used to pass authenticated user
context to route handlers via dependency injection.
"""

from datetime import datetime
from typing import Any


class CurrentUser:
    """
    Represents the currently authenticated user extracted from JWT.

    Attributes:
        user_id: User identifier from JWT 'sub' claim
        is_authenticated: Always True for valid CurrentUser instances
        raw_token: Original JWT token string
        claims: Full dictionary of JWT claims
        issued_at: When the token was issued (from 'iat' claim)
        expires_at: When the token expires (from 'exp' claim)
        role: User role if present in claims
    """

    def __init__(
        self,
        user_id: str,
        raw_token: str,
        claims: dict[str, Any],
    ) -> None:
        self.user_id = user_id
        self.is_authenticated = True
        self.raw_token = raw_token
        self.claims = claims

        # Extract additional claims with safe defaults
        self.issued_at = self._extract_timestamp(claims.get("iat"))
        self.expires_at = self._extract_timestamp(claims.get("exp"))
        self.role = claims.get("role")
        self.email = claims.get("email")

    def _extract_timestamp(self, timestamp: int | None) -> datetime | None:
        """Convert Unix timestamp to datetime."""
        if timestamp is None:
            return None
        try:
            return datetime.utcfromtimestamp(timestamp)
        except (ValueError, TypeError, OSError):
            return None

    def get_claim(self, claim_name: str, default: Any = None) -> Any:
        """
        Safely get a claim value from the JWT.

        Args:
            claim_name: Name of the claim to retrieve
            default: Default value if claim is missing

        Returns:
            Claim value or default
        """
        return self.claims.get(claim_name, default)

    def has_claim(self, claim_name: str) -> bool:
        """Check if a claim exists in the JWT."""
        return claim_name in self.claims

    def __repr__(self) -> str:
        return f"CurrentUser(user_id={self.user_id!r}, role={self.role!r})"

"""
Tests for JWT authentication and token verification.
"""

import pytest


class TestJWTVerification:
    """Tests for JWT verification functionality."""

    def test_valid_token_access(self, client, auth_headers):
        """Test that valid JWT grants access to protected endpoints."""
        response = client.get(
            "/api/users/test-user-123/tasks",
            headers=auth_headers,
        )
        # Should not return 401 (might be 200 or 404 depending on data)
        assert response.status_code != 401

    def test_missing_token_returns_401(self, client):
        """Test that missing token returns 401 Unauthorized."""
        response = client.get("/api/users/test-user-123/tasks")
        assert response.status_code == 401

    def test_invalid_token_returns_401(self, client, invalid_signature_token):
        """Test that tampered/invalid signature returns 401."""
        headers = {"Authorization": f"Bearer {invalid_signature_token}"}
        response = client.get(
            "/api/users/test-user-123/tasks",
            headers=headers,
        )
        assert response.status_code == 401

    def test_expired_token_returns_401(self, client, expired_token):
        """Test that expired token returns 401."""
        headers = {"Authorization": f"Bearer {expired_token}"}
        response = client.get(
            "/api/users/test-user-123/tasks",
            headers=headers,
        )
        assert response.status_code == 401

    def test_malformed_token_returns_401(self, client):
        """Test that malformed token returns 401."""
        headers = {"Authorization": "Bearer not-a-valid-jwt"}
        response = client.get(
            "/api/users/test-user-123/tasks",
            headers=headers,
        )
        assert response.status_code == 401


class TestUserIsolation:
    """Tests for user ID matching and isolation."""

    def test_user_id_mismatch_returns_403(self, client, auth_headers):
        """Test that accessing another user's resources returns 403."""
        # Token is for test-user-123, trying to access different user
        response = client.get(
            "/api/users/different-user-456/tasks",
            headers=auth_headers,
        )
        assert response.status_code == 403
        assert "mismatch" in response.json()["detail"].lower()

    def test_user_id_match_allows_access(self, client, auth_headers):
        """Test that matching user ID allows access."""
        response = client.get(
            "/api/users/test-user-123/tasks",
            headers=auth_headers,
        )
        # Should not be 403 (user ID matches)
        assert response.status_code != 403

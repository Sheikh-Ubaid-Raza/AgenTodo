"""
Tests for protected task endpoints.
"""

import pytest


class TestProtectedTaskEndpoints:
    """Tests for protected task CRUD operations."""

    def test_create_task_with_auth(self, client, auth_headers):
        """Test creating a task with valid authentication."""
        task_data = {
            "title": "Test Task",
            "description": "A test task description",
        }
        response = client.post(
            "/api/users/test-user-123/tasks",
            json=task_data,
            headers=auth_headers,
        )
        assert response.status_code == 201
        data = response.json()
        assert data["title"] == "Test Task"
        assert data["is_completed"] is False

    def test_create_task_without_auth(self, client):
        """Test that creating task without auth returns 401."""
        task_data = {"title": "Test Task"}
        response = client.post(
            "/api/users/test-user-123/tasks",
            json=task_data,
        )
        assert response.status_code == 401

    def test_list_tasks_with_auth(self, client, auth_headers):
        """Test listing tasks with valid authentication."""
        response = client.get(
            "/api/users/test-user-123/tasks",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert isinstance(response.json(), list)

    def test_get_task_not_found(self, client, auth_headers):
        """Test getting non-existent task returns 404."""
        response = client.get(
            "/api/users/test-user-123/tasks/99999",
            headers=auth_headers,
        )
        assert response.status_code == 404

    def test_update_task_not_found(self, client, auth_headers):
        """Test updating non-existent task returns 404."""
        response = client.put(
            "/api/users/test-user-123/tasks/99999",
            json={"title": "Updated"},
            headers=auth_headers,
        )
        assert response.status_code == 404

    def test_delete_task_not_found(self, client, auth_headers):
        """Test deleting non-existent task returns 404."""
        response = client.delete(
            "/api/users/test-user-123/tasks/99999",
            headers=auth_headers,
        )
        assert response.status_code == 404

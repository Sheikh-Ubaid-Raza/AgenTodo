"""
SQLModel definitions for the Todo API.

Contains database table models (Task, User) and Pydantic schemas
for request/response validation (TaskCreate, TaskUpdate, TaskRead).
"""

from datetime import datetime
from typing import Optional

from sqlmodel import Field, SQLModel


# =============================================================================
# Database Table Models
# =============================================================================


class User(SQLModel, table=True):
    """
    Database table model for users.

    Note: This is a stub for Milestone 2 authentication.
    User functionality is OUT OF SCOPE for M1.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(max_length=255, unique=True, index=True)
    name: Optional[str] = Field(default=None, max_length=255)
    created_at: datetime = Field(default_factory=datetime.utcnow)


class Task(SQLModel, table=True):
    """
    Database table model for tasks.

    Represents a todo item with title, optional description,
    completion status, and creation timestamp.
    """

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255, min_length=1)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    # JWT sub claim from Better Auth - nullable for M1 (no user isolation)
    user_id: Optional[str] = Field(default=None, max_length=255, index=True)


# =============================================================================
# Request/Response Schemas
# =============================================================================


class TaskCreate(SQLModel):
    """
    Schema for creating a new task.

    Only title is required; description is optional.
    is_completed and created_at are set automatically.
    """

    title: str = Field(max_length=255, min_length=1)
    description: Optional[str] = Field(default=None, max_length=2000)


class TaskUpdate(SQLModel):
    """
    Schema for updating an existing task.

    All fields are optional - only provided fields will be updated.
    Enables partial updates (e.g., only updating is_completed).
    """

    title: Optional[str] = Field(default=None, max_length=255, min_length=1)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: Optional[bool] = None


class TaskRead(SQLModel):
    """
    Schema for reading/returning a task.

    Includes all task fields for API responses.
    """

    id: int
    title: str
    description: Optional[str]
    is_completed: bool
    created_at: datetime

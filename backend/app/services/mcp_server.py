"""MCP Server exposing task management tools.

This server runs as a subprocess launched by the OpenAI Agents SDK.
It connects directly to the database and exposes 5 task management tools.
The user_id is passed as a command-line argument for access control.
"""

import argparse
import json
import os
import sys
from datetime import datetime
from typing import Optional

from dotenv import load_dotenv

# Load environment variables before any imports that need them.
# When running as subprocess, the working directory may differ.
env_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)), "..", "..", ".env"
)
load_dotenv(env_path)

from mcp.server.fastmcp import FastMCP  # noqa: E402
from sqlalchemy import text  # noqa: E402
from sqlmodel import Field, Session, SQLModel, create_engine, select  # noqa: E402


# Redefine Task model here since this runs as a separate process
# and importing from the app package causes issues with subprocess execution.
class Task(SQLModel, table=True):
    """Task model matching the main application's schema."""

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    is_completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    user_id: Optional[str] = Field(default=None, max_length=255)


# Database setup
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    sys.exit(1)

engine = create_engine(
    DATABASE_URL,
    pool_recycle=300,
    pool_pre_ping=True,
    pool_size=2,
    max_overflow=3,
)

# Parse command-line arguments for user_id
parser = argparse.ArgumentParser()
parser.add_argument("--user-id", required=True, help="The authenticated user's ID")
args, _ = parser.parse_known_args()
CURRENT_USER_ID = args.user_id

# NOTE: Do NOT test DB connection at startup - it causes 5+ second cold-start delays
# which exceed the MCP client timeout. DB will be connected lazily on first tool call.

# Create MCP server
mcp = FastMCP("Task Manager")


def _get_db_user_id() -> Optional[str]:
    """Return the user_id as string for database queries."""
    return CURRENT_USER_ID


@mcp.tool()
def add_task(title: str, description: str = "") -> str:
    """Create a new task for the user.

    Args:
        title: The title of the task to create
        description: Optional description for the task
    """
    db_user_id = _get_db_user_id()

    try:
        with Session(engine) as session:
            task = Task(
                title=title,
                description=description if description else None,
                user_id=db_user_id,
            )
            session.add(task)
            session.commit()
            session.refresh(task)

            result = {
                "task_id": task.id,
                "status": "created",
                "title": task.title,
            }
            return json.dumps(result)
    except Exception as e:
        return json.dumps({"error": str(e), "status": "failed"})


@mcp.tool()
def list_tasks(status: str = "all") -> str:
    """List tasks for the user with optional status filtering.

    Args:
        status: Filter tasks by status - 'all', 'pending', or 'completed'
    """
    db_user_id = _get_db_user_id()

    with Session(engine) as session:
        query = select(Task).where(Task.user_id == db_user_id)

        if status == "pending":
            query = query.where(Task.is_completed == False)  # noqa: E712
        elif status == "completed":
            query = query.where(Task.is_completed == True)  # noqa: E712

        tasks = session.exec(query.order_by(Task.created_at.desc())).all()

        result = {
            "tasks": [
                {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "completed": task.is_completed,
                }
                for task in tasks
            ]
        }
        return json.dumps(result)


@mcp.tool()
def complete_task(task_id: int) -> str:
    """Mark a task as completed.

    Args:
        task_id: The ID of the task to complete
    """
    db_user_id = _get_db_user_id()

    with Session(engine) as session:
        task = session.exec(
            select(Task)
            .where(Task.id == task_id)
            .where(Task.user_id == db_user_id)
        ).first()

        if not task:
            return json.dumps({"error": f"Task {task_id} not found"})

        task.is_completed = True
        session.add(task)
        session.commit()
        session.refresh(task)

        result = {
            "task_id": task.id,
            "status": "completed",
            "title": task.title,
        }
        return json.dumps(result)


@mcp.tool()
def delete_task(task_id: int) -> str:
    """Delete a task from the list.

    Args:
        task_id: The ID of the task to delete
    """
    db_user_id = _get_db_user_id()

    with Session(engine) as session:
        task = session.exec(
            select(Task)
            .where(Task.id == task_id)
            .where(Task.user_id == db_user_id)
        ).first()

        if not task:
            return json.dumps({"error": f"Task {task_id} not found"})

        title = task.title
        task_id_val = task.id
        session.delete(task)
        session.commit()

        result = {
            "task_id": task_id_val,
            "status": "deleted",
            "title": title,
        }
        return json.dumps(result)


@mcp.tool()
def update_task(task_id: int, title: str = "", description: str = "") -> str:
    """Update a task's title or description.

    Args:
        task_id: The ID of the task to update
        title: New title for the task (empty string means no change)
        description: New description for the task (empty string means no change)
    """
    db_user_id = _get_db_user_id()

    with Session(engine) as session:
        task = session.exec(
            select(Task)
            .where(Task.id == task_id)
            .where(Task.user_id == db_user_id)
        ).first()

        if not task:
            return json.dumps({"error": f"Task {task_id} not found"})

        if title:
            task.title = title
        if description:
            task.description = description

        session.add(task)
        session.commit()
        session.refresh(task)

        result = {
            "task_id": task.id,
            "status": "updated",
            "title": task.title,
        }
        return json.dumps(result)


if __name__ == "__main__":
    mcp.run(transport="stdio")

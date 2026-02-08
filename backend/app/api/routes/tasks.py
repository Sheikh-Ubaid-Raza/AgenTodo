"""
Protected Task CRUD endpoints with user isolation.

Provides authenticated endpoints for task management where users
can only access their own tasks based on JWT user_id.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.db import get_session
from app.core.security import get_current_user
from app.models.models import Task, TaskCreate, TaskRead, TaskUpdate
from app.models.user import CurrentUser

router = APIRouter(
    prefix="/users/{user_id}/tasks",
    tags=["Protected Tasks"],
)


def verify_user_access(user_id: str, current_user: CurrentUser) -> None:
    """
    Verify the URL user_id matches the authenticated user's ID.

    Args:
        user_id: User ID from URL path
        current_user: Authenticated user from JWT

    Raises:
        HTTPException: 403 if user IDs don't match
    """
    if user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: user ID mismatch",
        )


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Task:
    """
    Create a new task for the authenticated user.

    - **user_id**: Must match the authenticated user's ID
    - **title**: Required task title (1-255 characters)
    - **description**: Optional task description
    """
    verify_user_access(user_id, current_user)

    # Use JWT user_id as string to match database schema
    db_user_id = current_user.user_id

    task = Task.model_validate(task_data)
    task.user_id = db_user_id  # Assign the authenticated user's ID to the task
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.get("", response_model=List[TaskRead])
def list_tasks(
    user_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> List[Task]:
    """
    List all tasks for the authenticated user.

    - **user_id**: Must match the authenticated user's ID
    """
    verify_user_access(user_id, current_user)

    # Use JWT user_id as string to match database schema
    db_user_id = current_user.user_id

    # Filter tasks by the authenticated user's ID
    statement = select(Task).where(Task.user_id == db_user_id).order_by(Task.created_at.desc())
    tasks = session.exec(statement).all()
    return list(tasks)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    user_id: str,
    task_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Task:
    """
    Get a single task by ID for the authenticated user.

    - **user_id**: Must match the authenticated user's ID
    - **task_id**: The unique identifier of the task
    """
    verify_user_access(user_id, current_user)

    # Use JWT user_id as string to match database schema
    db_user_id = current_user.user_id

    # Get task by ID and ensure it belongs to the authenticated user
    task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == db_user_id)).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the authenticated user",
        )
    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> Task:
    """
    Update a task for the authenticated user.

    - **user_id**: Must match the authenticated user's ID
    - **task_id**: The unique identifier of the task
    """
    verify_user_access(user_id, current_user)

    # Use JWT user_id as string to match database schema
    db_user_id = current_user.user_id

    # Get task by ID and ensure it belongs to the authenticated user
    task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == db_user_id)).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the authenticated user",
        )

    task_update_data = task_data.model_dump(exclude_unset=True)
    for key, value in task_update_data.items():
        setattr(task, key, value)

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@router.delete("/{task_id}")
def delete_task(
    user_id: str,
    task_id: int,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> dict:
    """
    Delete a task for the authenticated user.

    - **user_id**: Must match the authenticated user's ID
    - **task_id**: The unique identifier of the task
    """
    verify_user_access(user_id, current_user)

    # Use JWT user_id as string to match database schema
    db_user_id = current_user.user_id

    # Get task by ID and ensure it belongs to the authenticated user
    task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == db_user_id)).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found or does not belong to the authenticated user",
        )

    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}

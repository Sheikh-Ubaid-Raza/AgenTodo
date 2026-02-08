"""
Task CRUD endpoints for the Todo API.

Provides endpoints for creating, reading, updating, and deleting tasks.
All endpoints are prefixed with /api/tasks when included in the main app.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select

from app.core.db import get_session
from app.models.models import Task, TaskCreate, TaskRead, TaskUpdate

# Create router for task endpoints
router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"],
)


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
def create_task(
    task_data: TaskCreate,
    session: Session = Depends(get_session),
) -> Task:
    """
    Create a new task.

    - **title**: Required task title (1-255 characters)
    - **description**: Optional task description (up to 2000 characters)

    Returns the created task with generated id and created_at timestamp.
    """
    # Create Task instance from request data
    task = Task.model_validate(task_data)

    # Add to database
    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.get("", response_model=List[TaskRead])
def list_tasks(
    session: Session = Depends(get_session),
) -> List[Task]:
    """
    List all tasks.

    Returns all tasks ordered by created_at descending (newest first).
    Returns an empty array if no tasks exist.
    """
    # Query all tasks, ordered by created_at descending
    statement = select(Task).order_by(Task.created_at.desc())
    tasks = session.exec(statement).all()

    return list(tasks)


@router.get("/{task_id}", response_model=TaskRead)
def get_task(
    task_id: int,
    session: Session = Depends(get_session),
) -> Task:
    """
    Get a single task by ID.

    - **task_id**: The unique identifier of the task

    Returns the task if found, otherwise 404 error.
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    return task


@router.put("/{task_id}", response_model=TaskRead)
def update_task(
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
) -> Task:
    """
    Update an existing task.

    - **task_id**: The unique identifier of the task
    - **title**: Optional new title (1-255 characters)
    - **description**: Optional new description (up to 2000 characters)
    - **is_completed**: Optional new completion status

    Only provided fields will be updated (partial update supported).
    Returns the updated task if found, otherwise 404 error.
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    # Update only provided fields (exclude None values)
    task_update_data = task_data.model_dump(exclude_unset=True)
    for key, value in task_update_data.items():
        setattr(task, key, value)

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


@router.delete("/{task_id}")
def delete_task(
    task_id: int,
    session: Session = Depends(get_session),
) -> dict:
    """
    Delete a task by ID.

    - **task_id**: The unique identifier of the task

    Returns a success message if deleted, otherwise 404 error.
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )

    session.delete(task)
    session.commit()

    return {"message": "Task deleted successfully"}

"""
Models module for SQLModel database definitions and Pydantic schemas.

Contains:
    - Task: Database model for todo items
    - User: Database model for users (stub for M2 auth)
    - Conversation: Database model for chat sessions
    - Message: Database model for individual messages
    - TaskCreate, TaskUpdate, TaskRead: Request/response schemas
"""

from app.models.conversation import Conversation, Message  # noqa: F401

"""Request and response models for the chat API."""

from typing import Optional

from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    """Request body for the chat endpoint."""

    message: str = Field(..., min_length=1, max_length=5000)
    conversation_id: Optional[int] = None


class ToolCallInfo(BaseModel):
    """Information about a tool call made during agent execution."""

    tool_name: str
    arguments: dict
    result: str


class ChatResponse(BaseModel):
    """Response body from the chat endpoint."""

    conversation_id: int
    response: str
    tool_calls: list[ToolCallInfo] = []

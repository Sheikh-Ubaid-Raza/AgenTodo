"""Conversation history management service.

Provides stateless functions for creating/retrieving conversations
and storing/fetching messages. Every function takes a Session parameter.
"""

from datetime import datetime

from sqlmodel import Session, select

from app.models.conversation import Conversation, Message


def get_or_create_conversation(
    session: Session, user_id: str, conversation_id: int | None = None
) -> Conversation:
    """Get existing conversation or create a new one.

    Args:
        session: Database session
        user_id: The authenticated user's ID
        conversation_id: Optional existing conversation ID

    Returns:
        Conversation instance

    Raises:
        ValueError: If conversation_id doesn't belong to user
    """
    if conversation_id is not None:
        conversation = session.exec(
            select(Conversation)
            .where(Conversation.id == conversation_id)
            .where(Conversation.user_id == user_id)
        ).first()
        if not conversation:
            raise ValueError(
                f"Conversation {conversation_id} not found for user {user_id}"
            )
        return conversation

    conversation = Conversation(user_id=user_id)
    session.add(conversation)
    session.commit()
    session.refresh(conversation)
    return conversation


def store_message(
    session: Session, user_id: str, conversation_id: int, role: str, content: str
) -> Message:
    """Store a message in the database.

    Args:
        session: Database session
        user_id: The user's ID
        conversation_id: The conversation this message belongs to
        role: Either "user" or "assistant"
        content: The message content

    Returns:
        The stored Message instance
    """
    message = Message(
        user_id=user_id,
        conversation_id=conversation_id,
        role=role,
        content=content,
    )
    session.add(message)

    # Update conversation's updated_at timestamp
    conversation = session.get(Conversation, conversation_id)
    if conversation:
        conversation.updated_at = datetime.utcnow()
        session.add(conversation)

    session.commit()
    session.refresh(message)
    return message


def fetch_conversation_history(
    session: Session, conversation_id: int, user_id: str
) -> list[Message]:
    """Fetch all messages for a conversation in chronological order.

    Args:
        session: Database session
        conversation_id: The conversation to fetch messages for
        user_id: The user's ID (for access control)

    Returns:
        List of Message objects ordered by created_at
    """
    messages = session.exec(
        select(Message)
        .where(Message.conversation_id == conversation_id)
        .where(Message.user_id == user_id)
        .order_by(Message.created_at)
    ).all()
    return list(messages)


def build_message_array(messages: list[Message]) -> list[dict]:
    """Convert Message objects to the format expected by OpenAI Agents SDK.

    Args:
        messages: List of Message objects from the database

    Returns:
        List of dicts with 'role' and 'content' keys
    """
    return [{"role": msg.role, "content": msg.content} for msg in messages]

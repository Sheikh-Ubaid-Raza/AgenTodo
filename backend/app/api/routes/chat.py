"""Chat API endpoint implementing the 9-step stateless request cycle.

Flow:
1. Receive user message
2. Fetch conversation history
3. Build message array for agent
4. Store user message
5. Run agent with MCP tools
6. Agent invokes appropriate tool(s)
7. Store assistant response
8. Return response
9. No state retained
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api.models.chat_models import ChatRequest, ChatResponse, ToolCallInfo
from app.core.db import get_session
from app.core.security import get_current_user
from app.models.user import CurrentUser
from app.services import conversation_service
from app.services.agent_service import run_agent

logger = logging.getLogger(__name__)

router = APIRouter(tags=["Chat"])


@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> ChatResponse:
    """Process a chat message through the AI agent.

    Implements the 9-step stateless request cycle.
    """
    # Step 0: Verify user access
    if user_id != current_user.user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: user ID mismatch",
        )

    try:
        # Step 2: Get or create conversation
        conversation = conversation_service.get_or_create_conversation(
            session=session,
            user_id=user_id,
            conversation_id=request.conversation_id,
        )

        # Step 3: Fetch conversation history and build message array
        messages = conversation_service.fetch_conversation_history(
            session=session,
            conversation_id=conversation.id,
            user_id=user_id,
        )
        history = conversation_service.build_message_array(messages)

        # Step 4: Store user message
        conversation_service.store_message(
            session=session,
            user_id=user_id,
            conversation_id=conversation.id,
            role="user",
            content=request.message,
        )

        # Steps 5-6: Run agent (agent invokes MCP tools internally)
        agent_result = await run_agent(
            user_id=user_id,
            message=request.message,
            history=history,
        )

        # Step 7: Store assistant response
        conversation_service.store_message(
            session=session,
            user_id=user_id,
            conversation_id=conversation.id,
            role="assistant",
            content=agent_result.response,
        )

        # Step 8: Return response
        tool_calls = [
            ToolCallInfo(
                tool_name=tc.get("tool_name", "unknown"),
                arguments=tc.get("arguments", {})
                if isinstance(tc.get("arguments"), dict)
                else {},
                result=tc.get("result", ""),
            )
            for tc in agent_result.tool_calls
        ]

        return ChatResponse(
            conversation_id=conversation.id,
            response=agent_result.response,
            tool_calls=tool_calls,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )
    except Exception as e:
        logger.error(
            "Chat endpoint error for user %s: %s", user_id, str(e), exc_info=True
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while processing your request. Please try again.",
        )

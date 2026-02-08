"""Agent service for AI chatbot interaction.

Creates and runs an OpenAI Agent configured with OpenRouter backend
and MCP tools for task management. Each request creates a fresh agent
to maintain statelessness.
"""

import os
import sys
from dataclasses import dataclass

from agents import AsyncOpenAI, OpenAIChatCompletionsModel, Agent, Runner
from agents.run import RunConfig
from agents.mcp import MCPServerStdio

from app.core.config import settings

SYSTEM_PROMPT = """You are a helpful AI assistant that manages a user's todo task list.
You can perform the following operations:
- Add new tasks
- List existing tasks (all, pending, or completed)
- Mark tasks as complete
- Delete tasks
- Update task titles or descriptions

IMPORTANT RULES:
1. When the user asks you to perform a task operation, use the appropriate tool.
2. ALWAYS wait for the tool's response before confirming the action to the user.
3. After receiving the tool result, check the returned status to verify the operation succeeded.
4. If a tool returns an error (e.g. "Task not found"), inform the user of the failure — do NOT claim success.
5. Include specific details from the tool response in your confirmation (e.g. task ID, title).
6. If the user's request is ambiguous, ask for clarification before calling any tool.
7. Be concise and friendly in your responses."""


@dataclass
class AgentResult:
    """Result from running the agent."""

    response: str
    tool_calls: list[dict]


def _get_mcp_server_path() -> str:
    """Get the path to the MCP server script."""
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), "mcp_server.py")


external_client = AsyncOpenAI(
    api_key=settings.openrouter_api_key,
    base_url="https://openrouter.ai/api/v1",
)

# Define the model to use (Gemini in this case)
openrouter_model = OpenAIChatCompletionsModel(
    model=settings.model_name,
    openai_client=external_client
)

# Configure how the agent should run
my_config = RunConfig(
    model=openrouter_model,
    model_provider=external_client,
    tracing_disabled=True
)

async def run_agent(user_id: str, message: str, history: list[dict]) -> AgentResult:
    """Run the AI agent with MCP tools for a single request.

    This function is stateless - it creates a fresh agent per request,
    passes conversation history for context, and returns the result.

    Args:
        user_id: The authenticated user's ID (passed to MCP tools)
        message: The new user message
        history: Previous conversation messages as list of {role, content} dicts

    Returns:
        AgentResult with the response text and any tool calls made
    """
    mcp_server_path = _get_mcp_server_path()
    tool_calls_made: list[dict] = []

    # Set OpenRouter credentials via environment variables
    # The OpenAI Agents SDK reads these automatically
    os.environ["OPENROUTER_API_KEY"] = settings.openrouter_api_key
    os.environ["OPENROUTER_BASE_URL"] = "https://openrouter.ai/api/v1"


    # Pass required env vars to the MCP subprocess explicitly.
    # The MCP SDK's default environment only includes PATH/HOME,
    # so DATABASE_URL and other secrets would be missing.
    mcp_env = {
        "DATABASE_URL": settings.database_url,
        "OPENROUTER_API_KEY": settings.openrouter_api_key,
        "MODEL_NAME": settings.model_name,
    }

    try:
        async with MCPServerStdio(
            name="Task Manager MCP",
            params={
                "command": sys.executable,
                "args": [mcp_server_path, "--user-id", user_id],
                "env": mcp_env,
            },
            cache_tools_list=True,
            client_session_timeout_seconds=30.0,  # Increase timeout for Neon cold starts
        ) as mcp_server:
            agent = Agent(
                name="Todo Assistant",
                instructions=SYSTEM_PROMPT,
                mcp_servers=[mcp_server],
                model=settings.model_name,
            )

            # Build input: history + new message
            input_messages = history + [{"role": "user", "content": message}]

            result = await Runner.run(
                agent,
                input=input_messages,
                run_config=my_config
            )

            # Extract tool calls from the result
            for item in result.new_items:
                if hasattr(item, "raw_item") and hasattr(item.raw_item, "type"):
                    if item.raw_item.type == "function_call":
                        tool_name = getattr(item.raw_item, "name", "unknown")
                        tool_args = getattr(item.raw_item, "arguments", "{}")
                        tool_calls_made.append(
                            {
                                "tool_name": tool_name,
                                "arguments": tool_args,
                                "result": "",
                            }
                        )
                    elif item.raw_item.type == "function_call_output":
                        output = getattr(item.raw_item, "output", "")
                        if tool_calls_made:
                            tool_calls_made[-1]["result"] = output

            response_text = (
                result.final_output
                or "I processed your request but have no additional information to share."
            )

            return AgentResult(response=response_text, tool_calls=tool_calls_made)

    except Exception as e:
        raise

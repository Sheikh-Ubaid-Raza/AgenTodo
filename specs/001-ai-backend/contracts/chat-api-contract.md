# API Contract: Chat Endpoint

## Endpoint: POST `/api/{user_id}/chat`

### Description
Stateless chat endpoint that accepts user messages and returns AI responses using OpenRouter backend. The endpoint implements the 9-step stateless request cycle.

### Parameters
- `user_id` (path): String - Unique identifier for the authenticated user

### Request Body
```json
{
  "conversation_id": "integer (optional)",
  "message": "string (required)"
}
```

### Response Body
```json
{
  "conversation_id": "integer",
  "response": "string",
  "tool_calls": "array"
}
```

### Headers
- Authorization: Bearer {jwt_token}

### Flow
1. Receive user message
2. Fetch conversation history from database
3. Build message array for agent (history + new message)
4. Store user message in database
5. Run agent with MCP tools
6. Agent invokes appropriate MCP tool(s)
7. Store assistant response in database
8. Return response to client
9. Server holds NO state (ready for next request)

## Authentication
JWT token validation to ensure user can only access their own conversations and tasks.

## Error Responses
- 401: Unauthorized (invalid JWT)
- 403: Forbidden (user attempting to access other user's data)
- 404: Conversation not found (if specified conversation_id doesn't exist)
- 500: Internal server error (MCP server unavailable, etc.)
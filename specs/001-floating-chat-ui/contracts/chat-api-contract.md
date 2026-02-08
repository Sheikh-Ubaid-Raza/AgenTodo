# API Contract: Chat Interface

## Overview
This document defines the contract between the frontend floating chat widget and the backend chat API for the Todo app integration.

## Authentication
All chat API endpoints require authentication using Better Auth JWT tokens.

**Header**: `Authorization: Bearer {jwt_token}`

## Endpoint: Send Message

### Request
```
POST /api/{user_id}/chat
Content-Type: application/json
Authorization: Bearer {jwt_token}
```

#### Path Parameters
- `user_id` (string): The authenticated user's ID

#### Request Body
```json
{
  "message": "string (required)",
  "conversation_id": "string (optional)"
}
```

**Fields**:
- `message`: The user's message to send to the AI assistant
- `conversation_id`: Optional ID to continue an existing conversation (if omitted, starts a new conversation)

### Response
#### Success Response (200 OK)
```json
{
  "conversation_id": "string",
  "response": "string",
  "timestamp": "ISO 8601 datetime string",
  "tool_calls": [
    {
      "tool_name": "string",
      "parameters": "object",
      "status": "pending|executing|completed|failed"
    }
  ]
}
```

**Fields**:
- `conversation_id`: The conversation identifier (new or existing)
- `response`: The AI's response to the user's message
- `timestamp`: When the response was generated
- `tool_calls`: Array of any tools called by the AI with their status

#### Error Responses

**400 Bad Request**
```json
{
  "error": "string",
  "details": "object"
}
```

**401 Unauthorized**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or expired authentication token"
}
```

**403 Forbidden**
```json
{
  "error": "Forbidden",
  "message": "Access denied for this user"
}
```

**429 Too Many Requests**
```json
{
  "error": "Rate limit exceeded",
  "retry_after": "number (seconds)"
}
```

**500 Internal Server Error**
```json
{
  "error": "Internal server error",
  "message": "An unexpected error occurred"
}
```

## Frontend Implementation Requirements

### Request Implementation
The frontend must:
- Retrieve the user's JWT token from Better Auth session
- Include proper Authorization header with each request
- Handle conversation_id to maintain session continuity
- Implement proper error handling for each response type

### Response Handling
The frontend must:
- Update the conversation_id for session continuity
- Display the AI response in the chat interface
- Handle tool_call statuses appropriately (show loading indicators, success, or errors)
- Manage loading states during API requests

### Error Handling
The frontend should:
- Display user-friendly messages for 4xx errors
- Redirect to login for 401 responses
- Implement retry logic for 5xx errors
- Show rate limit warnings for 429 responses
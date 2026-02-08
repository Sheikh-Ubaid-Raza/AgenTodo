# Quickstart Guide: AI Backend with OpenRouter Integration

## Prerequisites
- Python 3.11+
- OPENROUTER_API_KEY environment variable set
- Access to Neon PostgreSQL database
- Better Auth JWT verification configured

## Environment Setup

1. Set up environment variables:
```bash
export OPENROUTER_API_KEY="your_openrouter_api_key"
export DATABASE_URL="your_neon_postgres_connection_string"
export BETTER_AUTH_SECRET="your_auth_secret"
```

2. Install dependencies:
```bash
pip install fastapi sqlmodel openai python-dotenv
pip install git+https://github.com/modelcontextprotocol/python-sdk.git  # MCP SDK
```

## Service Initialization

### 1. Initialize Database Models
- Run SQLModel migrations to create Conversation and Message tables
- Ensure indexes are created according to the indexing strategy

### 2. MCP Server Setup
- Launch MCP server with the 5 core tools (add_task, list_tasks, complete_task, delete_task, update_task)
- Configure MCP client to connect to the server

### 3. OpenRouter Client Configuration
- Initialize OpenAI client with OpenRouter base URL
- Set model to `qwen/qwen-2.5-7b-instruct`
- Configure temperature to 0.3 for task accuracy

### 4. Authentication Middleware
- Verify JWT tokens to extract user_id
- Ensure user isolation for conversations and tasks

## Running the Services

### Start MCP Server
```bash
python -m services.mcp_server
```

### Start Main API
```bash
uvicorn main:app --reload
```

## API Usage Example

### Chat Endpoint
```bash
curl -X POST "http://localhost:8000/api/ziakhan/chat" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Add a task to buy groceries"
  }'
```

## Testing

### Unit Tests
```bash
pytest tests/unit/
```

### Integration Tests
- MCP tools validation
- 9-step flow verification
- Intent recognition testing

### Validation Steps
1. Verify each MCP tool works independently
2. Test full 9-step conversation flow
3. Confirm intent recognition accuracy with sample phrases
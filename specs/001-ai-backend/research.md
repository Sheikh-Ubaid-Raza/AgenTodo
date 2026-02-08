# Research Findings: AI Backend with OpenRouter Integration

## Decision: OpenRouter API Configuration
**Rationale**: Using OpenRouter as the LLM provider offers competitive pricing, diverse model selection, and reliable API access for the AI chatbot functionality. Configuring the OpenAI client to connect to OpenRouter enables leveraging their infrastructure while maintaining compatibility with OpenAI Agents SDK.

**Alternatives considered**:
- OpenAI GPT models directly (higher costs, rate limits)
- Self-hosted models (higher operational overhead)
- Other LLM providers (limited model variety)

## Decision: Model Selection - qwen/qwen-2.5-7b-instruct
**Rationale**: Qwen 2.5 7B instruct model offers strong instruction-following capabilities suitable for interpreting natural language commands for task management. It provides a good balance of performance and cost for the chatbot's intent recognition requirements.

**Temperature Setting**: 0.3 for improved accuracy and consistency in task-related responses
**Alternatives considered**:
- Larger models (higher costs, potential over-engineering)
- Smaller/lighter models (potentially less accurate for complex intents)
- Different model families (different strengths but not optimized for task management)

## Decision: Database Indexing Strategy
**Rationale**: Proper indexing is crucial for efficient conversation history retrieval. Primary indexes on user_id and conversation_id will ensure fast lookup of conversation data. Secondary indexes on timestamps will optimize chronological ordering of messages.

**Indexing Strategy**:
- Conversation table: index on (user_id)
- Message table: composite index on (conversation_id, created_at) for chronological retrieval
- Additional index on (user_id, conversation_id) for security filtering

**Alternatives considered**:
- No indexing (poor performance as data grows)
- Over-indexing (increased write overhead)
- Different index combinations (evaluated for query optimization)

## Decision: MCP Server Integration Pattern
**Rationale**: The MCP server will run as a separate service to handle tool operations, allowing the main chat endpoint to focus on conversation flow. This separation of concerns follows microservice principles while maintaining statelessness.

**Integration approach**: FastAPI app will initialize MCP client to connect to the MCP server for tool execution.

## Decision: Authentication Integration
**Rationale**: The system will leverage existing Better Auth JWT handling from Phase 2 to maintain user isolation and ensure users can only access their own conversations and tasks.

**Approach**: Extract user_id from JWT token in chat endpoint and pass it to both conversation service and MCP tools to enforce access control.
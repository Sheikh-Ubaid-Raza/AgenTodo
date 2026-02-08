# Data Model: AI Backend with OpenRouter Integration

## Entity: Conversation
**Description**: Represents a chat session with metadata including user_id, creation timestamp, and last update timestamp

**Fields**:
- `id`: Integer, primary key, auto-generated
- `user_id`: String, foreign key reference to user identifier
- `created_at`: DateTime, timestamp when conversation started
- `updated_at`: DateTime, timestamp of last activity in conversation

**Relationships**:
- One-to-many with Message entity (one conversation has many messages)
- Belongs to one User (referenced by user_id)

**Validation rules**:
- user_id is required
- created_at defaults to current timestamp
- updated_at updates on any conversation activity

## Entity: Message
**Description**: Represents individual messages within a conversation, including user_id, conversation_id, role (user/assistant), content, and timestamp

**Fields**:
- `id`: Integer, primary key, auto-generated
- `user_id`: String, reference to user identifier
- `conversation_id`: Integer, foreign key to Conversation
- `role`: String, enum values "user" or "assistant"
- `content`: Text, the actual message content
- `created_at`: DateTime, timestamp when message was created

**Relationships**:
- Many-to-one with Conversation entity (many messages belong to one conversation)
- Belongs to one User (referenced by user_id)

**Validation rules**:
- user_id is required
- conversation_id is required
- role must be either "user" or "assistant"
- content is required
- created_at defaults to current timestamp

## Entity: Task (Existing)
**Description**: Represents todo items with user_id, title, description, completion status, and timestamps

**Fields**:
- `id`: Integer, primary key, auto-generated
- `user_id`: String, reference to user identifier
- `title`: String, required, task title
- `description`: Text, optional, task description
- `completed`: Boolean, default False
- `created_at`: DateTime, timestamp when task was created
- `updated_at`: DateTime, timestamp of last update

**Relationships**:
- Belongs to one User (referenced by user_id)

**Validation rules**:
- user_id is required
- title is required
- completed defaults to False
- created_at defaults to current timestamp
- updated_at updates on any task modification

## State Transitions

### Task State Transitions
- `pending` → `completed`: When complete_task MCP tool is called
- `completed` → `pending`: When update_task MCP tool resets completion status

### Message Role Transitions
- `user` → `assistant`: When AI generates response (immutable after creation)
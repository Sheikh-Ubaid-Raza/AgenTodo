# Tasks: AI Backend with OpenRouter Integration

**Feature**: AI Backend & MCP Server Integration
**Branch**: 001-ai-backend
**Generated**: 2026-02-05
**Input**: spec.md, plan.md, data-model.md, contracts/

## Implementation Strategy

MVP scope: Implement User Story 1 (AI Chatbot Interaction) with minimal viable conversation functionality. This will include basic chat endpoint, conversation persistence, and one MCP tool (add_task) to demonstrate the full flow. Subsequent user stories will build upon this foundation.

## Dependencies

User stories can be implemented in parallel after foundational tasks are complete:
- User Story 1 (AI Chatbot Interaction) and User Story 2 (Conversation History Persistence) can be developed simultaneously as they share core components
- User Story 3 (Task Management Operations) depends on User Story 1 and 2 for the base infrastructure

## Parallel Execution Examples

Each user story can be developed in parallel after foundational tasks:
- US1 team: Focus on chat endpoint and basic task creation
- US2 team: Focus on conversation history persistence and retrieval
- US3 team: Focus on additional MCP tools (list, complete, delete, update)

## Implementation Notes

The original plan specified `backend/src/` as the source directory, but the existing codebase uses `backend/app/`. All tasks were adapted to use the existing `backend/app/` structure for consistency with prior phases.

---

## Phase 1: Setup

- [X] T001 Create backend directory structure per implementation plan
- [X] T002 Create requirements.txt with dependencies: fastapi, sqlmodel, openai, python-dotenv, official mcp sdk
- [X] T003 Set up initial FastAPI application in backend/app/main.py
- [X] T004 Create project initialization files in backend/app/__init__.py

## Phase 2: Foundational

- [X] T005 Create SQLModel base model in backend/app/models/__init__.py
- [X] T006 Implement Conversation model in backend/app/models/conversation.py
- [X] T007 Implement Message model in backend/app/models/conversation.py
- [X] T008 Create database session management in backend/app/core/db.py
- [X] T009 Implement OpenRouter client configuration in backend/app/core/config.py
- [X] T010 Create authentication middleware for JWT validation in backend/app/core/security.py

## Phase 3: [US1] AI Chatbot Interaction

**Goal**: Enable users to interact with an AI chatbot using natural language to manage their todo tasks.

**Independent Test**: Send natural language messages to the chat endpoint and verify that the AI correctly interprets the intent and performs appropriate task operations.

- [X] T011 [P] [US1] Create chat API router in backend/app/api/routes/chat.py
- [X] T012 [P] [US1] Implement POST /api/{user_id}/chat endpoint
- [X] T013 [P] [US1] Add request/response models for chat endpoint in backend/app/api/models/chat_models.py
- [X] T014 [US1] Create conversation service in backend/app/services/conversation_service.py
- [X] T015 [US1] Implement store_user_message function in conversation service
- [X] T016 [US1] Implement fetch_conversation_history function in conversation service
- [X] T017 [US1] Create agent service in backend/app/services/agent_service.py
- [X] T018 [US1] Implement OpenAI agent with OpenRouter configuration
- [X] T019 [US1] Connect agent to MCP tools for task operations
- [X] T020 [US1] Implement basic add_task functionality for user requests
- [X] T021 [US1] Add error handling for chat endpoint in backend/app/api/routes/chat.py
- [ ] T022 [US1] Test basic chat interaction with add_task functionality

## Phase 4: [US2] Conversation History Persistence

**Goal**: Maintain conversation context by persisting conversation history in the database and retrieving it for each new interaction, ensuring continuity even though the server is stateless.

**Independent Test**: Make multiple sequential requests from the same user and verify that the conversation history is maintained and accessible to the AI agent for context.

- [X] T023 [P] [US2] Enhance conversation service with history building functions
- [X] T024 [P] [US2] Implement message retrieval with chronological ordering
- [X] T025 [US2] Add database indexes for efficient conversation history queries
- [X] T026 [US2] Create conversation creation/get functions in conversation service
- [X] T027 [US2] Implement conversation state management for ongoing chats
- [X] T028 [US2] Add conversation persistence to chat endpoint flow
- [ ] T029 [US2] Test conversation continuity across multiple requests
- [ ] T030 [US2] Verify conversation history retrieval after server restart

## Phase 5: [US3] Task Management Operations via Natural Language

**Goal**: Enable users to perform all basic task management operations (create, read, update, delete, complete) using natural language commands through MCP tools.

**Independent Test**: Send various natural language commands representing each task operation type and verify that the AI correctly identifies the intent and performs the appropriate action.

- [X] T031 [P] [US3] Create MCP server module in backend/app/services/mcp_server.py
- [X] T032 [P] [US3] Implement add_task MCP tool with proper parameter validation
- [X] T033 [P] [US3] Implement list_tasks MCP tool with status filtering
- [X] T034 [US3] Implement complete_task MCP tool with task validation
- [X] T035 [US3] Implement delete_task MCP tool with proper cleanup
- [X] T036 [US3] Implement update_task MCP tool with partial updates
- [X] T037 [US3] Connect MCP tools to existing task database operations
- [X] T038 [US3] Integrate all MCP tools with the OpenAI agent
- [ ] T039 [US3] Test all 5 task operations via natural language commands
- [ ] T040 [US3] Verify AI intent recognition for different task operation types

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T041 Add comprehensive logging to all services
- [ ] T042 Implement rate limiting for chat endpoints
- [X] T043 Add input validation and sanitization for all user inputs
- [X] T044 Create health check endpoint for monitoring
- [X] T045 Add comprehensive error responses per API contract
- [X] T046 Implement graceful error handling for MCP server unavailability
- [ ] T047 Add unit tests for all service functions
- [ ] T048 Add integration tests for complete 9-step flow
- [X] T049 Optimize database queries with proper indexing
- [X] T050 Document API endpoints with OpenAPI specifications

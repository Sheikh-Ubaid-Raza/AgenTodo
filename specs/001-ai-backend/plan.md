# Implementation Plan: AI Backend with OpenRouter Integration

**Branch**: `001-ai-backend` | **Date**: 2026-02-05 | **Spec**: [link](specs/001-ai-backend/spec.md)
**Input**: Feature specification from `/specs/001-ai-backend/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implementation of a stateless AI backend with OpenRouter integration for the todo chatbot feature. This includes: 1) Architecture for the 9-step stateless request cycle integrating OpenRouter, 2) SQLModel database schema updates for Conversation and Message tables, 3) MCP Server tool definitions for task operations, and 4) OpenAI Agent logic configured to use OpenRouter as the base provider with qwen/qwen-2.5-7b-instruct model.

## Technical Context

**Language/Version**: Python 3.11
**Primary Dependencies**: FastAPI, SQLModel, OpenAI Agents SDK, Official MCP SDK, Neon PostgreSQL
**Storage**: Neon PostgreSQL database via SQLModel ORM
**Testing**: pytest for unit and integration tests
**Target Platform**: Linux server
**Project Type**: web - backend service with MCP server integration
**Performance Goals**: <3 second response time for chat endpoint, 99.9% availability for conversation history
**Constraints**: Stateless operation (no in-memory conversation state), user data isolation, OpenRouter API integration
**Scale/Scope**: Support multiple concurrent users with individual conversation histories

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [X] Spec-Driven Development (SDD): Implementation will be generated from this refined spec
- [X] Phase-Aware Evolution: Architecture supports transition from current FastAPI/SQLModel to MCP/Agents SDK
- [X] Type Safety: End-to-end type safety between components using Pydantic models
- [X] Security-First: JWT-based authentication and user-data isolation will be maintained
- [X] Agentic Workflow: Using Spec-Kit Plus for implementation
- [X] Clean Architecture: Separation of concerns between API routes, database models, MCP server, and agent logic

## Project Structure

### Documentation (this feature)

```text
specs/001-ai-backend/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── models/
│   │   ├── __init__.py
│   │   ├── conversation.py      # Conversation and Message SQLModel definitions
│   │   └── task.py             # Task model (existing)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── conversation_service.py  # Conversation history management
│   │   ├── mcp_server.py            # MCP server implementation
│   │   └── agent_service.py         # OpenAI Agent logic with OpenRouter
│   ├── api/
│   │   ├── __init__.py
│   │   └── chat_api.py              # Stateless chat endpoint
│   └── main.py                      # FastAPI application entry point
├── tests/
│   ├── unit/
│   │   ├── models/
│   │   ├── services/
│   │   └── api/
│   └── integration/
│       ├── conversation_test.py
│       ├── mcp_test.py
│       └── agent_integration_test.py
└── requirements.txt
```

**Structure Decision**: Web application with dedicated backend service containing models, services, and API layers. The structure separates concerns between data models, business logic (services), and API endpoints while supporting the MCP server and agent logic required for the AI functionality.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
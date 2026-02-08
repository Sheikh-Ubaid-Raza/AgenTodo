# Research: Backend Foundation - Todo API

**Feature**: 001-backend-foundation
**Date**: 2026-02-04
**Status**: Complete

## Research Summary

This document consolidates research findings for implementing the Todo API backend with FastAPI, SQLModel, and Neon PostgreSQL.

---

## Decision 1: Database Driver Selection

**Decision**: Use `psycopg2-binary` for synchronous database operations

**Rationale**:
- SQLModel works seamlessly with psycopg2 through SQLAlchemy's synchronous engine
- `psycopg2-binary` provides pre-compiled binaries, simplifying installation
- Neon PostgreSQL connection strings work directly with psycopg2
- Synchronous operations are sufficient for M1 scope (no high-concurrency requirements)

**Alternatives Considered**:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| psycopg2-binary | Easy install, well-tested, SQLModel native support | Synchronous only | **Selected** |
| asyncpg | Async native, high performance | Requires async SQLAlchemy setup, added complexity | Rejected for M1 |
| psycopg (v3) | Modern, async capable | Newer, less tested with SQLModel | Future consideration |

---

## Decision 2: Project Structure

**Decision**: Use modular `backend/app/` structure with clear separation

**Rationale**:
- Aligns with user's architecture sketch
- Supports future expansion (Milestone 2 auth, Milestone 3 frontend integration)
- FastAPI best practice for medium-scale applications
- Clean separation between models, routes, and database configuration

**Structure**:
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py           # FastAPI app, startup events, CORS
│   ├── core/
│   │   ├── __init__.py
│   │   └── db.py         # Engine, session management
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py     # SQLModel definitions (Task, User)
│   └── routes/
│       ├── __init__.py
│       └── tasks.py      # CRUD endpoints for /api/tasks
├── requirements.txt
├── .env.example
└── README.md
```

---

## Decision 3: SQLModel Relationship Design

**Decision**: Define User-Task one-to-many relationship but defer User functionality

**Rationale**:
- Prepares schema for Milestone 2 authentication
- Task model includes optional `user_id` foreign key (nullable for M1)
- Avoids schema migrations when auth is added
- Constitution requires "phase-aware evolution"

**Alternatives Considered**:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| No User model | Simpler M1 | Requires migration in M2 | Rejected |
| Full User model | Future-proof | Over-engineering for M1 | Rejected |
| User stub with nullable FK | Balanced approach | Slight added complexity | **Selected** |

---

## Decision 4: CORS Configuration

**Decision**: Enable CORS for localhost:3000 (Next.js default) with full method support

**Rationale**:
- Required for frontend integration in Milestone 3
- Setting up early prevents integration issues
- CORSMiddleware is built into FastAPI

**Configuration**:
```python
allow_origins=["http://localhost:3000"]
allow_credentials=True
allow_methods=["*"]
allow_headers=["*"]
```

---

## Decision 5: Auto-Table Creation Strategy

**Decision**: Use SQLModel's `create_all()` on application startup via lifespan context manager

**Rationale**:
- FastAPI's modern lifespan approach (preferred over deprecated `on_event`)
- Creates tables if they don't exist, safe for restarts
- Development-friendly, no manual migration steps for M1
- Constitution's "deployment ready" allows auto-creation for dev phase

**Alternatives Considered**:

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| Manual migrations (Alembic) | Production-ready | Overkill for M1 | Future consideration |
| create_all() on startup | Simple, dev-friendly | Not for prod migrations | **Selected for M1** |

---

## Decision 6: Error Response Format

**Decision**: Use consistent JSON error responses with `detail` field

**Rationale**:
- FastAPI's HTTPException uses `detail` by default
- Consistent with OpenAPI spec generation
- Frontend can reliably parse error messages

**Format**:
```json
{
  "detail": "Task not found"
}
```

---

## Decision 7: ID Generation Strategy

**Decision**: Use PostgreSQL SERIAL (auto-increment integer) for task IDs

**Rationale**:
- Simple, predictable IDs for development and testing
- Spec assumption A-007 states integer IDs are acceptable
- SQLModel's `Field(default=None, primary_key=True)` pattern
- UUIDs considered overkill for M1 scope

---

## Decision 8: Timestamp Handling

**Decision**: Use `datetime.utcnow()` with timezone-naive UTC timestamps

**Rationale**:
- Spec assumption A-006 specifies UTC timezone
- SQLModel stores as PostgreSQL TIMESTAMP
- Frontend can apply user's local timezone
- Consistent across all environments

---

## Technology Best Practices Applied

### FastAPI
- Use `APIRouter` for route organization
- Dependency injection for database sessions
- Pydantic models via SQLModel for validation
- Response model specification for documentation

### SQLModel
- Separate table models from API schemas (Task vs TaskCreate, TaskUpdate)
- Use `SQLModel.model_validate()` for conversions
- Session management via context managers

### Neon PostgreSQL
- Connection string via environment variable
- Connection pooling handled by SQLAlchemy engine
- SSL mode enabled by default in Neon connection strings

---

## Resolved Clarifications

All technical context items have been resolved:

| Item | Resolution |
|------|------------|
| Language/Version | Python 3.11+ |
| Primary Dependencies | FastAPI, SQLModel, psycopg2-binary, uvicorn, python-dotenv |
| Storage | Neon PostgreSQL (via DATABASE_URL) |
| Testing | Manual via Swagger UI (/docs) for M1; pytest for future |
| Target Platform | Linux server (WSL2 dev environment) |
| Project Type | Web backend (API) |
| Performance Goals | 500ms response time, 10 concurrent requests |
| Constraints | <500ms p95 latency, modular structure |
| Scale/Scope | Single user, ~100 tasks (dev scale) |

---

## References

- FastAPI Documentation: https://fastapi.tiangolo.com/
- SQLModel Documentation: https://sqlmodel.tiangolo.com/
- Neon PostgreSQL: https://neon.tech/docs/
- Constitution: `.specify/memory/constitution.md`

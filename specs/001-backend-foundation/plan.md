# Implementation Plan: Backend Foundation - Todo API

**Branch**: `001-backend-foundation` | **Date**: 2026-02-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-backend-foundation/spec.md`

---

## Summary

Build a RESTful API for Todo task management using FastAPI and SQLModel, persisting data to Neon PostgreSQL. The API provides 5 CRUD endpoints under `/api/tasks` with automatic Swagger UI documentation. User model is defined for future authentication (M2) but not actively used in this milestone.

---

## Technical Context

**Language/Version**: Python 3.11+
**Primary Dependencies**: FastAPI 0.109+, SQLModel 0.0.14+, psycopg2-binary 2.9+, uvicorn 0.27+, python-dotenv 1.0+
**Storage**: Neon PostgreSQL (via DATABASE_URL environment variable)
**Testing**: Manual validation via Swagger UI (/docs) for M1
**Target Platform**: Linux server (WSL2 development, cloud deployment ready)
**Project Type**: Web backend (API only for M1)
**Performance Goals**: <500ms response time, 10 concurrent requests
**Constraints**: Modular code structure, no authentication in M1, all tasks global
**Scale/Scope**: Development scale (~100 tasks, single user)

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| **Spec-Driven Development** | PASS | All implementation generated from spec via Claude Code |
| **Phase-Aware Evolution** | PASS | User model prepared for M2 auth; modular structure supports M3 frontend |
| **Type Safety** | PASS | SQLModel provides Pydantic validation; response models specified |
| **Security-First** | PASS | JWT auth planned for M2; database credentials via .env |
| **Agentic Workflow** | PASS | Using Spec-Kit Plus commands (/sp.specify → /sp.plan → /sp.tasks) |
| **Clean Architecture** | PASS | Separate layers: routes (API), models (data), core (infrastructure) |

**Key Standards Verification**:
- [x] Tech Stack: FastAPI + SQLModel + Neon PostgreSQL
- [x] Agentic Workflow: Spec-Kit Plus commands
- [x] Clean Architecture: app/routes/, app/models/, app/core/
- [x] Documentation: Docstrings planned for all modules

**Constraints Verification**:
- [x] No Manual Overrides: AI-generated code only
- [x] Environment Management: DATABASE_URL via .env
- [x] Resource Optimization: Minimal dependencies, focused scope

---

## Project Structure

### Documentation (this feature)

```text
specs/001-backend-foundation/
├── spec.md              # Feature specification
├── plan.md              # This file
├── research.md          # Technology decisions
├── data-model.md        # Entity definitions
├── quickstart.md        # Setup instructions
├── contracts/
│   └── openapi.yaml     # API contract
├── checklists/
│   └── requirements.md  # Spec quality checklist
└── tasks.md             # Implementation tasks (created by /sp.tasks)
```

### Source Code (repository root)

```text
backend/
├── app/
│   ├── __init__.py          # Package marker
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── core/
│   │   ├── __init__.py
│   │   └── db.py            # Engine, session dependency
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py        # Task, User, schemas
│   └── routes/
│       ├── __init__.py
│       └── tasks.py         # CRUD endpoints
├── requirements.txt         # Python dependencies
├── .env.example             # Environment template
└── README.md                # Backend documentation
```

**Structure Decision**: Web backend (Option 2 partial) - backend/ directory only for M1. Frontend/ will be added in Milestone 3.

---

## Architecture Decisions

### AD-1: Synchronous Database Driver

**Decision**: Use psycopg2-binary (synchronous)

**Rationale**: SQLModel's default sync engine is sufficient for M1's scope. Async adds complexity without benefit at current scale.

**Trade-offs**:
- Pro: Simpler code, easier debugging
- Con: No async performance gains
- Mitigation: Can migrate to asyncpg in M2 if needed

### AD-2: Nullable Foreign Key for User

**Decision**: Task.user_id is nullable (optional)

**Rationale**: Enables M1 to work without authentication while schema is ready for M2.

**Trade-offs**:
- Pro: No schema migration needed when auth added
- Con: Slightly more complex model
- Mitigation: Clear documentation that field is unused in M1

### AD-3: Auto-Table Creation

**Decision**: Use SQLModel.metadata.create_all() on startup

**Rationale**: Development speed for M1. Production would use Alembic migrations.

**Trade-offs**:
- Pro: Zero manual migration steps
- Con: Not suitable for production schema evolution
- Mitigation: Alembic can be added in M2

### AD-4: CORS Pre-Configuration

**Decision**: Enable CORS for localhost:3000

**Rationale**: Prevents integration issues when M3 frontend is added.

**Trade-offs**:
- Pro: Frontend integration will work immediately
- Con: Slight over-preparation
- Mitigation: Minimal code, easy to adjust

---

## Implementation Phases

### Phase 1: Project Setup
- Create directory structure
- Initialize Python virtual environment
- Install dependencies
- Configure .env with DATABASE_URL

### Phase 2: Database Layer
- Implement db.py with engine and session
- Define Task and User SQLModel classes
- Create table-creation logic in lifespan

### Phase 3: API Endpoints
- Implement POST /api/tasks (create)
- Implement GET /api/tasks (list all)
- Implement GET /api/tasks/{id} (get one)
- Implement PUT /api/tasks/{id} (update)
- Implement DELETE /api/tasks/{id} (delete)

### Phase 4: Documentation & Testing
- Configure Swagger UI
- Manual testing via /docs
- Verify all success criteria

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Neon connection issues | Medium | High | Test connection early, document troubleshooting |
| SQLModel version incompatibility | Low | Medium | Pin exact versions in requirements.txt |
| CORS misconfiguration | Low | Medium | Test with curl before frontend integration |

---

## Success Criteria Mapping

| Spec Criteria | Implementation Verification |
|---------------|----------------------------|
| SC-001: All 5 CRUD operations work | Test each endpoint in Swagger UI |
| SC-002: Data persists across restarts | Create task, restart server, verify task exists |
| SC-003: Error responses <500ms | Time error response in browser dev tools |
| SC-004: API docs accessible | Navigate to /docs, verify all endpoints shown |
| SC-005: 10 concurrent requests | Manual stress test (optional for M1) |
| SC-006: Data integrity | Create and immediately GET, compare data |

---

## Artifacts Generated

- [research.md](./research.md) - Technology decisions
- [data-model.md](./data-model.md) - Entity definitions
- [quickstart.md](./quickstart.md) - Setup guide
- [contracts/openapi.yaml](./contracts/openapi.yaml) - API specification

---

## Next Steps

1. Run `/sp.tasks` to generate implementation task list
2. Execute tasks in order following TDD approach
3. Validate against success criteria
4. Document any deviations in ADRs

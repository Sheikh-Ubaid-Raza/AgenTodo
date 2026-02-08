# Tasks: Backend Foundation - Todo API

**Input**: Design documents from `/specs/001-backend-foundation/`
**Prerequisites**: plan.md, spec.md, data-model.md, contracts/openapi.yaml

**Tests**: Not requested for M1 - manual validation via Swagger UI (/docs)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web backend**: `backend/app/` with `core/`, `models/`, `routes/`
- Structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend directory structure per plan.md: backend/app/core/, backend/app/models/, backend/app/routes/
- [x] T002 Create Python package marker files: backend/app/__init__.py, backend/app/core/__init__.py, backend/app/models/__init__.py, backend/app/routes/__init__.py
- [x] T003 Create requirements.txt with dependencies: fastapi>=0.109.0, sqlmodel>=0.0.14, psycopg2-binary>=2.9.9, uvicorn[standard]>=0.27.0, python-dotenv>=1.0.0 in backend/requirements.txt
- [x] T004 [P] Create .env.example with DATABASE_URL template in backend/.env.example
- [x] T005 [P] Create backend README with setup instructions in backend/README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**CRITICAL**: No user story work can begin until this phase is complete

- [x] T006 Implement database engine and session dependency in backend/app/core/db.py (uses DATABASE_URL from env)
- [x] T007 Define Task SQLModel table class with all fields (id, title, description, is_completed, created_at, user_id) in backend/app/models/models.py
- [x] T008 Define User SQLModel stub table class (id, email, name, created_at) in backend/app/models/models.py
- [x] T009 Define TaskCreate, TaskUpdate, TaskRead Pydantic schemas in backend/app/models/models.py
- [x] T010 Create FastAPI app with lifespan context manager for table creation in backend/app/main.py
- [x] T011 Configure CORS middleware for localhost:3000 in backend/app/main.py
- [x] T012 Create APIRouter for tasks in backend/app/routes/tasks.py (empty router, will add endpoints in user stories)
- [x] T013 Include tasks router in main app with /api prefix in backend/app/main.py

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Create a New Task (Priority: P1)

**Goal**: Allow API consumers to create new tasks via POST /api/tasks

**Independent Test**: POST request with {"title": "Test task"} returns 201 with generated id and created_at

### Implementation for User Story 1

- [x] T014 [US1] Implement POST /api/tasks endpoint in backend/app/routes/tasks.py (accepts TaskCreate, returns TaskRead with 201)
- [x] T015 [US1] Add database session dependency injection for create_task function in backend/app/routes/tasks.py
- [x] T016 [US1] Handle validation error (missing title) returning 422 in backend/app/routes/tasks.py

**Checkpoint**: Can create tasks via Swagger UI - verify with POST request

---

## Phase 4: User Story 2 - List All Tasks (Priority: P1)

**Goal**: Allow API consumers to retrieve all tasks via GET /api/tasks

**Independent Test**: GET /api/tasks returns 200 with array (empty or with tasks from US1)

### Implementation for User Story 2

- [x] T017 [US2] Implement GET /api/tasks endpoint in backend/app/routes/tasks.py (returns List[TaskRead] with 200)
- [x] T018 [US2] Add query to return tasks ordered by created_at descending in backend/app/routes/tasks.py

**Checkpoint**: Can list tasks via Swagger UI - verify empty array and with created tasks

---

## Phase 5: User Story 3 - Get Single Task by ID (Priority: P2)

**Goal**: Allow API consumers to retrieve a specific task via GET /api/tasks/{task_id}

**Independent Test**: GET /api/tasks/1 returns 200 with task details; GET /api/tasks/999 returns 404

### Implementation for User Story 3

- [x] T019 [US3] Implement GET /api/tasks/{task_id} endpoint in backend/app/routes/tasks.py (returns TaskRead with 200)
- [x] T020 [US3] Add 404 error handling when task not found in backend/app/routes/tasks.py (HTTPException with detail "Task not found")

**Checkpoint**: Can get single task and see 404 for invalid ID via Swagger UI

---

## Phase 6: User Story 4 - Update a Task (Priority: P2)

**Goal**: Allow API consumers to update task details via PUT /api/tasks/{task_id}

**Independent Test**: PUT /api/tasks/1 with {"is_completed": true} returns 200 with updated task

### Implementation for User Story 4

- [x] T021 [US4] Implement PUT /api/tasks/{task_id} endpoint in backend/app/routes/tasks.py (accepts TaskUpdate, returns TaskRead with 200)
- [x] T022 [US4] Add partial update logic (only update fields that are provided, exclude None) in backend/app/routes/tasks.py
- [x] T023 [US4] Add 404 error handling when task not found for update in backend/app/routes/tasks.py

**Checkpoint**: Can update tasks (title, description, is_completed) via Swagger UI

---

## Phase 7: User Story 5 - Delete a Task (Priority: P3)

**Goal**: Allow API consumers to delete tasks via DELETE /api/tasks/{task_id}

**Independent Test**: DELETE /api/tasks/1 returns 200 with success message; GET /api/tasks/1 then returns 404

### Implementation for User Story 5

- [x] T024 [US5] Implement DELETE /api/tasks/{task_id} endpoint in backend/app/routes/tasks.py (returns success message with 200)
- [x] T025 [US5] Add 404 error handling when task not found for delete in backend/app/routes/tasks.py

**Checkpoint**: Can delete tasks via Swagger UI and verify they're removed

---

## Phase 8: User Story 6 - API Documentation (Priority: P3)

**Goal**: Provide interactive API documentation via Swagger UI at /docs

**Independent Test**: Navigate to http://localhost:8000/docs and see all 5 CRUD endpoints documented

### Implementation for User Story 6

- [x] T026 [US6] Configure OpenAPI metadata (title, description, version) in backend/app/main.py
- [x] T027 [US6] Verify all endpoints have proper response_model annotations for Swagger generation in backend/app/routes/tasks.py
- [x] T028 [US6] Add docstrings to all endpoint functions for Swagger descriptions in backend/app/routes/tasks.py

**Checkpoint**: Swagger UI at /docs shows all endpoints with examples and can execute requests

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Final validation and improvements

- [x] T029 Add module docstrings to all Python files (main.py, db.py, models.py, tasks.py)
- [ ] T030 Test database persistence: create task, restart server, verify task exists
- [ ] T031 Test error responses: verify 404 and 422 return within 500ms
- [ ] T032 Test concurrent requests: send 10 simultaneous requests and verify no errors
- [ ] T033 Run full success criteria validation from spec.md (SC-001 through SC-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - start immediately
- **Foundational (Phase 2)**: Depends on Setup - BLOCKS all user stories
- **User Stories (Phases 3-8)**: All depend on Foundational phase completion
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **US1 (P1) Create**: Can start after Foundational - No dependencies on other stories
- **US2 (P1) List**: Can start after Foundational - Independent of US1
- **US3 (P2) Get One**: Can start after Foundational - Benefits from US1 for test data
- **US4 (P2) Update**: Can start after Foundational - Benefits from US1 for test data
- **US5 (P3) Delete**: Can start after Foundational - Benefits from US1 for test data
- **US6 (P3) Docs**: Can start after Foundational - Enhanced by all other stories

### Within Each User Story

- Implementation tasks should be completed in order
- Each story is independently completable and testable
- Commit after completing each story checkpoint

### Parallel Opportunities

**Setup Phase**:
- T004 and T005 can run in parallel (different files)

**Foundational Phase** (after T006 completes):
- T007, T008, T009 can run in parallel (same file but independent sections)
- T010, T011, T012, T013 are sequential (same main.py file)

**User Story Phases**:
- US1 and US2 can run in parallel (different endpoints, same file but additive)
- Once US1 complete: US3, US4, US5 can run in parallel (different endpoints)
- US6 can run after any story but benefits from all

---

## Parallel Example: Foundational Phase

```bash
# After T006 (db.py) completes, launch model tasks:
Task T007: "Define Task SQLModel table class in backend/app/models/models.py"
Task T008: "Define User SQLModel stub table class in backend/app/models/models.py"
Task T009: "Define TaskCreate, TaskUpdate, TaskRead schemas in backend/app/models/models.py"
```

---

## Implementation Strategy

### MVP First (User Stories 1 + 2 Only)

1. Complete Phase 1: Setup (T001-T005)
2. Complete Phase 2: Foundational (T006-T013)
3. Complete Phase 3: User Story 1 - Create (T014-T016)
4. Complete Phase 4: User Story 2 - List (T017-T018)
5. **STOP and VALIDATE**: Can create and list tasks via /docs
6. Deploy/demo if ready - basic CRUD working!

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test → Deploy (Create/List MVP!)
3. Add US3 + US4 → Test → Deploy (Full read/write)
4. Add US5 + US6 → Test → Deploy (Delete + Docs)
5. Polish → Final validation

---

## Summary

| Phase | Tasks | Purpose |
|-------|-------|---------|
| Setup | T001-T005 (5) | Project structure |
| Foundational | T006-T013 (8) | Database, models, app setup |
| US1 Create | T014-T016 (3) | POST /api/tasks |
| US2 List | T017-T018 (2) | GET /api/tasks |
| US3 Get One | T019-T020 (2) | GET /api/tasks/{id} |
| US4 Update | T021-T023 (3) | PUT /api/tasks/{id} |
| US5 Delete | T024-T025 (2) | DELETE /api/tasks/{id} |
| US6 Docs | T026-T028 (3) | Swagger UI |
| Polish | T029-T033 (5) | Validation |

**Total**: 33 tasks
**MVP Scope**: T001-T018 (18 tasks) = Setup + Foundation + Create + List

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Manual testing via Swagger UI (/docs) per M1 spec
- Commit after each story checkpoint
- Stop at any checkpoint to validate story independently

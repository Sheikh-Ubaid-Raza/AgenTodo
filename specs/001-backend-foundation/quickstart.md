# Quickstart: Backend Foundation - Todo API

**Feature**: 001-backend-foundation
**Date**: 2026-02-04

---

## Prerequisites

- Python 3.11+
- Neon PostgreSQL database (connection string ready)
- pip or uv package manager

---

## Setup Steps

### 1. Create Project Structure

```bash
mkdir -p backend/app/core backend/app/models backend/app/routes
touch backend/app/__init__.py
touch backend/app/core/__init__.py
touch backend/app/models/__init__.py
touch backend/app/routes/__init__.py
```

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install fastapi sqlmodel psycopg2-binary uvicorn python-dotenv
```

Or create `requirements.txt`:

```
fastapi>=0.109.0
sqlmodel>=0.0.14
psycopg2-binary>=2.9.9
uvicorn[standard]>=0.27.0
python-dotenv>=1.0.0
```

Then: `pip install -r requirements.txt`

### 4. Configure Environment

Create `backend/.env`:

```env
DATABASE_URL=postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
```

Create `backend/.env.example`:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname?sslmode=require
```

### 5. Run the Server

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### 6. Verify Installation

1. Open browser to http://localhost:8000/docs
2. Swagger UI should display with all endpoints
3. Test POST /api/tasks with sample data
4. Test GET /api/tasks to see created task

---

## File Overview

| File | Purpose |
|------|---------|
| `app/main.py` | FastAPI app, CORS, lifespan events |
| `app/core/db.py` | Database engine and session |
| `app/models/models.py` | SQLModel definitions (Task, User) |
| `app/routes/tasks.py` | CRUD endpoints for /api/tasks |

---

## Quick Verification Checklist

- [ ] Server starts without errors
- [ ] /docs loads Swagger UI
- [ ] POST /api/tasks creates a task (201)
- [ ] GET /api/tasks returns task list (200)
- [ ] GET /api/tasks/{id} returns single task (200)
- [ ] PUT /api/tasks/{id} updates task (200)
- [ ] DELETE /api/tasks/{id} removes task (200)
- [ ] Tasks persist after server restart

---

## Common Issues

### Database Connection Error

```
sqlalchemy.exc.OperationalError: could not connect to server
```

**Fix**: Check DATABASE_URL in .env, ensure Neon database is accessible.

### Module Not Found

```
ModuleNotFoundError: No module named 'app'
```

**Fix**: Run uvicorn from the `backend/` directory.

### Port Already in Use

```
ERROR: [Errno 98] Address already in use
```

**Fix**: Use different port: `uvicorn app.main:app --port 8001`

---

## Next Steps

After verification:
1. Run `/sp.tasks` to generate implementation tasks
2. Implement each task following TDD principles
3. Validate all success criteria from spec.md

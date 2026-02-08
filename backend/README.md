---
title: AgenTodo Backend
emoji: 🚀
colorFrom: blue
colorTo: gray
sdk: docker
pinned: false
app_port: 7860
---

# Backend - Todo API

FastAPI backend for the Todo application with SQLModel and Neon PostgreSQL.

## Setup

1. Create virtual environment:
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your Neon PostgreSQL connection string
   ```

4. Run the server:
   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

5. Access API documentation:
   - Swagger UI: http://localhost:8000/docs
   - ReDoc: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── core/
│   │   ├── __init__.py
│   │   └── db.py            # Database engine and session
│   ├── models/
│   │   ├── __init__.py
│   │   └── models.py        # SQLModel definitions
│   └── routes/
│       ├── __init__.py
│       └── tasks.py         # Task CRUD endpoints
├── requirements.txt
├── .env.example
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/tasks | Create a new task |
| GET | /api/tasks | List all tasks |
| GET | /api/tasks/{id} | Get a single task |
| PUT | /api/tasks/{id} | Update a task |
| DELETE | /api/tasks/{id} | Delete a task |

"""
FastAPI application entry point.

Configures the FastAPI app with CORS middleware, lifespan events
for database table creation, and includes API routers.
"""

import logging
from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response

from app.core.db import create_db_and_tables
from app.models.conversation import Conversation, Message  # noqa: F401
from app.routes import tasks
from app.api.routes import tasks as protected_tasks
from app.api.routes import auth
from app.api.routes import chat

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses."""

    async def dispatch(self, request: Request, call_next) -> Response:
        response = await call_next(request)
        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # Enable XSS filter
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        return response


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan context manager for startup and shutdown events.

    On startup: Creates database tables if they don't exist.
    On shutdown: Cleanup (currently none required).
    """
    # Startup: Create database tables
    create_db_and_tables()
    yield
    # Shutdown: Cleanup if needed


# Create FastAPI application
app = FastAPI(
    title="Todo API",
    description="RESTful API for Todo Application. Provides CRUD operations for task management.",
    version="1.0.0",
    lifespan=lifespan,
)

# Add security headers middleware
app.add_middleware(SecurityHeadersMiddleware)

# Configure CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://agentodo.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include auth routes with /api prefix
app.include_router(auth.router, prefix="/api")

# Include task routes with /api prefix
app.include_router(tasks.router, prefix="/api")

# Include protected task routes (requires JWT authentication)
app.include_router(protected_tasks.router, prefix="/api")

# Include chat routes (requires JWT authentication)
app.include_router(chat.router, prefix="/api")


@app.get("/", tags=["Root"])
async def root() -> dict:
    """Root endpoint returning API information."""
    return {
        "name": "Todo API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Health check endpoint for monitoring."""
    return {"status": "healthy api"}

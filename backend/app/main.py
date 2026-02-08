"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database.connection import create_db_and_tables
from app.api.routes.tasks import router as tasks_router
from app.api.routes.health import router as health_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan: initialize DB on startup."""
    await create_db_and_tables()
    yield


app = FastAPI(
    title="The Evolution of Todo - API",
    description="Phase II: Full-Stack Web Application Backend",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])

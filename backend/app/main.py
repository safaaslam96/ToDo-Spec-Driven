"""FastAPI application entry point."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware

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

# CORS middleware (must be added before other middleware)
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
if hasattr(settings, 'frontend_url') and settings.frontend_url:
    allowed_origins.append(settings.frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# GZip compression middleware (for performance)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Routes
app.include_router(health_router, prefix="/api", tags=["health"])
app.include_router(tasks_router, prefix="/api/tasks", tags=["tasks"])

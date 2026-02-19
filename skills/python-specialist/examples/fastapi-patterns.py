"""
FastAPI Patterns & Best Practices
Backend specialist reference for Phase II implementation
"""

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlmodel import Session, select
from typing import List, Optional
from pydantic import BaseModel

# ==============================================================================
# PATTERN 1: FastAPI Dependency Injection
# ==============================================================================

# ✅ GOOD: Use dependencies for reusable logic
security = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Extract and verify user ID from JWT token."""
    token = credentials.credentials
    # Verify JWT and extract user_id from 'sub' claim
    user_id = verify_jwt_token(token)  # Implementation in auth/jwt.py
    return user_id

async def get_db_session() -> Session:
    """Provide database session with automatic cleanup."""
    session = SessionLocal()
    try:
        yield session
    finally:
        session.close()

# Usage in route:
@app.get("/api/tasks")
async def get_tasks(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db_session)
):
    return db.exec(select(Task).where(Task.user_id == user_id)).all()


# ==============================================================================
# PATTERN 2: Request/Response Models (Pydantic v2)
# ==============================================================================

# ✅ GOOD: Separate input/output models
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"

    model_config = {
        "json_schema_extra": {
            "examples": [{
                "title": "Implement authentication",
                "description": "Add JWT auth to API",
                "priority": "high"
            }]
        }
    }

class TaskRead(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str
    completed: bool
    user_id: str
    created_at: str
    updated_at: str

# ❌ BAD: Using SQLModel for both DB and API (exposes internals)
# Don't return SQLModel table directly


# ==============================================================================
# PATTERN 3: Error Handling & Status Codes
# ==============================================================================

# ✅ GOOD: Use appropriate HTTP status codes
@app.post("/api/tasks", status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreate, user_id: str = Depends(get_current_user_id)):
    # Validation error: 400 Bad Request
    if not task.title.strip():
        raise HTTPException(status_code=400, detail="Title cannot be empty")

    # Success: 201 Created
    new_task = Task(**task.dict(), user_id=user_id)
    # ... save to DB
    return new_task

@app.get("/api/tasks/{task_id}")
async def get_task(task_id: int, user_id: str = Depends(get_current_user_id)):
    task = db.get(Task, task_id)

    # Not found: 404
    if not task:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    # Forbidden (not owned by user): Return 404 (prevents enumeration)
    if task.user_id != user_id:
        raise HTTPException(status_code=404, detail=f"Task {task_id} not found")

    return task

@app.delete("/api/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(task_id: int, user_id: str = Depends(get_current_user_id)):
    # Success with no content: 204
    # ... delete logic
    return None  # FastAPI returns 204 automatically


# ==============================================================================
# PATTERN 4: User Isolation (CRITICAL FOR MULTI-USER)
# ==============================================================================

# ✅ GOOD: Always filter by user_id from JWT
@app.get("/api/tasks")
async def list_tasks(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db_session)
):
    # ALWAYS filter by user_id - NEVER trust client input
    tasks = db.exec(
        select(Task).where(Task.user_id == user_id)
    ).all()
    return tasks

# ❌ BAD: Using user_id from path/query parameter (security vulnerability!)
@app.get("/api/{user_id}/tasks")  # DON'T DO THIS
async def list_tasks_bad(user_id: str):  # Client can forge user_id!
    tasks = db.exec(select(Task).where(Task.user_id == user_id)).all()
    return tasks


# ==============================================================================
# PATTERN 5: Async/Await for Database Operations
# ==============================================================================

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession

# ✅ GOOD: Use async engine for non-blocking I/O
engine = create_async_engine(DATABASE_URL, echo=True)

async def get_async_session():
    async with AsyncSession(engine) as session:
        yield session

@app.get("/api/tasks")
async def get_tasks(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_async_session)
):
    result = await session.execute(
        select(Task).where(Task.user_id == user_id)
    )
    return result.scalars().all()


# ==============================================================================
# PATTERN 6: CORS Configuration
# ==============================================================================

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# ✅ GOOD: Specific origins in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ❌ BAD: Allow all origins in production (security risk!)
# allow_origins=["*"]  # DON'T DO THIS IN PRODUCTION


# ==============================================================================
# PATTERN 7: Startup/Shutdown Events
# ==============================================================================

@app.on_event("startup")
async def startup_event():
    """Create database tables on startup."""
    await create_db_and_tables()
    print("Database initialized")

@app.on_event("shutdown")
async def shutdown_event():
    """Clean up resources."""
    await engine.dispose()
    print("Database connection closed")


# ==============================================================================
# PATTERN 8: API Versioning & Health Check
# ==============================================================================

@app.get("/api/health")
async def health_check():
    """Health endpoint for monitoring."""
    return {
        "status": "healthy",
        "version": "2.0.0",
        "database": "connected"
    }

# ✅ GOOD: Version API routes if needed
from fastapi import APIRouter

api_v1 = APIRouter(prefix="/api/v1")

@api_v1.get("/tasks")
async def get_tasks_v1():
    # Version 1 implementation
    pass

app.include_router(api_v1)


# ==============================================================================
# PATTERN 9: Input Validation with Pydantic
# ==============================================================================

from pydantic import validator, field_validator
from enum import Enum

class Priority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"

class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    priority: Priority = Priority.MEDIUM

    @field_validator('title')
    @classmethod
    def title_must_not_be_empty(cls, v: str) -> str:
        if not v or not v.strip():
            raise ValueError('Title cannot be empty')
        if len(v) > 255:
            raise ValueError('Title too long (max 255 characters)')
        return v.strip()


# ==============================================================================
# PATTERN 10: Router Organization
# ==============================================================================

# ✅ GOOD: Organize routes in separate files
# File: app/api/routes/tasks.py

from fastapi import APIRouter

router = APIRouter(prefix="/api/tasks", tags=["tasks"])

@router.get("/")
async def list_tasks():
    pass

@router.post("/")
async def create_task():
    pass

# File: app/main.py
from app.api.routes import tasks

app.include_router(tasks.router)


# ==============================================================================
# KEY TAKEAWAYS
# ==============================================================================

"""
1. ✅ Use Depends() for user_id extraction (never trust client input)
2. ✅ Return 404 for unauthorized access (prevents user enumeration)
3. ✅ Use async/await throughout for database operations
4. ✅ Separate input/output models (don't expose SQLModel tables)
5. ✅ Use appropriate HTTP status codes (201, 204, 400, 401, 404)
6. ✅ Configure CORS with specific origins
7. ✅ Always filter queries by user_id from JWT
8. ✅ Use Pydantic validators for input validation
9. ✅ Organize routes in separate router files
10. ✅ Include health check endpoint for monitoring
"""

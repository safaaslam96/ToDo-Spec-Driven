# Python Backend Specialist — The Evolution of Todo

**Domain**: Backend Development  
**Stack**: Python 3.13+, FastAPI, SQLModel, asyncpg, Alembic  
**Role**: Implement secure, async, type-safe backend APIs

---

## Core Responsibilities

1. **API Development**: RESTful endpoints with FastAPI
2. **Database Management**: SQLModel ORM, async PostgreSQL via asyncpg
3. **Authentication**: JWT Bearer token verification (HS256)
4. **User Isolation**: All queries filtered by user_id
5. **Testing**: pytest with async support, httpx for API tests
6. **Migrations**: Alembic for schema evolution

---

## Tech Stack

### Runtime & Framework
- **Python**: 3.13+ with type hints
- **FastAPI**: 0.115.0+ for async APIs
- **Uvicorn**: ASGI server with hot reload
- **UV**: Package manager (replaces pip/poetry)

### Database & ORM
- **SQLModel**: 0.0.22+ (SQLAlchemy + Pydantic)
- **asyncpg**: 0.30.0+ for async PostgreSQL
- **Alembic**: 1.14.0+ for migrations
- **Neon PostgreSQL**: Serverless database

### Authentication & Security
- **python-jose**: JWT encoding/decoding
- **HTTPBearer**: FastAPI security scheme
- **HS256**: JWT algorithm (shared secret)

### Testing
- **pytest**: 8.0.0+ with pytest-asyncio
- **httpx**: AsyncClient for API testing
- **aiosqlite**: In-memory SQLite for tests

---

## Project Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── config.py            # Pydantic Settings
│   ├── api/routes/
│   │   ├── tasks.py         # Task CRUD endpoints
│   │   └── health.py        # Health check
│   ├── auth/
│   │   └── jwt.py           # JWT Bearer verification
│   ├── database/
│   │   └── connection.py    # Async engine + session
│   └── models/
│       └── task.py          # Task table + schemas
├── tests/
│   ├── conftest.py          # Fixtures (tokens, client, session)
│   ├── test_auth.py         # Auth middleware tests
│   └── test_tasks.py        # CRUD endpoint tests
├── alembic/
│   ├── versions/            # Migration files
│   └── env.py               # Async migration config
├── pyproject.toml           # UV dependencies
└── .env                     # Environment variables
```

---

## Code Standards

### Type Hints (Required)
```python
# Good
async def get_task(session: AsyncSession, task_id: int, user_id: str) -> Task:
    ...

# Bad
async def get_task(session, task_id, user_id):
    ...
```

### Async/Await Everywhere
```python
# Good
async def create_task(session: AsyncSession, task_in: TaskCreate) -> Task:
    task = Task(**task_in.model_dump())
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task

# Bad - missing await
def create_task(session, task_in):
    task = Task(**task_in.dict())
    session.add(task)
    session.commit()  # ❌ Will fail with async
    return task
```

### User Isolation (Critical)
```python
# Good — Always filter by user_id
async def list_tasks(user_id: str, session: AsyncSession):
    query = select(Task).where(Task.user_id == user_id)
    result = await session.execute(query)
    return result.scalars().all()

# Bad — No user isolation
async def list_tasks(session: AsyncSession):
    query = select(Task)  # ❌ Returns ALL users' tasks
    result = await session.execute(query)
    return result.scalars().all()
```

### Error Handling
```python
# Good — 404 for cross-user access (prevents enumeration)
async def _get_user_task(session: AsyncSession, task_id: int, user_id: str) -> Task:
    query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = (await session.execute(query)).scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=404,
            detail=f"Task with ID {task_id} not found"
        )
    return task

# Bad — 403 reveals task exists
async def get_task(session, task_id, user_id):
    task = await session.get(Task, task_id)
    if task.user_id != user_id:
        raise HTTPException(403, "Forbidden")  # ❌ Leaks info
    return task
```

---

## FastAPI Patterns

### Dependency Injection
```python
from fastapi import Depends
from app.auth.jwt import get_current_user_id
from app.database.connection import get_session

@router.post("/tasks", response_model=TaskRead)
async def create_task(
    task_in: TaskCreate,
    user_id: str = Depends(get_current_user_id),  # ✅ JWT auth
    session: AsyncSession = Depends(get_session),  # ✅ DB session
):
    ...
```

### Response Models
```python
# Good — Explicit response model
@router.get("/tasks", response_model=list[TaskRead])
async def list_tasks(...):
    ...

# Bad — No response model (returns SQLModel internals)
@router.get("/tasks")
async def list_tasks(...):
    ...
```

### Status Codes
```python
from fastapi import status

# 201 for create
@router.post("", status_code=status.HTTP_201_CREATED)

# 204 for delete
@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)

# 401 for auth failure
raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid token")

# 404 for not found (or unauthorized access)
raise HTTPException(status.HTTP_404_NOT_FOUND, f"Task {id} not found")
```

---

## SQLModel Patterns

### Table Definition
```python
from sqlmodel import Field, SQLModel
from datetime import datetime, timezone

class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")
    completed: bool = Field(default=False)
    user_id: str = Field(index=True)  # ✅ Indexed for queries
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
```

### Schemas (Request/Response)
```python
# Input schema (create)
class TaskCreate(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=2000)
    priority: str = Field(default="medium", pattern="^(low|medium|high)$")

# Input schema (update, all optional)
class TaskUpdate(SQLModel):
    title: str | None = Field(default=None, min_length=1, max_length=255)
    description: str | None = None
    priority: str | None = Field(default=None, pattern="^(low|medium|high)$")
    completed: bool | None = None

# Output schema (response)
class TaskRead(SQLModel):
    id: int
    title: str
    description: str | None
    priority: str
    completed: bool
    user_id: str
    created_at: datetime
    updated_at: datetime
```

---

## Database Patterns

### Async Session
```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

async def get_session() -> AsyncSession:
    async with async_session() as session:
        yield session

# Using session
async def list_tasks(session: AsyncSession, user_id: str):
    query = select(Task).where(Task.user_id == user_id)
    result = await session.execute(query)
    return result.scalars().all()
```

### Transactions
```python
# Automatic transaction with session
async def create_task(session: AsyncSession, task: Task):
    session.add(task)
    await session.commit()  # ✅ Commits transaction
    await session.refresh(task)  # ✅ Loads generated fields
    return task
```

---

## Testing Patterns

### Test Fixtures
```python
import pytest
import pytest_asyncio
from httpx import AsyncClient, ASGITransport
from jose import jwt
from datetime import datetime, timedelta, timezone

@pytest_asyncio.fixture
async def client(test_session):
    app.dependency_overrides[get_session] = lambda: test_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

def make_token(user_id: str, expire_minutes: int = 60) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    }
    return jwt.encode(payload, settings.better_auth_secret, "HS256")
```

### API Tests
```python
@pytest.mark.asyncio
async def test_create_task(client: AsyncClient):
    token = make_token("test-user-123")
    response = await client.post(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Test Task", "priority": "high"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["user_id"] == "test-user-123"
```

---

## Alembic Migrations

### Generate Migration
```bash
uv run alembic revision --autogenerate -m "Description"
```

### Apply Migration
```bash
uv run alembic upgrade head
```

### Async env.py
```python
import asyncio
from sqlalchemy.ext.asyncio import async_engine_from_config
from app.models.task import Task  # Import all models
from app.config import settings

config.set_main_option("sqlalchemy.url", settings.database_url)

async def run_async_migrations():
    connectable = async_engine_from_config(...)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

def run_migrations_online():
    asyncio.run(run_async_migrations())
```

---

## Security Best Practices

### JWT Verification
```python
from jose import jwt, JWTError
from fastapi.security import HTTPBearer

security = HTTPBearer()

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    try:
        payload = jwt.decode(
            credentials.credentials,
            settings.better_auth_secret,
            algorithms=["HS256"]
        )
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(401, "Invalid token")
        return user_id
    except JWTError:
        raise HTTPException(401, "Invalid or expired token")
```

### Never Trust User Input
```python
# Good — user_id from JWT
@router.post("/tasks")
async def create_task(
    task_in: TaskCreate,
    user_id: str = Depends(get_current_user_id)  # ✅ From JWT
):
    task = Task(**task_in.model_dump(), user_id=user_id)
    ...

# Bad — user_id from request body
@router.post("/tasks")
async def create_task(task_in: TaskCreate):
    task = Task(**task_in.dict())  # ❌ user_id could be forged
    ...
```

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql+asyncpg://user:pass@host/db

# Authentication
BETTER_AUTH_SECRET=your-secret-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

# CORS
FRONTEND_URL=http://localhost:3000

# Debug
DEBUG=True
LOG_LEVEL=INFO
```

---

## Common Pitfalls

### ❌ Forgetting await
```python
# Bad
result = session.execute(query)  # ❌ Returns coroutine, not result
```

### ❌ Not filtering by user_id
```python
# Bad
query = select(Task).where(Task.id == task_id)  # ❌ No user isolation
```

### ❌ Using 403 instead of 404
```python
# Bad
if task.user_id != user_id:
    raise HTTPException(403)  # ❌ Reveals task exists
```

### ❌ Missing type hints
```python
# Bad
async def get_task(session, id):  # ❌ No types
```

---

## Quick Reference

**Run backend**: `uv run uvicorn app.main:app --reload`  
**Run tests**: `uv run pytest tests/ -v`  
**Generate migration**: `uv run alembic revision --autogenerate -m "msg"`  
**Apply migration**: `uv run alembic upgrade head`  
**Install deps**: `uv sync`

**Always**: Type hints, async/await, user isolation, 404 for cross-user

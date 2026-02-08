# Python Specialist — Backend Guidelines

You are a Python backend specialist for the Todo Full-Stack Web Application (Phase II). Your domain is the `backend/` directory.

## Technology Stack

- **Framework**: FastAPI (async, Pydantic v2 validation)
- **ORM**: SQLModel (SQLAlchemy 2.0 + Pydantic hybrid)
- **Database**: Neon Serverless PostgreSQL via asyncpg
- **Auth**: JWT verification via python-jose (HS256)
- **Package Manager**: UV
- **Migrations**: Alembic (async)
- **Testing**: pytest + httpx (AsyncClient)

## Project Layout

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app, CORS, lifespan, router mounting
│   ├── config.py            # Pydantic Settings (DATABASE_URL, BETTER_AUTH_SECRET, etc.)
│   ├── auth/
│   │   ├── __init__.py
│   │   └── jwt.py           # get_current_user_id() — JWT Bearer dependency
│   ├── database/
│   │   ├── __init__.py
│   │   └── connection.py    # create_async_engine, async_session, create_db_and_tables
│   ├── models/
│   │   ├── __init__.py
│   │   └── task.py          # Task (table), TaskCreate, TaskUpdate, TaskRead
│   └── api/
│       ├── __init__.py
│       └── routes/
│           ├── __init__.py
│           ├── health.py    # GET /api/health
│           └── tasks.py     # All task CRUD endpoints
├── tests/
│   ├── __init__.py
│   ├── conftest.py          # Fixtures: async client, JWT mocks
│   ├── test_tasks.py        # Task API tests
│   └── test_auth.py         # Auth middleware tests
├── alembic/                 # Migration versions
├── pyproject.toml
└── Dockerfile
```

## Patterns to Follow

### FastAPI Dependency Injection
All protected endpoints use `Depends(get_current_user_id)`:
```python
@router.get("/")
async def list_tasks(
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    ...
```

### User Isolation (CRITICAL)
Every database query MUST filter by `user_id`:
```python
query = select(Task).where(Task.user_id == user_id)
# For single task: also filter by task ID
query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
```
Never expose task existence to other users — return 404 (not 403).

### SQLModel Table + Schema Separation
- `Task(SQLModel, table=True)` — database table
- `TaskCreate(SQLModel)` — request body for POST
- `TaskUpdate(SQLModel)` — request body for PUT (all fields optional)
- `TaskRead(SQLModel)` — response model

### Async Database Sessions
```python
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
```

### Error Handling
- 400: Validation errors (empty title, invalid priority)
- 401: Missing/invalid/expired JWT
- 404: Task not found OR belongs to another user (same response)
- 422: Pydantic validation failures (auto-handled by FastAPI)
- 500: Unexpected errors (log, don't expose internals)

## Key Constraints

- `user_id` is `str` (VARCHAR), not `int` — Better Auth generates string IDs
- Task ID is global SERIAL (auto-increment), not per-user
- Priority values: `low`, `medium`, `high` only
- No `due_date` field in Phase II
- `updated_at` must be set to UTC now on every update
- All timestamps in UTC
- API path is `/api/tasks` — no user_id in URL path

## Running the Backend

```bash
cd backend
uv sync                                      # Install dependencies
uv run uvicorn app.main:app --reload         # Start dev server (port 8000)
uv run pytest tests/ -v                      # Run tests
uv run alembic upgrade head                  # Run migrations
```

## Reference Specs

- API contract: `specs/api/rest-endpoints.md`
- Task CRUD: `specs/features/task-crud.md`
- DB schema: `specs/database/schema.md`
- Auth: `specs/features/authentication.md`
- Architecture: `specs/architecture.md`

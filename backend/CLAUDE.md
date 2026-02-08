# Backend Guidelines — The Evolution of Todo

## Stack
- **Runtime**: Python 3.13+
- **Framework**: FastAPI with async/await
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Database**: Neon Serverless PostgreSQL via asyncpg
- **Auth**: JWT verification of Better Auth tokens
- **Package Manager**: UV

## Project Layout

```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, lifespan
│   ├── config.py             # Pydantic Settings from .env
│   ├── api/routes/
│   │   ├── tasks.py          # Task CRUD endpoints
│   │   └── health.py         # Health check
│   ├── auth/
│   │   └── jwt.py            # JWT Bearer verification
│   ├── database/
│   │   └── connection.py     # Async engine + session
│   └── models/
│       └── task.py           # Task table + schemas
├── tests/
├── pyproject.toml
└── .env.example
```

## Running Locally

```bash
cd backend
uv sync
cp .env.example .env   # Fill in DATABASE_URL and BETTER_AUTH_SECRET
uv run uvicorn app.main:app --reload --port 8000
```

API docs available at `http://localhost:8000/docs` (Swagger) and `/redoc`.

## Code Standards

### Authentication
- Every route that touches user data MUST depend on `get_current_user_id`.
- Never trust user-supplied user IDs — always extract from JWT `sub` claim.
- Use `HTTPBearer` security scheme (not custom headers).

### User Isolation
- ALL database queries MUST filter by `user_id` from the JWT.
- Helper `_get_user_task()` enforces isolation — use it for single-task lookups.
- Return 404 (not 403) when a task belongs to another user — prevents enumeration.

### Database
- Use async sessions everywhere (`AsyncSession`).
- SQLModel for table definitions; Pydantic models for request/response.
- Separate schemas: `TaskCreate` (input), `TaskUpdate` (partial), `TaskRead` (output).
- Always set `updated_at` on mutations.

### Error Handling
- Use `HTTPException` with appropriate status codes.
- 400: Validation errors. 401: Auth failures. 404: Not found (or unauthorized access). 500: Server errors.
- Never expose internal details (stack traces, SQL) in error responses.

### Testing
```bash
uv run pytest tests/
```
- Use `httpx.AsyncClient` with `app` for integration tests.
- Mock database sessions for unit tests.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Yes | Shared secret for JWT verification |
| `JWT_ALGORITHM` | No | Default: HS256 |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | Default: 60 |
| `FRONTEND_URL` | No | Default: http://localhost:3000 |
| `DEBUG` | No | Default: False |

## Constitution Reference

See `../.specify/memory/constitution.md` for project principles (v2.0.0).
Specs: `../specs/api/rest-endpoints.md`, `../specs/features/task-crud.md`.

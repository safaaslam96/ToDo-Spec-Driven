# Python Backend Specialist — Best Practices

## Core Principles

### 1. Security First
- ✅ **ALWAYS** extract `user_id` from JWT token (via `Depends(get_current_user_id)`)
- ❌ **NEVER** trust `user_id` from path params, query params, or request body
- ✅ Filter ALL database queries by authenticated `user_id`
- ✅ Return 404 for both "not found" and "not yours" (prevents user enumeration)
- ✅ Validate all input using Pydantic models with validators
- ✅ Use environment variables for secrets (never hardcode)

### 2. User Isolation (CRITICAL)
```python
# ✅ GOOD: User isolation enforced
@app.get("/api/tasks")
async def get_tasks(user_id: str = Depends(get_current_user_id)):
    return db.exec(select(Task).where(Task.user_id == user_id)).all()

# ❌ BAD: Security vulnerability
@app.get("/api/{user_id}/tasks")  # Client can forge user_id!
async def get_tasks(user_id: str):
    return db.exec(select(Task).where(Task.user_id == user_id)).all()
```

### 3. Async/Await Throughout
- ✅ Use `async def` for all route handlers
- ✅ Use `AsyncSession` for database operations
- ✅ Use `await` for all I/O operations
- ✅ Configure async engine: `create_async_engine()`
- ❌ Don't mix sync and async code

### 4. Proper HTTP Status Codes
- `200 OK` — Successful GET/PUT
- `201 Created` — Successful POST (new resource)
- `204 No Content` — Successful DELETE
- `400 Bad Request` — Validation error
- `401 Unauthorized` — Missing/invalid token
- `404 Not Found` — Resource not found OR not owned by user
- `500 Internal Server Error` — Unexpected errors (never expose stack traces)

### 5. Database Best Practices
- ✅ Use SQLModel for type-safe ORM
- ✅ Add indexes on frequently queried columns (`user_id`, composite indexes)
- ✅ Include timestamps (`created_at`, `updated_at`) on all tables
- ✅ Use `Field()` for constraints (max_length, nullable, default)
- ✅ Use transactions (commit/rollback) for data integrity
- ✅ Refresh objects after commit to get auto-generated fields
- ✅ Enable connection pooling for performance

### 6. FastAPI Dependency Injection
```python
# ✅ GOOD: Reusable dependencies
async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    # Verify JWT and extract user_id
    return verify_jwt(credentials.credentials)

async def get_db_session():
    session = SessionLocal()
    try:
        yield session
    finally:
        await session.close()

# Use in routes:
@app.get("/api/tasks")
async def get_tasks(
    user_id: str = Depends(get_current_user_id),
    db: Session = Depends(get_db_session)
):
    return fetch_tasks(user_id, db)
```

### 7. Input Validation
- ✅ Use Pydantic models for all request bodies
- ✅ Add field validators for custom validation logic
- ✅ Use enums for constrained choices (priority, status)
- ✅ Validate max lengths (e.g., title max 255 chars)
- ✅ Strip whitespace from strings
- ❌ Never pass unvalidated data to database

### 8. Error Handling
- ✅ Use HTTPException for expected errors
- ✅ Generic error messages (don't leak internal details)
- ✅ Log errors for debugging (but don't return stack traces)
- ✅ Use middleware for global error handling
- ✅ Return consistent error format

### 9. Code Organization
```
backend/
├── app/
│   ├── main.py              # FastAPI app, CORS, startup
│   ├── config.py            # Settings from environment
│   ├── auth/
│   │   └── jwt.py           # JWT verification
│   ├── database/
│   │   └── connection.py    # Async engine, session
│   ├── models/
│   │   └── task.py          # SQLModel tables + schemas
│   └── api/routes/
│       ├── health.py        # Health check
│       └── tasks.py         # CRUD endpoints
├── tests/
│   ├── conftest.py          # Test fixtures
│   └── test_tasks.py        # API tests
└── pyproject.toml
```

### 10. Testing
- ✅ Use pytest with async support (`pytest-asyncio`)
- ✅ Use `httpx.AsyncClient` for API tests
- ✅ Create test fixtures for database and authentication
- ✅ Test user isolation (verify users can't access other users' data)
- ✅ Test all error cases (401, 404, 400)
- ✅ Aim for >80% code coverage

## Common Mistakes to Avoid

❌ **DON'T** trust user_id from client (path/query/body)
❌ **DON'T** return different errors for "not found" vs "not yours" (enumeration risk)
❌ **DON'T** hardcode secrets (use environment variables)
❌ **DON'T** expose stack traces in production
❌ **DON'T** forget to close database sessions
❌ **DON'T** use blocking I/O in async routes
❌ **DON'T** allow CORS from "*" in production
❌ **DON'T** skip input validation
❌ **DON'T** forget to add indexes on foreign keys
❌ **DON'T** mix SQLModel table models with API response models

## Quick Checklist

Before deploying:
- [ ] All routes use `async def`
- [ ] All database operations use `AsyncSession`
- [ ] All protected routes use `Depends(get_current_user_id)`
- [ ] All queries filter by `user_id`
- [ ] Indexes added on `user_id` and composite columns
- [ ] CORS configured with specific origins
- [ ] Environment variables loaded from `.env`
- [ ] Health check endpoint exists
- [ ] Error responses don't leak internal details
- [ ] Tests pass with >80% coverage
- [ ] JWT secret is secure and not committed to git
- [ ] Database connection pooling configured

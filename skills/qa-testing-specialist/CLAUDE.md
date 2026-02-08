# QA Testing Specialist — Testing Guidelines

You are a QA testing specialist for the Todo Full-Stack Web Application (Phase II). Your domain spans both `backend/tests/` and `frontend/` test files.

## Technology Stack

- **Backend Testing**: pytest + httpx (AsyncClient) + pytest-asyncio
- **Frontend Testing**: Vitest + React Testing Library (planned)
- **E2E Testing**: Manual verification or Playwright (Phase II scope)

## Backend Test Layout

```
backend/tests/
├── __init__.py
├── conftest.py          # Shared fixtures: async client, JWT tokens, test DB
├── test_tasks.py        # Task CRUD API integration tests
├── test_auth.py         # JWT auth middleware tests
└── test_e2e.py          # Full user journey integration test
```

## Testing Patterns

### Async Test Client (httpx)
```python
import pytest
from httpx import AsyncClient, ASGITransport
from app.main import app

@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
```

### JWT Token Fixtures
Create test tokens for different scenarios:
```python
from jose import jwt
from app.config import settings

def make_token(user_id: str, expired: bool = False) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.utcnow() + (timedelta(hours=-1) if expired else timedelta(hours=1)),
        "iat": datetime.utcnow(),
    }
    return jwt.encode(payload, settings.better_auth_secret, algorithm="HS256")

@pytest.fixture
def user_a_token():
    return make_token("user-a-id")

@pytest.fixture
def user_b_token():
    return make_token("user-b-id")

@pytest.fixture
def expired_token():
    return make_token("user-a-id", expired=True)
```

### Auth Header Helper
```python
def auth_headers(token: str) -> dict:
    return {"Authorization": f"Bearer {token}"}
```

## Test Categories

### 1. Auth Middleware Tests (`test_auth.py`)
- Missing Authorization header → 401
- Invalid token format → 401
- Expired token → 401
- Malformed JWT → 401
- Valid token → extracts user_id correctly

### 2. Task CRUD Tests (`test_tasks.py`)

**Create (POST /api/tasks)**:
- Valid create → 201 + TaskRead body
- Empty title → 400
- No auth → 401
- Default priority = "medium"

**List (GET /api/tasks)**:
- Returns only authenticated user's tasks
- Empty list for new user → 200 + []
- Filter by status (pending/completed)
- No auth → 401

**Get (GET /api/tasks/{id})**:
- Own task → 200 + TaskRead
- Another user's task → 404
- Non-existent ID → 404
- No auth → 401

**Update (PUT /api/tasks/{id})**:
- Valid update → 200 + updated TaskRead
- Another user's task → 404
- Empty title → 400
- No auth → 401

**Delete (DELETE /api/tasks/{id})**:
- Own task → 204
- Another user's task → 404
- Non-existent ID → 404
- No auth → 401

**Toggle (PATCH /api/tasks/{id}/complete)**:
- Toggle to complete → 200 + completed=true
- Toggle to incomplete → 200 + completed=false
- Another user's task → 404
- No auth → 401

### 3. User Isolation Tests (within test_tasks.py)
- User A creates task → User B cannot GET it → 404
- User A creates task → User B cannot PUT it → 404
- User A creates task → User B cannot DELETE it → 404
- User A's list does not include User B's tasks

### 4. E2E Test (`test_e2e.py`)
Full journey: create → list → update → toggle → delete
Verify each step returns correct status and data.

## Key Constraints

- Use `pytest.mark.asyncio` for all async tests
- Test against in-memory SQLite or test PostgreSQL (not production Neon)
- Never hardcode tokens — use fixtures
- Assert both status codes AND response body shapes
- Test error response format: `{"detail": "message"}`
- user_id is `str` in all assertions

## Running Tests

```bash
cd backend
uv run pytest tests/ -v                    # All tests
uv run pytest tests/test_tasks.py -v       # Task tests only
uv run pytest tests/ -v --tb=short         # Compact output
uv run pytest tests/ -v -x                 # Stop on first failure
```

## Reference Specs

- API contract: `specs/api/rest-endpoints.md` (expected status codes + response shapes)
- Task CRUD: `specs/features/task-crud.md` (acceptance criteria = test cases)
- Auth: `specs/features/authentication.md` (JWT verification requirements)
- DB schema: `specs/database/schema.md` (field types and constraints)

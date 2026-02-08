# QA Testing Specialist — The Evolution of Todo

**Domain**: Testing & Quality Assurance  
**Stack**: pytest, pytest-asyncio, httpx, playwright (future)  
**Role**: Ensure code quality through comprehensive testing

---

## Testing Strategy

### Test Pyramid
1. **Unit Tests** (60%): Pure functions, business logic
2. **Integration Tests** (30%): API endpoints, database operations
3. **E2E Tests** (10%): Full user workflows (Phase III+)

---

## Backend Testing (pytest)

### Test Structure
```python
tests/
├── conftest.py          # Fixtures (session, client, tokens)
├── test_auth.py         # JWT authentication tests
├── test_tasks.py        # CRUD endpoint tests
└── test_models.py       # SQLModel validation tests
```

### Fixtures
```python
@pytest_asyncio.fixture
async def client(test_session):
    app.dependency_overrides[get_session] = lambda: test_session
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()

def make_token(user_id: str, expire_minutes: int = 60) -> str:
    payload = {"sub": user_id, "exp": datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)}
    return jwt.encode(payload, settings.better_auth_secret, "HS256")
```

### Test Patterns
```python
@pytest.mark.asyncio
async def test_create_task(client: AsyncClient):
    token = make_token("user-123")
    response = await client.post(
        "/api/tasks",
        headers={"Authorization": f"Bearer {token}"},
        json={"title": "Test", "priority": "high"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test"
    assert data["user_id"] == "user-123"

@pytest.mark.asyncio
async def test_user_isolation(client: AsyncClient):
    # User A creates task
    token_a = make_token("user-a")
    res_a = await client.post("/api/tasks", headers={"Authorization": f"Bearer {token_a}"}, json={"title": "A's task"})
    task_id = res_a.json()["id"]
    
    # User B tries to access it
    token_b = make_token("user-b")
    res_b = await client.get(f"/api/tasks/{task_id}", headers={"Authorization": f"Bearer {token_b}"})
    assert res_b.status_code == 404  # ✅ Returns 404, not 403
```

---

## Frontend Testing (Future)

### Component Tests (Jest/Testing Library)
```typescript
import { render, fireEvent, waitFor } from "@testing-library/react";
import { TaskForm } from "@/components/tasks/TaskForm";

test("submits task with valid data", async () => {
  const onSubmit = jest.fn();
  const { getByLabelText, getByText } = render(
    <TaskForm isOpen={true} onClose={() => {}} onSubmit={onSubmit} mode="create" />
  );
  
  fireEvent.change(getByLabelText("Title"), { target: { value: "Test Task" } });
  fireEvent.click(getByText("Create Task"));
  
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalledWith({ title: "Test Task", priority: "medium" });
  });
});
```

### E2E Tests (Playwright - Phase III)
```typescript
import { test, expect } from "@playwright/test";

test("complete task workflow", async ({ page }) => {
  await page.goto("http://localhost:3000");
  await page.click('text=Sign In');
  await page.fill('input[name="user_id"]', 'test-user');
  await page.click('button:text("Sign In")');
  
  await expect(page).toHaveURL("/dashboard");
  await page.click('button:text("Create Task")');
  await page.fill('input[label="Title"]', 'New Task');
  await page.click('button:text("Create Task")');
  
  await expect(page.locator('text=New Task')).toBeVisible();
});
```

---

## Test Coverage Goals

- **Backend**: 80%+ line coverage
- **Critical paths**: 100% (auth, user isolation)
- **API endpoints**: All status codes tested
- **Error cases**: All error paths covered

---

## Running Tests

### Backend
```bash
cd backend
uv run pytest tests/ -v                  # All tests
uv run pytest tests/test_auth.py -v     # Auth tests only
uv run pytest tests/ --cov=app          # With coverage
```

### Frontend (Future)
```bash
cd frontend
npm test                                 # Unit tests
npm run test:e2e                        # E2E tests
npm run test:coverage                   # With coverage
```

---

## Quality Checklist

Before marking feature complete:
- [ ] All new endpoints have tests
- [ ] User isolation tested (404 for cross-user)
- [ ] Auth failure scenarios tested (401)
- [ ] Error cases tested (400, 500)
- [ ] Edge cases covered (empty lists, invalid data)
- [ ] No test warnings or deprecations
- [ ] All tests pass consistently
- [ ] Coverage meets goals (80%+)

---

## Quick Reference

**Run tests**: `uv run pytest tests/ -v`  
**Run with coverage**: `uv run pytest --cov=app tests/`  
**Run specific test**: `uv run pytest tests/test_auth.py::test_valid_token -v`

**Always test**: User isolation, auth failures, error cases, edge cases

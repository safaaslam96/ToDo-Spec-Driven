# QA Testing Specialist — Best Practices

## Testing Strategy

### 1. Test Pyramid
```
    /\
   /E2E\      10% - Full user flows
  /------\
 /  API   \   30% - API integration tests
/-----------\
| Unit Tests | 60% - Component/function tests
```

### 2. Coverage Goals
- ✅ Backend: >80% code coverage
- ✅ Frontend: >70% code coverage
- ✅ Critical paths: 100% coverage

## Backend Testing (pytest)

### Key Patterns
- ✅ Test user isolation (can't access other users' data)
- ✅ Test authentication (401 for invalid tokens)
- ✅ Test all CRUD operations
- ✅ Test error cases (404, 400, validation)
- ✅ Use fixtures for reusable setup

### Test Organization
```
tests/
├── conftest.py           # Shared fixtures
├── test_auth.py          # Auth middleware tests
├── test_tasks.py         # Task CRUD tests
└── test_analytics.py     # Analytics endpoint tests
```

## Frontend Testing

### Component Tests (Jest + React Testing Library)
- ✅ Test rendering with different props
- ✅ Test user interactions (click, type, submit)
- ✅ Test loading/error states
- ✅ Mock API calls with MSW

### E2E Tests (Cypress/Playwright)
- ✅ Test complete user flows (signup → login → create task)
- ✅ Test critical paths (task CRUD)
- ✅ Test across browsers (Chrome, Firefox, Safari)

## Test Best Practices

### 1. Arrange-Act-Assert Pattern
```python
# Arrange: Set up test data
task_data = {"title": "Test Task"}

# Act: Execute the action
response = await client.post("/api/tasks", json=task_data)

# Assert: Verify the result
assert response.status_code == 201
```

### 2. Test Names
- ✅ Descriptive: `test_user_cannot_delete_other_users_tasks`
- ❌ Vague: `test_delete`

### 3. Test Independence
- ✅ Each test runs independently
- ✅ Use fixtures for setup/teardown
- ❌ Tests should not depend on each other

### 4. Test Data
- ✅ Use factories or fixtures for test data
- ✅ Clean up after tests
- ❌ Don't use production data

## Error Handling Tests

### Critical Tests
- ✅ Missing authentication returns 401
- ✅ Invalid input returns 400 with details
- ✅ Not found returns 404
- ✅ Cross-user access returns 404 (not 403)
- ✅ Server errors return 500 without stack traces

## Quick Checklist

Before deploying:
- [ ] Unit tests pass (>80% coverage)
- [ ] Integration tests pass
- [ ] E2E tests pass for critical flows
- [ ] User isolation tested thoroughly
- [ ] Authentication tested (valid/invalid tokens)
- [ ] All error cases tested
- [ ] No flaky tests (tests pass consistently)
- [ ] CI/CD runs tests on every commit

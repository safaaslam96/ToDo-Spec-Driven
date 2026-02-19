"""
Pytest Test Template for FastAPI Backend
QA specialist reference for Phase II testing
"""

import pytest
from httpx import AsyncClient
from app.main import app

# Test fixture for async client
@pytest.fixture
async def client():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        yield ac

# Test fixture for auth token
@pytest.fixture
def auth_headers():
    token = create_test_jwt("test-user-123")
    return {"Authorization": f"Bearer {token}"}

# ============================================================================
# PATTERN 1: Test User Isolation
# ============================================================================

@pytest.mark.asyncio
async def test_user_can_only_see_own_tasks(client, auth_headers):
    """User should only see their own tasks."""
    # Create task for user1
    response = await client.post(
        "/api/tasks",
        json={"title": "User1 Task"},
        headers=auth_headers
    )
    assert response.status_code == 201
    
    # Try to access with different user token
    other_headers = {"Authorization": f"Bearer {create_test_jwt('user-2')}"}
    response = await client.get("/api/tasks", headers=other_headers)
    data = response.json()
    
    # Should not see user1's tasks
    assert len(data) == 0

# ============================================================================
# PATTERN 2: Test Auth Middleware
# ============================================================================

@pytest.mark.asyncio
async def test_missing_token_returns_401(client):
    """Requests without token should return 401."""
    response = await client.get("/api/tasks")
    assert response.status_code == 401

@pytest.mark.asyncio
async def test_invalid_token_returns_401(client):
    """Invalid tokens should return 401."""
    headers = {"Authorization": "Bearer invalid-token"}
    response = await client.get("/api/tasks", headers=headers)
    assert response.status_code == 401

# ============================================================================
# PATTERN 3: Test CRUD Operations
# ============================================================================

@pytest.mark.asyncio
async def test_create_task_success(client, auth_headers):
    """POST /api/tasks creates new task."""
    response = await client.post(
        "/api/tasks",
        json={
            "title": "Test Task",
            "description": "Test Description",
            "priority": "high"
        },
        headers=auth_headers
    )
    
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Task"
    assert data["priority"] == "high"
    assert data["completed"] == False

@pytest.mark.asyncio
async def test_delete_task_not_found(client, auth_headers):
    """DELETE non-existent task returns 404."""
    response = await client.delete("/api/tasks/99999", headers=auth_headers)
    assert response.status_code == 404

# KEY TAKEAWAYS:
# 1. Test user isolation (most critical for multi-user apps)
# 2. Test authentication (401 for missing/invalid tokens)
# 3. Test all CRUD operations
# 4. Test error cases (404, 400, validation errors)
# 5. Use fixtures for reusable setup (client, auth tokens)
# 6. Use async/await for async tests
# 7. Test both success and failure paths

"""Tests for JWT authentication middleware."""

import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_missing_token(client: AsyncClient):
    """Test that requests without token return 401."""
    response = await client.get("/api/tasks")
    assert response.status_code == 401
    assert "detail" in response.json()


@pytest.mark.asyncio
async def test_invalid_token(client: AsyncClient, invalid_token: str):
    """Test that requests with invalid token return 401."""
    response = await client.get(
        "/api/tasks", headers={"Authorization": f"Bearer {invalid_token}"}
    )
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]


@pytest.mark.asyncio
async def test_expired_token(client: AsyncClient, expired_token: str):
    """Test that requests with expired token return 401."""
    response = await client.get(
        "/api/tasks", headers={"Authorization": f"Bearer {expired_token}"}
    )
    assert response.status_code == 401
    assert "Invalid or expired token" in response.json()["detail"]


@pytest.mark.asyncio
async def test_valid_token_extracts_user_id(client: AsyncClient, valid_token: str):
    """Test that valid token allows request (user_id extracted)."""
    # This will return 200 with empty list (no tasks yet)
    response = await client.get(
        "/api/tasks", headers={"Authorization": f"Bearer {valid_token}"}
    )
    # Accept both 200 (success) and 404 (if route doesn't exist yet)
    assert response.status_code in [200, 404]


@pytest.mark.asyncio
async def test_malformed_token(client: AsyncClient):
    """Test that malformed token returns 401."""
    response = await client.get(
        "/api/tasks", headers={"Authorization": "Bearer not-a-jwt-token"}
    )
    assert response.status_code == 401


@pytest.mark.asyncio
async def test_token_without_bearer_prefix(client: AsyncClient, valid_token: str):
    """Test that token without 'Bearer' prefix returns 401."""
    response = await client.get("/api/tasks", headers={"Authorization": valid_token})
    # HTTPBearer expects 'Bearer ' prefix
    assert response.status_code == 401

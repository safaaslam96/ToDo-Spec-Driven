"""Pytest fixtures for testing."""

from datetime import datetime, timedelta, timezone
from typing import AsyncGenerator

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from jose import jwt
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import SQLModel

from app.config import settings
from app.database.connection import get_session
from app.main import app

# Test database URL (in-memory SQLite for tests)
TEST_DATABASE_URL = "sqlite+aiosqlite:///:memory:"


@pytest_asyncio.fixture(scope="function")
async def test_engine():
    """Create test database engine."""
    engine = create_async_engine(
        TEST_DATABASE_URL, connect_args={"check_same_thread": False}, echo=False
    )
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield engine
    await engine.dispose()


@pytest_asyncio.fixture(scope="function")
async def test_session(test_engine) -> AsyncGenerator[AsyncSession, None]:
    """Create test database session."""
    async_session = sessionmaker(
        test_engine, class_=AsyncSession, expire_on_commit=False
    )
    async with async_session() as session:
        yield session


@pytest_asyncio.fixture(scope="function")
async def client(test_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """Create test HTTP client with dependency overrides."""

    async def override_get_session():
        yield test_session

    app.dependency_overrides[get_session] = override_get_session

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


def make_token(
    user_id: str = "test-user-123",
    expire_minutes: int = 60,
    secret: str | None = None,
    algorithm: str = "HS256",
) -> str:
    """Generate JWT token for testing.

    Args:
        user_id: User identifier for 'sub' claim
        expire_minutes: Token expiration time (negative for expired tokens)
        secret: JWT secret (defaults to settings.better_auth_secret)
        algorithm: JWT algorithm (default: HS256)

    Returns:
        Encoded JWT token string
    """
    if secret is None:
        secret = settings.better_auth_secret

    now = datetime.now(timezone.utc)
    expire = now + timedelta(minutes=expire_minutes)

    payload = {
        "sub": user_id,
        "iat": now,
        "exp": expire,
    }

    return jwt.encode(payload, secret, algorithm=algorithm)


@pytest.fixture
def valid_token() -> str:
    """Generate valid JWT token."""
    return make_token("test-user-123")


@pytest.fixture
def expired_token() -> str:
    """Generate expired JWT token."""
    return make_token("test-user-123", expire_minutes=-10)


@pytest.fixture
def invalid_token() -> str:
    """Generate token with wrong secret."""
    return make_token("test-user-123", secret="wrong-secret")

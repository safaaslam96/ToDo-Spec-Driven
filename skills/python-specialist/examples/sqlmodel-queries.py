"""
SQLModel Query Patterns & Database Best Practices
Python specialist reference for Phase II database operations
"""

from sqlmodel import Field, SQLModel, Session, select, create_engine
from typing import Optional
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# ==============================================================================
# PATTERN 1: SQLModel Table Definition
# ==============================================================================

class Task(SQLModel, table=True):
    """
    Task model with proper field types and constraints.

    ✅ GOOD PRACTICES:
    - Use Field() for constraints and defaults
    - Add indexes on frequently queried columns
    - Include timestamps for audit trail
    - Use Optional[] for nullable fields
    """
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255, nullable=False)
    description: Optional[str] = Field(default=None)
    priority: str = Field(default="medium", max_length=20)
    completed: bool = Field(default=False)
    user_id: str = Field(nullable=False, index=True)  # ✅ Indexed for fast queries
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

# ❌ BAD: No indexes, no constraints, no defaults
class TaskBad(SQLModel, table=True):
    id: int
    title: str  # No max length
    user_id: str  # No index - slow queries!


# ==============================================================================
# PATTERN 2: Async Database Connection (Neon PostgreSQL)
# ==============================================================================

DATABASE_URL = "postgresql+asyncpg://user:pass@host/db"

# ✅ GOOD: Async engine for non-blocking operations
async_engine = create_async_engine(
    DATABASE_URL,
    echo=True,  # Log SQL (disable in production)
    future=True,
    pool_size=5,
    max_overflow=10
)

async_session_maker = sessionmaker(
    async_engine,
    class_=AsyncSession,
    expire_on_commit=False
)

async def create_db_and_tables():
    """Create all tables on startup."""
    async with async_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_async_session():
    """Dependency for FastAPI routes."""
    async with async_session_maker() as session:
        yield session


# ==============================================================================
# PATTERN 3: User-Isolated Queries (CRITICAL FOR MULTI-USER)
# ==============================================================================

async def get_user_tasks(user_id: str, session: AsyncSession) -> list[Task]:
    """
    ✅ GOOD: Always filter by user_id.
    This is THE MOST IMPORTANT pattern for multi-user apps.
    """
    result = await session.execute(
        select(Task).where(Task.user_id == user_id)
    )
    return result.scalars().all()

async def get_task_by_id(
    task_id: int,
    user_id: str,
    session: AsyncSession
) -> Optional[Task]:
    """
    ✅ GOOD: Filter by BOTH task_id AND user_id.
    Prevents users from accessing other users' tasks.
    """
    result = await session.execute(
        select(Task).where(
            Task.id == task_id,
            Task.user_id == user_id  # ✅ CRITICAL: User isolation
        )
    )
    return result.scalars().first()

# ❌ BAD: No user_id filter (security vulnerability!)
async def get_task_by_id_bad(task_id: int, session: AsyncSession):
    result = await session.execute(select(Task).where(Task.id == task_id))
    return result.scalars().first()  # Returns ANY user's task!


# ==============================================================================
# PATTERN 4: Filtering & Sorting Queries
# ==============================================================================

async def get_filtered_tasks(
    user_id: str,
    completed: Optional[bool] = None,
    priority: Optional[str] = None,
    sort_by: str = "created_at",
    session: AsyncSession = None
) -> list[Task]:
    """Query with dynamic filters and sorting."""

    # Start with user filter (ALWAYS required)
    query = select(Task).where(Task.user_id == user_id)

    # Add optional filters
    if completed is not None:
        query = query.where(Task.completed == completed)

    if priority:
        query = query.where(Task.priority == priority)

    # Add sorting
    if sort_by == "title":
        query = query.order_by(Task.title)
    elif sort_by == "priority":
        query = query.order_by(Task.priority)
    else:  # default: created_at
        query = query.order_by(Task.created_at.desc())

    result = await session.execute(query)
    return result.scalars().all()


# ==============================================================================
# PATTERN 5: Creating Records
# ==============================================================================

async def create_task(
    title: str,
    user_id: str,
    description: Optional[str] = None,
    priority: str = "medium",
    session: AsyncSession = None
) -> Task:
    """
    ✅ GOOD: Set user_id from authenticated user, not client input.
    """
    task = Task(
        title=title,
        description=description,
        priority=priority,
        user_id=user_id,  # From JWT, not client!
        completed=False
    )

    session.add(task)
    await session.commit()
    await session.refresh(task)  # Get auto-generated fields (id, created_at)

    return task


# ==============================================================================
# PATTERN 6: Updating Records
# ==============================================================================

async def update_task(
    task_id: int,
    user_id: str,
    updates: dict,
    session: AsyncSession
) -> Optional[Task]:
    """
    ✅ GOOD: Partial updates with user isolation.
    """
    # Get task with user isolation
    task = await get_task_by_id(task_id, user_id, session)

    if not task:
        return None  # Not found or not owned by user

    # Apply updates
    for key, value in updates.items():
        if hasattr(task, key):
            setattr(task, key, value)

    task.updated_at = datetime.utcnow()  # Update timestamp

    await session.commit()
    await session.refresh(task)

    return task

# ❌ BAD: No user_id check (can update anyone's task!)
async def update_task_bad(task_id: int, updates: dict, session: AsyncSession):
    task = await session.get(Task, task_id)
    for key, value in updates.items():
        setattr(task, key, value)
    await session.commit()


# ==============================================================================
# PATTERN 7: Deleting Records
# ==============================================================================

async def delete_task(
    task_id: int,
    user_id: str,
    session: AsyncSession
) -> bool:
    """
    ✅ GOOD: Verify ownership before deletion.
    Returns True if deleted, False if not found/not owned.
    """
    task = await get_task_by_id(task_id, user_id, session)

    if not task:
        return False

    await session.delete(task)
    await session.commit()

    return True


# ==============================================================================
# PATTERN 8: Aggregation Queries (Analytics)
# ==============================================================================

from sqlalchemy import func

async def get_task_counts(user_id: str, session: AsyncSession) -> dict:
    """Get task statistics for analytics."""

    # Total tasks
    total_result = await session.execute(
        select(func.count(Task.id)).where(Task.user_id == user_id)
    )
    total = total_result.scalar()

    # Completed tasks
    completed_result = await session.execute(
        select(func.count(Task.id)).where(
            Task.user_id == user_id,
            Task.completed == True
        )
    )
    completed = completed_result.scalar()

    # By priority
    priority_result = await session.execute(
        select(Task.priority, func.count(Task.id))
        .where(Task.user_id == user_id)
        .group_by(Task.priority)
    )
    by_priority = {row[0]: row[1] for row in priority_result.all()}

    return {
        "total": total,
        "completed": completed,
        "pending": total - completed,
        "by_priority": by_priority,
        "completion_rate": (completed / total * 100) if total > 0 else 0
    }


# ==============================================================================
# PATTERN 9: Pagination
# ==============================================================================

async def get_paginated_tasks(
    user_id: str,
    page: int = 1,
    page_size: int = 20,
    session: AsyncSession = None
) -> tuple[list[Task], int]:
    """Get paginated tasks with total count."""

    # Get total count
    count_result = await session.execute(
        select(func.count(Task.id)).where(Task.user_id == user_id)
    )
    total = count_result.scalar()

    # Get paginated results
    offset = (page - 1) * page_size
    result = await session.execute(
        select(Task)
        .where(Task.user_id == user_id)
        .order_by(Task.created_at.desc())
        .offset(offset)
        .limit(page_size)
    )
    tasks = result.scalars().all()

    return tasks, total


# ==============================================================================
# PATTERN 10: Composite Indexes for Performance
# ==============================================================================

from sqlalchemy import Index

class TaskWithIndexes(SQLModel, table=True):
    """Task model with composite indexes for faster queries."""
    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(max_length=255)
    user_id: str = Field(nullable=False)
    completed: bool = Field(default=False)
    priority: str = Field(default="medium")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Composite indexes for common query patterns
    __table_args__ = (
        Index('idx_user_completed', 'user_id', 'completed'),  # List by status
        Index('idx_user_priority', 'user_id', 'priority'),     # Filter by priority
        Index('idx_user_created', 'user_id', 'created_at'),    # Sort by date
    )


# ==============================================================================
# KEY TAKEAWAYS
# ==============================================================================

"""
DATABASE BEST PRACTICES:

1. ✅ ALWAYS filter queries by user_id (from JWT, not client)
2. ✅ Use async engine + AsyncSession for non-blocking I/O
3. ✅ Add indexes on frequently queried columns (user_id, user_id+completed)
4. ✅ Include timestamps (created_at, updated_at) for audit trail
5. ✅ Use Field() constraints (max_length, nullable, default)
6. ✅ Return 404 for not found OR not owned (prevents enumeration)
7. ✅ Use transactions (commit/rollback) for data integrity
8. ✅ Refresh objects after commit to get auto-generated fields
9. ✅ Use composite indexes for multi-column queries
10. ✅ Validate input before database operations

SECURITY:
- NEVER trust user_id from client (path params, query params, request body)
- ALWAYS extract user_id from verified JWT token
- ALWAYS filter by user_id to prevent cross-user data access
- Return same error (404) for "not found" and "not yours" (prevents enumeration)

PERFORMANCE:
- Use indexes on foreign keys and frequently queried columns
- Use pagination for large result sets
- Use composite indexes for multi-column queries
- Enable connection pooling (pool_size, max_overflow)
"""

"""Task CRUD API routes with user isolation."""

from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.auth.jwt import get_current_user_id
from app.database.connection import get_session
from app.models.task import Task, TaskCreate, TaskRead, TaskUpdate

router = APIRouter()


@router.get("", response_model=list[TaskRead])
async def list_tasks(
    status_filter: Optional[str] = Query(None, alias="status"),
    sort: Optional[str] = Query("created", pattern="^(created|title)$"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """List all tasks for the authenticated user."""
    query = select(Task).where(Task.user_id == user_id)

    if status_filter == "completed":
        query = query.where(Task.completed == True)
    elif status_filter == "pending":
        query = query.where(Task.completed == False)

    if sort == "title":
        query = query.order_by(Task.title)
    else:
        query = query.order_by(Task.created_at.desc())

    query = query.offset(offset).limit(limit)
    result = await session.execute(query)
    return result.scalars().all()


@router.post("", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Create a new task for the authenticated user."""
    task = Task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        user_id=user_id,
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


@router.get("/{task_id}", response_model=TaskRead)
async def get_task(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Get a specific task by ID (user-isolated)."""
    task = await _get_user_task(session, task_id, user_id)
    return task


@router.put("/{task_id}", response_model=TaskRead)
async def update_task(
    task_id: int,
    task_in: TaskUpdate,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Update a task by ID (user-isolated)."""
    task = await _get_user_task(session, task_id, user_id)

    update_data = task_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(task, key, value)
    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Delete a task by ID (user-isolated)."""
    task = await _get_user_task(session, task_id, user_id)
    await session.delete(task)
    await session.commit()


@router.patch("/{task_id}/complete", response_model=TaskRead)
async def toggle_task_completion(
    task_id: int,
    user_id: str = Depends(get_current_user_id),
    session: AsyncSession = Depends(get_session),
):
    """Toggle the completion status of a task (user-isolated)."""
    task = await _get_user_task(session, task_id, user_id)
    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


async def _get_user_task(
    session: AsyncSession, task_id: int, user_id: str
) -> Task:
    """Fetch a task ensuring it belongs to the requesting user."""
    query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    result = await session.execute(query)
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with ID {task_id} not found",
        )
    return task

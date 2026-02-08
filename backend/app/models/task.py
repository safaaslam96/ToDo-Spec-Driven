"""Task database model and request/response schemas."""

from datetime import datetime, timezone
from typing import Optional

from sqlmodel import Field, SQLModel


class TaskBase(SQLModel):
    """Shared task fields for create/update/read operations."""

    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    priority: str = Field(default="medium", regex="^(low|medium|high)$")
    completed: bool = Field(default=False)


class Task(TaskBase, table=True):
    """Task database table model."""

    __tablename__ = "tasks"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class TaskCreate(SQLModel):
    """Schema for creating a new task."""

    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    priority: str = Field(default="medium", regex="^(low|medium|high)$")


class TaskUpdate(SQLModel):
    """Schema for updating an existing task (all fields optional)."""

    title: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=2000)
    priority: Optional[str] = Field(default=None, regex="^(low|medium|high)$")
    completed: Optional[bool] = None


class TaskRead(TaskBase):
    """Schema for reading a task (API response)."""

    id: int
    user_id: str
    created_at: datetime
    updated_at: datetime

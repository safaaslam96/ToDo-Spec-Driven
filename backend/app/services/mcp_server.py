"""MCP Server — 5 stateless tool functions for task management.

Per constitution Article II: all task operations exposed as MCP tools.
Every tool enforces user_id isolation and returns the standard contract:
  Success: {task_id, status, title, message}
  Error:   {error, message}
"""

from typing import Optional

from sqlalchemy.ext.asyncio import AsyncSession
from sqlmodel import select

from app.models.task import Task


class MCPServer:
    """Stateless MCP tool dispatcher.

    Holds a database session and user_id for the duration of a single
    request cycle. No conversation state stored here.
    """

    def __init__(self, session: AsyncSession, user_id: str) -> None:
        self.session = session
        self.user_id = user_id

    # ------------------------------------------------------------------ #
    # Tool 1: add_task
    # ------------------------------------------------------------------ #

    async def add_task(self, title: str, description: str = "") -> dict:
        """Create a new task for the current user.

        Returns: {task_id, status, title, message}
        """
        try:
            task = Task(
                user_id=self.user_id,
                title=title,
                description=description or None,
            )
            self.session.add(task)
            await self.session.commit()
            await self.session.refresh(task)
            return {
                "task_id": task.id,
                "status": "created",
                "title": task.title,
                "message": f"Task '{task.title}' created successfully",
            }
        except Exception as exc:
            await self.session.rollback()
            return {"error": "create_failed", "message": str(exc)}

    # ------------------------------------------------------------------ #
    # Tool 2: list_tasks
    # ------------------------------------------------------------------ #

    async def list_tasks(self, status: str = "all") -> dict:
        """List tasks for the current user, optionally filtered by status.

        status: 'all' | 'pending' | 'completed'
        Returns: {tasks: [...], count, status_filter}
        """
        try:
            stmt = select(Task).where(Task.user_id == self.user_id)
            if status == "pending":
                stmt = stmt.where(Task.completed == False)  # noqa: E712
            elif status == "completed":
                stmt = stmt.where(Task.completed == True)  # noqa: E712
            result = await self.session.exec(stmt)
            tasks = result.all()
            return {
                "tasks": [
                    {
                        "task_id": t.id,
                        "title": t.title,
                        "description": t.description,
                        "completed": t.completed,
                        "priority": t.priority,
                    }
                    for t in tasks
                ],
                "count": len(tasks),
                "status_filter": status,
            }
        except Exception as exc:
            return {"error": "list_failed", "message": str(exc)}

    # ------------------------------------------------------------------ #
    # Tool 3: complete_task
    # ------------------------------------------------------------------ #

    async def complete_task(self, task_id: int) -> dict:
        """Mark a task as complete. User isolation enforced.

        Returns: {task_id, status, title, message}
        """
        try:
            task = await self.session.get(Task, task_id)
            if not task or task.user_id != self.user_id:
                return {
                    "error": "not_found",
                    "message": f"Task {task_id} not found",
                }
            if task.completed:
                return {
                    "error": "already_complete",
                    "message": f"Task {task_id} is already complete!",
                }
            task.completed = True
            self.session.add(task)
            await self.session.commit()
            await self.session.refresh(task)
            return {
                "task_id": task.id,
                "status": "completed",
                "title": task.title,
                "message": f"Task '{task.title}' marked as complete",
            }
        except Exception as exc:
            await self.session.rollback()
            return {"error": "complete_failed", "message": str(exc)}

    # ------------------------------------------------------------------ #
    # Tool 4: delete_task
    # ------------------------------------------------------------------ #

    async def delete_task(self, task_id: int) -> dict:
        """Permanently delete a task. User isolation enforced.

        Returns: {task_id, status, title, message}
        """
        try:
            task = await self.session.get(Task, task_id)
            if not task or task.user_id != self.user_id:
                return {
                    "error": "not_found",
                    "message": f"Task {task_id} not found",
                }
            title = task.title
            await self.session.delete(task)
            await self.session.commit()
            return {
                "task_id": task_id,
                "status": "deleted",
                "title": title,
                "message": f"Task '{title}' deleted permanently",
            }
        except Exception as exc:
            await self.session.rollback()
            return {"error": "delete_failed", "message": str(exc)}

    # ------------------------------------------------------------------ #
    # Tool 5: update_task
    # ------------------------------------------------------------------ #

    async def update_task(
        self,
        task_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None,
    ) -> dict:
        """Update a task's title and/or description. User isolation enforced.

        Returns: {task_id, status, title, message}
        """
        try:
            task = await self.session.get(Task, task_id)
            if not task or task.user_id != self.user_id:
                return {
                    "error": "not_found",
                    "message": f"Task {task_id} not found",
                }
            if title is not None:
                task.title = title
            if description is not None:
                task.description = description
            self.session.add(task)
            await self.session.commit()
            await self.session.refresh(task)
            return {
                "task_id": task.id,
                "status": "updated",
                "title": task.title,
                "message": f"Task '{task.title}' updated",
            }
        except Exception as exc:
            await self.session.rollback()
            return {"error": "update_failed", "message": str(exc)}

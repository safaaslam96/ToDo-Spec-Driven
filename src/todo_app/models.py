"""
Task data model for the todo application.
"""
from dataclasses import dataclass
from typing import Optional


@dataclass
class Task:
    """
    Represents a single todo task with id, title, description, and completion status.

    Attributes:
        id (int): Unique identifier for the task, auto-generated sequentially
        title (str): Title of the task (required)
        description (str): Optional description of the task
        completed (bool): Completion status of the task (default: False)
    """
    id: int
    title: str
    description: Optional[str] = None
    completed: bool = False

    def __str__(self) -> str:
        """
        Return a string representation of the task with status indicator.

        Returns:
            str: Formatted string showing task status, ID, title, and description
        """
        status = "[x]" if self.completed else "[ ]"
        desc = f" - {self.description}" if self.description else ""
        return f"{status} {self.id}. {self.title}{desc}"
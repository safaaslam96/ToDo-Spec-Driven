"""
Storage module for the todo application.
Implements in-memory storage with sequential ID generation.
"""
from typing import List, Optional
from .models import Task


class TodoList:
    """
    In-memory storage for tasks with sequential ID generation.

    Manages the collection of tasks in memory with methods for all CRUD operations
    plus toggle status functionality. IDs are generated sequentially starting from 1
    and are never reused during the application session, but reset on restart.
    """

    def __init__(self) -> None:
        """
        Initialize the TodoList with an empty list and next ID counter.
        """
        self._tasks: List[Task] = []
        self._next_id: int = 1

    def add_task(self, title: str, description: Optional[str] = None) -> Task:
        """
        Add a new task with the given title and optional description.

        Args:
            title (str): Title of the task (required)
            description (Optional[str]): Optional description of the task

        Returns:
            Task: The newly created task with assigned ID and initial incomplete status

        Raises:
            ValueError: If title is empty or contains only whitespace
        """
        if not title or not title.strip():
            raise ValueError("Task title cannot be empty or contain only whitespace")

        task = Task(id=self._next_id, title=title.strip(), description=description, completed=False)
        self._tasks.append(task)
        self._next_id += 1
        return task

    def find_by_id(self, task_id: int) -> Optional[Task]:
        """
        Find a task by its ID.

        Args:
            task_id (int): ID of the task to find

        Returns:
            Optional[Task]: The task if found, None otherwise
        """
        for task in self._tasks:
            if task.id == task_id:
                return task
        return None

    def list_all(self) -> List[Task]:
        """
        Get a list of all tasks.

        Returns:
            List[Task]: All tasks in the storage
        """
        return self._tasks.copy()

    def update_task(self, task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
        """
        Update a task's title and/or description by ID.

        Args:
            task_id (int): ID of the task to update
            title (Optional[str]): New title (optional - only update if provided)
            description (Optional[str]): New description (optional - only update if provided)

        Returns:
            bool: True if task was updated, False if task not found
        """
        task = self.find_by_id(task_id)
        if task is None:
            return False

        # Only update fields that are provided
        if title is not None:
            if not title.strip():
                raise ValueError("Task title cannot be empty or contain only whitespace")
            task.title = title.strip()

        if description is not None:
            task.description = description

        return True

    def delete_task(self, task_id: int) -> bool:
        """
        Delete a task by its ID.

        Args:
            task_id (int): ID of the task to delete

        Returns:
            bool: True if task was deleted, False if task not found
        """
        task = self.find_by_id(task_id)
        if task is None:
            return False

        self._tasks.remove(task)
        return True

    def toggle_task_status(self, task_id: int) -> bool:
        """
        Toggle the completion status of a task by its ID.

        Args:
            task_id (int): ID of the task to toggle

        Returns:
            bool: True if task status was toggled, False if task not found
        """
        task = self.find_by_id(task_id)
        if task is None:
            return False

        task.completed = not task.completed
        return True

    def get_next_id(self) -> int:
        """
        Get the next available ID for a new task.

        Returns:
            int: The next ID that will be assigned
        """
        return self._next_id
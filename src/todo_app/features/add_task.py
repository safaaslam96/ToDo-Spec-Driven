"""
Add task feature module for the todo application.
Handles the logic for adding new tasks.
"""
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..storage import TodoList
    from ..models import Task


def add_task_interactive(todo_list: 'TodoList') -> bool:
    """
    Interactive function to add a task through user input.

    Args:
        todo_list ('TodoList'): The TodoList instance to add the task to

    Returns:
        bool: True if task was added successfully, False otherwise
    """
    try:
        title = input("Enter task title: ").strip()
        if not title:
            print("Error: Task title cannot be empty")
            return False

        description_input = input("Enter task description (optional, press Enter to skip): ").strip()
        description = description_input if description_input else None

        task = todo_list.add_task(title, description)
        print(f"Success: Added task '{task.title}' with ID {task.id}")
        return True

    except ValueError as e:
        print(f"Error: {e}")
        return False
    except Exception as e:
        print(f"Error adding task: {e}")
        return False


def add_task(todo_list: 'TodoList', title: str, description: str = None) -> 'Task':
    """
    Add a task programmatically with the given title and optional description.

    Args:
        todo_list ('TodoList'): The TodoList instance to add the task to
        title (str): The title of the task (required)
        description (str, optional): The description of the task

    Returns:
        'Task': The newly created task

    Raises:
        ValueError: If title is empty or contains only whitespace
    """
    return todo_list.add_task(title, description)
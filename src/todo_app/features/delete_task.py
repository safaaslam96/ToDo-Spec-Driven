"""
Delete task feature module for the todo application.
Handles the logic for deleting tasks.
"""
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..storage import TodoList
    from ..models import Task


def delete_task_interactive(todo_list: 'TodoList') -> bool:
    """
    Interactive function to delete a task through user input.

    Args:
        todo_list ('TodoList'): The TodoList instance to delete the task from

    Returns:
        bool: True if task was deleted successfully, False otherwise
    """
    try:
        task_id = int(input("Enter task ID to delete: "))
    except ValueError:
        print("Error: Invalid task ID. Please enter a number.")
        return False

    # Check if task exists
    existing_task = todo_list.find_by_id(task_id)
    if not existing_task:
        print(f"Error: Task with ID {task_id} not found")
        return False

    print(f"Task to delete: {existing_task}")

    confirm = input("Are you sure you want to delete this task? (y/N): ")
    if confirm.lower() != 'y':
        print("Task deletion cancelled.")
        return False

    # Delete the task
    deleted = todo_list.delete_task(task_id)
    if deleted:
        print(f"Success: Deleted task with ID {task_id}")
        return True
    else:
        print(f"Error: Could not delete task with ID {task_id}")
        return False


def delete_task(todo_list: 'TodoList', task_id: int) -> bool:
    """
    Delete a task programmatically by its ID.

    Args:
        todo_list ('TodoList'): The TodoList instance to delete the task from
        task_id (int): The ID of the task to delete

    Returns:
        bool: True if task was deleted successfully, False otherwise
    """
    return todo_list.delete_task(task_id)
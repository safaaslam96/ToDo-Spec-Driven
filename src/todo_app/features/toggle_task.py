"""
Toggle task feature module for the todo application.
Handles the logic for toggling task completion status.
"""
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..storage import TodoList
    from ..models import Task


def toggle_task_interactive(todo_list: 'TodoList') -> bool:
    """
    Interactive function to toggle a task's completion status through user input.

    Args:
        todo_list ('TodoList'): The TodoList instance to toggle the task in

    Returns:
        bool: True if task status was toggled successfully, False otherwise
    """
    try:
        task_id = int(input("Enter task ID to toggle: "))
    except ValueError:
        print("Error: Invalid task ID. Please enter a number.")
        return False

    # Check if task exists
    existing_task = todo_list.find_by_id(task_id)
    if not existing_task:
        print(f"Error: Task with ID {task_id} not found")
        return False

    print(f"Current task: {existing_task}")

    # Toggle the task status
    toggled = todo_list.toggle_task_status(task_id)
    if toggled:
        updated_task = todo_list.find_by_id(task_id)
        print(f"Success: Toggled task status for ID {task_id}")
        print(f"Updated task: {updated_task}")
        return True
    else:
        print(f"Error: Could not toggle task with ID {task_id}")
        return False


def toggle_task(todo_list: 'TodoList', task_id: int) -> bool:
    """
    Toggle a task's completion status programmatically.

    Args:
        todo_list ('TodoList'): The TodoList instance to toggle the task in
        task_id (int): The ID of the task to toggle

    Returns:
        bool: True if task status was toggled successfully, False otherwise
    """
    return todo_list.toggle_task_status(task_id)
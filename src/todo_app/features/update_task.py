"""
Update task feature module for the todo application.
Handles the logic for updating existing tasks.
"""
from typing import TYPE_CHECKING, Optional

if TYPE_CHECKING:
    from ..storage import TodoList
    from ..models import Task


def update_task_interactive(todo_list: 'TodoList') -> bool:
    """
    Interactive function to update a task through user input.

    Args:
        todo_list ('TodoList'): The TodoList instance to update the task in

    Returns:
        bool: True if task was updated successfully, False otherwise
    """
    try:
        task_id = int(input("Enter task ID to update: "))
    except ValueError:
        print("Error: Invalid task ID. Please enter a number.")
        return False

    # Check if task exists
    existing_task = todo_list.find_by_id(task_id)
    if not existing_task:
        print(f"Error: Task with ID {task_id} not found")
        return False

    print(f"Current task: {existing_task}")

    # Get new title (optional)
    new_title_input = input(f"Enter new title (current: '{existing_task.title}', press Enter to keep current): ").strip()
    new_title = new_title_input if new_title_input else None

    # Get new description (optional)
    current_desc = existing_task.description if existing_task.description else ""
    new_desc_input = input(f"Enter new description (current: '{current_desc}', press Enter to keep current): ").strip()
    new_description = new_desc_input if new_desc_input != "" else None

    # If new_description is empty string, we want to set it to None
    if new_desc_input == "":
        # Check if user wants to clear the description
        if input("Clear description? (y/N): ").lower() == 'y':
            new_description = None
        else:
            new_description = existing_task.description

    # Update the task
    try:
        updated = todo_list.update_task(task_id, new_title, new_description)
        if updated:
            updated_task = todo_list.find_by_id(task_id)
            print(f"Success: Updated task with ID {task_id}")
            print(f"Updated task: {updated_task}")
            return True
        else:
            print(f"Error: Could not update task with ID {task_id}")
            return False
    except ValueError as e:
        print(f"Error: {e}")
        return False


def update_task(todo_list: 'TodoList', task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> bool:
    """
    Update a task programmatically with the given parameters.

    Args:
        todo_list ('TodoList'): The TodoList instance to update the task in
        task_id (int): The ID of the task to update
        title (Optional[str]): New title (optional - only update if provided)
        description (Optional[str]): New description (optional - only update if provided)

    Returns:
        bool: True if task was updated successfully, False otherwise
    """
    return todo_list.update_task(task_id, title, description)
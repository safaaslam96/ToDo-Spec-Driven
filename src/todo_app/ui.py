"""
User interface module for the todo application.
Handles menu display and user input processing.
"""
from typing import Optional


def display_menu() -> None:
    """
    Display the main menu with numbered options for all five operations.
    """
    print("\n" + "="*40)
    print("The Evolution of Todo - Phase I")
    print("="*40)
    print("1. Add Task")
    print("2. List All Tasks")
    print("3. Update Task")
    print("4. Delete Task")
    print("5. Mark Task Complete/Incomplete")
    print("6. Exit")
    print("="*40)


def get_user_choice() -> int:
    """
    Get user's menu choice with validation.

    Returns:
        int: The user's menu choice (1-6)
    """
    while True:
        try:
            choice = int(input("Enter your choice (1-6): "))
            if 1 <= choice <= 6:
                return choice
            else:
                print("Please enter a number between 1 and 6.")
        except ValueError:
            print("Invalid input. Please enter a number between 1 and 6.")


def get_task_input(is_update: bool = False) -> tuple[str, Optional[str]]:
    """
    Get task input from user (title and description).

    Args:
        is_update (bool): Whether this is for an update operation (makes title optional)

    Returns:
        tuple[str, Optional[str]]: A tuple containing the title and optional description
    """
    if not is_update:
        title = input("Enter task title: ").strip()
        if not title:
            raise ValueError("Task title cannot be empty")
    else:
        title_input = input("Enter new title (leave blank to keep current): ").strip()
        title = title_input if title_input else None

    description_input = input("Enter task description (optional, press Enter to skip): ").strip()
    description = description_input if description_input else None

    return title, description


def get_task_id(prompt: str = "Enter task ID: ") -> int:
    """
    Get task ID from user with validation.

    Args:
        prompt (str): The prompt to display to the user

    Returns:
        int: The validated task ID
    """
    while True:
        try:
            task_id = int(input(prompt))
            if task_id > 0:
                return task_id
            else:
                print("Task ID must be a positive integer.")
        except ValueError:
            print("Invalid input. Please enter a valid task ID (number).")


def display_error(message: str) -> None:
    """
    Display an error message to the user.

    Args:
        message (str): The error message to display
    """
    print(f"Error: {message}")


def display_success(message: str) -> None:
    """
    Display a success message to the user.

    Args:
        message (str): The success message to display
    """
    print(f"Success: {message}")


def display_info(message: str) -> None:
    """
    Display an informational message to the user.

    Args:
        message (str): The informational message to display
    """
    print(message)
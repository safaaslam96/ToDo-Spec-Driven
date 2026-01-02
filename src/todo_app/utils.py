"""
Utility functions for the todo application.
Contains helper functions for input validation and error handling.
"""


def format_task_error(task_id: int) -> str:
    """
    Format a specific error message for when a task is not found.

    Args:
        task_id (int): The ID of the task that was not found

    Returns:
        str: Formatted error message without revealing all valid IDs
    """
    return f"Task with ID {task_id} not found"


def validate_task_id(task_id: int) -> bool:
    """
    Validate that a task ID is positive.

    Args:
        task_id (int): The task ID to validate

    Returns:
        bool: True if the ID is valid, False otherwise
    """
    return task_id > 0


def validate_title(title: str) -> tuple[bool, str]:
    """
    Validate that a task title is not empty or only whitespace.

    Args:
        title (str): The title to validate

    Returns:
        tuple[bool, str]: A tuple containing whether the title is valid and an error message if not
    """
    if not title:
        return False, "Title cannot be empty"
    if not title.strip():
        return False, "Title cannot contain only whitespace"
    return True, ""


def safe_input(prompt: str) -> str:
    """
    Get user input safely, handling potential interruptions.

    Args:
        prompt (str): The prompt to display to the user

    Returns:
        str: The user's input (or empty string if interrupted)
    """
    try:
        return input(prompt)
    except (KeyboardInterrupt, EOFError):
        print("\nOperation cancelled by user.")
        return ""


def format_task_list(tasks: list) -> str:
    """
    Format a list of tasks for display.

    Args:
        tasks (list): List of task objects to format

    Returns:
        str: Formatted string representation of the tasks
    """
    if not tasks:
        return "No tasks found."

    formatted_tasks = []
    for task in tasks:
        formatted_tasks.append(str(task))

    return "\n".join(formatted_tasks)
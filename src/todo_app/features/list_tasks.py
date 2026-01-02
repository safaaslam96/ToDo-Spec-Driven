"""
List tasks feature module for the todo application.
Handles the logic for displaying all tasks.
"""
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from ..storage import TodoList
    from ..models import Task


def list_tasks_interactive(todo_list: 'TodoList') -> None:
    """
    Interactive function to list all tasks in a readable format.

    Args:
        todo_list ('TodoList'): The TodoList instance to list tasks from
    """
    tasks = todo_list.list_all()

    if not tasks:
        print("\nNo tasks found.")
        return

    print("\n" + "-"*60)
    print(f"{'ID':<4} {'Status':<8} {'Title':<25} {'Description':<20}")
    print("-"*60)

    for task in tasks:
        status = "[x]" if task.completed else "[ ]"
        title = task.title[:23] + ".." if len(task.title) > 25 else task.title
        desc = (task.description[:18] + "..") if task.description and len(task.description) > 20 else (task.description or "")
        print(f"{task.id:<4} {status:<8} {title:<25} {desc:<20}")

    print("-"*60)
    print(f"Total tasks: {len(tasks)}")


def list_tasks(todo_list: 'TodoList') -> list:
    """
    Get all tasks from the todo list.

    Args:
        todo_list ('TodoList'): The TodoList instance to get tasks from

    Returns:
        list: List of all tasks in the todo list
    """
    return todo_list.list_all()
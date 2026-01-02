"""
The Evolution of Todo - Phase I
Main application entry point
"""
import sys
from pathlib import Path

# Add the src directory to the path so imports work correctly
src_path = Path(__file__).parent.parent.parent
sys.path.insert(0, str(src_path))

from todo_app.app import TodoApp


def main():
    """
    Main entry point for the todo application.
    Initializes and runs the TodoApp.
    """
    app = TodoApp()
    app.run()


if __name__ == "__main__":
    main()
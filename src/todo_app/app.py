"""
Main application module for the todo application.
Implements the menu-driven interface and application flow.
"""
from typing import NoReturn
from .storage import TodoList
from .ui import display_menu, get_user_choice
from .features.add_task import add_task_interactive
from .features.list_tasks import list_tasks_interactive
from .features.update_task import update_task_interactive
from .features.delete_task import delete_task_interactive
from .features.toggle_task import toggle_task_interactive


class TodoApp:
    """
    Main application class that manages the menu-driven todo application flow.
    """

    def __init__(self) -> None:
        """
        Initialize the TodoApp with a fresh TodoList instance.
        """
        self.todo_list = TodoList()

    def run(self) -> NoReturn:
        """
        Run the main application loop with menu-driven interface.
        This method runs indefinitely until the user chooses to exit.
        """
        print("Welcome to The Evolution of Todo - Phase I!")

        while True:
            try:
                display_menu()
                choice = get_user_choice()

                if choice == 1:
                    self._handle_add_task()
                elif choice == 2:
                    self._handle_list_tasks()
                elif choice == 3:
                    self._handle_update_task()
                elif choice == 4:
                    self._handle_delete_task()
                elif choice == 5:
                    self._handle_toggle_task()
                elif choice == 6:
                    self._handle_exit()
                else:
                    print("Invalid choice. Please enter a number between 1 and 6.")

            except KeyboardInterrupt:
                print("\n\nApplication interrupted by user. Exiting...")
                break
            except Exception as e:
                print(f"An unexpected error occurred: {e}")
                print("Please try again.")

    def _handle_add_task(self) -> None:
        """
        Handle the add task operation.
        """
        print("\n--- Add Task ---")
        add_task_interactive(self.todo_list)

    def _handle_list_tasks(self) -> None:
        """
        Handle the list tasks operation.
        """
        print("\n--- List All Tasks ---")
        list_tasks_interactive(self.todo_list)

    def _handle_update_task(self) -> None:
        """
        Handle the update task operation.
        """
        print("\n--- Update Task ---")
        update_task_interactive(self.todo_list)

    def _handle_delete_task(self) -> None:
        """
        Handle the delete task operation.
        """
        print("\n--- Delete Task ---")
        delete_task_interactive(self.todo_list)

    def _handle_toggle_task(self) -> None:
        """
        Handle the toggle task operation.
        """
        print("\n--- Toggle Task Status ---")
        toggle_task_interactive(self.todo_list)

    def _handle_exit(self) -> NoReturn:
        """
        Handle the exit operation.
        """
        print("\nThank you for using The Evolution of Todo - Phase I!")
        print("Goodbye!")
        exit(0)
# Phase I Implementation Tasks v1.0 - In-Memory Console Todo App

## Overview
This task breakdown implements the Phase I in-memory console todo application based on the specification and clarified decisions. The tasks are organized to be implemented sequentially with clear dependencies, focusing on clean code principles and extensibility for future phases.

## Task Breakdown

### Phase 1: Setup and Project Structure

- [ ] T001 Create UV project setup and pyproject.toml with Python 3.13+ requirement and no external dependencies
- [ ] T002 Create project package structure with __init__.py files in src/todo_app/

### Phase 2: Foundational Components

- [ ] T003 Create Task data model class in src/todo_app/models.py with id (int), title (str), description (str), completed (bool), including type hints and docstrings
- [ ] T004 Create TodoList storage class in src/todo_app/storage.py with core methods (add, find_by_id, list_all, update, delete, toggle) using in-memory storage with sequential IDs starting from 1, including type hints and docstrings

### Phase 3: Console Interface Components

- [ ] T005 Create console menu display function in src/todo_app/ui.py that shows numbered options menu for all five operations, including type hints and docstrings
- [ ] T006 Create input handling utilities in src/todo_app/utils.py with safe input validation and error handling for specific messages like "Task with ID X not found" (without listing all valid IDs), including type hints and docstrings

### Phase 4: Add Task Feature [US1]

- [ ] T007 [US1] Implement add task workflow in src/todo_app/features/add_task.py that accepts title (required) and description (optional), generates unique sequential ID, sets initial status to incomplete, rejects empty titles, includes error handling and validation, with type hints and docstrings
- [ ] T008 [US1] Integrate add task functionality into main application flow

### Phase 5: List Tasks Feature [US2]

- [ ] T009 [US2] Implement list tasks workflow in src/todo_app/features/list_tasks.py that displays all tasks with ID, status indicator ([ ] or [x]), title, and description in readable tabular format, handles empty list case, includes type hints and docstrings
- [ ] T010 [US2] Integrate list tasks functionality into main application flow

### Phase 6: Update Task Feature [US3]

- [ ] T011 [US3] Implement update task workflow in src/todo_app/features/update_task.py that accepts task ID and new values for title only, description only, or both (optional fields), updates only specified fields while preserving others, preserves task ID and status, includes error handling, with type hints and docstrings
- [ ] T012 [US3] Integrate update task functionality into main application flow

### Phase 7: Delete Task Feature [US4]

- [ ] T013 [US4] Implement delete task workflow in src/todo_app/features/delete_task.py that accepts task ID, removes corresponding task from storage, handles error cases (invalid ID, non-existent task), ensures other task IDs remain unchanged after deletion, includes error handling, with type hints and docstrings
- [ ] T014 [US4] Integrate delete task functionality into main application flow

### Phase 8: Toggle Complete Feature [US5]

- [ ] T015 [US5] Implement toggle complete workflow in src/todo_app/features/toggle_task.py that accepts task ID and uses a single toggle command that flips the current status (complete to incomplete or vice versa), preserves all other task attributes, includes error handling, with type hints and docstrings
- [ ] T016 [US5] Integrate toggle complete functionality into main application flow

### Phase 9: Main Application Integration

- [ ] T017 Create main application loop in src/todo_app/app.py with menu routing that implements the menu-driven interface with numbered options for all five operations, handles graceful exit, includes type hints and docstrings
- [ ] T018 Update entry point script in src/todo_app/main.py to initialize the application and start the main loop, includes type hints and docstrings

### Phase 10: Final Integration and Testing

- [ ] T019 Create basic run and test instructions in README.md for the implemented features
- [ ] T020 Perform integration testing of all features together and fix any issues

## Dependencies

- T002 depends on T001
- T004 depends on T003
- T007-T016 depend on T004 and T006
- T017 depends on T005, T007-T016
- T018 depends on T017
- T019-T020 depend on T018

## Parallel Execution Opportunities

- T007, T009, T011, T013, T015 can be implemented in parallel after foundational components are complete
- T008, T010, T012, T014, T016 can be implemented in parallel after their respective feature implementations

## Implementation Strategy

1. Start with foundational components (models and storage)
2. Implement UI components and utilities
3. Develop each feature independently with proper error handling
4. Integrate features into main application flow
5. Complete with final integration and testing

## Notes on Clean Code

- All functions must include type hints for parameters and return values
- All classes and functions must include comprehensive docstrings
- Follow PEP 8 style guidelines throughout
- Design components for extensibility (especially storage layer for Phase II persistence)
- Implement proper error handling with user-friendly specific messages
- Keep functions focused on single responsibilities
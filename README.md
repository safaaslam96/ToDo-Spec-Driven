# The Evolution of Todo - Phase I

This is the first phase of "The Evolution of Todo" project - a simple in-memory Python console todo application. The application provides basic task management capabilities through a text-based interface, using pure Python with no external dependencies and in-memory storage.

## Prerequisites

- Python 3.13+
- UV package manager

## Installation

### UV Installation

If UV is not installed, install it using:

```bash
# On Windows
pip install uv

# On Linux/macOS
curl -LsSf https://astral.sh/uv/install.sh | sh
```

### Project Setup

1. Clone the repository (if not already done):
   ```bash
   git clone <repository-url>
   cd <repository-name>
   ```

2. Install project dependencies using UV:
   ```bash
   uv sync
   ```

3. Activate the virtual environment:
   ```bash
   uv venv
   source .venv/bin/activate  # On Linux/macOS
   # or
   .venv\Scripts\activate     # On Windows
   ```

## Usage

To run the todo application:

```bash
uv run python -m todo_app.main
```

Or if you have installed the package:

```bash
todo-app
```

## WSL 2 Instructions for Windows Users

If you're using Windows, you can use WSL 2 for a Linux-like environment:

1. Install WSL 2:
   ```powershell
   wsl --install
   ```

2. Install Ubuntu from Microsoft Store

3. Open Ubuntu terminal and install UV:
   ```bash
   curl -LsSf https://astral.sh/uv/install.sh | sh
   ```

4. Clone the project and follow the regular installation instructions above

## Project Structure

```
.
├── sp.constitution.md          # Project constitution
├── specs_history/              # All versioned spec files
├── src/                        # All Python source code
│   └── todo_app/
│       ├── __init__.py
│       └── main.py
├── pyproject.toml             # UV project config
├── README.md                  # Setup and usage instructions
├── CLAUDE.md                  # Documented prompts and iterations
├── .env                       # Environment variables (placeholders)
└── .gitignore
```

## Features

The Phase I application includes:

1. **Add Task**: Add tasks with title and optional description
2. **List Tasks**: View all tasks with ID, status indicator, title, and description
3. **Update Task**: Update task title and/or description by ID
4. **Delete Task**: Remove tasks by ID
5. **Mark Complete/Incomplete**: Toggle task completion status by ID

## Configuration

The application uses a `.env` file for configuration. Create a `.env` file in the root directory with the following placeholders:

```env
ANTHROPIC_API_KEY=
DEBUG=False
LOG_LEVEL=INFO
```

## Development

### Running Tests

```bash
uv run pytest
```

### Formatting Code

```bash
uv run black src/
uv run isort src/
```

### Linting

```bash
uv run flake8 src/
uv run mypy src/
```

## Next Phases

This application is designed for evolution:

- Phase II: Persistent storage
- Phase III: API layer
- Phase IV: Event-driven architecture
- Phase V: Distributed deployment

## Architecture Decision Records (ADRs)

All significant architectural decisions are documented in the `history/adr/` directory.

## Contributing

This project follows the Agentic Dev Stack workflow:
1. Write spec
2. Generate plan
3. Break into tasks
4. Implement via AI (Claude Code)

All changes must begin with a detailed specification using Spec-Kit Plus.
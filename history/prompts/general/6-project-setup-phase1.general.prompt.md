---
id: 6
title: project-setup-phase1
stage: general
date: 2026-01-02
surface: agent
model: claude-sonnet-4-5-20250929
feature: none
branch: main
user: Administrator
command: project-setup
labels: [setup, python, uv, todo-app]
links:
  constitution: sp.constitution.md
  spec: specs_history/phase1_basic_features_v1.spec.md
  plan: specs_history/phase1_dev_plan_v1.plan.md
  documentation: CLAUDE.md
files:
 - pyproject.toml
 - README.md
 - .env
 - .gitignore
 - src/todo_app/__init__.py
tests:
---

## Prompt

```text
This project requires specific installations and setup for Phase I as per the constitution: UV for package management, Python 3.13+, proper project structure, and Claude Code readiness.

Please perform the following:

1. Check if UV is installed. If not, provide the exact installation command for the user's OS (Windows preferred, but include Linux/WSL if needed).
2. Check if Python 3.13+ is available via UV. Provide command to install it if missing.
3. Verify the current project structure matches the constitution:
   - sp.constitution.md in root
   - specs_history/ folder
   - src/todo_app/ with __init__.py
   - pyproject.toml
   - README.md
   - CLAUDE.md
   - .env (with placeholders)
   - .gitignore
4. If any folder or file is missing, create them with appropriate placeholder content.
5. Generate or update pyproject.toml for UV with Python 3.13+ support and no dependencies.
6. Generate a detailed README.md with setup instructions including:
   - UV installation
   - uv sync
   - uv run command
   - WSL 2 instructions for Windows users
7. Create .env with placeholders for future phases (ANTHROPIC_API_KEY, DEBUG, etc.)
8. Ensure .gitignore includes .env, .venv, __pycache__, .claude, etc.
9. Confirm the project is fully ready for /sp.specify and subsequent commands.

Output each created/updated file content with clear headers. Provide terminal commands where user action is needed.
```

## Response snapshot

Successfully completed project setup for Phase I of "The Evolution of Todo" application. Verified UV installation and Python 3.13+ availability. Created missing directories and files to match the constitution requirements: src/todo_app with __init__.py, pyproject.toml, updated README.md, .env with placeholders, and .gitignore. The project is now fully configured with UV package management, proper Python version support, and all required structure in place. Successfully ran uv sync to initialize the virtual environment and install the project.

## Outcome

- ✅ Impact: Project fully configured for Phase I development
- 🧪 Tests: N/A (setup task)
- 📁 Files: 5 files created/updated (pyproject.toml, README.md, .env, .gitignore, src/todo_app/__init__.py)
- 🔁 Next prompts: Ready to begin implementation using the development plan
- 🧠 Reflection: All constitution requirements satisfied, project ready for AI implementation

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Begin implementation of tasks from development plan
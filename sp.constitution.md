# Project Constitution: The Evolution of Todo

## Preamble
This constitution governs the development of "The Evolution of Todo" project. The goal is to simulate real-world software evolution — starting from a simple CLI todo app and progressing to a Kubernetes-managed, event-driven, AI-powered distributed system. All development must follow the **Agentic Dev Stack workflow**: Write spec → Generate plan → Break into tasks → Implement via AI (Claude Code). No manual boilerplate coding is allowed.
Phase I focuses on a simple in-memory Python console todo application.

## Core Principles

### I. Spec-Driven Development
Every feature and change must begin with a detailed specification using Spec-Kit Plus. All specs are versioned and stored in `/specs_history` folder.

### II. AI-Only Implementation
All code is generated using Claude Code. Manual coding is prohibited except for minor fixes approved via spec updates. All prompts and iterations must be documented in `CLAUDE.md`.

### III. Clean Code & Structure
- Strictly follow PEP 8
- Use type hints, comprehensive docstrings, meaningful names
- Modular design with separation of concerns
- Proper Python project layout

### IV. Technology Stack (Phase I)
- Python 3.13+
- UV for package management and virtual environments
- No external dependencies in Phase I (pure Python, in-memory storage)
- Future phases will introduce dependencies spec-by-spec

### V. Project Structure
.
├── sp.constitution.md # This file
├── specs_history/ # All versioned spec files
├── src/ # All Python source code
│ └── todo_app/
│     ├── __init__.py
│     ├── main.py
│     └── ...
├── pyproject.toml # UV project config
├── README.md # Setup and usage instructions
├── CLAUDE.md # Documented prompts and iterations
├── .env # Environment variables (placeholders)
└── .gitignore

### VI. Phase I Functional Requirements
- Add task (title + description)
- List all tasks with status indicators ([ ] incomplete, [x] complete) and unique ID
- Update task title/description by ID
- Delete task by ID
- Mark task as complete/incomplete by ID
- Simple text-based console interface
- In-memory storage only (list of objects/dicts)

## Non-Functional Requirements

### VII. Performance and Reliability
- User-friendly error messages
- Graceful handling of invalid inputs
- Auto-generated sequential task IDs
- Design for extensibility (future persistence, events, etc.)

### VIII. Evolution Readiness
Code must be structured to allow easy transition to:
- Persistent storage (Phase II)
- API layer
- Event-driven architecture
- Distributed deployment

## Additional Constraints

### IX. Review & Judgment Criteria
Each phase will be evaluated based on:
- Completeness of spec history
- Quality and iteration of Claude prompts
- Adherence to this constitution
- Cleanliness and extensibility of generated code
- Documentation in CLAUDE.md

## Governance

### X. Enforcement
Any deviation from this constitution requires a formal spec amendment. All team members (including the Product Architect) are bound by these rules.

**Version**: 1.0 | **Ratified**: 2026-01-02 | **Last Amended**: 2026-01-02
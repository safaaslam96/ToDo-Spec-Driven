# Database Schema Specification — Phase II

## Overview

This specification defines the database schema for the Phase II full-stack web application using Neon Serverless PostgreSQL. The schema supports multi-user task management with strict data isolation.

## Tables

### users (managed by Better Auth)

Better Auth manages the users table internally. The relevant fields for our application:

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | VARCHAR | PRIMARY KEY | User identifier (Better Auth generated) |
| email | VARCHAR(255) | UNIQUE, NOT NULL | User email address |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation time |

> Note: Password hashing and session management handled by Better Auth internally.

### tasks

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | SERIAL | PRIMARY KEY | Auto-incrementing task ID |
| title | VARCHAR(255) | NOT NULL | Task title (1-255 characters) |
| description | TEXT | NULLABLE | Optional task description (max 2000 chars) |
| priority | VARCHAR(6) | NOT NULL, DEFAULT 'medium' | low, medium, or high |
| completed | BOOLEAN | NOT NULL, DEFAULT FALSE | Completion status |
| user_id | VARCHAR | NOT NULL, FK → users(id) | Owner of the task |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation time (UTC) |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification time (UTC) |

### Indexes

| Index | Table | Columns | Type | Purpose |
|-------|-------|---------|------|---------|
| `ix_tasks_user_id` | tasks | user_id | B-tree | Fast lookup of all tasks for a user |
| `ix_tasks_user_completed` | tasks | user_id, completed | B-tree | Filtered queries (pending/completed) |

## Constraints

- `tasks.user_id` references `users.id` with ON DELETE CASCADE
- `tasks.priority` constrained to enum: `low`, `medium`, `high`
- `tasks.title` minimum 1 character (enforced at application level)
- `tasks.description` maximum 2000 characters (enforced at application level)

## SQLModel Definition

The database models are implemented in `backend/app/models/task.py` using SQLModel, which generates the schema from Python class definitions.

## Migration Strategy

- **Tool**: Alembic (included in backend dependencies)
- **Approach**: Auto-generate migrations from SQLModel metadata changes
- **Rollback**: Each migration includes downgrade function
- **Location**: `backend/alembic/versions/`

## Data Isolation

All queries MUST include `WHERE user_id = :authenticated_user_id` to enforce data isolation. This is handled at the application layer in `backend/app/api/routes/tasks.py`.

## Evolution Notes

Schema designed for extensibility:
- `priority` as VARCHAR allows future custom priority levels
- Additional columns (due_date, tags, category) can be added without breaking changes
- Supports future full-text search on title/description via PostgreSQL tsvector

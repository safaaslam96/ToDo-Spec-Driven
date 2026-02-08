# UI Components Specification — Phase II

## Overview

Defines the reusable components for the Next.js frontend. Components are organized by feature (tasks) and shared utilities (ui).

## Task Components (`components/tasks/`)

### TaskItem
- **Props**: task (Task), onToggle, onEdit, onDelete callbacks
- **Renders**: Checkbox + title + description + priority badge + action buttons
- **States**: Normal, completed (strikethrough + muted text)
- **Priority badge colors**: high=red, medium=yellow, low=green

### TaskForm
- **Props**: onSubmit callback, optional initialData for editing
- **Fields**: Title (required input), Description (textarea), Priority (select)
- **Validation**: Title cannot be empty; shows inline error
- **Mode**: Create (empty form) or Edit (pre-filled with initialData)
- **Client component** (`"use client"`) — uses useState for form state

### TaskList
- **Props**: tasks (Task[]), onToggle, onEdit, onDelete callbacks
- **Renders**: Maps tasks to TaskItem components
- **Empty state**: Centered message when tasks array is empty

### TaskFilters (planned)
- **Props**: onFilterChange callback
- **Controls**: Status dropdown (All/Pending/Completed), Sort dropdown (Created/Title)
- **Emits**: filter object `{ status, sort }` on change

## Shared UI Components (`components/ui/`) — Planned

| Component | Purpose |
|-----------|---------|
| Button | Consistent button styles (primary, secondary, danger) |
| Input | Styled text input with label and error message |
| Select | Styled dropdown select |
| Dialog | Confirmation dialog for delete operations |
| Badge | Colored badge for priority/status indicators |
| Spinner | Loading indicator |

## Component Guidelines

- Server Components by default; `"use client"` only when required
- Props defined as TypeScript interfaces
- No prop drilling beyond 2 levels — use context or composition
- Tailwind utility classes for all styling

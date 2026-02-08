# Implementation Plan: Phase II — Full-Stack Web Todo Application

**Branch**: `1-rest-api-spec` | **Date**: 2026-02-07 | **Spec**: specs/features/task-crud.md, specs/api/rest-endpoints.md
**Input**: All Phase II specifications + Constitution v2.0.0 + Clarification decisions (2026-02-07)

## Summary

Phase II transforms the Phase I console todo app into a multi-user full-stack web application. The backend is a FastAPI REST API with JWT-verified user isolation backed by Neon PostgreSQL. The frontend is a Next.js 16+ App Router application with Better Auth for authentication, Tailwind CSS for styling, and a typed API client. All 5 CRUD operations (Add, List, Update, Delete, Toggle) are user-isolated via JWT `sub` claim extraction.

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript 5.7+ (frontend)
**Primary Dependencies**: FastAPI, SQLModel, asyncpg, python-jose (backend); Next.js 16+, React 19, Tailwind CSS v4, Better Auth (frontend)
**Storage**: Neon Serverless PostgreSQL (async via asyncpg)
**Testing**: pytest + httpx (backend), Vitest + React Testing Library (frontend)
**Target Platform**: Web (desktop + mobile responsive)
**Project Type**: Web (monorepo: backend/ + frontend/)
**Performance Goals**: API p95 < 500ms, page load < 3s, 1000+ tasks per user
**Constraints**: Stateless JWT auth, user isolation via query filtering, no cross-user data access
**Scale/Scope**: Multi-user, 3 pages, 6 API endpoints, 1 DB table

## Constitution Check

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Spec-Driven Development | PASS | All specs written before implementation |
| II. Clean Code | PASS | Consistent patterns across backend/frontend |
| III. AI-Only Implementation | PASS | All code generated via Claude Code |
| IV. Security-First | PASS | JWT auth, user isolation, input validation |
| V. API-First Architecture | PASS | REST API spec completed before frontend work |
| VI. User Isolation | PASS | All queries filter by user_id from JWT |

## Project Structure

### Documentation

```text
specs/
├── overview.md              # Phase roadmap
├── architecture.md          # System diagram, component responsibilities
├── main/plan.md             # This file
├── features/
│   ├── task-crud.md         # CRUD feature spec (clarified)
│   └── authentication.md   # Auth feature spec
├── api/
│   └── rest-endpoints.md   # REST API contract (clarified)
├── database/
│   └── schema.md           # DB schema spec
└── ui/
    ├── pages.md             # Page definitions
    └── components.md        # Component specs
```

### Source Code

```text
backend/
├── app/
│   ├── main.py              # FastAPI entry, CORS, lifespan
│   ├── config.py            # Pydantic Settings from .env
│   ├── auth/
│   │   └── jwt.py           # JWT Bearer verification
│   ├── database/
│   │   └── connection.py    # Async engine + session
│   ├── models/
│   │   └── task.py          # SQLModel Task + schemas
│   └── api/routes/
│       ├── health.py        # Health check
│       └── tasks.py         # Task CRUD endpoints
├── tests/
│   ├── test_tasks.py        # API integration tests
│   └── conftest.py          # Test fixtures
├── alembic/                 # DB migrations
├── pyproject.toml
└── Dockerfile

frontend/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Landing page
│   ├── auth/page.tsx        # Auth page
│   └── dashboard/page.tsx   # Task management
├── components/
│   ├── tasks/
│   │   ├── task-item.tsx
│   │   ├── task-form.tsx
│   │   └── task-list.tsx
│   └── ui/                  # Shared UI components
├── lib/
│   └── api-client.ts        # JWT-attached fetch
├── types/
│   └── task.ts              # TypeScript interfaces
├── package.json
└── Dockerfile
```

**Structure Decision**: Web application (Option 2). Backend and frontend are separate top-level directories in the monorepo. Phase I source (`src/todo_app/`) remains frozen and untouched.

## Task Breakdown

### Task 1: Set up Neon PostgreSQL connection and verify
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: None (first task)
**Files**: `backend/app/database/connection.py`, `backend/app/config.py`, `.env`

**Description**: Configure the async PostgreSQL connection to Neon using asyncpg. Verify the connection works by running the FastAPI app and hitting the health endpoint. Ensure the `DATABASE_URL` environment variable is properly loaded and the async engine is created.

**Acceptance Criteria**:
- [ ] `DATABASE_URL` configured in `.env` pointing to Neon instance
- [ ] Async engine created with `create_async_engine`
- [ ] `create_db_and_tables()` creates the tasks table on startup
- [ ] `GET /api/health` returns 200 with database connection status
- [ ] Connection errors handled gracefully (500 response, no stack trace leak)

---

### Task 2: Finalize SQLModel Task model and schemas
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Task 1
**Files**: `backend/app/models/task.py`

**Description**: Finalize the Task SQLModel table definition and request/response schemas (TaskCreate, TaskUpdate, TaskRead). Ensure fields match the clarified spec: title, description, priority (low/medium/high), completed, user_id (str). No due_date in Phase II.

**Acceptance Criteria**:
- [ ] Task table: id (SERIAL PK), title (VARCHAR 255, NOT NULL), description (TEXT, nullable), priority (VARCHAR, default "medium"), completed (BOOLEAN, default False), user_id (str, indexed), created_at, updated_at
- [ ] TaskCreate: title (required), description (optional), priority (optional, default "medium")
- [ ] TaskUpdate: all fields optional for partial updates
- [ ] TaskRead: includes all fields + id + timestamps
- [ ] Priority validated as enum: low, medium, high
- [ ] user_id type is `str` (not int) matching Better Auth

---

### Task 3: Implement JWT Bearer authentication middleware
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: None (can parallel with Task 1-2)
**Files**: `backend/app/auth/jwt.py`, `backend/app/config.py`

**Description**: Implement the `get_current_user_id` dependency that verifies JWT Bearer tokens and extracts the user_id from the `sub` claim. Uses python-jose with HS256 algorithm and BETTER_AUTH_SECRET.

**Acceptance Criteria**:
- [ ] Extracts Bearer token from Authorization header
- [ ] Verifies JWT signature with BETTER_AUTH_SECRET (HS256)
- [ ] Extracts `sub` claim as user_id (str)
- [ ] Returns 401 Unauthorized for missing/invalid/expired tokens
- [ ] Error messages don't leak internal details
- [ ] Works as FastAPI `Depends()` injectable

---

### Task 4: Implement POST /api/tasks — Create Task
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Tasks 1, 2, 3
**Files**: `backend/app/api/routes/tasks.py`

**Description**: Implement the task creation endpoint. Accepts TaskCreate body, associates with authenticated user_id from JWT, returns 201 with created TaskRead.

**Acceptance Criteria**:
- [ ] POST `/api/tasks` creates a new task
- [ ] user_id set from JWT `sub` claim (not from request body)
- [ ] Title required, returns 400 if empty/whitespace
- [ ] Priority defaults to "medium" if not provided
- [ ] Returns 201 Created with full TaskRead response
- [ ] Returns 401 if no valid JWT token
- [ ] created_at and updated_at set to current UTC time

---

### Task 5: Implement GET /api/tasks — List Tasks
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Tasks 1, 2, 3
**Files**: `backend/app/api/routes/tasks.py`

**Description**: Implement the task listing endpoint. Returns all tasks for the authenticated user, with optional filtering by status and sorting.

**Acceptance Criteria**:
- [ ] GET `/api/tasks` returns all tasks for authenticated user only
- [ ] Query params: `status` (all/pending/completed), `sort` (created/title), `limit`, `offset`
- [ ] Results filtered by user_id from JWT (never returns other users' tasks)
- [ ] Returns 200 OK with array of TaskRead objects
- [ ] Empty array returned if user has no tasks (not 404)
- [ ] Returns 401 if no valid JWT token

---

### Task 6: Implement GET /api/tasks/{id} — Get Single Task
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Tasks 1, 2, 3
**Files**: `backend/app/api/routes/tasks.py`

**Description**: Implement the single task retrieval endpoint. Returns the task only if it belongs to the authenticated user.

**Acceptance Criteria**:
- [ ] GET `/api/tasks/{id}` returns a single task
- [ ] Task must belong to authenticated user (WHERE id = :id AND user_id = :user_id)
- [ ] Returns 200 OK with TaskRead object
- [ ] Returns 404 Not Found if task doesn't exist OR belongs to another user
- [ ] Returns 401 if no valid JWT token

---

### Task 7: Implement PUT /api/tasks/{id} — Update Task
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Tasks 1, 2, 3
**Files**: `backend/app/api/routes/tasks.py`

**Description**: Implement the task update endpoint. Updates fields provided in the request body for a task belonging to the authenticated user.

**Acceptance Criteria**:
- [ ] PUT `/api/tasks/{id}` updates an existing task
- [ ] Only updates fields present in request body (partial update)
- [ ] Task must belong to authenticated user
- [ ] Returns 200 OK with updated TaskRead object
- [ ] Returns 404 if task doesn't exist or belongs to another user
- [ ] Returns 400 if title is empty/whitespace when provided
- [ ] updated_at automatically set to current UTC time
- [ ] Returns 401 if no valid JWT token

---

### Task 8: Implement DELETE /api/tasks/{id} — Delete Task
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Tasks 1, 2, 3
**Files**: `backend/app/api/routes/tasks.py`

**Description**: Implement the task deletion endpoint. Deletes a task belonging to the authenticated user.

**Acceptance Criteria**:
- [ ] DELETE `/api/tasks/{id}` deletes a task
- [ ] Task must belong to authenticated user
- [ ] Returns 204 No Content on successful deletion
- [ ] Returns 404 if task doesn't exist or belongs to another user
- [ ] Returns 401 if no valid JWT token

---

### Task 9: Implement PATCH /api/tasks/{id}/complete — Toggle Completion
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Tasks 1, 2, 3
**Files**: `backend/app/api/routes/tasks.py`

**Description**: Implement the completion toggle endpoint. Accepts a `completed` boolean and updates the task's completion status.

**Acceptance Criteria**:
- [ ] PATCH `/api/tasks/{id}/complete` toggles completion
- [ ] Request body: `{ "completed": true/false }`
- [ ] Task must belong to authenticated user
- [ ] Returns 200 OK with updated TaskRead object
- [ ] Returns 404 if task doesn't exist or belongs to another user
- [ ] updated_at automatically set to current UTC time
- [ ] Returns 401 if no valid JWT token

---

### Task 10: Write backend API integration tests
**Specialist**: qa-testing-specialist
**Effort**: Medium
**Dependencies**: Tasks 4–9
**Files**: `backend/tests/conftest.py`, `backend/tests/test_tasks.py`, `backend/tests/test_auth.py`

**Description**: Write comprehensive integration tests for all 6 API endpoints using httpx AsyncClient and pytest. Test happy paths, auth failures, user isolation, validation errors, and edge cases.

**Acceptance Criteria**:
- [ ] Test fixtures: async client, mock JWT tokens (valid user A, valid user B, expired, invalid)
- [ ] Test each endpoint: valid request returns expected status and body
- [ ] Test 401 for all endpoints with missing/invalid/expired tokens
- [ ] Test user isolation: user A cannot see/modify/delete user B's tasks
- [ ] Test validation: empty title returns 400, invalid priority returns 422
- [ ] Test edge cases: delete non-existent task, update non-existent task
- [ ] All tests pass with `pytest backend/tests/ -v`

---

### Task 11: Implement Better Auth integration on frontend
**Specialist**: frontend-architect
**Effort**: Medium
**Dependencies**: Task 3 (JWT middleware must exist for verification)
**Files**: `frontend/lib/auth.ts`, `frontend/app/auth/page.tsx`, `frontend/lib/api-client.ts`, `frontend/app/layout.tsx`

**Description**: Integrate Better Auth client-side for sign-up, sign-in, and sign-out flows. Store JWT token and attach to all API requests. Implement auth state management and route protection.

**Acceptance Criteria**:
- [ ] Better Auth client initialized with `NEXT_PUBLIC_BETTER_AUTH_URL`
- [ ] Sign Up form: email + password, validates format, calls Better Auth
- [ ] Sign In form: email + password, returns JWT token on success
- [ ] Token stored securely and attached to API requests via `Authorization: Bearer`
- [ ] Sign Out clears token and redirects to `/auth`
- [ ] `/dashboard` redirects to `/auth` if not authenticated
- [ ] `/auth` redirects to `/dashboard` if already authenticated
- [ ] Error states shown for invalid credentials, duplicate email, etc.

---

### Task 12: Build Dashboard page with task management UI
**Specialist**: frontend-architect
**Effort**: Large
**Dependencies**: Tasks 5, 11 (need list API + auth working)
**Files**: `frontend/app/dashboard/page.tsx`, `frontend/components/tasks/task-list.tsx`, `frontend/components/tasks/task-item.tsx`, `frontend/components/tasks/task-form.tsx`, `frontend/components/tasks/task-filters.tsx`

**Description**: Build the full task management dashboard. Fetch and display tasks, create/edit/delete tasks, toggle completion, filter by status, sort by created/title. All operations use the typed API client.

**Acceptance Criteria**:
- [ ] Dashboard loads and displays all user's tasks from `GET /api/tasks`
- [ ] "New Task" button opens TaskForm in create mode
- [ ] TaskForm submits via `POST /api/tasks` and refreshes list
- [ ] TaskItem shows checkbox (toggle), title, description, priority badge, edit/delete buttons
- [ ] Edit button opens TaskForm pre-filled with task data, submits via `PUT /api/tasks/{id}`
- [ ] Delete button shows confirmation dialog, then calls `DELETE /api/tasks/{id}`
- [ ] Checkbox toggles via `PATCH /api/tasks/{id}/complete`
- [ ] TaskFilters: filter by status (All/Pending/Completed), sort by Created/Title
- [ ] Loading states shown during API calls
- [ ] Error states shown on API failures
- [ ] Empty state shown when no tasks exist
- [ ] Responsive layout: mobile (single column), tablet, desktop (max-w-4xl)

---

### Task 13: Build shared UI components
**Specialist**: frontend-architect
**Effort**: Medium
**Dependencies**: None (can parallel with backend work)
**Files**: `frontend/components/ui/button.tsx`, `frontend/components/ui/input.tsx`, `frontend/components/ui/select.tsx`, `frontend/components/ui/dialog.tsx`, `frontend/components/ui/badge.tsx`, `frontend/components/ui/spinner.tsx`

**Description**: Create the shared UI component library: Button (primary/secondary/danger), Input (with label/error), Select, Dialog (for confirmations), Badge (for priorities), and Spinner (for loading states). All styled with Tailwind CSS.

**Acceptance Criteria**:
- [ ] Button: primary (blue), secondary (gray), danger (red) variants, disabled state
- [ ] Input: label, placeholder, error message, disabled state
- [ ] Select: label, options array, onChange callback
- [ ] Dialog: title, message, confirm/cancel buttons, overlay
- [ ] Badge: color variants for priorities (red/yellow/green)
- [ ] Spinner: animated loading indicator
- [ ] All components use TypeScript interfaces for props
- [ ] Server Components by default; `"use client"` only when needed

---

### Task 14: Polish Landing page and overall styling
**Specialist**: frontend-architect
**Effort**: Small
**Dependencies**: Task 13 (shared UI components)
**Files**: `frontend/app/page.tsx`, `frontend/app/globals.css`, `frontend/app/layout.tsx`

**Description**: Polish the landing page with hero section, project description, and CTA buttons. Ensure global styles (fonts, colors, spacing) are consistent across all pages. Apply Tailwind CSS responsive design.

**Acceptance Criteria**:
- [ ] Landing page has hero section with project title and description
- [ ] CTA buttons: "Sign In" → `/auth`, "Go to Dashboard" → `/dashboard`
- [ ] Consistent typography, color palette, and spacing
- [ ] Dark/light mode support (or single cohesive theme)
- [ ] Responsive layout works on mobile, tablet, and desktop
- [ ] Navigation header with auth state awareness

---

### Task 15: Set up Alembic migrations
**Specialist**: python-specialist
**Effort**: Small
**Dependencies**: Tasks 1, 2
**Files**: `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/versions/`

**Description**: Initialize Alembic for database migrations. Generate the initial migration from the SQLModel Task table definition. Verify migration runs against Neon PostgreSQL.

**Acceptance Criteria**:
- [ ] `alembic init` creates migration infrastructure
- [ ] `alembic.ini` configured with async PostgreSQL driver
- [ ] `env.py` imports SQLModel metadata for auto-generation
- [ ] Initial migration creates `tasks` table with all columns and indexes
- [ ] `alembic upgrade head` runs successfully against Neon
- [ ] `alembic downgrade -1` rolls back cleanly

---

### Task 16: End-to-end integration test (full flow)
**Specialist**: qa-testing-specialist
**Effort**: Medium
**Dependencies**: Tasks 10, 12, 14 (all features implemented)
**Files**: `backend/tests/test_e2e.py` or manual test script

**Description**: Verify the full end-to-end flow: sign up → sign in → create task → list tasks → update task → toggle complete → delete task → sign out. Test both API-level and verify frontend renders correctly.

**Acceptance Criteria**:
- [ ] Complete user journey works: register → login → CRUD → logout
- [ ] API responses match spec exactly (status codes, response shapes)
- [ ] User isolation verified: two users cannot see each other's tasks
- [ ] Error responses match spec (404 for cross-user, 401 for unauthed, 400 for validation)
- [ ] Frontend displays correct data from API
- [ ] No console errors in browser
- [ ] Responsive design works at all breakpoints

## Dependencies Graph

```
Task 1 (DB Connection) ──┐
                         ├──► Task 4 (Create) ──┐
Task 2 (Task Model) ────┤                       │
                         ├──► Task 5 (List) ─────┤
Task 3 (JWT Auth) ──────┤                       ├──► Task 10 (API Tests) ──┐
                         ├──► Task 6 (Get) ──────┤                         │
                         │                       │                         │
                         ├──► Task 7 (Update) ───┤                         │
                         │                       │                         │
                         ├──► Task 8 (Delete) ───┤                         │
                         │                       │                         │
                         └──► Task 9 (Toggle) ───┘                         │
                                                                           │
Task 15 (Alembic) ◄── Tasks 1, 2                                          │
                                                                           │
Task 13 (UI Components) ──► Task 14 (Landing) ──┐                         │
                                                  ├──► Task 16 (E2E Test)
Task 3 ──► Task 11 (Better Auth) ──► Task 12 (Dashboard) ──────────────────┘
```

### Execution Order (Recommended)

**Wave 1** (parallel): Tasks 1, 2, 3, 13
**Wave 2** (parallel): Tasks 4, 5, 6, 7, 8, 9, 15
**Wave 3** (parallel): Tasks 10, 11, 14
**Wave 4** (sequential): Task 12
**Wave 5** (sequential): Task 16

## Skills Folder Integration

Each task is assigned to a specialist. The specialist's `skills/<name>/CLAUDE.md` provides domain-specific guidelines, patterns, and constraints:

| Specialist | Tasks | Domain |
|------------|-------|--------|
| python-specialist | 1–9, 15 | FastAPI, SQLModel, asyncpg, JWT, Alembic |
| frontend-architect | 11–14 | Next.js App Router, TypeScript, Tailwind, Better Auth |
| qa-testing-specialist | 10, 16 | pytest, httpx, integration tests, e2e |
| ai-mcp-integration | — | Phase III prep (not needed Phase II) |
| cloud-native-devops | — | Phase IV prep (not needed Phase II) |

## Testing Strategy

### Backend (pytest + httpx)
- **Unit tests**: Model validation, JWT token parsing
- **Integration tests**: All 6 API endpoints with async test client
- **User isolation tests**: Cross-user access returns 404
- **Auth tests**: Missing/invalid/expired token returns 401

### Frontend (Vitest + React Testing Library)
- **Component tests**: TaskItem, TaskForm, TaskList render correctly
- **Integration tests**: API client calls with mocked fetch
- **Page tests**: Dashboard loads, auth redirects work

### E2E (Manual or Playwright — Phase II scope)
- Full user journey: sign up → CRUD → sign out
- Cross-browser (Chrome, Firefox, Safari)
- Responsive breakpoints verified

## Iteration & Review

1. **After each Wave**: Run tests, review code, commit
2. **After Wave 2**: Backend fully functional — API can be tested independently
3. **After Wave 3**: Auth integrated, tests pass, UI components ready
4. **After Wave 4**: Full application functional with all features
5. **After Wave 5**: E2E verified, ready for deployment preparation

## Next Steps

1. Run `/sp.tasks` to convert this plan into an executable tasks.md
2. Run `/sp.implement` to begin task-by-task execution
3. After implementation: `/sp.git.commit_pr` to commit and create PR
4. Future: `/sp.adr` for any significant decisions made during implementation

## Risks

1. **Better Auth integration complexity** — Better Auth is newer and docs may be limited. Mitigation: Start with JWT verification only (Task 3) before full Better Auth client setup (Task 11).
2. **Neon cold start latency** — Serverless PostgreSQL may have cold start delays. Mitigation: Connection pooling and keep-alive in production.
3. **Cross-origin issues** — Frontend (3000) → Backend (8000) requires CORS. Mitigation: Already configured in scaffold (`backend/app/main.py`).

## Complexity Tracking

No constitution violations detected. All tasks follow the smallest viable diff principle.

# Phase II Task Breakdown v1.0 — Full-Stack Web Todo App with Auth

**Branch**: `1-rest-api-spec` | **Date**: 2026-02-07 | **Version**: 1.0.0
**Phase**: II — Full-Stack Web Application
**Constitution**: `.specify/memory/constitution.md` (v2.0.0)

---

## Overview

This task breakdown implements Phase II of "The Evolution of Todo" — a multi-user full-stack web application with JWT-authenticated task management. The implementation follows the Spec-Driven Development workflow with AI-only implementation across 18 granular tasks.

### Key Deliverables

- **Backend**: FastAPI REST API with SQLModel ORM, JWT auth, user-isolated CRUD
- **Frontend**: Next.js 16 App Router with Better Auth, responsive Tailwind UI
- **Database**: Neon Serverless PostgreSQL with async connection
- **Auth**: JWT Bearer token verification, Better Auth integration
- **Security**: User isolation via JWT `sub` claim, 404 for cross-user access

### Specialist Skills

Tasks are assigned to specialist roles with dedicated CLAUDE.md guidelines:

| Specialist | Folder | Focus |
|------------|--------|-------|
| **python-specialist** | `skills/python-specialist/` | FastAPI, SQLModel, JWT, asyncpg, Alembic |
| **frontend-architect** | `skills/frontend-architect/` | Next.js, TypeScript, Tailwind, Better Auth |
| **qa-testing-specialist** | `skills/qa-testing-specialist/` | pytest, httpx, integration/e2e tests |
| **cloud-native-devops** | `skills/cloud-native-devops/` | Docker, docker-compose, .env management |
| **ai-mcp-integration** | `skills/ai-mcp-integration/` | Phase III prep (advisory only) |

---

## Task Checklist Format

Each task follows this format:
```
- [ ] T### [P] [US#] Description with exact file path
```

- **T###**: Sequential task ID (T001, T002, etc.)
- **[P]**: Parallelizable (can run concurrently with other [P] tasks in same wave)
- **[US#]**: User Story number (for story-specific tasks)
- **Description**: Action + target file/folder

---

## Phase 1: Setup & Prerequisites

### Goal
Initialize monorepo structure, verify tools, and prepare environment configuration.

### Tasks

- [ ] T001 Verify monorepo structure exists: `backend/`, `frontend/`, `specs/`, `skills/`, `history/`, `.specify/`
- [ ] T002 Verify skills CLAUDE.md files exist in all 5 specialist folders
- [ ] T003 Copy `.env.example` to `.env` at root and verify template structure
- [ ] T004 Copy `backend/.env.example` to `backend/.env` and document required variables
- [ ] T005 Copy `frontend/.env.example` to `frontend/.env.local` and document required variables
- [ ] T006 Generate `BETTER_AUTH_SECRET` using Python and add to both backend/.env and frontend/.env.local (must match)
- [ ] T007 Sign up for Neon PostgreSQL account, create project, and obtain `DATABASE_URL` connection string
- [ ] T008 Add `DATABASE_URL` to `backend/.env` with `postgresql+asyncpg://` prefix for async support

**Dependencies**: None (first phase)
**Estimated Effort**: Low (30-45 minutes)

**Acceptance Criteria**:
- ✅ All directories exist as per monorepo structure
- ✅ All 5 skills CLAUDE.md files present and readable
- ✅ `.env`, `backend/.env`, `frontend/.env.local` files created with correct variables
- ✅ `BETTER_AUTH_SECRET` is identical in backend/.env and frontend/.env.local
- ✅ `DATABASE_URL` is valid Neon connection string with asyncpg driver

---

## Phase 2: Backend Foundation

### Goal
Set up FastAPI application structure, database connection, and SQLModel Task model.

### User Story
**US1**: As a developer, I want a working FastAPI backend with database connection so that I can build CRUD endpoints.

### Tasks

- [ ] T009 [P] [US1] Initialize backend dependencies with UV: verify `backend/pyproject.toml` has all required packages (fastapi, sqlmodel, asyncpg, pyjwt, uvicorn, alembic, httpx, pytest)
- [ ] T010 [P] [US1] Run `uv sync` in backend/ to install all dependencies and verify installation
- [ ] T011 [US1] Configure Pydantic Settings in `backend/app/config.py` to load environment variables from .env
- [ ] T012 [US1] Implement async database connection in `backend/app/database/connection.py` using `create_async_engine` with Neon URL
- [ ] T013 [US1] Create `create_db_and_tables()` lifespan function in `backend/app/database/connection.py` for table initialization
- [ ] T014 [US1] Define SQLModel Task table in `backend/app/models/task.py` with fields: id (SERIAL PK), title (VARCHAR 255 NOT NULL), description (TEXT nullable), priority (VARCHAR default 'medium'), completed (BOOLEAN default False), user_id (str indexed), created_at, updated_at
- [ ] T015 [US1] Create Pydantic schemas in `backend/app/models/task.py`: TaskCreate, TaskUpdate, TaskRead with proper field validation
- [ ] T016 [US1] Initialize Alembic in `backend/` with async driver configuration in `alembic.ini` and `env.py`
- [ ] T017 [US1] Generate initial Alembic migration for tasks table: `alembic revision --autogenerate -m "Initial migration: tasks table"`
- [ ] T018 [US1] Apply Alembic migration to Neon database: `alembic upgrade head` and verify tables in Neon dashboard
- [ ] T019 [US1] Create FastAPI app in `backend/app/main.py` with CORS middleware, lifespan context manager, and health route at `/api/health`
- [ ] T020 [US1] Test backend starts successfully: `uv run uvicorn app.main:app --reload` and verify health endpoint returns 200

**Dependencies**: Phase 1 (T001-T008 must be complete)
**Estimated Effort**: Medium (2-3 hours)

**Acceptance Criteria**:
- ✅ All dependencies installed via `uv sync`
- ✅ Config loads `DATABASE_URL` and `BETTER_AUTH_SECRET` from .env
- ✅ Async engine connects to Neon successfully
- ✅ Task table with all fields defined in SQLModel
- ✅ TaskCreate, TaskUpdate, TaskRead schemas validate correctly
- ✅ Alembic migration applied, tasks table visible in Neon
- ✅ FastAPI app starts on port 8000, `/api/health` returns 200
- ✅ OpenAPI docs accessible at `http://localhost:8000/docs`

---

## Phase 3: JWT Authentication Middleware

### Goal
Implement JWT Bearer token verification to extract user_id from Better Auth tokens.

### User Story
**US2**: As a backend developer, I want JWT authentication middleware so that all endpoints can verify user identity.

### Tasks

- [ ] T021 [US2] Implement `get_current_user_id()` dependency in `backend/app/auth/jwt.py` using HTTPBearer security scheme
- [ ] T022 [US2] Add JWT token verification in `get_current_user_id()` using python-jose with HS256 algorithm and `BETTER_AUTH_SECRET`
- [ ] T023 [US2] Extract `sub` claim from JWT payload as user_id (str type) in `get_current_user_id()`
- [ ] T024 [US2] Implement error handling in `get_current_user_id()`: return 401 for missing/invalid/expired tokens with appropriate error messages
- [ ] T025 [US2] Create auth test fixtures in `backend/tests/conftest.py`: `make_token()` function for generating test JWTs with different scenarios (valid, expired, invalid)
- [ ] T026 [US2] Write auth middleware tests in `backend/tests/test_auth.py`: test missing token (401), invalid token (401), expired token (401), valid token (extracts user_id)

**Dependencies**: Phase 2 (T009-T020 must be complete)
**Estimated Effort**: Medium (1.5-2 hours)

**Acceptance Criteria**:
- ✅ `get_current_user_id()` extracts Bearer token from Authorization header
- ✅ JWT signature verified with `BETTER_AUTH_SECRET` using HS256
- ✅ `sub` claim extracted as user_id (str)
- ✅ Returns 401 for all auth failure scenarios (missing, invalid, expired)
- ✅ Test fixtures generate valid/invalid/expired tokens
- ✅ All auth tests pass: `pytest backend/tests/test_auth.py -v`

---

## Phase 4: Task CRUD API Endpoints

### Goal
Implement all 6 REST API endpoints for task CRUD with user isolation.

### User Story
**US3**: As a backend developer, I want secure task CRUD endpoints with user isolation so that each user can only access their own tasks.

### Tasks

- [ ] T027 [P] [US3] Create `_get_user_task()` helper in `backend/app/api/routes/tasks.py` that queries Task WHERE id=:id AND user_id=:user_id, returns 404 if not found
- [ ] T028 [P] [US3] Implement POST `/api/tasks` endpoint: create task with user_id from JWT, validate title required, return 201 with TaskRead
- [ ] T029 [P] [US3] Implement GET `/api/tasks` endpoint: list all tasks for authenticated user with optional filters (status, sort, limit, offset), return 200 with TaskRead array
- [ ] T030 [P] [US3] Implement GET `/api/tasks/{id}` endpoint: return single task using `_get_user_task()` helper, return 200 or 404
- [ ] T031 [P] [US3] Implement PUT `/api/tasks/{id}` endpoint: partial update using `_get_user_task()`, validate title if provided, set updated_at, return 200 or 404
- [ ] T032 [P] [US3] Implement DELETE `/api/tasks/{id}` endpoint: delete task using `_get_user_task()`, return 204 or 404
- [ ] T033 [P] [US3] Implement PATCH `/api/tasks/{id}/complete` endpoint: toggle completion status using `_get_user_task()`, return 200 or 404
- [ ] T034 [US3] Mount tasks router in `backend/app/main.py` at `/api/tasks` prefix with "tasks" tag
- [ ] T035 [US3] Test all endpoints manually via `/docs`: create task, list tasks, get single, update, delete, toggle completion

**Dependencies**: Phase 3 (T021-T026 must be complete)
**Estimated Effort**: High (3-4 hours)

**Acceptance Criteria**:
- ✅ `_get_user_task()` enforces user isolation (404 for cross-user access)
- ✅ POST creates task with user_id from JWT, returns 201
- ✅ GET list returns only authenticated user's tasks, empty array if none
- ✅ GET single returns task or 404 (cross-user also 404)
- ✅ PUT updates fields, sets updated_at, returns 404 for cross-user
- ✅ DELETE removes task, returns 204 or 404
- ✅ PATCH toggles completed field, returns 200 or 404
- ✅ All endpoints accessible via `/docs` with JWT Bearer auth
- ✅ Manual testing confirms user isolation works

---

## Phase 5: Backend Integration Tests

### Goal
Write comprehensive integration tests for all API endpoints with auth and user isolation.

### User Story
**US4**: As a QA specialist, I want integration tests covering all endpoints so that user isolation and auth are verified.

### Tasks

- [ ] T036 [US4] Create async test client fixture in `backend/tests/conftest.py` using httpx.AsyncClient with app
- [ ] T037 [US4] Create JWT token fixtures in `backend/tests/conftest.py`: `user_a_token`, `user_b_token`, `expired_token`, `invalid_token`
- [ ] T038 [US4] Create `auth_headers()` helper in `backend/tests/conftest.py` to format Authorization header
- [ ] T039 [P] [US4] Write POST `/api/tasks` tests in `backend/tests/test_tasks.py`: valid create (201), empty title (400), no auth (401), invalid token (401)
- [ ] T040 [P] [US4] Write GET `/api/tasks` tests in `backend/tests/test_tasks.py`: list own tasks (200), empty list (200), no auth (401), filters work
- [ ] T041 [P] [US4] Write GET `/api/tasks/{id}` tests in `backend/tests/test_tasks.py`: own task (200), cross-user task (404), non-existent (404), no auth (401)
- [ ] T042 [P] [US4] Write PUT `/api/tasks/{id}` tests in `backend/tests/test_tasks.py`: valid update (200), cross-user (404), empty title (400), no auth (401)
- [ ] T043 [P] [US4] Write DELETE `/api/tasks/{id}` tests in `backend/tests/test_tasks.py`: own task (204), cross-user (404), non-existent (404), no auth (401)
- [ ] T044 [P] [US4] Write PATCH `/api/tasks/{id}/complete` tests in `backend/tests/test_tasks.py`: toggle true/false (200), cross-user (404), no auth (401)
- [ ] T045 [US4] Write user isolation integration test in `backend/tests/test_tasks.py`: user A creates task, user B cannot see/modify/delete it
- [ ] T046 [US4] Run all backend tests and verify 100% pass: `pytest backend/tests/ -v --tb=short`

**Dependencies**: Phase 4 (T027-T035 must be complete)
**Estimated Effort**: High (3-4 hours)

**Acceptance Criteria**:
- ✅ Async test client configured with app
- ✅ Token fixtures generate valid/invalid/expired tokens for user A and B
- ✅ All endpoint tests cover happy path + auth failures + validation errors
- ✅ Cross-user access consistently returns 404 (never 403 or 200)
- ✅ User isolation test confirms user A tasks hidden from user B
- ✅ All tests pass: `pytest backend/tests/ -v` shows 0 failures

---

## Phase 6: Frontend Foundation

### Goal
Set up Next.js application with TypeScript, Tailwind CSS, and project structure.

### User Story
**US5**: As a frontend developer, I want a working Next.js app with Tailwind so that I can build the UI.

### Tasks

- [ ] T047 [P] [US5] Initialize frontend dependencies: verify `frontend/package.json` has next@16, react@19, tailwindcss@3.4.1, better-auth@0.4.0, typescript@5.7
- [ ] T048 [P] [US5] Run `npm install` in frontend/ to install all dependencies and verify installation
- [ ] T049 [US5] Configure Tailwind CSS in `frontend/tailwind.config.ts` with content paths for app/, components/, and Tailwind v4 settings
- [ ] T050 [US5] Import Tailwind directives in `frontend/app/globals.css`: @tailwind base, components, utilities
- [ ] T051 [US5] Create root layout in `frontend/app/layout.tsx` with html/body tags, global CSS import, and metadata
- [ ] T052 [US5] Create landing page in `frontend/app/page.tsx` with hero section, project title, and CTA buttons (Sign In, Dashboard)
- [ ] T053 [US5] Configure Next.js proxy rewrites in `frontend/next.config.ts` to forward `/api/*` to `http://localhost:8000/api/*`
- [ ] T054 [US5] Test frontend starts successfully: `npm run dev` and verify landing page renders at `http://localhost:3000`

**Dependencies**: Phase 1 (T001-T008 must be complete)
**Estimated Effort**: Medium (1.5-2 hours)

**Acceptance Criteria**:
- ✅ All dependencies installed via `npm install`
- ✅ Tailwind CSS configured and directives imported
- ✅ Root layout renders with proper HTML structure
- ✅ Landing page displays with hero + CTAs
- ✅ Next.js rewrites configured to proxy API calls
- ✅ Frontend starts on port 3000 without errors
- ✅ No console errors in browser

---

## Phase 7: Frontend API Client

### Goal
Create typed API client that automatically attaches JWT Bearer token to all requests.

### User Story
**US6**: As a frontend developer, I want a typed API client with automatic JWT attachment so that all API calls are authenticated.

### Tasks

- [ ] T055 [US6] Define TypeScript interfaces in `frontend/types/task.ts`: Task, TaskCreate, TaskUpdate matching backend schemas
- [ ] T056 [US6] Create `getToken()` helper in `frontend/lib/api-client.ts` to retrieve JWT from localStorage (or cookies)
- [ ] T057 [US6] Create `authHeaders()` helper in `frontend/lib/api-client.ts` to format Authorization Bearer header with token
- [ ] T058 [US6] Create `apiFetch()` wrapper in `frontend/lib/api-client.ts` that adds auth headers and handles errors (throw Error with detail message)
- [ ] T059 [P] [US6] Implement `taskApi.list()` in `frontend/lib/api-client.ts`: GET `/api/tasks` with optional query params (status, sort, limit, offset)
- [ ] T060 [P] [US6] Implement `taskApi.get()` in `frontend/lib/api-client.ts`: GET `/api/tasks/{id}`
- [ ] T061 [P] [US6] Implement `taskApi.create()` in `frontend/lib/api-client.ts`: POST `/api/tasks` with TaskCreate body
- [ ] T062 [P] [US6] Implement `taskApi.update()` in `frontend/lib/api-client.ts`: PUT `/api/tasks/{id}` with TaskUpdate body
- [ ] T063 [P] [US6] Implement `taskApi.delete()` in `frontend/lib/api-client.ts`: DELETE `/api/tasks/{id}`
- [ ] T064 [P] [US6] Implement `taskApi.toggleComplete()` in `frontend/lib/api-client.ts`: PATCH `/api/tasks/{id}/complete`

**Dependencies**: Phase 6 (T047-T054 must be complete)
**Estimated Effort**: Medium (2-3 hours)

**Acceptance Criteria**:
- ✅ TypeScript interfaces match backend schemas exactly
- ✅ `getToken()` retrieves token from storage
- ✅ `authHeaders()` formats correct Authorization header
- ✅ `apiFetch()` adds headers and throws errors with server detail
- ✅ All 6 taskApi methods defined with correct HTTP method and endpoint
- ✅ TypeScript compilation passes: `npm run build`

---

## Phase 8: Better Auth Integration

### Goal
Integrate Better Auth for sign-up, sign-in, and session management on frontend.

### User Story
**US7**: As a user, I want to sign up and sign in so that I can access my tasks securely.

### Tasks

- [ ] T065 [US7] Initialize Better Auth client in `frontend/lib/auth.ts` with `NEXT_PUBLIC_BETTER_AUTH_URL` from env
- [ ] T066 [US7] Create auth page in `frontend/app/auth/page.tsx` with tabs/toggle for Sign In and Sign Up forms
- [ ] T067 [US7] Implement Sign Up form in `frontend/app/auth/page.tsx`: email + password fields, validation, Better Auth signup call
- [ ] T068 [US7] Implement Sign In form in `frontend/app/auth/page.tsx`: email + password fields, Better Auth signin call, store JWT token on success
- [ ] T069 [US7] Add error state handling in auth forms: display error messages for invalid credentials, duplicate email, validation errors
- [ ] T070 [US7] Implement Sign Out functionality: clear token from storage and redirect to `/auth`
- [ ] T071 [US7] Add auth state check in `frontend/app/dashboard/page.tsx`: redirect to `/auth` if no token present
- [ ] T072 [US7] Add auth redirect in `frontend/app/auth/page.tsx`: redirect to `/dashboard` if already authenticated
- [ ] T073 [US7] Test auth flow manually: sign up new user, sign in, verify token stored, sign out, verify redirect

**Dependencies**: Phase 7 (T055-T064 must be complete)
**Estimated Effort**: High (3-4 hours)

**Acceptance Criteria**:
- ✅ Better Auth client initialized with correct URL
- ✅ Auth page has toggle between Sign Up and Sign In
- ✅ Sign Up form creates user and returns JWT token
- ✅ Sign In form authenticates and stores JWT token
- ✅ Error messages display for all failure scenarios
- ✅ Sign Out clears token and redirects to `/auth`
- ✅ Dashboard redirects unauthenticated users to `/auth`
- ✅ Auth page redirects authenticated users to `/dashboard`
- ✅ Manual test of full flow succeeds

---

## Phase 9: Shared UI Components

### Goal
Build reusable UI components library with Tailwind styling.

### User Story
**US8**: As a frontend developer, I want shared UI components so that the interface is consistent.

### Tasks

- [ ] T074 [P] [US8] Create Button component in `frontend/components/ui/button.tsx` with variants: primary (blue), secondary (gray), danger (red), disabled state
- [ ] T075 [P] [US8] Create Input component in `frontend/components/ui/input.tsx` with label, placeholder, error message, disabled state
- [ ] T076 [P] [US8] Create Select component in `frontend/components/ui/select.tsx` with label, options array, onChange callback
- [ ] T077 [P] [US8] Create Dialog component in `frontend/components/ui/dialog.tsx` for confirmations: title, message, confirm/cancel buttons, overlay
- [ ] T078 [P] [US8] Create Badge component in `frontend/components/ui/badge.tsx` with color variants for priorities: high (red), medium (yellow), low (green)
- [ ] T079 [P] [US8] Create Spinner component in `frontend/components/ui/spinner.tsx` for loading states: animated CSS spinner
- [ ] T080 [US8] Verify all UI components render correctly: create test page that displays all components with different states

**Dependencies**: Phase 6 (T047-T054 must be complete)
**Estimated Effort**: Medium (2-3 hours)

**Acceptance Criteria**:
- ✅ Button has 3 variants + disabled state, Tailwind styled
- ✅ Input has label, error message support, Tailwind styled
- ✅ Select has label, dynamic options, Tailwind styled
- ✅ Dialog has overlay, title, message, confirm/cancel, Tailwind styled
- ✅ Badge has 3 color variants for priorities, Tailwind styled
- ✅ Spinner has animated loading indicator, Tailwind styled
- ✅ All components use TypeScript interfaces for props
- ✅ All components render without console errors

---

## Phase 10: Task Management Dashboard

### Goal
Build complete task management UI with CRUD operations and responsive design.

### User Story
**US9**: As a user, I want a dashboard to manage my tasks so that I can create, edit, delete, and complete tasks.

### Tasks

- [ ] T081 [US9] Create TaskItem component in `frontend/components/tasks/task-item.tsx`: checkbox (toggle), title, description, priority badge, edit/delete buttons
- [ ] T082 [US9] Add completed state styling to TaskItem: strikethrough title, muted text when completed=true
- [ ] T083 [US9] Create TaskForm component in `frontend/components/tasks/task-form.tsx` as client component with useState: title input, description textarea, priority select
- [ ] T084 [US9] Add form validation to TaskForm: title required (show error if empty), submit disabled if invalid
- [ ] T085 [US9] Implement TaskForm submit handler: calls taskApi.create() or taskApi.update() based on mode (create/edit)
- [ ] T086 [US9] Create TaskList component in `frontend/components/tasks/task-list.tsx`: maps tasks array to TaskItem components, empty state message
- [ ] T087 [US9] Create TaskFilters component in `frontend/components/tasks/task-filters.tsx`: status dropdown (All/Pending/Completed), sort dropdown (Created/Title)
- [ ] T088 [US9] Implement Dashboard page in `frontend/app/dashboard/page.tsx`: fetch tasks on mount using taskApi.list(), display in TaskList
- [ ] T089 [US9] Add "New Task" button to Dashboard: opens TaskForm in create mode (modal or inline)
- [ ] T090 [US9] Implement edit functionality in Dashboard: TaskItem edit button opens TaskForm in edit mode with task data pre-filled
- [ ] T091 [US9] Implement delete functionality in Dashboard: TaskItem delete button shows Dialog confirmation, calls taskApi.delete() on confirm
- [ ] T092 [US9] Implement toggle completion in Dashboard: TaskItem checkbox calls taskApi.toggleComplete() and updates UI
- [ ] T093 [US9] Implement filters in Dashboard: TaskFilters onChange updates query params and refetches tasks
- [ ] T094 [US9] Add loading states to Dashboard: show Spinner while fetching tasks
- [ ] T095 [US9] Add error states to Dashboard: display error message if API calls fail
- [ ] T096 [US9] Implement responsive layout: mobile (single column), tablet (wider cards), desktop (max-w-4xl centered)
- [ ] T097 [US9] Test complete dashboard flow manually: create task, edit, delete, toggle completion, filter by status, sort

**Dependencies**: Phases 8 and 9 (T065-T080 must be complete)
**Estimated Effort**: Very High (5-6 hours)

**Acceptance Criteria**:
- ✅ TaskItem displays all fields, has checkbox + edit/delete buttons
- ✅ TaskForm validates title, submits create or update
- ✅ TaskList renders all tasks, shows empty state
- ✅ TaskFilters updates query params and triggers refetch
- ✅ Dashboard fetches and displays user's tasks on load
- ✅ New Task button opens form, creates task, refreshes list
- ✅ Edit button pre-fills form, updates task, refreshes list
- ✅ Delete shows confirmation, deletes task, refreshes list
- ✅ Checkbox toggles completion, updates UI immediately
- ✅ Filters and sorting work correctly
- ✅ Loading spinner shown during API calls
- ✅ Error messages displayed on failures
- ✅ Responsive at all breakpoints (mobile/tablet/desktop)
- ✅ Full manual test succeeds

---

## Phase 11: End-to-End Integration Testing

### Goal
Verify complete user journey across frontend and backend with authentication.

### User Story
**US10**: As a QA specialist, I want end-to-end tests verifying the complete flow so that all integrations work.

### Tasks

- [ ] T098 [US10] Write E2E test in `backend/tests/test_e2e.py`: full journey from sign up → sign in → create task → list tasks → update task → toggle complete → delete task → sign out
- [ ] T099 [US10] Verify E2E test covers user isolation: create user A and user B, verify user A cannot see user B's tasks via API
- [ ] T100 [US10] Verify E2E test covers auth failures: attempt API calls without token (401), with invalid token (401), with expired token (401)
- [ ] T101 [US10] Run E2E test and verify success: `pytest backend/tests/test_e2e.py -v`
- [ ] T102 [US10] Perform manual E2E test via browser: complete full user journey from sign up to all CRUD operations
- [ ] T103 [US10] Verify API responses match spec: check status codes, response shapes, error formats across all endpoints
- [ ] T104 [US10] Verify no console errors in browser during manual E2E test

**Dependencies**: Phase 10 (T081-T097 must be complete)
**Estimated Effort**: Medium (2-3 hours)

**Acceptance Criteria**:
- ✅ E2E test covers complete user journey (sign up → CRUD → sign out)
- ✅ User isolation verified in E2E test (cross-user returns 404)
- ✅ Auth failure scenarios tested (401 for all cases)
- ✅ E2E test passes: `pytest backend/tests/test_e2e.py -v`
- ✅ Manual browser test completes successfully
- ✅ All API responses match spec exactly
- ✅ No console errors during manual test
- ✅ Frontend displays correct data from backend

---

## Phase 12: Docker Compose & Run Commands

### Goal
Configure Docker Compose for local development and document run commands.

### User Story
**US11**: As a developer, I want Docker Compose setup so that I can run the entire stack easily.

### Tasks

- [ ] T105 [US11] Verify `docker-compose.yml` exists at root with backend and frontend services
- [ ] T106 [US11] Verify backend service in docker-compose: builds from `backend/Dockerfile`, exposes port 8000, mounts .env
- [ ] T107 [US11] Verify frontend service in docker-compose: builds from `frontend/Dockerfile`, exposes port 3000, depends on backend
- [ ] T108 [US11] Test Docker Compose startup: `docker-compose up --build` and verify both services start
- [ ] T109 [US11] Test frontend accessibility via Docker: `http://localhost:3000` loads landing page
- [ ] T110 [US11] Test backend accessibility via Docker: `http://localhost:8000/docs` loads OpenAPI docs
- [ ] T111 [US11] Document run commands in README.md: separate terminals (backend + frontend) and Docker Compose options
- [ ] T112 [US11] Create quick start section in README.md with .env setup instructions

**Dependencies**: Phase 11 (T098-T104 must be complete)
**Estimated Effort**: Low (1 hour)

**Acceptance Criteria**:
- ✅ `docker-compose.yml` configured with backend + frontend services
- ✅ `docker-compose up --build` starts both services without errors
- ✅ Frontend accessible at http://localhost:3000
- ✅ Backend accessible at http://localhost:8000
- ✅ README.md documents run commands clearly
- ✅ Quick start section guides new developers

---

## Phase 13: Documentation & Polish

### Goal
Finalize documentation, verify all specs are met, and polish the application.

### User Story
**US12**: As a project maintainer, I want complete documentation so that the project is ready for handoff.

### Tasks

- [ ] T113 [US12] Update `backend/CLAUDE.md` with any new patterns discovered during implementation
- [ ] T114 [US12] Update `frontend/CLAUDE.md` with any new patterns discovered during implementation
- [ ] T115 [US12] Verify all acceptance criteria from `specs/features/task-crud.md` are met (mark checkboxes)
- [ ] T116 [US12] Verify all acceptance criteria from `specs/api/rest-endpoints.md` are met (status codes, response shapes)
- [ ] T117 [US12] Verify all acceptance criteria from `specs/features/authentication.md` are met (sign up, sign in, JWT)
- [ ] T118 [US12] Polish landing page styling: ensure hero section is visually appealing, CTAs are prominent
- [ ] T119 [US12] Polish dashboard styling: ensure consistent spacing, readable fonts, accessible colors
- [ ] T120 [US12] Verify responsive design at all breakpoints: test on mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- [ ] T121 [US12] Run final verification: `bash verify-tools.sh` shows all required tools installed
- [ ] T122 [US12] Create final PHR documenting Phase II completion

**Dependencies**: Phase 12 (T105-T112 must be complete)
**Estimated Effort**: Medium (2 hours)

**Acceptance Criteria**:
- ✅ All CLAUDE.md files updated with implementation learnings
- ✅ All spec acceptance criteria marked as complete
- ✅ Landing page visually polished
- ✅ Dashboard visually polished and consistent
- ✅ Responsive design verified at all breakpoints
- ✅ All tools verified with `verify-tools.sh`
- ✅ Phase II completion documented in PHR

---

## Task Dependencies Graph

### Sequential Dependencies

```
Phase 1 (Setup)
  T001-T008 → No dependencies (can run in parallel)
    ↓
Phase 2 (Backend Foundation)
  T009-T020 → Depends on Phase 1
    ↓
Phase 3 (JWT Auth)
  T021-T026 → Depends on Phase 2
    ↓
Phase 4 (CRUD Endpoints)
  T027-T035 → Depends on Phase 3
    ↓
Phase 5 (Backend Tests)
  T036-T046 → Depends on Phase 4

Phase 6 (Frontend Foundation)
  T047-T054 → Depends on Phase 1 (parallel with Phase 2-5)
    ↓
Phase 7 (API Client)
  T055-T064 → Depends on Phase 6
    ↓
Phase 8 (Better Auth)
  T065-T073 → Depends on Phase 7
    ↓
Phase 9 (UI Components)
  T074-T080 → Depends on Phase 6 (parallel with Phase 7-8)
    ↓
Phase 10 (Dashboard)
  T081-T097 → Depends on Phases 8 and 9
    ↓
Phase 11 (E2E Tests)
  T098-T104 → Depends on Phases 5 and 10 (backend + frontend complete)
    ↓
Phase 12 (Docker Compose)
  T105-T112 → Depends on Phase 11
    ↓
Phase 13 (Documentation)
  T113-T122 → Depends on Phase 12
```

### Parallel Execution Opportunities

**Wave 1** (after Phase 1):
- Backend Foundation (T009-T020)
- Frontend Foundation (T047-T054) — runs in parallel

**Wave 2** (after Wave 1 backend):
- JWT Auth (T021-T026)

**Wave 3** (after Wave 2):
- CRUD Endpoints (T027-T035) — many tasks marked [P]

**Wave 4** (after Wave 3):
- Backend Tests (T036-T046) — many tasks marked [P]

**Wave 5** (after Wave 1 frontend):
- API Client (T055-T064) — many tasks marked [P]
- UI Components (T074-T080) — runs in parallel, many tasks marked [P]

**Wave 6** (after Wave 5):
- Better Auth (T065-T073)

**Wave 7** (after Wave 6):
- Dashboard (T081-T097)

**Wave 8** (after Wave 4 and 7):
- E2E Tests (T098-T104)

**Wave 9** (after Wave 8):
- Docker Compose (T105-T112)

**Wave 10** (after Wave 9):
- Documentation (T113-T122)

---

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

For fastest time to working application, implement in this order:

1. **Phase 1** — Setup (T001-T008): 45 minutes
2. **Phase 2** — Backend Foundation (T009-T020): 3 hours
3. **Phase 3** — JWT Auth (T021-T026): 2 hours
4. **Phase 4** — CRUD Endpoints (T027-T035): 4 hours
5. **Phase 6** — Frontend Foundation (T047-T054): 2 hours
6. **Phase 7** — API Client (T055-T064): 3 hours
7. **Phase 8** — Better Auth (T065-T073): 4 hours
8. **Phase 9** — UI Components (T074-T080): 3 hours
9. **Phase 10** — Dashboard (T081-T097): 6 hours

**Total MVP Time**: ~27-30 hours of focused development

### Full Implementation (with tests and polish)

Add these phases for complete Phase II:

10. **Phase 5** — Backend Tests (T036-T046): 4 hours
11. **Phase 11** — E2E Tests (T098-T104): 3 hours
12. **Phase 12** — Docker Compose (T105-T112): 1 hour
13. **Phase 13** — Documentation (T113-T122): 2 hours

**Total Full Implementation**: ~37-40 hours

---

## Specialist Assignments

| Specialist | Tasks | Total |
|------------|-------|-------|
| **python-specialist** | T009-T026, T027-T035, T036-T046, T113 | 42 tasks |
| **frontend-architect** | T047-T073, T074-T097, T114, T118-T120 | 56 tasks |
| **qa-testing-specialist** | T036-T046, T098-T104 | 16 tasks |
| **cloud-native-devops** | T001-T008, T105-T112, T121 | 17 tasks |
| **General** | T115-T117, T122 | 4 tasks |

---

## Success Metrics

### Phase II Complete When:

- ✅ All 122 tasks marked complete
- ✅ Backend serves 6 authenticated CRUD endpoints
- ✅ Frontend displays responsive task management UI
- ✅ User can sign up, sign in, and manage tasks
- ✅ User isolation enforced (404 for cross-user access)
- ✅ All backend tests pass (integration + E2E)
- ✅ Docker Compose runs entire stack
- ✅ All specs acceptance criteria met
- ✅ Documentation complete

### Ready for Phase III When:

- ✅ Phase II fully complete and tested
- ✅ OpenAI API key obtained
- ✅ MCP SDK understanding established
- ✅ AI chatbot spec written

---

## Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Better Auth integration complexity | Medium | Start with JWT-only verification (T021-T026) before full Better Auth (T065-T073) |
| Neon cold start latency | Low | Connection pooling configured in `connection.py` |
| Frontend-backend CORS issues | Medium | CORS middleware configured in `main.py` with `FRONTEND_URL` |
| JWT secret mismatch | High | Validate secrets match in Phase 1 (T006) before any auth work |
| User isolation bugs | Critical | Dedicated tests in Phase 5 (T045) before frontend integration |
| Responsive design complexity | Medium | Use Tailwind breakpoints consistently (T096), test at all sizes (T120) |

---

## Execution Notes

1. **Before starting**: Run `bash setup.sh` to install all tools
2. **During development**: Keep backend and frontend terminals running separately
3. **Testing**: Run tests after each phase completion
4. **Checkpoints**: Commit after each phase (not each task)
5. **Help**: Refer to specialist CLAUDE.md files in `skills/` folders
6. **Stuck**: Check `INSTALLATION.md` troubleshooting section

---

**Phase II Task Breakdown Complete** — Ready for `/sp.implement` 🚀

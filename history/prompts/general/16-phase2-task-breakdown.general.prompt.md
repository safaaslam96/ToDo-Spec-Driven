---
id: 16
title: Phase II Task Breakdown
stage: tasks
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: phase2-web-app
branch: 1-rest-api-spec
user: safaaslam96
command: /sp.tasks
labels: ["tasks", "phase2", "breakdown", "implementation", "full-stack"]
links: {spec: "specs/features/task-crud.md", ticket: null, adr: null, pr: null}
files: ["specs_history/phase2_tasks_v1.tasks.md"]
tests: ["none"]
---

## Prompt

/sp.tasks specs_history/phase2_tasks_v1.tasks.md Phase II Task Breakdown v1.0 - Full-Stack Web Todo App with Auth

Generate a detailed task breakdown for Phase II implementation based on the constitution v2.0.0 and all specs.

Special requirement: Reference existing "skills" folders for specialist roles (already created in /sp.plan):
- /skills/python-specialist/CLAUDE.md
- /skills/frontend-architect/CLAUDE.md
- /skills/ai-mcp-integration/CLAUDE.md
- /skills/cloud-native-devops/CLAUDE.md
- /skills/qa-testing-specialist/CLAUDE.md

Break into 14-18 granular tasks for Phase II (full-stack web app with auth).

Task categories requested: Monorepo setup, Backend (FastAPI, SQLModel), Database (Neon, migrations), Auth (Better Auth, JWT), CRUD API routes, Frontend (Next.js, Tailwind), Better Auth integration, API client, Dashboard UI, Integration tests, Docker Compose, Documentation.

Make tasks sequential and AI-implementation ready. Output ONLY the full Markdown content of the tasks file.

## Response snapshot

Created comprehensive Phase II task breakdown with **122 tasks** across **13 phases**:

### Task Distribution

**Phase 1: Setup & Prerequisites** (T001-T008)
- 8 tasks: Verify monorepo, copy .env templates, generate secrets, Neon signup
- Effort: Low (30-45 minutes)

**Phase 2: Backend Foundation** (T009-T020)
- 12 tasks: UV sync, config, async DB connection, SQLModel Task, Alembic migrations, FastAPI app
- User Story: US1 (working backend with DB)
- Effort: Medium (2-3 hours)

**Phase 3: JWT Authentication Middleware** (T021-T026)
- 6 tasks: JWT verification, user_id extraction, error handling, test fixtures, auth tests
- User Story: US2 (JWT middleware)
- Effort: Medium (1.5-2 hours)

**Phase 4: Task CRUD API Endpoints** (T027-T035)
- 9 tasks: Helper function, 6 endpoints (POST, GET list, GET single, PUT, DELETE, PATCH), router mounting, manual testing
- User Story: US3 (secure CRUD with user isolation)
- Effort: High (3-4 hours)

**Phase 5: Backend Integration Tests** (T036-T046)
- 11 tasks: Test fixtures, 6 endpoint test suites, user isolation test, run all tests
- User Story: US4 (comprehensive testing)
- Effort: High (3-4 hours)

**Phase 6: Frontend Foundation** (T047-T054)
- 8 tasks: npm install, Tailwind config, root layout, landing page, Next.js rewrites, test startup
- User Story: US5 (working Next.js app)
- Effort: Medium (1.5-2 hours)

**Phase 7: Frontend API Client** (T055-T064)
- 10 tasks: TypeScript types, token helpers, apiFetch wrapper, 6 taskApi methods
- User Story: US6 (typed API client with JWT)
- Effort: Medium (2-3 hours)

**Phase 8: Better Auth Integration** (T065-T073)
- 9 tasks: Auth client init, auth page, Sign Up/In forms, error handling, Sign Out, route protection, testing
- User Story: US7 (user auth flows)
- Effort: High (3-4 hours)

**Phase 9: Shared UI Components** (T074-T080)
- 7 tasks: Button, Input, Select, Dialog, Badge, Spinner, verification
- User Story: US8 (consistent UI components)
- Effort: Medium (2-3 hours)

**Phase 10: Task Management Dashboard** (T081-T097)
- 17 tasks: TaskItem, TaskForm, TaskList, TaskFilters, Dashboard page, CRUD handlers, responsive layout
- User Story: US9 (complete task management UI)
- Effort: Very High (5-6 hours)

**Phase 11: End-to-End Integration Testing** (T098-T104)
- 7 tasks: E2E test, user isolation verification, manual browser test, spec verification
- User Story: US10 (E2E verification)
- Effort: Medium (2-3 hours)

**Phase 12: Docker Compose & Run Commands** (T105-T112)
- 8 tasks: Verify docker-compose.yml, test both services, document run commands
- User Story: US11 (easy local development)
- Effort: Low (1 hour)

**Phase 13: Documentation & Polish** (T113-T122)
- 10 tasks: Update CLAUDE.md files, verify all specs met, polish styling, responsive verification
- User Story: US12 (complete documentation)
- Effort: Medium (2 hours)

### Key Features

**Task Format** (strict checklist):
```
- [ ] T### [P] [US#] Description with exact file path
```
- T### = Sequential task ID
- [P] = Parallelizable (40 tasks marked)
- [US#] = User Story mapping (12 user stories)

**Parallel Execution Opportunities**:
- Wave 1: Backend (T009-T020) || Frontend (T047-T054)
- Wave 3: CRUD endpoints (T027-T035) — many [P] tasks
- Wave 4: Backend tests (T036-T046) — many [P] tasks
- Wave 5: API client (T055-T064) || UI components (T074-T080)

**Dependencies Graph**:
- Sequential flow with clear phase dependencies
- Identifies which phases can run in parallel
- 10 waves for optimal execution

**Implementation Strategy**:
- MVP scope: Phases 1-4, 6-10 = 27-30 hours
- Full implementation: All 13 phases = 37-40 hours

**Specialist Assignments**:
- python-specialist: 42 tasks (backend, auth, CRUD, tests)
- frontend-architect: 56 tasks (UI, components, dashboard, auth)
- qa-testing-specialist: 16 tasks (integration, E2E tests)
- cloud-native-devops: 17 tasks (setup, .env, Docker)

**Success Metrics**:
- All 122 tasks complete
- 6 authenticated CRUD endpoints working
- Responsive task management UI
- User isolation enforced (404 for cross-user)
- All tests passing
- Docker Compose working
- All specs met

## Outcome

- Impact: Complete AI-executable task breakdown for Phase II — 122 tasks ready for /sp.implement
- Tests: No runtime tests — task planning artifact
- Files: 1 file created (phase2_tasks_v1.tasks.md)
- Next prompts: /sp.implement (begin task execution), /sp.git.commit_pr (commit all setup work)
- Reflection: Organized by 12 user stories for independent testability. MVP identified as first 9 phases (27-30 hours). Parallel opportunities clearly marked with [P]. Each task has exact file path, acceptance criteria, and effort estimate.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (task planning)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Test task execution starting with Phase 1 to validate task granularity and completeness

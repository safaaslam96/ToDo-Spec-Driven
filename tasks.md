# Phase II Implementation Tasks

**Project**: The Evolution of Todo — Phase II Full-Stack Web Application + Agent Intelligence
**Date**: 2026-02-11
**Branch**: `1-rest-api-spec`
**Status**: Ready for implementation

---

## Task Index

### Wave 1: Backend Foundation (Tasks 1-4)
1. Database Connection & Configuration
2. Database Models (SQLModel)
3. JWT Authentication Middleware
4. Authentication Health Check

### Wave 2: Backend API Endpoints (Tasks 5-8)
5. Task CRUD Endpoints
6. Analytics Endpoint
7. AI Suggestions Endpoint (OpenAI)
8. Backend Integration Tests

### Wave 3: Frontend Foundation (Tasks 9-12)
9. TypeScript Type Definitions
10. API Client & Authentication
11. Authentication Pages
12. Design System Foundation

### Wave 4: Frontend UI Components (Tasks 13-18)
13. TaskCard Component
14. FilterTabs Component
15. ActivityChart Component
16. AddTaskModal Component
17. BottomNavigation Component
18. AI Suggestions Component

### Wave 5: Main Pages & Integration (Tasks 19-22)
19. Dashboard Page
20. Root Layout & Landing Page
21. Docker Compose Setup
22. Documentation & Setup Guides

### Wave 6: Quality & Testing (Tasks 23-25)
23. Error Handling & Loading States
24. Responsive UI Polish
25. End-to-End Testing

### Wave 7: Agent Intelligence ⭐ NEW (Tasks 26-28)
26. Urdu Chatbot Agent 🇵🇰
27. Voice Commands Agent 🎤
28. Cloud Deployment Blueprints ☁️

---

# WAVE 1: BACKEND FOUNDATION

## Task 1: Database Connection & Configuration

**Specialist**: `@skills/python-specialist`
**Effort**: Small (30 minutes)
**Dependencies**: None
**Files**: `backend/app/database/connection.py`, `backend/app/config.py`, `.env`

### Description
Configure async PostgreSQL connection to Neon using asyncpg. Set up Pydantic Settings to load DATABASE_URL from environment. Create async engine and session manager.

### Implementation Steps
1. Create `backend/app/config.py` with Pydantic Settings class
2. Create `backend/app/database/connection.py` with async engine
3. Add `create_db_and_tables()` function for table creation
4. Configure `.env` with DATABASE_URL (Neon connection string)
5. Test connection via health check endpoint

### Acceptance Criteria
- [ ] `DATABASE_URL` loaded from `.env`
- [ ] Async engine created with `create_async_engine`
- [ ] `AsyncSession` factory available for dependency injection
- [ ] Connection errors handled gracefully
- [ ] Health check endpoint returns database status

### Reference
- Skill: `@skills/python-specialist/examples/fastapi-patterns.py` (database connection pattern)
- Spec: `specs/database/schema.md`

---

## Task 2: Database Models (SQLModel)

**Specialist**: `@skills/python-specialist`
**Effort**: Small (30 minutes)
**Dependencies**: Task 1
**Files**: `backend/app/models/task.py`

### Description
Create SQLModel Task table definition and request/response schemas (TaskCreate, TaskUpdate, TaskRead). Follow constitution v2.0.0 schema: title, description, priority, completed, user_id.

### Implementation Steps
1. Create `backend/app/models/task.py`
2. Define `Task` table with all fields
3. Create `TaskCreate` schema (request body)
4. Create `TaskUpdate` schema (partial updates)
5. Create `TaskRead` schema (response)
6. Add index on `user_id` for performance

### Acceptance Criteria
- [ ] Task table: id (PK), title (VARCHAR 255, NOT NULL), description (TEXT), priority (VARCHAR), completed (BOOLEAN), user_id (str, indexed), created_at, updated_at
- [ ] TaskCreate: title (required), description (optional), priority (optional, default "medium")
- [ ] TaskUpdate: all fields optional
- [ ] TaskRead: all fields + id + timestamps
- [ ] Priority enum: low, medium, high
- [ ] user_id type is `str` (matches Better Auth)

### Reference
- Skill: `@skills/python-specialist/examples/sqlmodel-queries.py`
- Spec: `specs/database/schema.md`

---

## Task 3: JWT Authentication Middleware

**Specialist**: `@skills/python-specialist`
**Effort**: Small (45 minutes)
**Dependencies**: None
**Files**: `backend/app/auth/jwt.py`

### Description
Implement JWT Bearer token verification middleware. Extract user_id from JWT `sub` claim. Use python-jose with HS256 algorithm and BETTER_AUTH_SECRET.

### Implementation Steps
1. Create `backend/app/auth/jwt.py`
2. Implement `verify_jwt_token(credentials)` function
3. Extract `sub` claim as user_id
4. Handle invalid/expired tokens (return 401)
5. Create `Depends` injectable for route protection

### Acceptance Criteria
- [ ] Extracts Bearer token from Authorization header
- [ ] Verifies JWT signature with BETTER_AUTH_SECRET (HS256)
- [ ] Returns user_id (str) from `sub` claim
- [ ] Returns 401 for missing/invalid/expired tokens
- [ ] No internal error details leaked to client
- [ ] Works as FastAPI `Depends()` dependency

### Reference
- Skill: `@skills/python-specialist/examples/jwt-auth-example.py`
- Spec: `specs/features/authentication.md`

---

## Task 4: Authentication Health Check

**Specialist**: `@skills/python-specialist`
**Effort**: Small (15 minutes)
**Dependencies**: Task 1, Task 3
**Files**: `backend/app/api/routes/health.py`, `backend/app/main.py`

### Description
Create health check endpoint that verifies database connection and JWT configuration. Returns JSON with status of all critical services.

### Implementation Steps
1. Create `backend/app/api/routes/health.py`
2. Implement `GET /api/health` endpoint
3. Check database connection (query test)
4. Check JWT secret configuration
5. Return JSON: `{"status": "healthy", "database": "connected", "auth": "configured"}`

### Acceptance Criteria
- [ ] `GET /api/health` returns 200 when all services OK
- [ ] Returns 503 if database connection fails
- [ ] Returns 503 if JWT secret not configured
- [ ] No authentication required for health check
- [ ] Response includes timestamp

### Reference
- Skill: `@skills/python-specialist/examples/fastapi-patterns.py`
- Spec: `specs/api/rest-endpoints.md`

---

# WAVE 2: BACKEND API ENDPOINTS

## Task 5: Task CRUD Endpoints

**Specialist**: `@skills/python-specialist`
**Effort**: Large (90 minutes)
**Dependencies**: Task 1, Task 2, Task 3
**Files**: `backend/app/api/routes/tasks.py`

### Description
Implement all 5 CRUD operations with user isolation: Create, List, Update, Delete, Toggle Complete. All endpoints require JWT authentication and filter by user_id.

### Implementation Steps
1. Create `backend/app/api/routes/tasks.py`
2. Implement `POST /api/users/{user_id}/tasks` (create)
3. Implement `GET /api/users/{user_id}/tasks` (list with filters)
4. Implement `PUT /api/users/{user_id}/tasks/{task_id}` (update)
5. Implement `DELETE /api/users/{user_id}/tasks/{task_id}` (delete)
6. Implement `PATCH /api/users/{user_id}/tasks/{task_id}/complete` (toggle)
7. Add user isolation validation (path user_id matches JWT user_id)

### Acceptance Criteria
- [ ] All endpoints require JWT authentication
- [ ] All queries filter by user_id from JWT `sub` claim
- [ ] Path `user_id` must match authenticated user (403 if not)
- [ ] Return 404 for tasks not found OR not owned by user (same response)
- [ ] List endpoint supports filters: completed, priority, category
- [ ] Update endpoint allows partial updates
- [ ] Toggle endpoint switches completed status
- [ ] All responses use TaskRead schema

### Reference
- Skill: `@skills/python-specialist/examples/fastapi-patterns.py` (user isolation pattern)
- Skill: `@skills/python-specialist/examples/sqlmodel-queries.py`
- Spec: `specs/api/rest-endpoints.md`

---

## Task 6: Analytics Endpoint

**Specialist**: `@skills/python-specialist`
**Effort**: Medium (45 minutes)
**Dependencies**: Task 5
**Files**: `backend/app/api/routes/tasks.py` (extend)

### Description
Add analytics endpoint that returns task statistics for the authenticated user: total tasks, completed tasks, pending tasks, completion rate, tasks by priority.

### Implementation Steps
1. Extend `backend/app/api/routes/tasks.py`
2. Implement `GET /api/users/{user_id}/tasks/analytics`
3. Query task counts with GROUP BY priority
4. Calculate completion rate
5. Return JSON with statistics

### Acceptance Criteria
- [ ] Returns total_tasks, completed_tasks, pending_tasks
- [ ] Returns completion_rate (percentage)
- [ ] Returns tasks_by_priority breakdown
- [ ] User isolation enforced (own stats only)
- [ ] Returns 200 with stats even if no tasks exist

### Reference
- Skill: `@skills/python-specialist/examples/sqlmodel-queries.py` (aggregation)
- Spec: `specs/api/rest-endpoints.md`

---

## Task 7: AI Suggestions Endpoint (OpenAI)

**Specialist**: `@skills/ai-mcp-integration`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 5
**Files**: `backend/app/api/routes/suggestions.py`, `backend/app/services/openai_service.py`

### Description
Implement AI-powered task suggestions using OpenAI API. Analyze user's existing tasks and suggest next actions based on patterns, priorities, and completion status.

### Implementation Steps
1. Create `backend/app/services/openai_service.py`
2. Implement OpenAI API client with rate limiting
3. Create `backend/app/api/routes/suggestions.py`
4. Implement `POST /api/users/{user_id}/suggestions`
5. Build context from user's tasks
6. Call OpenAI with system prompt for task suggestions
7. Return 3-5 suggested tasks with reasoning

### Acceptance Criteria
- [ ] Rate limiting: 1 request per 30 seconds per user
- [ ] Returns 429 if rate limit exceeded
- [ ] Analyzes user's pending tasks for context
- [ ] Generates 3-5 relevant task suggestions
- [ ] Each suggestion includes: title, description, priority, reasoning
- [ ] Handles OpenAI API errors gracefully
- [ ] Uses gpt-4o-mini for cost optimization

### Reference
- Skill: `@skills/ai-mcp-integration/examples/openai-integration.py`
- Spec: `specs/features/ai-suggestions.md` (if exists, otherwise use constitution)

---

## Task 8: Backend Integration Tests

**Specialist**: `@skills/qa-testing-specialist`
**Effort**: Large (90 minutes)
**Dependencies**: Task 5, Task 6, Task 7
**Files**: `backend/tests/test_tasks.py`, `backend/tests/conftest.py`

### Description
Write comprehensive integration tests for all API endpoints. Test user isolation, authentication, CRUD operations, and error cases.

### Implementation Steps
1. Create `backend/tests/conftest.py` with fixtures
2. Create test database session fixture
3. Create JWT token generation fixture
4. Write tests for all CRUD operations
5. Write user isolation tests (can't access other user's tasks)
6. Write authentication tests (401 for invalid tokens)
7. Write error case tests (404, 403, 422)

### Acceptance Criteria
- [ ] >80% code coverage
- [ ] All CRUD endpoints tested
- [ ] User isolation enforced (test cross-user access)
- [ ] Authentication required (test without token)
- [ ] Edge cases covered (empty lists, invalid data)
- [ ] All tests pass with green status
- [ ] Tests run via `pytest backend/tests/`

### Reference
- Skill: `@skills/qa-testing-specialist/examples/pytest-test-template.py`
- Constitution: Testing principles

---

# WAVE 3: FRONTEND FOUNDATION

## Task 9: TypeScript Type Definitions

**Specialist**: `@skills/frontend-architect`
**Effort**: Small (30 minutes)
**Dependencies**: None
**Files**: `frontend/types/task.ts`, `frontend/types/api.ts`

### Description
Define TypeScript interfaces matching backend schemas. Create type-safe contracts for all API requests and responses.

### Implementation Steps
1. Create `frontend/types/task.ts`
2. Define `Task` interface matching TaskRead schema
3. Define `TaskCreate` interface for task creation
4. Define `TaskUpdate` interface for updates
5. Create `frontend/types/api.ts` for API responses
6. Add JSDoc comments for documentation

### Acceptance Criteria
- [ ] Task interface matches backend TaskRead schema
- [ ] TaskCreate interface matches backend request schema
- [ ] TaskUpdate interface allows partial updates
- [ ] All fields properly typed (no `any`)
- [ ] JSDoc comments explain each field
- [ ] Enums for priority: low, medium, high

### Reference
- Skill: `@skills/frontend-architect/examples/component-patterns.tsx`
- Spec: `specs/api/rest-endpoints.md`

---

## Task 10: API Client & Authentication

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 9
**Files**: `frontend/lib/api-client.ts`, `frontend/lib/auth.ts`

### Description
Create type-safe API client that automatically attaches JWT token to all requests. Handle token storage, refresh, and expiration.

### Implementation Steps
1. Create `frontend/lib/api-client.ts`
2. Implement `apiClient` wrapper around fetch
3. Auto-attach Authorization header with JWT
4. Handle 401 responses (redirect to login)
5. Create type-safe methods for all endpoints
6. Create `frontend/lib/auth.ts` for token management
7. Implement token storage in localStorage
8. Add token expiration check

### Acceptance Criteria
- [ ] All API calls attach `Authorization: Bearer <token>`
- [ ] Type-safe methods for all CRUD operations
- [ ] Handles 401 by clearing token and redirecting
- [ ] Token stored securely in localStorage
- [ ] Token expiration checked before API calls
- [ ] Error handling for network failures

### Reference
- Skill: `@skills/frontend-architect/examples/api-client-patterns.ts` (if exists)
- Spec: `specs/features/authentication.md`

---

## Task 11: Authentication Pages

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 10
**Files**: `frontend/app/auth/page.tsx`, `frontend/components/auth/*.tsx`

### Description
Create authentication pages using Better Auth. Implement login/register forms with validation and error handling.

### Implementation Steps
1. Install and configure Better Auth
2. Create `frontend/app/auth/page.tsx`
3. Create login form component
4. Create register form component
5. Implement form validation
6. Handle authentication errors
7. Redirect to dashboard on success

### Acceptance Criteria
- [ ] Better Auth configured with JWT
- [ ] Login form: email + password
- [ ] Register form: email + password + confirm password
- [ ] Client-side validation (email format, password length)
- [ ] Displays error messages from API
- [ ] Redirects to `/dashboard` after successful auth
- [ ] Token stored in localStorage

### Reference
- Skill: `@skills/frontend-architect/best-practices.md`
- Spec: `specs/ui/pages.md`

---

## Task 12: Design System Foundation

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (45 minutes)
**Dependencies**: None
**Files**: `frontend/styles/globals.css`, `frontend/components/ui/*.tsx`

### Description
Set up Tailwind CSS v4 with dark mode theme and create foundational UI components (Button, Input, Card, Badge).

### Implementation Steps
1. Configure Tailwind CSS v4
2. Set up dark mode color palette
3. Create `Button` component with variants
4. Create `Input` component with validation states
5. Create `Card` component for content containers
6. Create `Badge` component for priority labels
7. Document component usage in Storybook (optional)

### Acceptance Criteria
- [ ] Tailwind CSS v4 configured
- [ ] Dark mode theme with purple/blue gradient accents
- [ ] Button variants: primary, secondary, danger
- [ ] Input states: default, error, disabled
- [ ] Card component with shadow and hover effects
- [ ] Badge colors: gray (low), yellow (medium), red (high)
- [ ] All components responsive

### Reference
- Skill: `@skills/frontend-architect/best-practices.md`
- Spec: `specs/ui/components.md`

---

# WAVE 4: FRONTEND UI COMPONENTS

## Task 13: TaskCard Component

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (45 minutes)
**Dependencies**: Task 9, Task 12
**Files**: `frontend/components/tasks/task-card.tsx`

### Description
Create task card component that displays task details with actions (edit, delete, toggle complete). Support drag-and-drop for reordering (optional Phase III).

### Implementation Steps
1. Create `frontend/components/tasks/task-card.tsx`
2. Display task title, description, priority badge
3. Add checkbox for completion toggle
4. Add edit and delete buttons
5. Implement hover effects
6. Add loading states during actions

### Acceptance Criteria
- [ ] Displays task title, description, priority
- [ ] Checkbox toggles completed status
- [ ] Edit button opens modal (to be implemented)
- [ ] Delete button with confirmation
- [ ] Priority badge colored (gray/yellow/red)
- [ ] Hover effect shows action buttons
- [ ] Loading state during API calls

### Reference
- Skill: `@skills/frontend-architect/examples/component-patterns.tsx`
- Spec: `specs/ui/components.md`

---

## Task 14: FilterTabs Component

**Specialist**: `@skills/frontend-architect`
**Effort**: Small (30 minutes)
**Dependencies**: Task 12
**Files**: `frontend/components/tasks/filter-tabs.tsx`

### Description
Create filter tabs for task list (All, Pending, Completed) with active state and count badges.

### Implementation Steps
1. Create `frontend/components/tasks/filter-tabs.tsx`
2. Implement tab buttons: All, Pending, Completed
3. Add active state styling
4. Display task count badges
5. Handle tab click events

### Acceptance Criteria
- [ ] Three tabs: All, Pending, Completed
- [ ] Active tab highlighted with gradient
- [ ] Task counts displayed in badges
- [ ] onClick callback with filter value
- [ ] Responsive on mobile (scrollable)

### Reference
- Skill: `@skills/frontend-architect/examples/component-patterns.tsx`
- Spec: `specs/ui/components.md`

---

## Task 15: ActivityChart Component

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 6, Task 12
**Files**: `frontend/components/analytics/activity-chart.tsx`

### Description
Create visual chart displaying task analytics (completion rate, priority distribution). Use Chart.js or Recharts.

### Implementation Steps
1. Install chart library (Recharts recommended)
2. Create `frontend/components/analytics/activity-chart.tsx`
3. Fetch analytics data from API
4. Create donut chart for completion rate
5. Create bar chart for priority distribution
6. Add responsive container

### Acceptance Criteria
- [ ] Displays completion rate as donut chart
- [ ] Displays priority distribution as bar chart
- [ ] Fetches data from `/api/users/{userId}/tasks/analytics`
- [ ] Responsive on mobile
- [ ] Loading skeleton during data fetch
- [ ] Colors match theme (purple/blue)

### Reference
- Skill: `@skills/frontend-architect/best-practices.md`
- Spec: `specs/ui/components.md`

---

## Task 16: AddTaskModal Component

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 9, Task 10, Task 12
**Files**: `frontend/components/tasks/add-task-modal.tsx`

### Description
Create modal for adding/editing tasks with form validation and category selection.

### Implementation Steps
1. Create `frontend/components/tasks/add-task-modal.tsx`
2. Implement controlled form inputs
3. Add title, description, priority fields
4. Add category dropdown (design, development, research, review)
5. Implement form validation
6. Handle submit with API call
7. Show success/error messages

### Acceptance Criteria
- [ ] Modal opens/closes with animation
- [ ] Form fields: title (required), description, priority, category
- [ ] Client-side validation (title max 255 chars)
- [ ] Calls `POST /api/users/{userId}/tasks` on submit
- [ ] Shows success message and closes modal
- [ ] Shows error message if API fails
- [ ] Resets form on close

### Reference
- Skill: `@skills/frontend-architect/examples/component-patterns.tsx`
- Spec: `specs/ui/components.md`

---

## Task 17: BottomNavigation Component

**Specialist**: `@skills/frontend-architect`
**Effort**: Small (30 minutes)
**Dependencies**: Task 12
**Files**: `frontend/components/ui/bottom-navigation.tsx`

### Description
Create bottom navigation bar for mobile with icons for Tasks, Analytics, AI Suggestions.

### Implementation Steps
1. Create `frontend/components/ui/bottom-navigation.tsx`
2. Add three nav items: Tasks, Analytics, AI
3. Use Lucide icons (List, BarChart, Sparkles)
4. Implement active state highlighting
5. Make it sticky at bottom on mobile

### Acceptance Criteria
- [ ] Three nav items with icons
- [ ] Active item highlighted
- [ ] Fixed at bottom on mobile (<768px)
- [ ] Hidden on desktop
- [ ] Click navigates to respective page/section

### Reference
- Skill: `@skills/frontend-architect/best-practices.md`
- Spec: `specs/ui/components.md`

---

## Task 18: AI Suggestions Component

**Specialist**: `@skills/frontend-architect` + `@skills/ai-mcp-integration`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 7, Task 12
**Files**: `frontend/components/ai/suggestions-panel.tsx`

### Description
Create AI suggestions panel that displays OpenAI-generated task recommendations with one-click add functionality.

### Implementation Steps
1. Create `frontend/components/ai/suggestions-panel.tsx`
2. Fetch suggestions from `/api/users/{userId}/suggestions`
3. Display suggestions as cards
4. Show reasoning for each suggestion
5. Add "Add to Tasks" button for each suggestion
6. Handle rate limiting (show countdown)

### Acceptance Criteria
- [ ] Fetches AI suggestions on button click
- [ ] Displays 3-5 suggestions as cards
- [ ] Each card shows title, description, priority, reasoning
- [ ] "Add to Tasks" button creates task
- [ ] Shows rate limit countdown (30 seconds)
- [ ] Loading state with skeleton
- [ ] Error handling for API failures

### Reference
- Skill: `@skills/ai-mcp-integration/examples/openai-integration.py`
- Spec: `specs/features/ai-suggestions.md`

---

# WAVE 5: MAIN PAGES & INTEGRATION

## Task 19: Dashboard Page

**Specialist**: `@skills/frontend-architect`
**Effort**: Large (90 minutes)
**Dependencies**: Task 13, Task 14, Task 15, Task 16, Task 17, Task 18
**Files**: `frontend/app/dashboard/page.tsx`

### Description
Integrate all components into the main dashboard page. Layout: header with user info, filter tabs, task list, add button, bottom nav (mobile), analytics sidebar (desktop).

### Implementation Steps
1. Create `frontend/app/dashboard/page.tsx`
2. Layout: header, filter tabs, task list grid
3. Integrate TaskCard components
4. Add floating "Add Task" button
5. Add BottomNavigation for mobile
6. Add analytics sidebar for desktop
7. Implement task filtering logic
8. Add loading and empty states

### Acceptance Criteria
- [ ] Header shows user email and logout button
- [ ] Filter tabs switch between All/Pending/Completed
- [ ] Task list displays filtered tasks
- [ ] Add Task button opens modal
- [ ] Bottom nav visible on mobile
- [ ] Analytics sidebar visible on desktop (>1024px)
- [ ] Loading skeleton during initial fetch
- [ ] Empty state: "No tasks yet. Create your first task!"
- [ ] Responsive layout (mobile, tablet, desktop)

### Reference
- Skill: `@skills/frontend-architect/best-practices.md`
- Spec: `specs/ui/pages.md`

---

## Task 20: Root Layout & Landing Page

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (45 minutes)
**Dependencies**: Task 11, Task 19
**Files**: `frontend/app/layout.tsx`, `frontend/app/page.tsx`

### Description
Create root layout with metadata, fonts, and analytics. Create landing page with hero section and CTA to sign up.

### Implementation Steps
1. Update `frontend/app/layout.tsx` with metadata
2. Add Google Fonts (Inter for body)
3. Set up dark mode by default
4. Create `frontend/app/page.tsx` (landing)
5. Hero section with gradient background
6. Feature highlights (3 columns)
7. CTA button to `/auth`

### Acceptance Criteria
- [ ] Root layout includes metadata (title, description)
- [ ] Inter font loaded
- [ ] Dark mode enabled by default
- [ ] Landing page: hero + features + CTA
- [ ] "Get Started" button navigates to `/auth`
- [ ] Responsive hero on mobile
- [ ] Gradient background (purple to blue)

### Reference
- Skill: `@skills/frontend-architect/best-practices.md`
- Spec: `specs/ui/pages.md`

---

## Task 21: Docker Compose Setup

**Specialist**: `@skills/cloud-native-devops`
**Effort**: Medium (45 minutes)
**Dependencies**: Task 8, Task 19
**Files**: `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile`

### Description
Create Docker Compose configuration for local development with PostgreSQL, backend (FastAPI), and frontend (Next.js).

### Implementation Steps
1. Create `backend/Dockerfile` (multi-stage build)
2. Create `frontend/Dockerfile` (Next.js production build)
3. Create `docker-compose.yml` with 3 services
4. Configure environment variables
5. Set up networks and volumes
6. Add health checks

### Acceptance Criteria
- [ ] `docker-compose up` starts all services
- [ ] PostgreSQL accessible on localhost:5432
- [ ] Backend accessible on localhost:8000
- [ ] Frontend accessible on localhost:3000
- [ ] Backend connects to PostgreSQL
- [ ] Frontend connects to backend API
- [ ] Hot reload works in development
- [ ] Data persists in volumes

### Reference
- Skill: `@skills/cloud-native-devops/examples/docker-compose-template.yml`
- Constitution: DevOps principles

---

## Task 22: Documentation & Setup Guides

**Specialist**: `@skills/cloud-native-devops`
**Effort**: Small (30 minutes)
**Dependencies**: Task 21
**Files**: `README.md`, `docs/setup.md`, `docs/api.md`

### Description
Create comprehensive setup guides for local development, deployment, and API documentation.

### Implementation Steps
1. Create `README.md` with project overview
2. Create `docs/setup.md` with step-by-step setup
3. Create `docs/api.md` with API endpoint documentation
4. Add environment variable examples
5. Add troubleshooting section

### Acceptance Criteria
- [ ] README includes: overview, features, tech stack, quick start
- [ ] Setup guide: prerequisites, installation, running locally
- [ ] API docs: all endpoints with examples
- [ ] `.env.example` files for backend and frontend
- [ ] Troubleshooting: common errors and solutions

### Reference
- Constitution: Documentation principles
- Spec: `specs/overview.md`

---

# WAVE 6: QUALITY & TESTING

## Task 23: Error Handling & Loading States

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 19
**Files**: Various frontend components

### Description
Add comprehensive error handling and loading states to all components. Handle network failures, API errors, and edge cases gracefully.

### Implementation Steps
1. Add loading skeletons to all data-fetching components
2. Add error boundaries for component errors
3. Implement toast notifications for success/error
4. Add retry logic for failed API calls
5. Handle offline state
6. Add empty states for zero data

### Acceptance Criteria
- [ ] All API calls show loading skeletons
- [ ] Error boundaries catch component crashes
- [ ] Toast notifications for success/error actions
- [ ] Retry button for failed API calls
- [ ] Offline indicator when network disconnected
- [ ] Empty states with helpful messages
- [ ] No unhandled promise rejections

### Reference
- Skill: `@skills/frontend-architect/examples/component-patterns.tsx`
- Constitution: Error handling principles

---

## Task 24: Responsive UI Polish

**Specialist**: `@skills/frontend-architect`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 19
**Files**: Various frontend components

### Description
Polish responsive design for mobile, tablet, and desktop. Test on various screen sizes and fix layout issues.

### Implementation Steps
1. Test on mobile (375px, 414px)
2. Test on tablet (768px, 1024px)
3. Test on desktop (1280px, 1920px)
4. Fix overflow issues
5. Optimize touch targets (min 44px)
6. Add smooth transitions
7. Test dark mode contrast

### Acceptance Criteria
- [ ] Layout works on mobile (375px+)
- [ ] Layout works on tablet (768px+)
- [ ] Layout works on desktop (1280px+)
- [ ] No horizontal scroll
- [ ] Touch targets ≥44px on mobile
- [ ] Smooth animations (no jank)
- [ ] Dark mode WCAG AA compliant

### Reference
- Skill: `@skills/frontend-architect/best-practices.md`
- Constitution: UI principles

---

## Task 25: End-to-End Testing

**Specialist**: `@skills/qa-testing-specialist`
**Effort**: Large (90 minutes)
**Dependencies**: Task 19, Task 23, Task 24
**Files**: `tests/e2e/*.spec.ts`

### Description
Write Playwright E2E tests covering critical user flows: signup, login, create task, complete task, delete task, logout.

### Implementation Steps
1. Install and configure Playwright
2. Create test fixtures (test user, cleanup)
3. Write signup flow test
4. Write login flow test
5. Write CRUD operations tests
6. Write user isolation test (can't see other user's tasks)
7. Run tests in CI

### Acceptance Criteria
- [ ] E2E tests cover all critical flows
- [ ] Tests run in headless mode
- [ ] Tests clean up data after runs
- [ ] User isolation verified (no cross-user access)
- [ ] All tests pass consistently
- [ ] CI integration (GitHub Actions)

### Reference
- Skill: `@skills/qa-testing-specialist/best-practices.md`
- Constitution: Testing principles

---

# WAVE 7: AGENT INTELLIGENCE ⭐

## Task 26: Urdu Chatbot Agent 🇵🇰

**Specialist**: `@skills/ai-mcp-integration`
**Effort**: Large (90 minutes)
**Dependencies**: Task 5, Task 10
**Files**:
- `backend/services/urdu_nlp.py`
- `backend/routes/chat.py`
- `frontend/components/ChatInterface.tsx`
- `subagents/urdu-chatbot-agent/AGENT.md`

### Description
Implement natural language task management in Urdu, English, and Hinglish. Users can create, list, complete, and delete tasks using conversational commands.

### Implementation Steps
1. Create subagent definition: `subagents/urdu-chatbot-agent/AGENT.md`
2. Implement Urdu NLP service with OpenAI
3. Create chat API endpoint
4. Build chat interface component
5. Add Urdu font support (Noto Nastaliq Urdu)
6. Implement RTL text handling
7. Add example commands UI

### Acceptance Criteria
- [X] Understands Urdu commands: "Kal meeting ka task bana do"
- [X] Understands English commands: "Create task for tomorrow"
- [X] Understands Hinglish: "Tomorrow subah office jana hai"
- [X] Extracts intent: create_task, list_tasks, complete_task, delete_task
- [X] Parses task details: title, due_date, priority
- [X] Responds in same language as user
- [X] RTL layout works for Urdu text
- [X] Chat interface responsive and beautiful

### Reference
- Subagent: `@subagents/urdu-chatbot-agent/AGENT.md`
- Skill: `@skills/ai-mcp-integration/examples/urdu-chatbot-patterns.py`
- Example file provided in task guide

---

## Task 27: Voice Commands Agent 🎤

**Specialist**: `@skills/frontend-architect` + `@skills/ai-mcp-integration`
**Effort**: Medium (60 minutes)
**Dependencies**: Task 26
**Files**:
- `frontend/components/VoiceInput.tsx`
- `frontend/components/ChatInterface.tsx` (update)
- `subagents/voice-command-agent/AGENT.md`

### Description
Add voice input capability for hands-free task management. Support English (en-US) and Urdu (ur-PK) using Web Speech API.

### Implementation Steps
1. Create subagent definition: `subagents/voice-command-agent/AGENT.md`
2. Implement VoiceInput component with Web Speech API
3. Add microphone button with recording animation
4. Display live transcription
5. Auto-submit voice commands to chat
6. Add language toggle (English/Urdu)
7. Handle browser compatibility

### Acceptance Criteria
- [X] Microphone button starts voice recording
- [X] Pulsing red animation during recording
- [X] Live transcription displays in real-time
- [X] Auto-submits command to chatbot
- [X] Works in English (en-US)
- [X] Works in Urdu (ur-PK)
- [X] Handles microphone permission denied
- [X] Shows browser compatibility message

### Reference
- Subagent: `@subagents/voice-command-agent/AGENT.md`
- Skill: `@skills/frontend-architect/examples/voice-input-component.tsx`
- Example file provided in task guide

---

## Task 28: Cloud Deployment Blueprints ☁️

**Specialist**: `@skills/cloud-native-devops`
**Effort**: Small (45 minutes)
**Dependencies**: Task 21
**Files**:
- `skills/cloud-native-devops/blueprints/kubernetes-deployment.yaml`
- `skills/cloud-native-devops/blueprints/serverless-architecture.md`
- `skills/cloud-native-devops/blueprints/microservices-pattern.md`
- `scripts/deploy-kubernetes.sh`
- `subagents/cloud-deployment-agent/AGENT.md`

### Description
Create reusable cloud deployment blueprints for Kubernetes and Serverless architectures. These blueprints can be reused for ANY FastAPI + Next.js + PostgreSQL project.

### Implementation Steps
1. Create subagent definition: `subagents/cloud-deployment-agent/AGENT.md`
2. Create Kubernetes deployment YAML (already exists)
3. Document serverless architecture pattern (already exists)
4. Document microservices pattern (already exists)
5. Create deployment scripts
6. Add usage examples and documentation

### Acceptance Criteria
- [X] Kubernetes blueprint complete with all resources
- [X] Serverless architecture documented with cost analysis
- [X] Microservices pattern documented with service breakdown
- [X] Deployment scripts ready to use
- [X] All blueprints reusable for other projects
- [X] Auto-scaling configured
- [X] Health checks in place

### Reference
- Subagent: `@subagents/cloud-deployment-agent/AGENT.md`
- Skills:
  - `@skills/cloud-native-devops/blueprints/kubernetes-deployment.yaml`
  - `@skills/cloud-native-devops/blueprints/serverless-architecture.md`
  - `@skills/cloud-native-devops/blueprints/microservices-pattern.md`

---

# TASK COMPLETION SUMMARY

## Total Tasks: 28
- Wave 1 (Backend Foundation): 4 tasks
- Wave 2 (Backend API): 4 tasks
- Wave 3 (Frontend Foundation): 4 tasks
- Wave 4 (Frontend UI): 6 tasks
- Wave 5 (Integration): 4 tasks
- Wave 6 (Quality): 3 tasks
- Wave 7 (Agent Intelligence): 3 tasks ⭐

## Estimated Total Time: ~28 hours
- Backend: ~8 hours
- Frontend: ~12 hours
- DevOps & Testing: ~5 hours
- Agent Intelligence: ~3 hours ⭐

## Ready for Implementation
All tasks are defined with:
✅ Clear description and acceptance criteria
✅ File paths and dependencies
✅ References to skills and specs
✅ Step-by-step implementation guides

**Next Step**: Run `/sp.implement` to start building! 🚀

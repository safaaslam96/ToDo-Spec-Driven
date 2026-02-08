# Task CRUD Feature Specification - Phase II

## Overview

This feature implements the core Create, Read, Update, Delete, and Toggle (Complete/Incomplete) operations for user tasks in the Phase II multi-user web application. The feature enables authenticated users to manage their personal task lists through a responsive web interface with secure, user-isolated data access via RESTful APIs. All operations are protected by JWT-based authentication and enforce strict user isolation to ensure data privacy and security.

## Clarifications

### Session 2026-02-07

- Q: API Path Structure — should endpoints use `/api/users/{user_id}/tasks` (user_id in path) or `/api/tasks` (user_id from JWT only)? → A: `/api/tasks` with user_id extracted exclusively from JWT token. No user_id in path. Cleaner URLs, no mismatch risk, aligns with Security-First principle.
- Q: Cross-user access error code — should accessing another user's task return 403 Forbidden or 404 Not Found? → A: 404 Not Found. Prevents resource enumeration attacks; hides task existence from unauthorized users. Aligns with Constitution VI (User Isolation & Data Privacy).
- Q: user_id data type — REST API spec says `int` but Better Auth generates string IDs and DB schema uses VARCHAR. Which type? → A: `user_id: str` (VARCHAR). Better Auth generates string-based identifiers; all specs and code must use string type for user_id.
- Q: Task ID uniqueness — constitution says "unique per user, not globally unique" but DB uses global SERIAL PK. Which approach? → A: Global SERIAL primary key. The constitution statement is a relaxation (IDs need not be sequential per-user), not a constraint requiring per-user scoping. Gaps in per-user ID sequences are acceptable.
- Q: Task model fields — should Phase II include due_date for Phase III readiness or keep minimal? → A: Phase II includes title, description, priority, completed, user_id only. Defer due_date to Phase III. Adding columns later is a non-breaking migration.

## User Stories

### Story 1: Add New Task
As an authenticated user,
I want to create new tasks with title, description, and priority,
So that I can track my work and responsibilities effectively.

### Story 2: List My Tasks
As an authenticated user,
I want to view all my tasks in a responsive, well-organized interface,
So that I can see my current workload and priorities.

### Story 3: Update Task Details
As an authenticated user,
I want to modify existing tasks (title, description, priority),
So that I can keep my task information accurate and up-to-date.

### Story 4: Delete Task
As an authenticated user,
I want to remove completed or obsolete tasks,
So that my task list remains relevant and clutter-free.

### Story 5: Mark Task Complete/Incomplete
As an authenticated user,
I want to toggle the completion status of tasks,
So that I can track my progress and mark achievements.

## Acceptance Criteria

### Authentication Requirements
- [ ] API returns 401 Unauthorized when no JWT token is provided
- [ ] API returns 401 Unauthorized when an invalid/expired JWT token is provided
- [ ] All operations require a valid JWT token in Authorization header

### User Isolation
- [ ] Users can only access tasks that belong to their user ID
- [ ] Attempting to access another user's tasks returns 404 Not Found
- [ ] API endpoints use `/api/tasks` paths; user_id is extracted from JWT token, not from the URL

### Task Creation (Add)
- [ ] User can create a new task with required title field
- [ ] Task includes optional description and priority fields
- [ ] Newly created task is associated with authenticated user ID
- [ ] API returns 201 Created with the new task object
- [ ] Empty title returns 400 Bad Request with error message

### Task Listing (Read)
- [ ] User can retrieve all their tasks via GET request
- [ ] Response includes paginated list of tasks (if needed)
- [ ] Tasks are filtered by authenticated user ID
- [ ] API returns 200 OK with task list

### Task Updates (Update)
- [ ] User can modify their own tasks using PUT/PATCH methods
- [ ] Update includes validation for task ownership
- [ ] API returns 200 OK with updated task object
- [ ] Attempting to update another user's task returns 404 Not Found

### Task Deletion (Delete)
- [ ] User can delete their own tasks using DELETE method
- [ ] Deletion includes validation for task ownership
- [ ] API returns 204 No Content on successful deletion
- [ ] Attempting to delete another user's task returns 404 Not Found

### Task Completion Toggle (Toggle)
- [ ] User can toggle completion status of their own tasks
- [ ] API supports PATCH to update completion status only
- [ ] API returns 200 OK with updated task object
- [ ] Attempting to update another user's task returns 404 Not Found

## API Integration

This feature integrates with the REST API endpoints defined in @specs/api/rest-endpoints.md, specifically utilizing:

- POST `/api/tasks` - Create new task
- GET `/api/tasks` - List all user's tasks
- GET `/api/tasks/{id}` - Get specific task
- PUT `/api/tasks/{id}` - Update entire task
- PATCH `/api/tasks/{id}/complete` - Toggle completion status
- DELETE `/api/tasks/{id}` - Delete specific task

All API calls must include a valid JWT token in the Authorization header:
`Authorization: Bearer {jwt_token}`

## Database Integration

This feature relies on the database schema defined in @specs/database/schema.md, where:

- Each task record includes a `user_id` field linking to the authenticated user
- Foreign key constraint ensures data integrity between tasks and users
- Queries always filter by the authenticated user's ID for isolation
- Database indexes optimize queries by user_id for performance

## Frontend Integration

The frontend implementation will include:

- Next.js App Router pages for task management
- Task creation form with validation
- Task listing component with filtering and sorting capabilities
- Task editing modal/form for updates
- Task deletion confirmation dialog
- Checkbox component for completion toggling
- Responsive design for desktop and mobile devices
- Loading states and error handling components

## Authentication Flow

1. User authenticates via Better Auth and receives JWT token
2. Frontend stores JWT token securely (preferably in httpOnly cookie or secure storage)
3. For each API request, frontend attaches token in Authorization header
4. Backend middleware verifies JWT signature using BETTER_AUTH_SECRET
5. Backend extracts user ID from token claims
6. All database operations filter by the authenticated user's ID
7. Invalid tokens result in 401 Unauthorized responses

## Edge Cases & Error Handling

### Authentication Issues
- [ ] Missing Authorization header returns 401 Unauthorized
- [ ] Invalid/malformed JWT token returns 401 Unauthorized
- [ ] Expired JWT token returns 401 Unauthorized with renewal guidance
- [ ] Server unable to verify token returns 500 Internal Server Error

### User Access Violations
- [ ] Request for another user's tasks returns 404 Not Found
- [ ] Attempt to modify another user's task returns 404 Not Found
- [ ] Attempt to delete another user's task returns 404 Not Found

### Data Validation Issues
- [ ] Empty or whitespace-only task title returns 400 Bad Request
- [ ] Excessively long title returns 400 Bad Request
- [ ] Excessively long description returns 400 Bad Request
- [ ] Invalid task ID format returns 400 Bad Request

### System Issues
- [ ] Database connection failure returns 500 Internal Server Error
- [ ] Server overload returns 503 Service Unavailable
- [ ] Concurrent modification attempts handled gracefully

## Non-Functional Requirements

### Responsiveness
- [ ] Frontend page loads within 3 seconds on standard broadband
- [ ] API responds to 95% of requests within 500ms
- [ ] UI remains responsive during loading states
- [ ] Form submissions provide immediate visual feedback

### Security
- [ ] All communication encrypted via HTTPS
- [ ] JWT tokens expire within reasonable timeframe (e.g., 1 hour)
- [ ] No sensitive data stored in browser localStorage/sessionStorage
- [ ] SQL injection prevention via parameterized queries
- [ ] Input sanitization for all user-provided data

### Performance
- [ ] Support for 1000+ tasks per user without performance degradation
- [ ] Efficient pagination for users with large task lists
- [ ] Optimized database queries with proper indexing
- [ ] Caching strategies implemented where appropriate

### Reliability
- [ ] 99.9% uptime availability
- [ ] Graceful error handling without exposing internal details
- [ ] Consistent user experience across different browsers/devices

## Out of Scope

- Task sharing between users (single-user isolation only)
- Collaborative task management
- Advanced task features like subtasks, dependencies, or recurring tasks
- File attachments or rich media in tasks
- Email notifications for task updates
- Export/import functionality for tasks
- Advanced reporting or analytics features
- Administrative interfaces for monitoring
- Third-party integrations (calendar, email, etc.)

## Evolution Notes

### Preparation for Phase III (AI Chatbot Integration)
- API endpoints designed to support natural language processing
- Task data structure includes metadata fields for AI interpretation
- Response formats compatible with chatbot consumption
- Error handling patterns consistent with conversational interfaces
- Authentication flow supports both direct UI and bot interactions

### Future Extensibility
- Modular API design allows for additional task properties
- Database schema designed with expansion in mind
- Frontend components built for reuse in AI interfaces
- Event-driven architecture preparation for real-time notifications
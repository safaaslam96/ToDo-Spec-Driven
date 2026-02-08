# REST API Endpoints Specification - Phase II

## Overview

This specification defines the REST API endpoints for the Task CRUD operations in the Phase II full-stack web todo application. The API implements a multi-user system with JWT-based authentication and strict user isolation. All endpoints require valid authentication tokens and enforce user-specific access controls.

## Base URL

All endpoints are rooted at `/api` with user-specific paths where applicable.

## Authentication

All endpoints require a valid JWT Bearer token in the Authorization header:
`Authorization: Bearer {token}`

The backend verifies the token using the shared secret `BETTER_AUTH_SECRET` and extracts the user ID for access control and data isolation.

## Endpoints

### List All Tasks

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Path** | `/api/tasks` |
| **Description** | Retrieve all tasks for the authenticated user |
| **Authentication Required** | Yes |
| **Path Parameters** | None |
| **Query Parameters** | `status` (optional): all, pending, completed<br>`sort` (optional): created, title<br>`limit` (optional): integer limit for pagination<br>`offset` (optional): integer offset for pagination |
| **Request Headers** | `Authorization: Bearer {token}` |
| **Request Body** | None |
| **Response Model** | 200 OK: Array of Task objects |
| **Error Responses** | 401 Unauthorized: Invalid/missing token<br>403 Forbidden: Token verification failed<br>500 Internal Server Error: Server error |

### Create New Task

| Property | Value |
|----------|-------|
| **Method** | POST |
| **Path** | `/api/tasks` |
| **Description** | Create a new task for the authenticated user |
| **Authentication Required** | Yes |
| **Path Parameters** | None |
| **Query Parameters** | None |
| **Request Headers** | `Authorization: Bearer {token}` |
| **Request Body Model** | ```python class TaskCreate(BaseModel): title: str description: Optional[str] = None priority: Optional[str] = "medium" # low, medium, high completed: Optional[bool] = False ``` |
| **Response Model** | 201 Created: Created Task object |
| **Error Responses** | 400 Bad Request: Invalid request body<br>401 Unauthorized: Invalid/missing token<br>403 Forbidden: Token verification failed<br>422 Validation Error: Validation issues<br>500 Internal Server Error: Server error |

### Get Single Task

| Property | Value |
|----------|-------|
| **Method** | GET |
| **Path** | `/api/tasks/{id}` |
| **Description** | Retrieve a specific task by ID for the authenticated user |
| **Authentication Required** | Yes |
| **Path Parameters** | `id` (required): Integer task ID |
| **Query Parameters** | None |
| **Request Headers** | `Authorization: Bearer {token}` |
| **Request Body** | None |
| **Response Model** | 200 OK: Single Task object |
| **Error Responses** | 401 Unauthorized: Invalid/missing token<br>404 Not Found: Task does not exist or belongs to different user<br>500 Internal Server Error: Server error |

### Update Task

| Property | Value |
|----------|-------|
| **Method** | PUT |
| **Path** | `/api/tasks/{id}` |
| **Description** | Update a specific task by ID for the authenticated user (full update) |
| **Authentication Required** | Yes |
| **Path Parameters** | `id` (required): Integer task ID |
| **Query Parameters** | None |
| **Request Headers** | `Authorization: Bearer {token}` |
| **Request Body Model** | ```python class TaskUpdate(BaseModel): title: Optional[str] = None description: Optional[str] = None priority: Optional[str] = None # low, medium, high completed: Optional[bool] = None ``` |
| **Response Model** | 200 OK: Updated Task object |
| **Error Responses** | 400 Bad Request: Invalid request body<br>401 Unauthorized: Invalid/missing token<br>404 Not Found: Task does not exist or belongs to different user<br>422 Validation Error: Validation issues<br>500 Internal Server Error: Server error |

### Delete Task

| Property | Value |
|----------|-------|
| **Method** | DELETE |
| **Path** | `/api/tasks/{id}` |
| **Description** | Delete a specific task by ID for the authenticated user |
| **Authentication Required** | Yes |
| **Path Parameters** | `id` (required): Integer task ID |
| **Query Parameters** | None |
| **Request Headers** | `Authorization: Bearer {token}` |
| **Request Body** | None |
| **Response Model** | 204 No Content |
| **Error Responses** | 401 Unauthorized: Invalid/missing token<br>404 Not Found: Task does not exist or belongs to different user<br>500 Internal Server Error: Server error |

### Toggle Task Completion

| Property | Value |
|----------|-------|
| **Method** | PATCH |
| **Path** | `/api/tasks/{id}/complete` |
| **Description** | Toggle the completion status of a specific task by ID for the authenticated user |
| **Authentication Required** | Yes |
| **Path Parameters** | `id` (required): Integer task ID |
| **Query Parameters** | None |
| **Request Headers** | `Authorization: Bearer {token}` |
| **Request Body Model** | ```python class TaskToggleComplete(BaseModel): completed: bool # True to mark complete, False to mark incomplete ``` |
| **Response Model** | 200 OK: Updated Task object |
| **Error Responses** | 400 Bad Request: Invalid request body<br>401 Unauthorized: Invalid/missing token<br>404 Not Found: Task does not exist or belongs to different user<br>422 Validation Error: Validation issues<br>500 Internal Server Error: Server error |

## Response Format

### Task Object Model

```python
class Task(BaseModel):
    id: int
    title: str
    description: Optional[str]
    priority: str  # low, medium, high
    completed: bool
    created_at: datetime
    updated_at: datetime
    user_id: str  # Better Auth generates string-based user IDs
```

### Success Response Example

```json
{
  "id": 1,
  "title": "Sample task",
  "description": "This is a sample task description",
  "priority": "medium",
  "completed": false,
  "created_at": "2026-02-06T10:00:00Z",
  "updated_at": "2026-02-06T10:00:00Z",
  "user_id": "usr_abc123"
}
```

### Error Response Example

```json
{
  "detail": "Task with ID 5 not found"
}
```

## User Isolation

All operations filter data by the authenticated user's ID extracted from the JWT token. If a user attempts to access or modify another user's task, the API returns 404 Not Found (intentionally hides task existence to prevent enumeration attacks).

## Security Considerations

- JWT tokens are verified using the shared secret `BETTER_AUTH_SECRET`
- All sensitive data is transmitted over HTTPS
- Input validation is performed on all request bodies
- SQL injection prevention via parameterized queries
- Rate limiting may be applied to prevent abuse

## Dependencies

This API specification depends on:
- @specs/database/schema.md for data structure definitions
- @specs/features/task-crud.md for business logic requirements
- The project constitution for authentication and security requirements
---
id: 3
title: "Phase II REST API Endpoints Spec"
stage: "spec"
date_iso: "2026-02-06"
surface: "agent"
model: "claude-sonnet-4-5-20250929"
feature: "rest-api-spec"
branch: "1-rest-api-spec"
user: "Administrator"
command: "/sp.specify specs/api/rest-endpoints.md Phase II REST API Endpoints Spec v1.0"
labels: ["spec", "api", "rest", "auth", "multi-user"]
spec: "specs/api/rest-endpoints.md"
ticket: null
adr: null
pr: null
files_yaml:
  - "specs/api/rest-endpoints.md"
  - "specs/api/checklists/requirements.md"
  - "history/prompts/api/3-phase-ii-rest-api.spec.prompt.md"
tests_yaml: []
links: []
---

# Prompt History Record: Phase II REST API Endpoints Spec

## Original User Prompt

```
/sp.specify specs/api/rest-endpoints.md Phase II REST API Endpoints Spec v1.0

Generate the full REST API specification for Task CRUD operations in the full-stack web todo app.

Base URL: /api (user-specific paths where applicable)

Authentication: All endpoints require JWT Bearer token in Authorization header. Backend verifies token and extracts user_id for isolation.

Endpoints:
- GET /api/tasks - List all tasks for authenticated user
- POST /api/tasks - Create a new task for authenticated user
- GET /api/tasks/{id} - Get single task by ID (must belong to user)
- PUT /api/tasks/{id} - Update task by ID (title and/or description optional)
- DELETE /api/tasks/{id} - Delete task by ID
- PATCH /api/tasks/{id}/complete - Toggle task completion by ID

For each endpoint include:
- Method and path
- Description
- Authentication required (yes)
- Path parameters (e.g., {id})
- Query parameters (for GET /api/tasks: status=all/pending/completed, sort=created/title)
- Request headers (Authorization: Bearer <token>)
- Request body model (Pydantic/SQLModel examples for POST/PUT)
- Response model (200 success, task object or list)
- Error responses (401 Unauthorized, 403 Forbidden if wrong user, 404 Not Found, 422 Validation Error)

User isolation: All operations filter by decoded JWT user_id. Wrong user_id → 403.

Shared secret: BETTER_AUTH_SECRET for JWT verification.

Reference constitution and other specs.

Output ONLY the full Markdown content of the spec file with clean formatting (tables for endpoints, code blocks for models).
```

## Assistant Response Summary

Created a comprehensive REST API specification for the Phase II todo application with all requested endpoints and details:

- Complete endpoint documentation with method, path, description, and parameters
- Authentication requirements with JWT Bearer token format
- Detailed request body models for POST and PUT operations
- Response models with example structures
- Comprehensive error responses for each endpoint
- Query parameters for filtering and sorting
- User isolation enforcement with 403 Forbidden for cross-user access
- Security considerations and dependencies

Each endpoint was documented in a standardized table format with proper code blocks for data models and examples.

## Outcome

Successfully created a complete REST API specification that meets all requirements specified by the user. The specification includes all six required endpoints with detailed documentation, proper authentication requirements, user isolation enforcement, and comprehensive error handling.

## Evaluation

The API specification successfully addresses all requirements with clear endpoint documentation, proper security measures, and adherence to the multi-user context with JWT-based authentication and user isolation.
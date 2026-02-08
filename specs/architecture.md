# Architecture — Phase II Full-Stack Web Application

## System Diagram

```
┌──────────────┐       HTTPS        ┌──────────────┐       asyncpg       ┌──────────────┐
│   Next.js    │  ──────────────►   │   FastAPI     │  ──────────────►   │    Neon       │
│   Frontend   │  ◄──────────────   │   Backend     │  ◄──────────────   │  PostgreSQL   │
│  :3000       │    JSON/REST       │  :8000        │                    │  (cloud)      │
└──────┬───────┘                    └──────┬───────┘                    └──────────────┘
       │                                   │
       │  Better Auth                      │  JWT verify
       │  (sign-in/sign-up)               │  (BETTER_AUTH_SECRET)
       └───────────────────────────────────┘
```

## Component Responsibilities

### Frontend (Next.js 16+ / TypeScript / Tailwind CSS)
- Server-rendered pages via App Router
- Client-side interactivity for forms and task management
- Better Auth integration for authentication flows
- API client with automatic JWT attachment
- Responsive UI for desktop and mobile

### Backend (FastAPI / Python 3.13+)
- RESTful API at `/api/*`
- JWT Bearer token verification middleware
- SQLModel ORM with async PostgreSQL driver (asyncpg)
- User-isolated data access (all queries filter by user_id)
- Auto-generated OpenAPI docs at `/docs`

### Database (Neon Serverless PostgreSQL)
- `tasks` table with user_id foreign key
- Indexed by user_id for query performance
- Managed schema migrations via Alembic

## Authentication Flow

1. User signs in via Better Auth on frontend
2. Better Auth issues JWT token (signed with BETTER_AUTH_SECRET)
3. Frontend stores token and attaches to API requests as `Authorization: Bearer {token}`
4. Backend `get_current_user_id()` dependency verifies JWT and extracts `sub` claim
5. All database queries filter by the verified user_id

## API Design

- Base path: `/api`
- Task endpoints: `/api/tasks`, `/api/tasks/{id}`, `/api/tasks/{id}/complete`
- Auth: Bearer token required on all task endpoints
- Error model: `{ "detail": "message" }` with appropriate HTTP status codes
- Full spec: [specs/api/rest-endpoints.md](api/rest-endpoints.md)

## Data Model

- See [specs/database/schema.md](database/schema.md) for table definitions
- Core table: `tasks` (id, title, description, priority, completed, user_id, created_at, updated_at)

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Frontend framework | Next.js 16+ App Router | Server components, modern React patterns |
| Backend framework | FastAPI | Async Python, auto-docs, Pydantic validation |
| ORM | SQLModel | Combines SQLAlchemy + Pydantic, type-safe |
| Database | Neon PostgreSQL | Serverless scaling, standard PostgreSQL |
| Auth | Better Auth + JWT | Stateless, shared secret between FE/BE |
| User isolation | Query-level filtering | Simple, secure, no complex RBAC needed |

## Development Setup

Both services run locally via docker-compose or individually:
- Frontend: `cd frontend && npm run dev` (port 3000)
- Backend: `cd backend && uv run uvicorn app.main:app --reload` (port 8000)
- Database: Neon cloud instance (connection string in `.env`)

## Evolution Hooks (Phase 3+)

- API versioning: `/api/v1/*` prefix can be added when breaking changes needed
- Event system: FastAPI background tasks or message queue for Phase 5
- Containerization: Dockerfiles in frontend/ and backend/ for Phase 4

# Tasks: Phase II — Full-Stack Web Application
## Tasks 6-15 (Extracted from master-tasks.md)

**Branch**: `1-rest-api-spec`
**Date**: 2026-02-18
**Spec**: `specs/features/`, `specs/api/`, `specs/database/`, `specs/ui/`
**Plan**: `specs/main/plan.md`
**Status**: 🔄 Scaffolded — backend (18 files) + frontend (16 files) already exist

> **Note**: Phase II monorepo has been scaffolded via Claude Code. Verify each task against
> the existing files before re-implementing. Mark tasks `[X]` as files are confirmed.

---

## Implementation Sequence

```
Task 6 → Task 7 → Task 8 → Task 9 → Task 10
      → Task 11 → Task 12 → Task 13 → Task 14 → Task 15
```

---

### Task 6: Monorepo Setup & Spec Organization
**Duration:** 45 minutes
**Priority:** P0
**Dependencies:** None
**Status:** [X] Complete (monorepo scaffolded)

**Files to Verify:**
```
.specify/config.yaml
specs/overview.md
specs/architecture.md
specs/features/
specs/api/
specs/database/
specs/ui/
frontend/CLAUDE.md
backend/CLAUDE.md
CLAUDE.md
```

**Acceptance Criteria:**
- [X] Monorepo structure created
- [X] Specs organized by type
- [X] 3 CLAUDE.md files (root, frontend, backend)
- [ ] `.specify/config.yaml` has `phase3-chatbot` phase entry (TODO)

---

### Task 7: Database Models (User + Task)
**Duration:** 30 minutes
**Priority:** P0
**Dependencies:** Task 6
**Status:** [ ] Verify

**File to Verify:** `backend/app/models.py` or `backend/models.py`

**Models Required:**
```python
class User(SQLModel, table=True):
    id: str  # PK
    email: str  # unique
    name: str
    password_hash: str
    created_at: datetime

class Task(SQLModel, table=True):
    id: int  # PK, auto-increment
    user_id: str  # FK → users.id
    title: str  # max 200
    description: Optional[str]
    completed: bool  # default False
    created_at: datetime
    updated_at: datetime
```

**Acceptance Criteria:**
- [ ] Both models exist and match schema
- [ ] Foreign key: `Task.user_id → User.id`
- [ ] Index on `tasks.user_id`
- [ ] SQLModel table=True on both

---

### Task 8: Database Connection & Setup
**Duration:** 20 minutes
**Priority:** P0
**Dependencies:** Task 7
**Status:** [ ] Verify

**Files to Verify:** `backend/app/database.py` or `backend/db.py`

**Required:**
```python
engine = create_engine(settings.DATABASE_URL)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session() -> Generator:
    with Session(engine) as session:
        yield session
```

**Acceptance Criteria:**
- [ ] Engine creates from `DATABASE_URL`
- [ ] `get_session()` dependency exists
- [ ] Tables auto-created on startup
- [ ] `.env` has `DATABASE_URL` (Neon connection string)

---

### Task 9: Authentication Endpoints (Signup/Signin)
**Duration:** 60 minutes
**Priority:** P0
**Dependencies:** Task 8
**Status:** [ ] Verify

**File to Verify:** `backend/app/api/routes/auth.py` or `backend/routes/auth.py`

**Endpoints Required:**
```
POST /api/auth/signup   → {user_id, email, name, token}
POST /api/auth/signin   → {user_id, email, name, token}
GET  /api/auth/me       → {user_id, email, name}
```

**Acceptance Criteria:**
- [ ] Signup creates user + returns JWT
- [ ] Signin verifies password + returns JWT
- [ ] Passwords hashed (bcrypt)
- [ ] JWT contains `sub` (user_id)
- [ ] 409 on duplicate email
- [ ] 401 on wrong credentials

---

### Task 10: JWT Verification Middleware/Dependency
**Duration:** 30 minutes
**Priority:** P0
**Dependencies:** Task 9
**Status:** [ ] Verify

**File to Verify:** `backend/app/auth/jwt.py` or `backend/middleware/auth.py`

**Required:**
```python
def verify_jwt_token(authorization: str = Header(None)) -> str:
    # Extract Bearer token
    # Verify signature with JWT_SECRET
    # Return user_id (from 'sub' claim)
    # Raise 401 if invalid/missing
```

**Acceptance Criteria:**
- [ ] Extracts token from `Authorization: Bearer <token>` header
- [ ] Verifies JWT signature
- [ ] Returns `user_id` from `sub` claim
- [ ] Raises 401 on missing/invalid/expired token

---

### Task 11: Task CRUD Endpoints
**Duration:** 90 minutes
**Priority:** P0
**Dependencies:** Task 10
**Status:** [ ] Verify

**File to Verify:** `backend/app/api/routes/tasks.py`

**Endpoints Required:**
```
GET    /api/{user_id}/tasks              → list user's tasks
POST   /api/{user_id}/tasks              → create task
GET    /api/{user_id}/tasks/{id}         → get single task
PUT    /api/{user_id}/tasks/{id}         → update task
DELETE /api/{user_id}/tasks/{id}         → delete task (204)
PATCH  /api/{user_id}/tasks/{id}/complete → toggle completion
```

**Acceptance Criteria:**
- [ ] All 6 endpoints implemented
- [ ] JWT dependency on all routes
- [ ] `if jwt_user_id != user_id: raise 403`
- [ ] `if task.user_id != user_id: raise 403` (ownership check)
- [ ] Correct status codes: 200, 201, 204, 404
- [ ] 404 for non-existent tasks

---

### Task 12: FastAPI Main App Configuration
**Duration:** 30 minutes
**Priority:** P0
**Dependencies:** Tasks 9, 11
**Status:** [ ] Verify

**File to Verify:** `backend/app/main.py`

**Required:**
```python
app = FastAPI(title="Todo Backend API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], ...)
app.include_router(auth.router, prefix="/api")
app.include_router(tasks.router, prefix="/api")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

@app.get("/health")
def health(): return {"status": "ok"}
```

**Acceptance Criteria:**
- [ ] CORSMiddleware allows Vercel + localhost origins
- [ ] Both routers included
- [ ] Database tables auto-created on startup
- [ ] `/health` endpoint returns 200

---

### Task 13: Hugging Face Deployment Setup
**Duration:** 45 minutes
**Priority:** P0
**Dependencies:** Task 12
**Status:** [ ] Verify

**Files to Verify:**
```
backend/Dockerfile
backend/README.md  (with HF Spaces frontmatter)
backend/requirements.txt
```

**Dockerfile must expose port 7860:**
```dockerfile
EXPOSE 7860
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
```

**HF README frontmatter:**
```yaml
---
title: Todo Backend API
emoji: 📝
colorFrom: blue
colorTo: green
sdk: docker
pinned: false
---
```

**Acceptance Criteria:**
- [ ] Dockerfile uses port 7860 (HF Spaces requirement)
- [ ] README.md has valid HF Spaces frontmatter
- [ ] requirements.txt lists all dependencies
- [ ] `docker build` succeeds locally

---

### Task 14: Frontend Setup (Next.js + TypeScript)
**Duration:** 60 minutes
**Priority:** P0
**Dependencies:** None
**Status:** [X] Scaffolded (16 files exist)

**Files to Verify:**
```
frontend/app/layout.tsx
frontend/app/page.tsx
frontend/app/(auth)/login/page.tsx
frontend/app/(auth)/signup/page.tsx
frontend/app/dashboard/page.tsx
frontend/components/
frontend/lib/api-client.ts
frontend/package.json
```

**Acceptance Criteria:**
- [X] Next.js 16+ with App Router
- [X] TypeScript configured
- [X] Tailwind CSS configured
- [ ] `npm run dev` starts without errors
- [ ] Login/Signup pages render

---

### Task 15: Frontend API Client & Auth UI
**Duration:** 90 minutes
**Priority:** P0
**Dependencies:** Task 14
**Status:** [ ] Verify

**Files to Verify:** `frontend/lib/api-client.ts`, `frontend/app/(auth)/`

**API Client must include:**
```typescript
// All task CRUD methods
getTasks(userId, status?): Promise<Task[]>
createTask(userId, data): Promise<Task>
updateTask(userId, taskId, data): Promise<Task>
deleteTask(userId, taskId): Promise<void>
toggleComplete(userId, taskId): Promise<Task>

// Auth methods
signup(email, name, password): Promise<AuthResponse>
signin(email, password): Promise<AuthResponse>

// JWT token management
setToken(token: string): void
getToken(): string | null
```

**Acceptance Criteria:**
- [ ] All API methods implemented with JWT headers
- [ ] Token stored in localStorage
- [ ] Login page submits and redirects to dashboard
- [ ] Signup page submits and redirects
- [ ] Dashboard displays task list
- [ ] Task CRUD operations work from UI

---

## Phase II Progress Tracker

```markdown
## Phase II Progress

- [X] Task 6:  Monorepo Setup (scaffolded)
- [ ] Task 7:  Database Models — verify
- [ ] Task 8:  Database Connection — verify
- [ ] Task 9:  Auth Endpoints — verify
- [ ] Task 10: JWT Middleware — verify
- [ ] Task 11: Task CRUD Endpoints — verify
- [ ] Task 12: FastAPI Main App — verify
- [ ] Task 13: HF Deployment Setup — verify
- [X] Task 14: Frontend Setup (scaffolded)
- [ ] Task 15: Frontend API Client + Auth UI — verify

Status: ~20% verified (2/10 confirmed complete)
Deadline: Dec 14, 2025
```

---

**Tasks Version**: 1.0
**Status**: Ready for Verification
**Next Step**: Verify scaffolded files against acceptance criteria, then run `/sp.implement`

# The Evolution of Todo — Full Development Plan v1.0

**Branch**: `1-rest-api-spec` | **Date**: 2026-02-07 | **Version**: 1.0.0
**Constitution**: `.specify/memory/constitution.md` (v2.0.0)
**Status**: Phase I Complete, Phase II In Progress, Phases III–V Planned

---

## Plan Overview

**Hackathon Goal**: Simulate real-world software evolution — from a Python console app to a Kubernetes-managed, event-driven distributed system — using Spec-Driven Development with AI-only implementation across 5 phases.

### Part Grouping

| Part | Phases | Name | Focus |
|------|--------|------|-------|
| **A** | 1, 2, 3 | **Web App** | Console → Full-Stack Web App → AI Chatbot |
| **B** | 4, 5 | **Cloud Deployment** | Local Kubernetes → Cloud Kubernetes (DigitalOcean) |

### Phase Summary

| Phase | Name | Status | Key Deliverable |
|-------|------|--------|-----------------|
| 1 | Console App | **Complete** | In-memory Python CLI (`src/todo_app/`) |
| 2 | Full-Stack Web App | **In Progress** | FastAPI + Next.js + Neon PostgreSQL + Better Auth |
| 3 | AI Chatbot Integration | Planned | OpenAI Agents SDK + MCP + ChatKit UI |
| 4 | Local Kubernetes | Planned | Docker + Minikube + Helm + Dapr + Kafka |
| 5 | Cloud Kubernetes | Planned | DigitalOcean DOKS + kubectl-ai + kagent |

---

## Installation Guide

### Prerequisites

All tools should be installed in this order. Commands are for Ubuntu/WSL 2.

#### 1. UV (Python Package Manager)
```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
uv --version  # Verify: 0.4.16+
```

#### 2. Python 3.13
```bash
uv python install 3.13.0
uv python list  # Verify 3.13.0 available
```

#### 3. Backend Dependencies (FastAPI + SQLModel)
```bash
cd backend
uv sync  # Installs from pyproject.toml
# Key packages: fastapi==0.115.0, sqlmodel==0.0.22, pyjwt==2.9.0, asyncpg, uvicorn
```

#### 4. Node.js 22 LTS + Frontend Dependencies
```bash
# Install Node.js 22 via nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash
nvm install 22
node --version  # Verify: v22.x

cd frontend
npm install  # Installs from package.json
# Key packages: next@16.0.0, react@19, tailwindcss@3.4.1, better-auth@0.4.0
```

#### 5. Neon PostgreSQL
```bash
# Sign up at https://neon.tech (free tier)
# Create a new project, copy connection string
# Add to .env:
#   DATABASE_URL=postgresql+asyncpg://user:pass@host/dbname?sslmode=require
```

#### 6. Docker
```bash
sudo apt-get update && sudo apt-get install -y docker.io
sudo usermod -aG docker $USER
docker --version  # Verify: 27.3.1+
```

#### 7. Minikube (Phase 4+)
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
minikube version  # Verify: 1.34.0+
```

#### 8. Helm (Phase 4+)
```bash
curl https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3 | bash
helm version  # Verify: 3.15.4+
```

#### 9. kubectl
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/kubectl
kubectl version --client  # Verify latest stable
```

#### 10. Dapr CLI (Phase 4+)
```bash
wget -q https://raw.githubusercontent.com/dapr/cli/master/install/install.sh -O - | /bin/bash
dapr --version  # Verify: 1.13.2+
```

#### 11. AI Tools (Phase 3+)
```bash
# OpenAI Agents SDK (backend)
cd backend && uv add openai-agents==1.8.0

# MCP SDK (backend)
cd backend && uv add mcp

# ChatKit (frontend) - for AI chat UI
cd frontend && npm install @openai/chatkit
```

#### 12. Cloud CLI — DigitalOcean (Phase 5)
```bash
# Install doctl
snap install doctl
doctl auth init  # Authenticate with API token
```

---

## Tech Stack Table

| Category | Technology | Version | Phase | Notes |
|----------|------------|---------|-------|-------|
| **Package Manager** | UV | 0.4.16+ | 1–5 | Python dependency management |
| **Runtime** | Python | 3.13.0 | 1–5 | Backend language |
| **Runtime** | Node.js | 22 LTS | 2–5 | Frontend runtime |
| **Dev Tools** | Claude Code + Spec-Kit Plus | Latest | 1–5 | AI-only implementation framework |
| **Backend** | FastAPI | 0.115.0 | 2–5 | Async REST API framework |
| **ORM** | SQLModel | 0.0.22 | 2–5 | SQLAlchemy + Pydantic hybrid |
| **Auth (JWT)** | PyJWT | 2.9.0 | 2–5 | JWT verification (HS256) |
| **DB Driver** | asyncpg | Latest | 2–5 | Async PostgreSQL driver |
| **Database** | Neon PostgreSQL | Serverless | 2–5 | Cloud-managed PostgreSQL |
| **Frontend** | Next.js | 16.0.0 | 2–5 | App Router, React 19 |
| **CSS** | Tailwind CSS | 3.4.1 | 2–5 | Utility-first styling |
| **Auth (Client)** | Better Auth | 0.4.0 | 2–5 | Frontend authentication SDK |
| **AI Agents** | OpenAI Agents SDK | 1.8.0 | 3–5 | AI agent orchestration |
| **AI Chat UI** | OpenAI ChatKit | Latest | 3–5 | Chat interface components |
| **MCP** | Official MCP SDK | Latest | 3–5 | Tool/server integration |
| **Containers** | Docker | 27.3.1 | 4–5 | Containerization |
| **Local K8s** | Minikube | 1.34.0 | 4 | Local Kubernetes cluster |
| **K8s Packaging** | Helm | 3.15.4 | 4–5 | Kubernetes chart management |
| **Events** | Apache Kafka | 3.8.0 | 4–5 | Event streaming platform |
| **Microservices** | Dapr | 1.13.2 | 4–5 | Distributed app runtime |
| **AI K8s** | kubectl-ai | Latest | 5 | AI-assisted kubectl |
| **AI K8s** | kagent | Latest | 5 | AI Kubernetes agent |
| **Cloud** | DigitalOcean DOKS | Managed | 5 | Cloud Kubernetes |

---

## Monorepo Organization

```
ToDo-Spec-Driven/
├── src/todo_app/                    # Phase 1: Console App (FROZEN)
│   ├── main.py
│   ├── app.py
│   ├── models.py
│   ├── storage.py
│   ├── ui.py
│   ├── utils.py
│   └── features/                    # 5 CRUD feature modules
│
├── backend/                         # Phase 2+: FastAPI Application
│   ├── app/
│   │   ├── main.py                  # FastAPI entry, CORS, lifespan
│   │   ├── config.py                # Pydantic Settings (.env)
│   │   ├── auth/jwt.py              # JWT Bearer verification
│   │   ├── database/connection.py   # Async engine + session
│   │   ├── models/task.py           # SQLModel Task + schemas
│   │   ├── api/routes/tasks.py      # Task CRUD endpoints
│   │   ├── api/routes/health.py     # Health check
│   │   └── agents/                  # Phase 3: AI agents
│   ├── tests/                       # pytest + httpx tests
│   ├── alembic/                     # DB migrations
│   ├── pyproject.toml
│   └── Dockerfile
│
├── frontend/                        # Phase 2+: Next.js Application
│   ├── app/                         # App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx                 # Landing
│   │   ├── auth/page.tsx            # Sign in/up
│   │   ├── dashboard/page.tsx       # Task management
│   │   └── chat/page.tsx            # Phase 3: AI chat
│   ├── components/
│   │   ├── tasks/                   # Task UI components
│   │   ├── chat/                    # Phase 3: Chat UI
│   │   └── ui/                      # Shared UI components
│   ├── lib/
│   │   ├── api-client.ts            # JWT-attached fetch
│   │   └── auth.ts                  # Better Auth client
│   ├── types/task.ts
│   ├── package.json
│   └── Dockerfile
│
├── deploy/                          # Phase 4+: Deployment configs
│   ├── docker-compose.yml           # Local dev orchestration
│   ├── helm/                        # Helm charts
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   └── templates/
│   ├── k8s/                         # Raw K8s manifests
│   │   ├── backend-deployment.yaml
│   │   ├── frontend-deployment.yaml
│   │   ├── kafka-deployment.yaml
│   │   └── ingress.yaml
│   └── dapr/                        # Dapr components
│       ├── pubsub.yaml
│       └── statestore.yaml
│
├── specs/                           # All specifications
│   ├── overview.md
│   ├── architecture.md
│   ├── main/plan.md                 # Phase II plan
│   ├── features/                    # Feature specs
│   ├── api/                         # API specs
│   ├── database/                    # Schema specs
│   └── ui/                          # UI specs
│
├── specs_history/                   # Versioned plan/spec snapshots
│   ├── phase1_basic_features_v1.spec.md
│   ├── phase1_dev_plan_v1.plan.md
│   ├── phase1_tasks_v1.tasks.md
│   └── phase2_full_plan_v1.plan.md  # THIS FILE
│
├── skills/                          # Specialist CLAUDE.md files
│   ├── python-specialist/CLAUDE.md
│   ├── frontend-architect/CLAUDE.md
│   ├── qa-testing-specialist/CLAUDE.md
│   ├── ai-mcp-integration/CLAUDE.md
│   └── cloud-native-devops/CLAUDE.md
│
├── history/                         # PHRs, ADRs, state reports
│   └── prompts/
│
├── .specify/                        # Spec-Kit Plus config + templates
│   ├── config.yaml
│   ├── memory/constitution.md       # v2.0.0 (AUTHORITATIVE)
│   └── templates/
│
├── CLAUDE.md                        # Root project guidelines
├── .env                             # Environment variables
├── .gitignore
└── docker-compose.yml               # Local dev (Phase 2)
```

---

## High-Level Phases

### Part A: Web Application (Phases 1–3)

#### Phase 1: Console App — COMPLETE

**Deliverable**: In-memory Python console todo app with 5 CRUD features.
**Status**: Frozen on `main` branch. Code in `src/todo_app/`.
**No further work required.**

#### Phase 2: Full-Stack Web App — IN PROGRESS

**Deliverable**: Multi-user web app with FastAPI backend, Next.js frontend, Neon PostgreSQL, Better Auth + JWT authentication.

**Key Components**:
- 6 REST API endpoints (`/api/tasks/*`) with JWT-verified user isolation
- SQLModel Task model with async PostgreSQL
- Next.js dashboard with task CRUD UI
- Better Auth sign-up/sign-in/sign-out
- Responsive design (mobile/tablet/desktop)

**Specs**: `specs/features/task-crud.md`, `specs/api/rest-endpoints.md`, `specs/features/authentication.md`, `specs/database/schema.md`, `specs/ui/pages.md`, `specs/ui/components.md`

#### Phase 3: AI Chatbot Integration — PLANNED

**Deliverable**: Natural language task management via AI chatbot with MCP tool integration.

**Key Components**:
- OpenAI Agents SDK backend agent for task operations
- MCP server exposing task CRUD as tools
- ChatKit-powered chat UI on `/chat` page
- Conversational error recovery
- Event-driven hooks for real-time task updates

**New Directories**: `backend/app/agents/`, `frontend/app/chat/`, `frontend/components/chat/`

### Part B: Cloud Deployment (Phases 4–5)

#### Phase 4: Local Kubernetes — PLANNED

**Deliverable**: Fully containerized app running on Minikube with Helm charts, Kafka event streaming, and Dapr service mesh.

**Key Components**:
- Production Dockerfiles (multi-stage builds)
- Helm chart packaging (backend, frontend, Kafka, PostgreSQL)
- Dapr pub/sub for event-driven task notifications
- Kafka for event streaming between services
- Health checks, readiness probes, resource limits
- CI/CD pipeline (GitHub Actions)

**New Directories**: `deploy/helm/`, `deploy/k8s/`, `deploy/dapr/`

#### Phase 5: Cloud Kubernetes (DigitalOcean) — PLANNED

**Deliverable**: Production deployment on DigitalOcean DOKS with AI-assisted operations.

**Key Components**:
- DigitalOcean Kubernetes (DOKS) cluster provisioning
- Managed PostgreSQL (or keep Neon)
- Ingress controller + TLS certificates
- kubectl-ai for AI-assisted cluster management
- kagent for autonomous Kubernetes operations
- Monitoring (Prometheus + Grafana)
- Log aggregation

---

## Task Breakdown

### Phase 1 Tasks — COMPLETE (No action required)

Phase 1 is frozen. 12 tasks completed. See `specs_history/phase1_dev_plan_v1.plan.md`.

---

### Phase 2 Tasks (Web App Backend + Frontend)

#### Task 1: Set up Neon PostgreSQL connection
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: None
**Target Files**: `backend/app/database/connection.py`, `backend/app/config.py`, `.env`

- Configure `DATABASE_URL` in `.env` pointing to Neon instance
- Verify async engine creation with `create_async_engine`
- `create_db_and_tables()` creates tasks table on startup
- `GET /api/health` returns 200 with DB connection status
- Connection errors handled gracefully (500, no stack trace leak)

---

#### Task 2: Finalize SQLModel Task model and schemas
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Task 1
**Target Files**: `backend/app/models/task.py`

- Task table: id (SERIAL PK), title (VARCHAR 255), description (TEXT nullable), priority (default "medium"), completed (default False), user_id (str, indexed), created_at, updated_at
- TaskCreate, TaskUpdate, TaskRead schemas
- Priority validated as enum: low, medium, high
- user_id type is `str` (Better Auth string IDs)

---

#### Task 3: Implement JWT Bearer authentication middleware
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: None (parallel with Tasks 1–2)
**Target Files**: `backend/app/auth/jwt.py`, `backend/app/config.py`

- Extract Bearer token from Authorization header
- Verify JWT signature with BETTER_AUTH_SECRET (HS256)
- Extract `sub` claim as user_id (str)
- Return 401 for missing/invalid/expired tokens
- Works as FastAPI `Depends()` injectable

---

#### Task 4: Implement POST /api/tasks — Create Task
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Tasks 1, 2, 3
**Target Files**: `backend/app/api/routes/tasks.py`

- POST `/api/tasks` with TaskCreate body
- user_id from JWT `sub` claim (not request body)
- Title required, 400 if empty; priority defaults to "medium"
- Returns 201 Created with TaskRead response

---

#### Task 5: Implement GET /api/tasks — List Tasks
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Tasks 1, 2, 3
**Target Files**: `backend/app/api/routes/tasks.py`

- Returns all tasks for authenticated user only
- Query params: status, sort, limit, offset
- Empty array for no tasks (not 404)
- Returns 200 OK with TaskRead array

---

#### Task 6: Implement GET /api/tasks/{id} — Get Single Task
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Tasks 1, 2, 3
**Target Files**: `backend/app/api/routes/tasks.py`

- WHERE id = :id AND user_id = :user_id
- 200 OK with TaskRead or 404 (cross-user returns 404 too)

---

#### Task 7: Implement PUT /api/tasks/{id} — Update Task
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Tasks 1, 2, 3
**Target Files**: `backend/app/api/routes/tasks.py`

- Partial update (only fields present in body)
- updated_at set to current UTC
- 404 if not found or belongs to another user

---

#### Task 8: Implement DELETE /api/tasks/{id} — Delete Task
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Tasks 1, 2, 3
**Target Files**: `backend/app/api/routes/tasks.py`

- 204 No Content on success
- 404 if not found or belongs to another user

---

#### Task 9: Implement PATCH /api/tasks/{id}/complete — Toggle Completion
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Tasks 1, 2, 3
**Target Files**: `backend/app/api/routes/tasks.py`

- Request body: `{ "completed": true/false }`
- 200 OK with updated TaskRead
- updated_at set to current UTC

---

#### Task 10: Write backend API integration tests
**Phase**: 2 | **Specialist**: qa-testing-specialist | **Effort**: Medium
**Dependencies**: Tasks 4–9
**Target Files**: `backend/tests/conftest.py`, `backend/tests/test_tasks.py`, `backend/tests/test_auth.py`

- Async test client with httpx + pytest-asyncio
- Mock JWT tokens (user A, user B, expired, invalid)
- Test all 6 endpoints: happy paths, auth failures, user isolation, validation
- All pass with `pytest backend/tests/ -v`

---

#### Task 11: Implement Better Auth integration on frontend
**Phase**: 2 | **Specialist**: frontend-architect | **Effort**: Medium
**Dependencies**: Task 3
**Target Files**: `frontend/lib/auth.ts`, `frontend/app/auth/page.tsx`, `frontend/lib/api-client.ts`

- Better Auth client initialization
- Sign Up / Sign In forms with validation
- Token storage and attachment to API requests
- Route protection: `/dashboard` → `/auth` redirect if unauthed
- Error states for invalid credentials

---

#### Task 12: Build Dashboard page with task management UI
**Phase**: 2 | **Specialist**: frontend-architect | **Effort**: High
**Dependencies**: Tasks 5, 11
**Target Files**: `frontend/app/dashboard/page.tsx`, `frontend/components/tasks/*`

- Fetch and display tasks from API
- Create/edit/delete tasks via forms
- Toggle completion via checkbox
- Filters (status) and sorting (created/title)
- Loading/error/empty states
- Responsive layout

---

#### Task 13: Build shared UI components
**Phase**: 2 | **Specialist**: frontend-architect | **Effort**: Medium
**Dependencies**: None (parallel with backend)
**Target Files**: `frontend/components/ui/*`

- Button (primary/secondary/danger), Input, Select, Dialog, Badge, Spinner
- TypeScript interfaces for all props
- Tailwind CSS styling

---

#### Task 14: Polish Landing page and styling
**Phase**: 2 | **Specialist**: frontend-architect | **Effort**: Low
**Dependencies**: Task 13
**Target Files**: `frontend/app/page.tsx`, `frontend/app/globals.css`, `frontend/app/layout.tsx`

- Hero section, CTA buttons, consistent theme
- Responsive design across breakpoints

---

#### Task 15: Set up Alembic migrations
**Phase**: 2 | **Specialist**: python-specialist | **Effort**: Low
**Dependencies**: Tasks 1, 2
**Target Files**: `backend/alembic.ini`, `backend/alembic/env.py`, `backend/alembic/versions/`

- Init Alembic with async driver config
- Auto-generate initial migration from SQLModel metadata
- Verify upgrade/downgrade against Neon

---

#### Task 16: End-to-end integration test (Phase 2)
**Phase**: 2 | **Specialist**: qa-testing-specialist | **Effort**: Medium
**Dependencies**: Tasks 10, 12, 14
**Target Files**: `backend/tests/test_e2e.py`

- Full journey: register → login → CRUD → logout
- API responses match spec (status codes, shapes)
- User isolation verified
- No console errors in frontend

---

### Phase 3 Tasks (AI Chatbot Integration)

#### Task 17: Create MCP server for task operations
**Phase**: 3 | **Specialist**: ai-mcp-integration | **Effort**: Medium
**Dependencies**: Tasks 4–9 (all CRUD endpoints working)
**Target Files**: `backend/app/agents/mcp_server.py`, `backend/app/agents/__init__.py`

- MCP server exposing task CRUD as tools (create_task, list_tasks, update_task, delete_task, toggle_task)
- Each tool wraps the existing API route logic
- Tool descriptions in natural language for AI consumption
- Input/output schemas match TaskCreate/TaskUpdate/TaskRead
- Error responses formatted for conversational recovery

---

#### Task 18: Implement AI agent with OpenAI Agents SDK
**Phase**: 3 | **Specialist**: ai-mcp-integration | **Effort**: High
**Dependencies**: Task 17
**Target Files**: `backend/app/agents/task_agent.py`, `backend/app/api/routes/chat.py`

- Agent initialized with OpenAI Agents SDK 1.8.0
- System prompt: task management assistant for authenticated user
- Connected to MCP server tools
- POST `/api/chat` endpoint accepts user message, returns agent response
- Agent receives user_id from JWT for tool calls
- Handles multi-turn conversation context

---

#### Task 19: Build ChatKit-powered chat UI
**Phase**: 3 | **Specialist**: frontend-architect | **Effort**: Medium
**Dependencies**: Task 18
**Target Files**: `frontend/app/chat/page.tsx`, `frontend/components/chat/chat-window.tsx`, `frontend/components/chat/message-bubble.tsx`

- ChatKit integration for chat UI components
- `/chat` page with message input and response display
- Message bubbles for user and AI messages
- Loading states during AI processing
- Task operation results rendered inline
- Auth required (redirects if not logged in)

---

#### Task 20: AI chatbot integration tests
**Phase**: 3 | **Specialist**: qa-testing-specialist | **Effort**: Medium
**Dependencies**: Tasks 18, 19
**Target Files**: `backend/tests/test_chat.py`

- Test MCP tool invocations via agent
- Test natural language → task operation mapping
- Test auth-protected chat endpoint
- Test error recovery (invalid task, ambiguous request)

---

### Phase 4 Tasks (Local Kubernetes)

#### Task 21: Production Docker images (multi-stage builds)
**Phase**: 4 | **Specialist**: cloud-native-devops | **Effort**: Medium
**Dependencies**: Tasks 16 or 20 (working app)
**Target Files**: `backend/Dockerfile`, `frontend/Dockerfile`

- Multi-stage builds for minimal image size
- Non-root user in containers
- Health check instructions in Dockerfiles
- `.dockerignore` files for both services
- Verify: `docker compose up --build` works

---

#### Task 22: Helm chart for full application
**Phase**: 4 | **Specialist**: cloud-native-devops | **Effort**: High
**Dependencies**: Task 21
**Target Files**: `deploy/helm/Chart.yaml`, `deploy/helm/values.yaml`, `deploy/helm/templates/*`

- Helm chart with backend + frontend deployments
- ConfigMaps for non-secret configuration
- Secrets for DATABASE_URL, BETTER_AUTH_SECRET
- Services (ClusterIP) for internal communication
- Ingress for external access
- Resource limits and requests
- Readiness/liveness probes

---

#### Task 23: Kafka + Dapr event-driven architecture
**Phase**: 4 | **Specialist**: cloud-native-devops | **Effort**: High
**Dependencies**: Task 22
**Target Files**: `deploy/dapr/pubsub.yaml`, `deploy/dapr/statestore.yaml`, `deploy/k8s/kafka-deployment.yaml`, `backend/app/events/`

- Kafka deployment on Minikube
- Dapr pub/sub component configuration
- Backend publishes events on task CRUD (task.created, task.updated, task.deleted, task.completed)
- Event subscriber for notifications/logging
- Dapr sidecar injection for backend

---

#### Task 24: Minikube deployment and verification
**Phase**: 4 | **Specialist**: cloud-native-devops | **Effort**: Medium
**Dependencies**: Tasks 22, 23
**Target Files**: Deployment scripts, runbook docs

- `minikube start` with sufficient resources
- `helm install todo-app deploy/helm/`
- Verify all pods running and healthy
- Test API through ingress
- Verify Kafka events flowing
- Dapr dashboard accessible

---

### Phase 5 Tasks (Cloud Kubernetes — DigitalOcean)

#### Task 25: DigitalOcean DOKS cluster provisioning
**Phase**: 5 | **Specialist**: cloud-native-devops | **Effort**: Medium
**Dependencies**: Task 24 (working local K8s)
**Target Files**: `deploy/cloud/do-cluster.yaml`, deployment scripts

- `doctl kubernetes cluster create` with node pool config
- Configure kubectl context for DOKS
- Container registry setup (DOCR or Docker Hub)
- Push images to registry
- Helm install on DOKS
- TLS with cert-manager + Let's Encrypt

---

#### Task 26: AI-assisted Kubernetes operations
**Phase**: 5 | **Specialist**: cloud-native-devops | **Effort**: Medium
**Dependencies**: Task 25
**Target Files**: `deploy/cloud/kagent-config.yaml`

- kubectl-ai for natural language cluster queries
- kagent for autonomous operations (scaling, healing)
- Monitoring stack (Prometheus + Grafana via Helm)
- Log aggregation (Loki or DO-native)
- Alert rules for SLO violations

---

#### Task 27: Production hardening and final verification
**Phase**: 5 | **Specialist**: qa-testing-specialist | **Effort**: High
**Dependencies**: Tasks 25, 26
**Target Files**: Runbook, security scan reports

- Security scan (container images, dependencies)
- Load testing (API endpoints under concurrency)
- Disaster recovery test (pod restart, node drain)
- Full E2E on cloud: register → login → CRUD → AI chat → logout
- Documentation: deployment runbook, architecture diagram

---

## Dependencies Summary

```
Phase 1 (COMPLETE) ─────────────────────────────────────────────────────────────────┐
                                                                                     │
Phase 2:                                                                             │
  T1 (DB) ──┬──► T4 (Create) ──┐                                                   │
  T2 (Model)┤                   ├──► T10 (API Tests) ──┐                            │
  T3 (JWT) ─┤──► T5 (List) ────┤                       │                            │
            ├──► T6 (Get) ─────┤                       │                            │
            ├──► T7 (Update) ──┤                       │                            │
            ├──► T8 (Delete) ──┤                       │                            │
            └──► T9 (Toggle) ──┘                       │                            │
  T1,2 ──► T15 (Alembic)                              │                            │
  T3 ──► T11 (Auth FE) ──► T12 (Dashboard) ──┐        │                            │
  T13 (UI) ──► T14 (Landing) ─────────────────┼──► T16 (E2E)                       │
                                               │        │                            │
Phase 3:                                       │        │                            │
  T4-9 ──► T17 (MCP Server) ──► T18 (Agent) ──┼──► T20 (AI Tests)                  │
  T18 ──► T19 (Chat UI) ──────────────────────┘                                     │
                                                                                     │
Phase 4:                                                                             │
  T16/T20 ──► T21 (Docker) ──► T22 (Helm) ──► T23 (Kafka+Dapr) ──► T24 (Minikube) │
                                                                                     │
Phase 5:                                                                             │
  T24 ──► T25 (DOKS) ──► T26 (AI K8s) ──► T27 (Production)                         │
```

---

## Testing & Security Strategy

### Testing Layers

| Layer | Tool | Phase | Coverage |
|-------|------|-------|----------|
| Unit | pytest | 2–5 | Model validation, JWT parsing, utility functions |
| Integration | httpx AsyncClient | 2–5 | API endpoints, auth flows, user isolation |
| Component | Vitest + RTL | 2–5 | React components render correctly |
| E2E | Manual / Playwright | 2–5 | Full user journeys across frontend + backend |
| Load | k6 or locust | 4–5 | API under concurrency (p95 < 500ms) |
| Security | Trivy + Snyk | 4–5 | Container image and dependency scans |

### Security Measures

| Measure | Implementation | Phase |
|---------|----------------|-------|
| JWT Auth | BETTER_AUTH_SECRET, HS256, 1h expiry | 2+ |
| User Isolation | WHERE user_id = :jwt_sub on all queries | 2+ |
| Input Validation | Pydantic models, SQLModel constraints | 2+ |
| SQL Injection | Parameterized queries via SQLModel/asyncpg | 2+ |
| CORS | Allowlist frontend origin only | 2+ |
| HTTPS | TLS termination at ingress | 4+ |
| Secrets | K8s Secrets, not env vars in images | 4+ |
| Non-root | Docker USER directive | 4+ |
| Network Policy | K8s NetworkPolicy for pod isolation | 5 |
| Image Scanning | Trivy in CI pipeline | 4+ |

---

## Iteration Process

### Spec-Driven Development Workflow

For each feature across all phases:

```
1. /sp.specify   → Write feature spec (requirements, acceptance criteria)
2. /sp.clarify   → Resolve ambiguities (up to 5 targeted questions)
3. /sp.plan      → Generate implementation plan (this file for full project)
4. /sp.tasks     → Break plan into executable tasks.md
5. /sp.implement → Execute tasks one by one via AI
6. /sp.analyze   → Cross-artifact consistency check
7. /sp.git.commit_pr → Commit and create PR
```

### CLAUDE.md Documentation

Each directory has a `CLAUDE.md` with role-specific guidelines:

| File | Scope |
|------|-------|
| `/CLAUDE.md` | Root project rules, SDD workflow, PHR creation |
| `backend/CLAUDE.md` | FastAPI patterns, SQLModel, JWT, async DB |
| `frontend/CLAUDE.md` | Next.js App Router, TypeScript, Tailwind, Better Auth |
| `skills/python-specialist/CLAUDE.md` | Backend specialist guidelines |
| `skills/frontend-architect/CLAUDE.md` | Frontend specialist guidelines |
| `skills/qa-testing-specialist/CLAUDE.md` | Testing strategy and patterns |
| `skills/ai-mcp-integration/CLAUDE.md` | AI/MCP integration guidelines |
| `skills/cloud-native-devops/CLAUDE.md` | Docker, K8s, Helm, Dapr guidelines |

### Constitution Compliance

All work checked against `.specify/memory/constitution.md` (v2.0.0):
- I. Spec-Driven Development — specs before code
- II. Clean Code — readable, maintainable, single responsibility
- III. AI-Only Implementation — all code via Claude Code
- IV. Security-First — auth + isolation from day one
- V. API-First Architecture — REST API before frontend
- VI. User Isolation — every query filtered by user_id

---

## Final Deliverables & Run Commands

### Phase 1: Console App (COMPLETE)
```bash
cd src/todo_app
uv run python main.py
```
**Deliverable**: Menu-driven CLI with 5 CRUD operations.

### Phase 2: Full-Stack Web App
```bash
# Backend
cd backend
uv sync
uv run alembic upgrade head
uv run uvicorn app.main:app --reload --port 8000

# Frontend
cd frontend
npm install
npm run dev  # Port 3000

# Both (Docker)
docker compose up --build
```
**Deliverable**: Multi-user web app at `http://localhost:3000` with API at `http://localhost:8000/docs`.

### Phase 3: AI Chatbot
```bash
# Same as Phase 2 + AI endpoint
cd backend
uv run uvicorn app.main:app --reload --port 8000
# Chat available at http://localhost:3000/chat
```
**Deliverable**: AI chatbot at `/chat` page managing tasks via natural language.

### Phase 4: Local Kubernetes
```bash
# Start Minikube
minikube start --cpus 4 --memory 8192

# Deploy with Helm
helm install todo-app deploy/helm/ --values deploy/helm/values.yaml

# Access
minikube service todo-app-frontend --url

# Dapr dashboard
dapr dashboard -k
```
**Deliverable**: Full app running on Minikube with Kafka events and Dapr.

### Phase 5: Cloud Kubernetes (DigitalOcean)
```bash
# Create cluster
doctl kubernetes cluster create todo-prod --region nyc1 --size s-2vcpu-4gb --count 3

# Deploy
helm install todo-app deploy/helm/ --values deploy/helm/values-production.yaml

# AI operations
kubectl-ai "show me the health of all pods"
kagent status
```
**Deliverable**: Production app on DigitalOcean DOKS with AI-assisted operations, monitoring, and TLS.

---

## Risks & Mitigations

| # | Risk | Impact | Mitigation |
|---|------|--------|------------|
| 1 | Better Auth integration complexity | Medium | Start with JWT-only verification; full SDK later |
| 2 | Neon cold start latency | Low | Connection pooling, keep-alive in production |
| 3 | OpenAI Agents SDK breaking changes | Medium | Pin version 1.8.0, abstract agent interface |
| 4 | Kafka complexity on Minikube | High | Start with Strimzi operator, minimal config |
| 5 | DigitalOcean cost overrun | Medium | Use smallest node pool, auto-scale policies |
| 6 | Context window limits during AI implementation | Low | Use skills folders for focused specialist context |

---

## Execution Roadmap

| Wave | Phase | Tasks | Parallelism | Milestone |
|------|-------|-------|-------------|-----------|
| 1 | 2 | 1, 2, 3, 13 | Parallel | Foundation: DB + Model + Auth + UI |
| 2 | 2 | 4–9, 15 | Parallel | All CRUD endpoints + migrations |
| 3 | 2 | 10, 11, 14 | Parallel | Tests + Auth FE + Landing |
| 4 | 2 | 12 | Sequential | Dashboard complete |
| 5 | 2 | 16 | Sequential | Phase 2 E2E verified |
| 6 | 3 | 17, 18 | Sequential | MCP server + AI agent |
| 7 | 3 | 19, 20 | Parallel | Chat UI + AI tests |
| 8 | 4 | 21, 22 | Sequential | Docker + Helm |
| 9 | 4 | 23, 24 | Sequential | Kafka/Dapr + Minikube verified |
| 10 | 5 | 25, 26, 27 | Sequential | DOKS + AI ops + production |

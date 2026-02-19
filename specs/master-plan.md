# 📋 Master Implementation Plan
## Complete Hackathon: Phases 1-5 (Console → Cloud-Native AI)

**Source**: User-provided strategic plan
**Date**: 2026-02-18
**Branch**: `1-rest-api-spec`
**Total Points**: 1,000 base + 600 bonus = **1,600 maximum**

---

## 📚 DOCUMENT INDEX

**This master plan is divided into 2 parts:**

### PART 1: Foundation & AI (Phases 1-3) - IMPLEMENT FIRST
- Phase I: Python Console App (Week 1)
- Phase II: Full-Stack Web App (Week 2)
- Phase III: AI Chatbot with MCP (Week 3)
- **Points:** 450 base + 700 bonus = 1,150 points
- **Duration:** 3 weeks (Dec 1-21, 2025)

### PART 2: Cloud-Native Deployment (Phases 4-5) - IMPLEMENT AFTER PART 1
- Phase IV: Local Kubernetes (Weeks 4-5)
- Phase V: Production Cloud + Kafka (Weeks 6-7)
- **Points:** 550 points
- **Duration:** 4 weeks (Dec 22, 2025 - Jan 18, 2026)

**Total Project:** 1,000 base + 600 bonus = **1,600 points maximum**

---

## 🎯 IMPLEMENTATION STRATEGY

```
┌─────────────────────────────────────────────────────────────┐
│  WEEK 1-3: PART 1 (Build Core Application)                 │
│  ↓ Phase I   → Console App                                 │
│  ↓ Phase II  → Web App + Auth + Database                   │
│  ↓ Phase III → AI Chatbot + MCP + Urdu                     │
│  Status: Ready for deployment ✓                            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  WEEK 4-7: PART 2 (Cloud-Native Deployment)                │
│  ↓ Phase IV  → Docker + Kubernetes + Helm                  │
│  ↓ Phase V   → Cloud + Kafka + Dapr + CI/CD                │
│  Status: Production-ready ✓                                │
└─────────────────────────────────────────────────────────────┘
```

---

# 🏗️ PART 1: FOUNDATION & AI INTEGRATION
## Phases I, II, III (Weeks 1-3) - IMPLEMENT THIS FIRST

---

## 📦 PHASE I: In-Memory Python Console App

**Timeline:** Week 1 (Dec 1-7, 2025)
**Points:** 100
**Deadline:** Sunday, Dec 7 @ 8:00 PM
**Status:** ✅ COMPLETE

### Features Required (All 5 Basic Level)
1. ✅ Add Task (title + description)
2. ✅ Delete Task (by ID)
3. ✅ Update Task (modify details)
4. ✅ View Task List (with status indicators)
5. ✅ Mark as Complete (toggle completion)

### Technology Stack
```yaml
Language: Python 3.13+
Package Manager: UV
Storage: In-memory (dict/list)
Spec Tool: Spec-Kit Plus
AI Tool: Claude Code
```

### Project Structure
```
phase1-console-todo/
├── .spec-kit/
│   └── config.yaml
├── specs/
│   ├── constitution.md      # WHY - Principles
│   ├── specify.md           # WHAT - Features
│   ├── plan.md              # HOW - Architecture
│   └── tasks.md             # BREAKDOWN - Tasks
├── src/
│   ├── task.py              # Task model (dataclass)
│   ├── todo_manager.py      # CRUD operations
│   ├── cli.py               # CLI interface
│   └── main.py              # Entry point
├── tests/
│   ├── test_task.py
│   └── test_todo_manager.py
├── README.md
├── CLAUDE.md
├── pyproject.toml
└── .gitignore
```

---

## 🌐 PHASE II: Full-Stack Web Application

**Timeline:** Week 2 (Dec 8-14, 2025)
**Points:** 150
**Deadline:** Sunday, Dec 14 @ 8:00 PM
**Status:** 🔄 In Progress (scaffolded)

### Features Required (Basic Level + Auth + Multi-User)
1. ✅ All 5 basic features as web app
2. ✅ User authentication (Better Auth + JWT)
3. ✅ PostgreSQL persistence (Neon)
4. ✅ RESTful API endpoints
5. ✅ Responsive UI (mobile + desktop)
6. ✅ User isolation (each user sees only their tasks)

### Technology Stack
```yaml
Frontend:
  Framework: Next.js 16+ (App Router)
  Language: TypeScript
  Styling: Tailwind CSS
  Auth: Better Auth
  Deployment: Vercel

Backend:
  Framework: Python FastAPI
  ORM: SQLModel
  Database: Neon Serverless PostgreSQL
  Auth: JWT verification
  Deployment: Hugging Face Spaces

Tools:
  Spec: Spec-Kit Plus
  AI: Claude Code
```

### Monorepo Structure
```
hackathon-todo/                      # Single repository
├── .spec-kit/
│   └── config.yaml
│
├── specs/                           # Organized specifications
│   ├── overview.md
│   ├── architecture.md
│   ├── features/
│   │   ├── 01-authentication.md
│   │   ├── 02-task-crud.md
│   │   ├── 03-user-isolation.md
│   │   └── 04-responsive-ui.md
│   ├── api/
│   │   ├── rest-endpoints.md
│   │   └── authentication.md
│   ├── database/
│   │   └── schema.md
│   └── ui/
│       ├── components.md
│       └── pages.md
│
├── frontend/                        # Next.js app
│   ├── CLAUDE.md
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/page.tsx
│   │   └── layout.tsx
│   ├── components/
│   │   ├── TaskCard.tsx
│   │   ├── TaskList.tsx
│   │   └── AddTaskModal.tsx
│   ├── lib/
│   │   ├── api.ts
│   │   └── auth.ts
│   ├── types/
│   │   ├── task.ts
│   │   └── user.ts
│   └── package.json
│
├── backend/                         # FastAPI app
│   ├── CLAUDE.md
│   ├── Dockerfile
│   ├── main.py
│   ├── models.py
│   ├── db.py
│   ├── config.py
│   ├── routes/
│   │   ├── auth.py
│   │   └── tasks.py
│   ├── middleware/
│   │   └── auth.py
│   ├── requirements.txt
│   └── .env
│
├── docker-compose.yml
├── README.md
└── CLAUDE.md
```

### Database Schema
```sql
-- Users (managed by Better Auth)
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    name VARCHAR NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

### API Endpoints
```
Authentication:
POST /api/auth/signup
POST /api/auth/signin
GET  /api/auth/me

Tasks (all require JWT):
GET    /api/{user_id}/tasks
POST   /api/{user_id}/tasks
GET    /api/{user_id}/tasks/{id}
PUT    /api/{user_id}/tasks/{id}
DELETE /api/{user_id}/tasks/{id}
PATCH  /api/{user_id}/tasks/{id}/complete
```

### Deployment
- **Backend**: Hugging Face Spaces (Docker, port 7860)
- **Frontend**: Vercel

---

## 🤖 PHASE III: AI Chatbot with MCP

**Timeline:** Week 3 (Dec 15-21, 2025)
**Points:** 200 + 100 (Urdu) = **300 points**
**Deadline:** Sunday, Dec 21 @ 8:00 PM
**Status:** 📋 Spec + Plan complete — needs tasks.md

### Features Required (AI + MCP + Multilingual)
1. ✅ ChatKit UI for natural language
2. ✅ OpenAI Agents SDK integration
3. ✅ 5 MCP tools (add, list, complete, delete, update)
4. ✅ **STATELESS architecture** (DB-only state)
5. ✅ **Urdu + English + Hinglish support** (+100 bonus!)

### Critical Requirement: STATELESS
```
🚨 SERVER MUST HOLD ZERO CONVERSATION STATE IN MEMORY

Every request cycle:
1. Fetch conversation history from database
2. Process with AI
3. Store response to database
4. Discard ALL state

Test: Server restart = ZERO data loss ✓
```

### Technology Stack
```yaml
Frontend: OpenAI ChatKit + Next.js 16+
Backend: FastAPI (stateless) + OpenAI Agents SDK + Official MCP SDK
Database: Neon PostgreSQL (+conversations, +messages tables)
Languages: English, Urdu, Hinglish (mixed)
```

### New Database Tables
```sql
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id),
    user_id VARCHAR NOT NULL,
    role VARCHAR(20) CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    tool_calls TEXT,  -- JSON
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

### MCP Tools (All 5 Required)
| Tool | Operation | Returns |
|------|-----------|---------|
| `add_task` | INSERT tasks | `{task_id, status, title, message}` |
| `list_tasks` | SELECT tasks | list of tasks |
| `complete_task` | UPDATE completed=true | `{task_id, status, title, message}` |
| `delete_task` | DELETE task | `{task_id, status, title, message}` |
| `update_task` | UPDATE title/description | `{task_id, status, title, message}` |

### Urdu Support (Bonus +100 Points!)
```
Urdu examples:
* "Kal subah meeting ka task bana do" → add_task
* "Mere pending tasks dikhao" → list_tasks
* "Task 3 complete karo" → complete_task
* "Task 2 delete kar do" → delete_task
* "Task 1 ko change karo" → update_task
```

---

# ☸️ PART 2: CLOUD-NATIVE DEPLOYMENT
## Phases IV & V (Weeks 4-7) - IMPLEMENT AFTER PART 1

---

## 🚢 PHASE IV: Local Kubernetes Deployment

**Timeline:** Weeks 4-5 (Dec 22, 2025 - Jan 4, 2026)
**Points:** 250
**Deadline:** Sunday, Jan 4 @ 8:00 PM
**Status:** 📋 Planned

### Requirements
1. ✅ Containerize frontend + backend
2. ✅ Deploy to Minikube
3. ✅ Create Helm charts
4. ✅ Configure kubectl-ai
5. ✅ Setup kagent
6. ✅ Health checks & monitoring

### Technology Stack
```yaml
Containers: Docker
Orchestration: Kubernetes (Minikube)
Package Manager: Helm
AI Ops: kubectl-ai, kagent
Registry: Docker Hub / GitHub Container Registry
```

### Architecture
```
Minikube Cluster:
├── Frontend Deployment (3 replicas)
│   └── Service (LoadBalancer)
├── Backend Deployment (3 replicas)
│   └── Service (ClusterIP)
└── ConfigMaps + Secrets

External:
└── Neon PostgreSQL
```

### Helm Chart Structure
```
helm-charts/todo-app/
├── Chart.yaml
├── values.yaml
├── templates/
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── configmap.yaml
│   └── secrets.yaml
```

---

## ☁️ PHASE V: Production Cloud + Kafka + Dapr

**Timeline:** Weeks 6-7 (Jan 5-18, 2026)
**Points:** 300
**Deadline:** Sunday, Jan 18 @ 8:00 PM
**Status:** 📋 Planned

### New Features (Intermediate + Advanced)
**Intermediate:**
1. ✅ Priorities (High/Medium/Low)
2. ✅ Categories/Tags (Work/Home/Personal)
3. ✅ Search & Filter
4. ✅ Sort tasks

**Advanced:**
1. ✅ Recurring tasks (daily/weekly/monthly)
2. ✅ Due dates & reminders
3. ✅ Browser notifications

### Technology Stack
```yaml
Cloud: GKE/AKS/OKE (Oracle recommended - free forever)
Event Streaming: Kafka (Redpanda Cloud / Strimzi)
Runtime: Dapr
CI/CD: GitHub Actions
Monitoring: Prometheus + Grafana
```

### Event-Driven Architecture
```
Chat API → Kafka Topics → Services

Topics:
├── task-events (all CRUD)
├── reminders (due date alerts)
└── task-updates (real-time sync)

Consumers:
├── Recurring Task Service
├── Notification Service
└── Audit Log Service
```

### Cloud Deployment
- **Oracle Cloud (Recommended - Always Free)**: OKE cluster, 4 OCPUs, 24GB RAM
- **Alternative**: GKE ($300 credit) or AKS ($200 credit)

---

## 🎁 BONUS FEATURES (All Phases)

### Points Breakdown
| Bonus | Points | Status |
|-------|--------|--------|
| Reusable Intelligence (5 Agent Skills + 3 Subagents) | +200 | ✅ Planned |
| Cloud-Native Blueprints (K8s templates + Serverless) | +200 | ✅ Planned |
| Urdu Support (bilingual chatbot) | +100 | 📋 Phase III |
| Voice Commands (Web Speech API) | +200 | ✅ Planned |

---

## 📊 COMPLETE POINTS BREAKDOWN

```
Phase I:   100 points  (console app)
Phase II:  150 points  (web app)
Phase III: 300 points  (AI chatbot + 100 Urdu bonus)
Phase IV:  250 points  (Kubernetes)
Phase V:   300 points  (Cloud + Kafka)
Bonus:    +600 points  (skills + blueprints + voice)

TOTAL:   1,700 points  (note: 1,600 per plan, +100 from Urdu already counted)
```

---

## 🗓️ WEEK-BY-WEEK TIMELINE

| Week | Phase | Deadline | Status |
|------|-------|----------|--------|
| 1 | Phase I — Console App | Dec 7, 2025 | ✅ Complete |
| 2 | Phase II — Web App | Dec 14, 2025 | 🔄 In Progress |
| 3 | Phase III — AI Chatbot | Dec 21, 2025 | 📋 Spec+Plan done |
| 4-5 | Phase IV — Kubernetes | Jan 4, 2026 | 📋 Planned |
| 6-7 | Phase V — Cloud+Kafka | Jan 18, 2026 | 📋 Planned |

---

## 🚨 CRITICAL REMINDERS

- **NO MANUAL CODING** — All via Claude Code
- **Spec-Driven** — Write specs before code
- **Follow Structure** — Exact folder layouts
- **Test Everything** — Verify all features
- **Demo Videos** — < 90 seconds each

---

**Next Step**: `/sp.tasks` → `specs/phase3-chatbot/tasks.md`

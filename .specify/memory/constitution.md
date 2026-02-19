<!-- SYNC IMPACT REPORT:
Version change: 2.0.0 → 3.0.0
Modified principles: None (Phase II principles retained verbatim)
Added sections:
  - Phase III Constitutional Articles (I-V): Stateless Architecture, MCP-First Tool Design,
    OpenAI Agents SDK Integration, ChatKit Frontend, Multi-Language Support
  - Phase III Technology Stack entries
  - Phase III Database Schema (Conversation, Message models)
  - Phase III API Endpoint: POST /api/{user_id}/chat
  - Phase III Functional Requirements
  - Phase III MCP Tools Specification
  - Phase III Agent Behavior Constitution
  - Phase III Success Criteria & Anti-Patterns
  - Phase III Deliverables & Judging Criteria
  - Phase III Educational Outcomes
  - Phase III Project Structure addendum
Removed sections: None
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gate now includes Phase III stateless + MCP gates
  ✅ .specify/templates/spec-template.md — No structural changes required; Phase III feature specs follow same format
  ✅ .specify/templates/tasks-template.md — No structural changes required
  ⚠ .specify/config.yaml — Add phase3-chatbot phase entry (manual follow-up)
Follow-up TODOs:
  - TODO(OPENAI_DOMAIN_KEY): Configure domain allowlist after Vercel deployment
  - TODO(CHATKIT_VERSION): Pin exact @openai/chatkit version once stable release confirmed
  - TODO(MCP_SDK_VERSION): Pin mcp>=1.0.0 version after integration testing
-->

# The Evolution of Todo — Project Constitution

## Preamble

This constitution is the single authoritative source of truth for all development across all phases of "The Evolution of Todo" — a 5-phase Spec-Driven Development project demonstrating AI-only implementation. It governs Phase I (console app), Phase II (full-stack web), Phase III (AI chatbot + MCP), Phase IV (Kubernetes), and Phase V (production). All code, specs, plans, and decisions MUST trace back to this document.

**Version**: 3.0.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-18

---

## Phase Roadmap

| Phase | Focus | Status | Stack |
|-------|-------|--------|-------|
| **I** | Console App | ✅ Complete & Frozen | Python 3.13+, in-memory |
| **II** | Full-Stack Web App | ✅ Complete | FastAPI, Next.js, Neon PostgreSQL |
| **III** | AI Chatbot (MCP) | 🟢 Active | OpenAI Agents SDK, MCP SDK, ChatKit |
| **IV** | Kubernetes | 📋 Planned | K8s, Helm, monitoring |
| **V** | Production | 📋 Planned | CI/CD, observability, alerting |

---

## Phase II Core Principles (Retained)

### I. Spec-Driven Development
Every feature and architectural decision MUST be documented in specifications before implementation begins. All code changes MUST trace back to explicit requirements in the spec documents. This ensures predictable outcomes and maintains architectural integrity throughout the development lifecycle.

### II. Clean Code Implementation
Code MUST be readable, maintainable, and well-documented. Follow established patterns consistently across the codebase. Prioritize simplicity over cleverness. Every function, module, and service MUST have a single, clear responsibility.

### III. AI-Only Implementation (NON-NEGOTIABLE)
All code MUST be generated and maintained through AI-assisted development practices. Manual code changes are prohibited without corresponding AI guidance and documentation. This ensures consistent quality and knowledge capture for future maintenance.

### IV. Security-First Design
Security considerations MUST be integrated from the initial design phase. Authentication, authorization, data validation, and privacy protection are fundamental requirements, not afterthoughts. All user data MUST be properly isolated and protected.

### V. API-First Architecture
Backend services MUST expose well-defined RESTful APIs before frontend development begins. APIs MUST follow consistent patterns, include proper error handling, and maintain backward compatibility. Documentation MUST be comprehensive and up-to-date.

### VI. User Isolation & Data Privacy
Each user's data MUST be completely isolated from other users. No user SHALL ever have access to another user's tasks or personal information. Database queries MUST always be filtered by authenticated user ID to prevent data leakage.

---

## Phase III Constitutional Articles (IMMUTABLE)

### Article I: Stateless Architecture (IMMUTABLE)

**Declaration:** The server SHALL hold NO conversation state in memory between requests.

**Mandatory Requirements:**
1. Every request is fully independent — no in-memory conversation storage, no session caching
2. All conversation and message state MUST be persisted to PostgreSQL immediately
3. Server restart MUST result in zero data loss
4. Any server instance MUST be capable of handling any request (horizontal scalability)
5. No sticky sessions required or permitted

**Verification test:**
```
1. Start conversation on Server A
2. Route next message to Server B
3. Assert: Full context maintained from database ✓
```

**Rationale:** Scalability, resilience, testability, and deployment flexibility. A stateless server can be replicated freely, crashes lose no data, and every request is reproducible.

### Article II: MCP-First Tool Design (IMMUTABLE)

**Declaration:** ALL task operations SHALL be exposed exclusively as MCP tools using the Official MCP SDK.

**Mandatory Requirements:**
1. Use the Python MCP SDK — no custom protocol implementations
2. Every tool MUST be a stateless function with no instance-level side effects
3. Tools MUST interact with the database directly
4. Complete tool coverage REQUIRED: `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task`
5. Every tool MUST accept `user_id` for multi-tenancy isolation
6. Every tool MUST return a structured response or a structured error

**Tool contract:**
```python
# Every MCP tool MUST:
# 1. Accept user_id (str) for isolation
# 2. Validate all inputs
# 3. Interact with database only (no side effects beyond DB)
# 4. Return {"status": ..., "message": ...} or {"error": ..., "message": ...}
```

**Rationale:** Standard AI-app interface, composability, portability across AI providers, and full observability of tool call traces.

### Article III: OpenAI Agents SDK Integration (IMMUTABLE)

**Declaration:** All AI logic SHALL be implemented using the Official OpenAI Agents SDK. Custom AI orchestration frameworks are prohibited.

**Mandatory Requirements:**
1. Agent MUST have a clear role definition and system instructions
2. MCP tools MUST be registered as the agent's capabilities
3. The official Agent Runner pattern MUST be used for request execution
4. Conversation history MUST be passed on every request (fetched from DB)
5. Token limits MUST be respected; truncate history when necessary

**Agent behavior contract:**
```python
# Agent MUST:
# 1. Understand natural language task commands (Urdu, English, Hinglish)
# 2. Map user intent to exactly the appropriate MCP tool
# 3. Confirm every action in a friendly, natural response
# 4. Handle tool errors gracefully and inform the user
# 5. Respond in the same language as the user's input
```

**Rationale:** Official SDK ensures long-term compatibility, vendor-supported reliability, and correct tool-call orchestration without reinventing the wheel.

### Article IV: ChatKit Frontend (IMMUTABLE)

**Declaration:** The conversational UI SHALL be built using OpenAI ChatKit. Custom chat UI implementations are prohibited for the primary interface.

**Mandatory Requirements:**
1. Use the official `@openai/chatkit` package
2. Domain allowlist MUST be configured before production deployment
3. API key MUST be managed via `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` environment variable
4. Chat interface MUST display typing indicators, message history, and error states
5. ChatKit handles streaming — no custom streaming implementation required

**Pre-deployment steps (REQUIRED):**
```
1. Deploy frontend to production URL (Vercel recommended)
2. Add domain to: https://platform.openai.com/settings/organization/security/domain-allowlist
3. Obtain domain key
4. Set: NEXT_PUBLIC_OPENAI_DOMAIN_KEY=<domain-key>
```

**Rationale:** ChatKit provides an officially supported, OpenAI-aligned UI that handles streaming, history, and accessibility out-of-the-box, reducing frontend complexity.

### Article V: Multi-Language Support — Urdu (REQUIRED)

**Declaration:** The chatbot SHALL support natural language commands in English, Urdu, and Hinglish (code-switching) equally.

**Mandatory Requirements:**
1. Language detection MUST be automatic — users MUST NOT need to select a language
2. Agent MUST respond in the same language as the user's input
3. All five MCP tools MUST be triggerable via Urdu commands
4. Cultural context MUST be understood (time references: `subah`, `sham`, `kal`, etc.)
5. Response quality in Urdu MUST be equivalent to English

**Reference command examples:**
```
Urdu:   "Kal subah meeting ka task bana do"      → add_task
Urdu:   "Mere pending tasks dikhao"               → list_tasks(status="pending")
Urdu:   "Task 3 ko complete karo"                 → complete_task(task_id=3)
Hinglish: "Create task for tomorrow subah"        → add_task
English: "Show me all my tasks"                   → list_tasks(status="all")
```

**Rationale:** Urdu is the primary language of the target audience. Equal-quality multilingual support is a hackathon requirement and a key differentiator.

---

## Technology Stack

### Phase II Stack (Retained)

| Component | Technology | Purpose |
|-----------|------------|---------|
| Frontend | Next.js 16+ (App Router) | Responsive web interface |
| Backend | Python FastAPI | High-performance REST API |
| ORM | SQLModel | Type-safe database interactions |
| Database | Neon Serverless PostgreSQL | Scalable cloud database |
| Authentication | Better Auth + JWT | Stateless token-based auth |
| Spec-Driven | Claude Code + Spec-Kit Plus | AI-assisted development |

### Phase III Stack Additions (IMMUTABLE)

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| Chat UI | OpenAI ChatKit | Latest | Streaming chat interface |
| AI Framework | OpenAI Agents SDK | Latest | Agent orchestration |
| MCP Server | Official Python MCP SDK | ≥1.0.0 | Tool-based AI interface |
| Backend | FastAPI (extended) | ≥0.109.0 | Chat endpoint |
| Database | Neon PostgreSQL (extended) | Latest | Conversation + message storage |

**Phase III backend dependencies:**
```txt
openai>=1.12.0
mcp>=1.0.0
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
psycopg2-binary>=2.9.9
pydantic-settings>=2.1.0
```

**Phase III frontend dependencies:**
```json
{
  "@openai/chatkit": "latest",
  "next": "^16.0.0",
  "react": "^19.0.0",
  "typescript": "^5.3.0"
}
```

---

## Project Structure

### Phase II Structure (Retained)

```
todo-fullstack/
├── frontend/                 # Next.js application
│   ├── app/                  # App Router pages
│   ├── components/           # Reusable UI components
│   ├── lib/                  # Utilities and API clients
│   └── public/               # Static assets
├── backend/                  # FastAPI application
│   ├── api/                  # API route definitions
│   ├── models/               # SQLModel database models
│   ├── auth/                 # Authentication handlers
│   └── database/             # Database connection and setup
├── specs/                    # Specification documents
│   ├── features/             # Feature specifications
│   ├── api/                  # API specifications
│   ├── database/             # Database schema specs
│   └── ui/                   # UI/UX specifications
└── .specify/                 # Spec-Kit Plus configuration
    └── config.yaml
```

### Phase III Structure Additions

```
backend/
├── routes/
│   └── chat.py               # POST /api/{user_id}/chat (new)
├── services/
│   ├── agent_service.py      # OpenAI Agents SDK (new)
│   └── mcp_server.py         # MCP tools: add/list/complete/delete/update (new)
└── models/
    ├── task.py               # Existing Task model
    ├── conversation.py       # NEW: Conversation model
    └── message.py            # NEW: Message model

frontend/
└── app/
    └── chat/
        └── page.tsx          # ChatKit integration (new)
```

---

## Database Schema

### Phase II Models (Retained)

```python
class Task(SQLModel, table=True):
    __tablename__ = "tasks"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    title: str = Field(max_length=200)
    description: Optional[str] = None
    completed: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Phase III New Models (REQUIRED)

```python
class Conversation(SQLModel, table=True):
    __tablename__ = "conversations"
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: str = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class Message(SQLModel, table=True):
    __tablename__ = "messages"
    id: Optional[int] = Field(default=None, primary_key=True)
    conversation_id: int = Field(foreign_key="conversations.id", index=True)
    user_id: str = Field(index=True)
    role: str = Field()           # 'user' or 'assistant'
    content: str = Field()
    tool_calls: Optional[str] = Field(default=None)  # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**Required indexes:** `conversation_id`, `user_id`, `created_at`

---

## API Endpoints

### Phase II Endpoints (Retained)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/{user_id}/tasks` | Retrieve all tasks for user |
| POST | `/api/users/{user_id}/tasks` | Create a new task |
| GET | `/api/users/{user_id}/tasks/{id}` | Retrieve specific task |
| PUT | `/api/users/{user_id}/tasks/{id}` | Update entire task object |
| PATCH | `/api/users/{user_id}/tasks/{id}` | Partial task update |
| DELETE | `/api/users/{user_id}/tasks/{id}` | Delete a specific task |

### Phase III New Endpoint (REQUIRED)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/{user_id}/chat` | Stateless chat endpoint — full history fetched from DB per request |

**Request:**
```json
{
  "conversation_id": 123,
  "message": "Add task to buy groceries"
}
```

**Response:**
```json
{
  "conversation_id": 123,
  "response": "Done! I've added 'Buy groceries' to your tasks.",
  "tool_calls": [
    {
      "tool": "add_task",
      "parameters": {"title": "Buy groceries"},
      "result": {"task_id": 5, "status": "created"}
    }
  ]
}
```

---

## Phase III Stateless Request Cycle (REQUIRED)

Every request to `POST /api/{user_id}/chat` MUST follow this exact pattern:

```
1. Receive { conversation_id?, message }
2. Fetch full conversation history from DB
   → SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at
3. Persist user message to DB immediately
   → INSERT INTO messages (role='user', content=message)
4. Build messages array: [history...] + [new user message]
5. Run OpenAI Agent with MCP tools registered
   → agent.run(messages, tools=[add_task, list_tasks, ...])
6. Agent invokes MCP tool(s) as needed — tools write to DB directly
7. Persist assistant response to DB
   → INSERT INTO messages (role='assistant', content=response)
8. Return { conversation_id, response, tool_calls }
9. Server discards ALL in-memory state ← CRITICAL
```

---

## Phase III MCP Tools Specification

Each tool MUST conform to this contract:

| Tool | Parameters | Returns |
|------|-----------|---------|
| `add_task` | `user_id`, `title`, `description=""` | `{task_id, status, title, message}` |
| `list_tasks` | `user_id`, `status="all"` | `{tasks[], count, filter}` |
| `complete_task` | `user_id`, `task_id` | `{task_id, status, title, message}` |
| `delete_task` | `user_id`, `task_id` | `{task_id, status, title, message}` |
| `update_task` | `user_id`, `task_id`, `title=None`, `description=None` | `{task_id, status, title, message}` |

All tools return `{"error": str, "message": str}` on failure.

---

## Authentication & Security (Phase II — Retained)

### JWT Token Flow
- Frontend authenticates users through Better Auth
- Successful authentication generates JWT token
- Token attached to all API requests: `Authorization: Bearer {token}`
- Backend verifies token using shared `BETTER_AUTH_SECRET`
- Invalid tokens return 401 Unauthorized

### User Isolation
- All API endpoints require valid authentication token
- Database queries always filtered by authenticated `user_id`
- No cross-user data access permitted

---

## Non-Functional Requirements

### Performance
- API responses MUST be under 500ms for 95% of standard CRUD requests
- Chat responses: streaming preferred; first token MUST arrive within 2 seconds
- Frontend MUST load within 3 seconds on standard broadband

### Reliability
- All conversations MUST survive server restarts (stateless mandate)
- Database MUST be the single source of truth for all state
- Graceful error handling required at every layer

### Security
- All communications encrypted via HTTPS
- No sensitive data in client-side storage
- Proper authentication required for all data access
- Multi-tenancy enforced via `user_id` isolation at every layer

---

## Phase III Success Criteria

Phase III is COMPLETE when ALL of the following are satisfied:

**Functional:**
- [ ] User can chat with AI in English
- [ ] User can chat with AI in Urdu
- [ ] AI creates tasks via natural language
- [ ] AI lists tasks via natural language
- [ ] AI completes tasks via natural language
- [ ] AI deletes tasks via natural language
- [ ] AI updates tasks via natural language
- [ ] Conversations persist after server restart
- [ ] Multiple users can chat independently (user isolation)

**Technical:**
- [ ] Server is completely stateless (no in-memory conversation state)
- [ ] All tools use Official MCP SDK
- [ ] Agent uses OpenAI Agents SDK
- [ ] Frontend uses ChatKit
- [ ] Database stores all conversations and messages
- [ ] Domain allowlist configured for production
- [ ] Graceful error handling at all layers

**Process:**
- [ ] All features implemented via Spec-Driven Development
- [ ] All specs documented before implementation
- [ ] README has complete setup instructions
- [ ] Demo ≤ 90 seconds and covers all key features

---

## Phase III Anti-Patterns (PROHIBITED)

| Anti-Pattern | Required Alternative |
|-------------|---------------------|
| Store conversation state in server memory | Persist everything to PostgreSQL |
| Custom AI orchestration framework | OpenAI Agents SDK (official) |
| Custom MCP protocol implementation | Official Python MCP SDK |
| Manual code without spec | Spec-Driven via Claude Code |
| Ignore Urdu support | Equal English + Urdu quality |
| Stateful server design | Stateless + DB-persisted state |
| Skip domain allowlist | Configure before production deployment |
| Invent features not in spec | Implement spec exactly as written |

---

## Monorepo Organization & Spec-Kit Plus

### `.specify/config.yaml`

```yaml
project:
  name: "The Evolution of Todo"
  version: "3.0.0"
  phases:
    - "Phase I: Console App (Complete)"
    - "Phase II: Full-Stack Web App (Complete)"
    - "Phase III: AI Chatbot + MCP (Active)"
    - "Phase IV: Kubernetes (Planned)"
    - "Phase V: Production (Planned)"
```

### Specification Organization
- `specs/features/` — Feature-level requirements and acceptance criteria
- `specs/api/` — API contract definitions
- `specs/database/` — Schema and relationship diagrams
- `specs/ui/` — UI/UX designs and interaction patterns

---

## Evolution Readiness

### Phase III → Phase IV Preparation
- Kubernetes deployment blueprints available in `skills/cloud-native-devops/blueprints/`
- Docker Compose configured for local dev orchestration
- Stateless architecture is natively Kubernetes-ready (no sticky sessions)

### Phase IV → Phase V Preparation
- Observability hooks to be added (Jaeger, Prometheus)
- CI/CD pipeline definitions
- Feature flag support for incremental rollouts

---

## Governance

This constitution is the authoritative guide for ALL development activities across ALL phases of "The Evolution of Todo." All contributors MUST comply with these principles. All code reviews MUST verify constitutional adherence.

**Amendment process:**
- PATCH (clarifications): Any contributor may propose; merge after peer review
- MINOR (new sections): Requires stakeholder discussion and documented rationale
- MAJOR (principle changes or removals): Requires formal ADR (`/sp.adr`) and full team approval

**Versioning policy:** Semantic versioning (`MAJOR.MINOR.PATCH`) as defined above.

**Constitution Check gate:** Every `/sp.plan` execution MUST include a Constitution Check section verifying:
- Phase II: Principles I–VI satisfied
- Phase III: Articles I–V satisfied (stateless, MCP-first, Agents SDK, ChatKit, Urdu support)

**Version**: 3.0.0 | **Ratified**: 2026-02-06 | **Last Amended**: 2026-02-18

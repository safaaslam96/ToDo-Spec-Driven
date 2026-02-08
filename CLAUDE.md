# Claude Code Rules

**⚠️ IMPORTANT**: This file is a shim. For complete agent instructions, see:
- **Main Instructions**: `@AGENTS.md` (comprehensive agent system)
- **Detailed Guidelines**: `@agents/CLAUDE.md` (workflow and commands)
- **Constitution**: `@.specify/memory/constitution.md` (v2.0.0, AUTHORITATIVE)

---

## Quick Start for AI Agents

### Before Every Session
1. **Read constitution**: `@.specify/memory/constitution.md` (project principles)
2. **Check AGENTS.md**: `@AGENTS.md` (comprehensive instructions)
3. **Load main instructions**: `@agents/CLAUDE.md` (workflow details)
4. **Review specialist skills**: `@agents/skills/<domain>.md` as needed

### Workflow
```
Spec → Plan → Tasks → Implement → Test → Document → Commit
```

### Key Commands
- `/sp.specify` — Create specification
- `/sp.plan` — Generate implementation plan
- `/sp.tasks` — Break into granular tasks
- `/sp.implement` — Execute implementation
- `/sp.git.commit_pr` — Commit and create PR
- `/sp.phr` — Create Prompt History Record

---

## Original Claude Code Rules

You are an expert AI assistant specializing in Spec-Driven Development (SDD). Your primary goal is to work with the architext to build products.

## Task context

**Your Surface:** You operate on a project level, providing guidance to users and executing development tasks via a defined set of tools.

**Your Success is Measured By:**
- All outputs strictly follow the user intent.
- Prompt History Records (PHRs) are created automatically and accurately for every user prompt.
- Architectural Decision Record (ADR) suggestions are made intelligently for significant decisions.
- All changes are small, testable, and reference code precisely.

## Core Guarantees (Product Promise)

- Record every user input verbatim in a Prompt History Record (PHR) after every user message. Do not truncate; preserve full multiline input.
- PHR routing (all under `history/prompts/`):
  - Constitution → `history/prompts/constitution/`
  - Feature-specific → `history/prompts/<feature-name>/`
  - General → `history/prompts/general/`
- ADR suggestions: when an architecturally significant decision is detected, suggest: "📋 Architectural decision detected: <brief>. Document? Run `/sp.adr <title>`." Never auto‑create ADRs; require user consent.

## Development Guidelines

### 1. Authoritative Source Mandate:
Agents MUST prioritize and use MCP tools and CLI commands for all information gathering and task execution. NEVER assume a solution from internal knowledge; all methods require external verification.

### 2. Execution Flow:
Treat MCP servers as first-class tools for discovery, verification, execution, and state capture. PREFER CLI interactions (running commands and capturing outputs) over manual file creation or reliance on internal knowledge.

### 3. Knowledge capture (PHR) for Every User Input.
After completing requests, you **MUST** create a PHR (Prompt History Record).

**When to create PHRs:**
- Implementation work (code changes, new features)
- Planning/architecture discussions
- Debugging sessions
- Spec/task/plan creation
- Multi-step workflows

**PHR Creation Process:**

1) Detect stage
   - One of: constitution | spec | plan | tasks | red | green | refactor | explainer | misc | general

2) Generate title
   - 3–7 words; create a slug for the filename.

2a) Resolve route (all under history/prompts/)
  - `constitution` → `history/prompts/constitution/`
  - Feature stages (spec, plan, tasks, red, green, refactor, explainer, misc) → `history/prompts/<feature-name>/` (requires feature context)
  - `general` → `history/prompts/general/`

3) Prefer agent‑native flow (no shell)
   - Read the PHR template from one of:
     - `.specify/templates/phr-template.prompt.md`
     - `templates/phr-template.prompt.md`
   - Allocate an ID (increment; on collision, increment again).
   - Compute output path based on stage:
     - Constitution → `history/prompts/constitution/<ID>-<slug>.constitution.prompt.md`
     - Feature → `history/prompts/<feature-name>/<ID>-<slug>.<stage>.prompt.md`
     - General → `history/prompts/general/<ID>-<slug>.general.prompt.md`
   - Fill ALL placeholders in YAML and body:
     - ID, TITLE, STAGE, DATE_ISO (YYYY‑MM‑DD), SURFACE="agent"
     - MODEL (best known), FEATURE (or "none"), BRANCH, USER
     - COMMAND (current command), LABELS (["topic1","topic2",...])
     - LINKS: SPEC/TICKET/ADR/PR (URLs or "null")
     - FILES_YAML: list created/modified files (one per line, " - ")
     - TESTS_YAML: list tests run/added (one per line, " - ")
     - PROMPT_TEXT: full user input (verbatim, not truncated)
     - RESPONSE_TEXT: key assistant output (concise but representative)
     - Any OUTCOME/EVALUATION fields required by the template
   - Write the completed file with agent file tools (WriteFile/Edit).
   - Confirm absolute path in output.

4) Use sp.phr command file if present
   - If `.**/commands/sp.phr.*` exists, follow its structure.
   - If it references shell but Shell is unavailable, still perform step 3 with agent‑native tools.

5) Shell fallback (only if step 3 is unavailable or fails, and Shell is permitted)
   - Run: `.specify/scripts/bash/create-phr.sh --title "<title>" --stage <stage> [--feature <name>] --json`
   - Then open/patch the created file to ensure all placeholders are filled and prompt/response are embedded.

6) Routing (automatic, all under history/prompts/)
   - Constitution → `history/prompts/constitution/`
   - Feature stages → `history/prompts/<feature-name>/` (auto-detected from branch or explicit feature context)
   - General → `history/prompts/general/`

7) Post‑creation validations (must pass)
   - No unresolved placeholders (e.g., `{{THIS}}`, `[THAT]`).
   - Title, stage, and dates match front‑matter.
   - PROMPT_TEXT is complete (not truncated).
   - File exists at the expected path and is readable.
   - Path matches route.

8) Report
   - Print: ID, path, stage, title.
   - On any failure: warn but do not block the main command.
   - Skip PHR only for `/sp.phr` itself.

### 4. Explicit ADR suggestions
- When significant architectural decisions are made (typically during `/sp.plan` and sometimes `/sp.tasks`), run the three‑part test and suggest documenting with:
  "📋 Architectural decision detected: <brief> — Document reasoning and tradeoffs? Run `/sp.adr <decision-title>`"
- Wait for user consent; never auto‑create the ADR.

### 5. Human as Tool Strategy
You are not expected to solve every problem autonomously. You MUST invoke the user for input when you encounter situations that require human judgment. Treat the user as a specialized tool for clarification and decision-making.

**Invocation Triggers:**
1.  **Ambiguous Requirements:** When user intent is unclear, ask 2-3 targeted clarifying questions before proceeding.
2.  **Unforeseen Dependencies:** When discovering dependencies not mentioned in the spec, surface them and ask for prioritization.
3.  **Architectural Uncertainty:** When multiple valid approaches exist with significant tradeoffs, present options and get user's preference.
4.  **Completion Checkpoint:** After completing major milestones, summarize what was done and confirm next steps.

## Default policies (must follow)
- Clarify and plan first - keep business understanding separate from technical plan and carefully architect and implement.
- Do not invent APIs, data, or contracts; ask targeted clarifiers if missing.
- Never hardcode secrets or tokens; use `.env` and docs.
- Prefer the smallest viable diff; do not refactor unrelated code.
- Cite existing code with code references (start:end:path); propose new code in fenced blocks.
- Keep reasoning private; output only decisions, artifacts, and justifications.

### Execution contract for every request
1) Confirm surface and success criteria (one sentence).
2) List constraints, invariants, non‑goals.
3) Produce the artifact with acceptance checks inlined (checkboxes or tests where applicable).
4) Add follow‑ups and risks (max 3 bullets).
5) Create PHR in appropriate subdirectory under `history/prompts/` (constitution, feature-name, or general).
6) If plan/tasks identified decisions that meet significance, surface ADR suggestion text as described above.

### Minimum acceptance criteria
- Clear, testable acceptance criteria included
- Explicit error paths and constraints stated
- Smallest viable change; no unrelated edits
- Code references to modified/inspected files where relevant

## Architect Guidelines (for planning)

Instructions: As an expert architect, generate a detailed architectural plan for [Project Name]. Address each of the following thoroughly.

1. Scope and Dependencies:
   - In Scope: boundaries and key features.
   - Out of Scope: explicitly excluded items.
   - External Dependencies: systems/services/teams and ownership.

2. Key Decisions and Rationale:
   - Options Considered, Trade-offs, Rationale.
   - Principles: measurable, reversible where possible, smallest viable change.

3. Interfaces and API Contracts:
   - Public APIs: Inputs, Outputs, Errors.
   - Versioning Strategy.
   - Idempotency, Timeouts, Retries.
   - Error Taxonomy with status codes.

4. Non-Functional Requirements (NFRs) and Budgets:
   - Performance: p95 latency, throughput, resource caps.
   - Reliability: SLOs, error budgets, degradation strategy.
   - Security: AuthN/AuthZ, data handling, secrets, auditing.
   - Cost: unit economics.

5. Data Management and Migration:
   - Source of Truth, Schema Evolution, Migration and Rollback, Data Retention.

6. Operational Readiness:
   - Observability: logs, metrics, traces.
   - Alerting: thresholds and on-call owners.
   - Runbooks for common tasks.
   - Deployment and Rollback strategies.
   - Feature Flags and compatibility.

7. Risk Analysis and Mitigation:
   - Top 3 Risks, blast radius, kill switches/guardrails.

8. Evaluation and Validation:
   - Definition of Done (tests, scans).
   - Output Validation for format/requirements/safety.

9. Architectural Decision Record (ADR):
   - For each significant decision, create an ADR and link it.

### Architecture Decision Records (ADR) - Intelligent Suggestion

After design/architecture work, test for ADR significance:

- Impact: long-term consequences? (e.g., framework, data model, API, security, platform)
- Alternatives: multiple viable options considered?
- Scope: cross‑cutting and influences system design?

If ALL true, suggest:
📋 Architectural decision detected: [brief-description]
   Document reasoning and tradeoffs? Run `/sp.adr [decision-title]`

Wait for consent; never auto-create ADRs. Group related decisions (stacks, authentication, deployment) into one ADR when appropriate.

## Monorepo Structure & Navigation

```
/                                 # Root: orchestration, specs, history
├── .specify/
│   ├── memory/constitution.md    # Project constitution (v2.0.0, AUTHORITATIVE)
│   ├── config.yaml               # Phase grouping and project config
│   └── templates/                # SDD templates (spec, plan, tasks, PHR, ADR)
├── src/todo_app/                 # Phase 1: Console App (FROZEN — do not modify)
├── backend/                      # Phase 2+: FastAPI backend
│   ├── app/main.py               # FastAPI application entry point
│   ├── app/api/routes/tasks.py   # Task CRUD endpoints (user-isolated)
│   ├── app/auth/jwt.py           # JWT Bearer verification
│   ├── app/models/task.py        # SQLModel Task table + schemas
│   ├── app/database/connection.py # Async Neon PostgreSQL connection
│   └── CLAUDE.md                 # Backend-specific guidelines
├── frontend/                     # Phase 2+: Next.js frontend
│   ├── app/                      # App Router pages (layout, page, auth, dashboard)
│   ├── components/tasks/         # TaskItem, TaskForm, TaskList components
│   ├── lib/api-client.ts         # API client with JWT token attachment
│   ├── types/task.ts             # TypeScript interfaces
│   └── CLAUDE.md                 # Frontend-specific guidelines
├── specs/                        # All specifications
│   ├── overview.md               # Project overview and phase roadmap
│   ├── architecture.md           # System architecture diagram
│   ├── features/task-crud.md     # Task CRUD feature spec
│   ├── features/authentication.md # Auth feature spec
│   ├── api/rest-endpoints.md     # REST API contract
│   ├── database/schema.md        # Database schema spec
│   ├── ui/pages.md               # Page structure spec
│   └── ui/components.md          # Component spec
├── specs_history/                # Phase 1 archived specs
├── history/
│   ├── prompts/                  # PHRs (constitution, feature, general)
│   ├── adr/                      # Architecture Decision Records
│   └── current-state.md          # Project state report
├── docker-compose.yml            # Local dev: frontend + backend
├── sp.constitution.md            # Phase 1 constitution archive (v1.0)
└── CLAUDE.md                     # This file (root guidelines)
```

### Phase Grouping (5 Phases in 2 Parts)

**Part A: Web Application (Phases 1–3)**
| Phase | Status | Directory | Description |
|-------|--------|-----------|-------------|
| 1 — Console App | **Complete** | `src/todo_app/` | In-memory Python CLI, 5 features |
| 2 — Full-Stack Web | **In Progress** | `backend/` + `frontend/` | FastAPI + Next.js + Neon + Auth |
| 3 — Enhanced Features | Planned | `backend/` + `frontend/` | Filtering, sorting, search, tags |

**Part B: Cloud Deployment (Phases 4–5)**
| Phase | Status | Description |
|-------|--------|-------------|
| 4 — Containerization | Planned | Docker, docker-compose, CI/CD |
| 5 — Kubernetes & Events | Planned | K8s orchestration, event-driven, AI chatbot |

### Quick Start (Phase 2 Development)

**Backend:**
```bash
cd backend && uv sync && cp .env.example .env
uv run uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend && npm install && cp .env.example .env.local
npm run dev   # http://localhost:3000
```

**Both (Docker):**
```bash
docker-compose up
```

## Basic Project Structure

- `.specify/memory/constitution.md` — Project principles (v2.0.0)
- `.specify/config.yaml` — Phase grouping and project config
- `specs/` — All specifications (features, api, database, ui)
- `history/prompts/` — Prompt History Records
- `history/adr/` — Architecture Decision Records
- `.specify/templates/` — SDD templates

## Code Standards

### Backend (Python)
- FastAPI with async/await everywhere
- SQLModel for database models + Pydantic for request/response schemas
- JWT verification via `get_current_user_id()` dependency on all protected routes
- All database queries filtered by user_id (user isolation)
- See `backend/CLAUDE.md` for full backend guidelines

### Frontend (TypeScript)
- Next.js 16+ App Router; Server Components by default
- Tailwind CSS v4 for styling; no custom CSS
- TypeScript strict mode; no `any` types
- API calls through `lib/api-client.ts` only (auto JWT attachment)
- See `frontend/CLAUDE.md` for full frontend guidelines

### Shared
- BETTER_AUTH_SECRET must match between backend and frontend
- Never hardcode secrets; use `.env` files
- See `.specify/memory/constitution.md` for overarching principles

## Project Documentation: The Evolution of Todo

### Phase 1 (Complete)
- Constitution v1.0: In-memory Python console todo, AI-only implementation
- Spec: 5 features (Add, List, Update, Delete, Toggle) with acceptance criteria
- Clarifications: Menu-driven UI, optional update fields, sequential IDs, toggle command
- Plan: 12 tasks, sequential dependencies
- Implementation: 12 source files in `src/todo_app/`
- Archived: `specs_history/phase1_*.md`

### Phase 2 (In Progress)
- Constitution v2.0.0: Full-stack web app, multi-user, JWT auth, Neon PostgreSQL
- Specs: Task CRUD, REST API, Authentication, Database Schema, UI Pages, UI Components
- Architecture: FastAPI backend + Next.js frontend + Neon DB
- Monorepo: `backend/` (13 files) + `frontend/` (14 files) scaffolded
- Next steps: `/sp.plan` then `/sp.tasks` then `/sp.implement`

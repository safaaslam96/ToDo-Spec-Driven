---
id: 24
title: Phase III Chatbot Implementation Plan
stage: plan
date: 2026-02-18
surface: agent
model: claude-opus-4-6
feature: phase3-chatbot
branch: 1-rest-api-spec
user: safaaslam96
command: /sp.plan
labels: ["plan", "phase3", "chatbot", "mcp", "openai-agents-sdk", "chatkit", "stateless", "fastapi", "nextjs"]
links: {spec: "specs/phase3-chatbot/spec.md", ticket: null, adr: null, pr: null}
files: ["specs/phase3-chatbot/plan.md"]
tests: ["Verified plan file created at correct path", "Verified all 5 component designs present", "Verified Constitution Check gates all passing", "Verified 6-phase implementation sequence documented"]
---

## Prompt

User provided the full Phase III `/sp.plan` document — "HOW We Are Building It — Implementation Plan: Phase III — AI-Powered Todo Chatbot" — containing system architecture, component designs, DB schema, security architecture, and implementation sequence.

The document defines a 3-tier stateless conversational AI system using OpenAI Agents SDK, Official MCP SDK, ChatKit, and Neon PostgreSQL. All 5 constitutional Articles (I–V) are satisfied.

## Response snapshot

Created `specs/phase3-chatbot/plan.md` — a complete implementation plan structured per the project plan template.

**System Architecture (3-tier):**
- Presentation: ChatKit frontend (Next.js 16+, `@openai/chatkit`)
- Application: FastAPI backend with AgentService + MCPServer (`backend/services/`)
- Data: Neon PostgreSQL with `tasks`, `conversations`, `messages` tables

**5 Component Designs specified:**
- Component 1 (`backend/models.py`): `Conversation` + `Message` SQLModel models with required indexes
- Component 2 (`backend/services/mcp_server.py`): `MCPServer` class with 5 async tools — `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task`; all enforce `user_id` isolation; standard response `{task_id, status, title, message}` or `{error, message}`
- Component 3 (`backend/services/agent_service.py`): `AgentService` using `client.chat.completions.create()` with `tools=TOOL_SCHEMAS`, `tool_choice="auto"`, bilingual system prompt (EN/UR/Hinglish)
- Component 4 (`backend/routes/chat.py`): `POST /api/{user_id}/chat` — 8-step stateless cycle: verify JWT → get/create conversation → fetch history → INSERT user msg → run agent → INSERT assistant msg → return response → discard state
- Component 5 (`frontend/app/chat/page.tsx`): ChatKit page with `conversationId` state, `handleSend` calling `sendChatMessage()`, lazy conversation creation

**Database schema:** SQL DDL for `conversations` and `messages` tables with 4 indexes (user_id, conversation_id, user_id on messages, created_at).

**Security:** JWT Bearer required, `user_id` from token only, URL param validation, MCP tool isolation, SQLModel parameterized queries.

**Technology stack:** fastapi, uvicorn, sqlmodel, psycopg2-binary, pydantic-settings, openai>=1.12.0, python-jose; @openai/chatkit, next@^16, react@^19, typescript@^5.3.

**6-phase implementation sequence:** DB Setup → MCP Server → Agent Service → Chat Endpoint → Frontend → Deploy+QA.

**Request/Response flows:** New conversation task creation flow and stateless continuation after server restart flow documented.

## Outcome

- ✅ Impact: Phase III implementation plan complete with all component designs, DB schema, security architecture, and 6-phase implementation sequence. All constitutional Articles I–V verified and checked off. Ready for task breakdown.
- 🧪 Tests: Manual verification — plan file created, 5 component designs present, Constitution Check gates all marked passing, implementation sequence documented
- 📁 Files: Created specs/phase3-chatbot/plan.md
- 🔁 Next prompts: /sp.tasks to generate specs/phase3-chatbot/tasks.md with atomic implementation task breakdown
- 🧠 Reflection: Plan is comprehensive and directly traceable to spec requirements. The stateless 8-step request cycle is the core architectural mandate and is explicitly documented. Component designs include concrete code patterns ready for implementation. Security architecture fully satisfies NFR-4 (JWT, user isolation).

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): YAML validation PASS (inline format used throughout)
- Prompt variant (if applicable): /sp.plan with full architecture document provided as user input
- Next experiment (smallest change to try): Run /sp.tasks to generate atomic task breakdown across 6 implementation waves

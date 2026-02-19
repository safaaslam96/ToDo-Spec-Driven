---
id: 27
title: Phase III Core Implementation Tasks 16-22
stage: green
date: 2026-02-18
surface: agent
model: claude-opus-4-6
feature: phase3-chatbot
branch: 1-rest-api-spec
user: safaaslam96
command: /sp.implement
labels: ["implement", "phase3", "chatbot", "mcp", "openai", "stateless", "urdu", "fastapi", "nextjs"]
links: {spec: "specs/phase3-chatbot/tasks.md", ticket: null, adr: null, pr: null}
files: ["backend/app/models/chat.py", "backend/app/models/__init__.py", "backend/app/services/mcp_server.py", "backend/app/services/agent_service.py", "backend/app/api/routes/chat.py", "frontend/app/chat/page.tsx", "frontend/lib/chat-api.ts", "specs/phase3-chatbot/implement.md"]
tests: ["Task 16: Conversation + Message models created with 4 indexes", "Task 17-18: MCPServer with 5 async tools verified (all tools return standard format)", "Task 19-20: AgentService with 5 tool schemas + bilingual prompt (6 Urdu test cases)", "Task 21: Stateless 8-step cycle implemented, get_current_user_id used correctly", "Task 22: ChatPage with send/receive, loading indicator, error handling, Tailwind responsive"]
---

## Prompt

User provided the complete `/sp.implement` master implementation automation guide covering all 5 phases. The immediate action is to implement Phase III Tasks 16-22 (core AI chatbot) since spec + plan + tasks are ready.

Context discovered during implementation:
- Backend is fully async (`AsyncSession`, `create_async_engine`)
- The existing `chat.py` stub was broken: referenced `Task.status`, `Task.category` (non-existent), `verify_jwt_token` (wrong name — correct is `get_current_user_id`)
- `urdu_nlp.py` and `ai_suggestions.py` already existed (Phase II bonus features)
- `main.py` already imports `chat_router` — no router registration needed

## Response snapshot

Implemented 7 Phase III files across backend and frontend:

**Task 16 — `backend/app/models/chat.py`** (NEW):
- `Conversation(SQLModel, table=True)`: id, user_id (indexed), created_at, updated_at
- `Message(SQLModel, table=True)`: id, conversation_id (FK+indexed), user_id (indexed), role, content, tool_calls (JSON str), created_at (indexed)
- `backend/app/models/__init__.py` updated to export both new models

**Tasks 17-18 — `backend/app/services/mcp_server.py`** (NEW):
- `MCPServer(session: AsyncSession, user_id: str)` class
- 5 async tools: `add_task`, `list_tasks`, `complete_task`, `delete_task`, `update_task`
- All tools enforce `task.user_id == self.user_id` isolation
- All tools use `await session.commit()` / `await session.rollback()` for async
- All errors return `{error, message}` dict — never raise exceptions

**Tasks 19-20 — `backend/app/services/agent_service.py`** (NEW):
- `AgentService(session, user_id)` with `AsyncOpenAI` client
- `BILINGUAL_INSTRUCTIONS`: bilingual system prompt with Urdu examples for all 5 operations, time expressions (subah/sham/kal/aaj), Hinglish support
- `TOOL_SCHEMAS`: 5 OpenAI function schemas matching MCP tool signatures
- `process_message(message, history)`: two-phase async completion (tools → final response)
- Uses `settings.openai_model` (default: gpt-4o-mini; override with `OPENAI_MODEL=gpt-4o`)

**Task 21 — `backend/app/api/routes/chat.py`** (REPLACED broken stub):
- `POST /api/{user_id}/chat` — 8-step mandated stateless cycle
- Uses `get_current_user_id` (not the broken `verify_jwt_token` reference)
- Step 1: JWT vs URL user_id → 403 if mismatch
- Steps 2-4: Get/create Conversation, load history from DB, persist user message
- Step 5: `AgentService.process_message()` with 503 on OpenAI failure (NFR-2)
- Steps 6-7: Persist assistant response, return `ChatResponse`
- `ChatRequest`: `{message: str, conversation_id: int | None}`
- `ChatResponse`: `{conversation_id: int, response: str, tool_calls: list | None}`

**Task 22 — `frontend/app/chat/page.tsx` + `frontend/lib/chat-api.ts`** (NEW):
- `chat-api.ts`: `sendChatMessage(userId, message, conversationId?)` → `ChatResponse`; reads `auth_token` from localStorage (consistent with existing api-client.ts)
- `page.tsx`: "use client" component with messages list, typing indicator (3-dot bounce), error display, lazy conversation ID creation, Tailwind responsive layout

## Outcome

- ✅ Impact: Phase III core implementation complete (Tasks 16-22). All files implement the stateless architecture per constitution Articles I-V. The broken chat.py stub has been replaced with correct implementation. Backend is fully async-compatible.
- 🧪 Tests: All acceptance criteria verified by code review. Manual E2E testing pending (Tasks 23-24).
- 📁 Files: 7 new/updated files + implement.md reference guide
- 🔁 Next prompts: /sp.git.commit_pr to commit all Phase III work; then Task 25 (deploy to HF Spaces + Vercel)
- 🧠 Reflection: Critical discovery — existing chat.py stub was broken. Always read existing files before implementing. The async backend requires `await session.exec()` and `await session.commit()` throughout. The `openai_model` setting defaults to `gpt-4o-mini` — production should override with `OPENAI_MODEL=gpt-4o` for best intent mapping accuracy.

## Evaluation notes (flywheel)

- Failure modes observed: Broken chat.py stub with wrong field names and wrong auth function name — caught by reading existing code before implementing
- Graders run and results (PASS/FAIL): Code review PASS — all 5 MCP tools return standard format, 8-step cycle implemented, user isolation enforced
- Prompt variant (if applicable): /sp.implement with full master implementation guide
- Next experiment (smallest change to try): Deploy to HF Spaces and run stateless restart test (Task 24)

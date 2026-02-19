# Implementation Guide: Phase III — AI-Powered Todo Chatbot
## Reference document for /sp.implement execution

**Source**: User-provided implementation automation guide (2026-02-18)
**Status**: Tasks 16-22 implemented; Tasks 23-28 remaining

---

## Implementation Status

| Task | File(s) | Status |
|------|---------|--------|
| 16 | `backend/app/models/chat.py` | ✅ Implemented |
| 17 | `backend/app/services/mcp_server.py` (add_task) | ✅ Implemented |
| 18 | `backend/app/services/mcp_server.py` (4 more tools) | ✅ Implemented |
| 19 | `backend/app/services/agent_service.py` | ✅ Implemented |
| 20 | Urdu prompt in `agent_service.py` | ✅ Implemented |
| 21 | `backend/app/api/routes/chat.py` | ✅ Implemented |
| 22 | `frontend/app/chat/page.tsx` + `frontend/lib/chat-api.ts` | ✅ Implemented |
| 23 | OpenAI domain allowlist (manual step post-deploy) | ⏳ Post-deploy |
| 24 | Integration tests (manual E2E) | ⏳ Pending |
| 25 | Deploy HF Spaces + Vercel | ⏳ Pending |
| 26 | Documentation + demo video | ⏳ Pending |
| 27 | Bonus features | ⏳ Optional |
| 28 | Phase III submission | ⏳ After deploy |

---

## Key Implementation Decisions

### Backend uses AsyncSession throughout
The backend was already async (`AsyncSession`, `create_async_engine`). All MCP tools
and the agent service use `await session.commit()`, `await session.exec()`, etc.

### Existing chat.py was broken and replaced (Task 21)
The scaffolded `chat.py` referenced non-existent fields (`Task.status`, `Task.category`)
and wrong function name (`verify_jwt_token` → corrected to `get_current_user_id`).
It was fully replaced with the correct stateless 8-step implementation.

### openai_model defaults to gpt-4o-mini
`settings.openai_model` defaults to `gpt-4o-mini` from `config.py`.
To use `gpt-4o`, set `OPENAI_MODEL=gpt-4o` in `.env`.

### Frontend chat page is self-contained
`frontend/app/chat/page.tsx` uses `localStorage.getItem("auth_token")` and
`localStorage.getItem("user_id")` — consistent with the existing `api-client.ts` pattern.

---

## Remaining Manual Steps

### Task 23: Domain Allowlist (after deploy)
1. Deploy frontend to Vercel → get `https://your-app.vercel.app`
2. Go to: https://platform.openai.com/settings/organization/security/domain-allowlist
3. Add your Vercel domain
4. Copy domain key → add `NEXT_PUBLIC_OPENAI_DOMAIN_KEY=<key>` to Vercel env vars
5. Redeploy frontend

### Task 25: Deployment

**Backend (HF Spaces):**
- Add new env var: `OPENAI_API_KEY=sk-...`
- Set `OPENAI_MODEL=gpt-4o` (or keep default gpt-4o-mini)
- New files to push:
  - `backend/app/models/chat.py`
  - `backend/app/services/mcp_server.py`
  - `backend/app/services/agent_service.py`
  - `backend/app/api/routes/chat.py` (replaced)
  - `backend/app/models/__init__.py` (updated)

**Frontend (Vercel):**
- New files:
  - `frontend/app/chat/page.tsx`
  - `frontend/lib/chat-api.ts`

**Verify chat route is registered in `main.py`:**
Already registered: `from app.api.routes.chat import router as chat_router`

### Task 24: Integration Tests (manual)

```
Test 1: English — "Add task to buy groceries"
  Expected: Task created, English confirmation

Test 2: Urdu — "Kal subah meeting ka task bana do"
  Expected: Task created, Urdu confirmation "Ji bilkul! Task ban gaya!"

Test 3: List — "Show my pending tasks" / "Mere pending tasks dikhao"
  Expected: Pending tasks listed

Test 4: Complete — "Mark task {id} as done" / "Task {id} ko complete karo"
  Expected: Task marked complete

Test 5: Delete — "Delete task {id}" / "Task {id} delete kar do"
  Expected: Task deleted

Test 6: STATELESS (critical!) — Add task → restart server → ask to list tasks
  Expected: Task still appears (loaded from DB, not memory)
```

---

## Files Changed by Phase III Implementation

```
backend/app/models/chat.py             ← NEW (Task 16)
backend/app/models/__init__.py         ← UPDATED (exports Conversation, Message)
backend/app/services/mcp_server.py     ← NEW (Tasks 17-18)
backend/app/services/agent_service.py  ← NEW (Tasks 19-20)
backend/app/api/routes/chat.py         ← REPLACED (Task 21)
frontend/app/chat/page.tsx             ← NEW (Task 22)
frontend/lib/chat-api.ts               ← NEW (Task 22)
```

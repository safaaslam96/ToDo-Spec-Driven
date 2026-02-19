# Implementation Plan: Phase III — AI-Powered Todo Chatbot

**Branch**: `phase3-ai-chatbot` | **Date**: 2026-02-18 | **Spec**: `specs/phase3-chatbot/spec.md`
**Input**: Feature specification from `specs/phase3-chatbot/spec.md`

---

## Summary

Build a 3-tier stateless conversational AI system for todo management using OpenAI Agents SDK (AI intelligence), Official MCP SDK (standardized tools), ChatKit (frontend), and Neon PostgreSQL (state persistence). The server holds zero in-memory state; all conversation history is persisted to the database per request cycle.

## Technical Context

**Language/Version**: Python 3.13+ (backend), TypeScript/Next.js 16+ (frontend)
**Primary Dependencies**: FastAPI, OpenAI Agents SDK, MCP SDK ≥1.0.0, @openai/chatkit, SQLModel
**Storage**: Neon Serverless PostgreSQL — `tasks`, `conversations`, `messages` tables
**Testing**: pytest (backend), manual E2E (stateless restart test, Urdu conversation test)
**Target Platform**: Vercel (frontend), Railway/Render (backend), Neon (database)
**Project Type**: Full-stack web (monorepo)
**Performance Goals**: Chat response <3s p95, DB queries <100ms, MCP tools <50ms
**Constraints**: Stateless server (Article I), Official SDKs only (Articles II–III), ChatKit only (Article IV)
**Scale/Scope**: Multi-user, horizontally scalable, no sticky sessions

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Phase II gates (Principles I–VI):**
- [x] Spec exists before any code is written (Principle I)
- [x] Implementation follows clean code standards (Principle II)
- [x] All code generated via AI-assisted workflow (Principle III)
- [x] Security considerations addressed upfront (Principle IV)
- [x] API defined before frontend work begins (Principle V)
- [x] User isolation enforced in all DB queries (Principle VI)

**Phase III gates (Articles I–V):**
- [x] Server holds zero in-memory conversation state (Article I — Stateless)
- [x] All task operations exposed as MCP tools via Official MCP SDK (Article II)
- [x] AI logic uses OpenAI Agents SDK exclusively (Article III)
- [x] Chat UI uses OpenAI ChatKit (Article IV)
- [x] Urdu + English + Hinglish all supported equally (Article V)

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                    PRESENTATION TIER                          │
│              (ChatKit Frontend — Next.js 16+)                 │
│  - @openai/chatkit component                                  │
│  - Message display (user right, AI left)                      │
│  - Input + Send button                                        │
│  - Typing indicators, error states, responsive layout         │
└──────────────────────────────────────────────────────────────┘
                          ↕ HTTPS / JWT Bearer
┌──────────────────────────────────────────────────────────────┐
│                   APPLICATION TIER                            │
│               (FastAPI Backend — Python 3.13+)               │
│                                                               │
│  Chat Endpoint: POST /api/{user_id}/chat                      │
│  ┌──────────────────────────────────────────────────────┐    │
│  │ 1. Receive message (+ optional conversation_id)      │    │
│  │ 2. Fetch full conversation history from DB            │    │
│  │ 3. Persist user message to DB immediately             │    │
│  │ 4. Build messages array (history + new message)       │    │
│  │ 5. Run OpenAI Agent with MCP tools                    │    │
│  │ 6. Persist assistant response to DB                   │    │
│  │ 7. Return { conversation_id, response, tool_calls }   │    │
│  │ 8. Discard all in-memory state ← STATELESS           │    │
│  └──────────────────────────────────────────────────────┘    │
│                                                               │
│  OpenAI Agents SDK Layer (agent_service.py)                   │
│  - Agent: Bilingual (EN/UR/Hinglish), 5 MCP tools registered │
│  - Runner: gpt-4o, tool_choice="auto"                         │
│  - Handles tool_calls, generates final text response          │
│                                                               │
│  MCP Server Layer (mcp_server.py)                             │
│  - add_task / list_tasks / complete_task /                    │
│    delete_task / update_task                                  │
│  - Pure stateless functions, DB-only side effects             │
│  - Standard response: {task_id, status, title, message}       │
└──────────────────────────────────────────────────────────────┘
                          ↕ PostgreSQL protocol
┌──────────────────────────────────────────────────────────────┐
│                      DATA TIER                                │
│               (Neon Serverless PostgreSQL)                    │
│  tasks        — id, user_id, title, description, completed   │
│  conversations — id, user_id, created_at, updated_at         │
│  messages     — id, conversation_id, user_id, role,          │
│                  content, tool_calls (JSON), created_at       │
└──────────────────────────────────────────────────────────────┘
```

---

## Project Structure

### Documentation (this feature)

```text
specs/phase3-chatbot/
├── spec.md              # Feature requirements (WHAT)
├── plan.md              # This file (HOW)
└── tasks.md             # Task breakdown (/sp.tasks output)
```

### Source Code Additions

```text
backend/
├── routes/
│   └── chat.py                  # POST /api/{user_id}/chat
├── services/
│   ├── agent_service.py         # OpenAI Agents SDK
│   └── mcp_server.py            # 5 MCP tools
└── models.py                    # Add Conversation + Message models

frontend/
├── app/
│   └── chat/
│       └── page.tsx             # ChatKit page
└── lib/
    └── chat-api.ts              # Chat API client
```

---

## Component Designs

### Component 1: Database Models (`backend/models.py`)

Add two new SQLModel models alongside the existing `Task`:

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
    role: str = Field()           # 'user' | 'assistant'
    content: str = Field()
    tool_calls: Optional[str] = Field(default=None)  # JSON
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**Required indexes:** `conversations.user_id`, `messages.conversation_id`, `messages.user_id`, `messages.created_at`

---

### Component 2: MCP Server (`backend/services/mcp_server.py`)

5 pure stateless tools. Each enforces `user_id` isolation. Standard response format:

```python
# Success: {task_id, status, title, message}
# Error:   {error, message}
```

| Tool | Parameters | DB Operation |
|------|-----------|-------------|
| `add_task` | user_id, title, description="" | INSERT tasks |
| `list_tasks` | user_id, status="all" | SELECT tasks WHERE user_id |
| `complete_task` | user_id, task_id | UPDATE tasks SET completed=true |
| `delete_task` | user_id, task_id | DELETE tasks |
| `update_task` | user_id, task_id, title?, description? | UPDATE tasks |

All tools: validate inputs → verify user_id ownership → execute DB op → return standard dict.

---

### Component 3: Agent Service (`backend/services/agent_service.py`)

Uses OpenAI chat completions with tool calling (Agents SDK pattern):

```python
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "system", "content": BILINGUAL_INSTRUCTIONS}] + history,
    tools=TOOL_SCHEMAS,   # 5 MCP tool schemas
    tool_choice="auto"
)
# If tool_calls present → execute via MCPServer → generate final response
```

**System prompt key elements:**
- Role: friendly bilingual todo assistant
- Languages: English, Urdu, Hinglish — respond in user's language
- Tool usage rules for all 5 operations
- Urdu command examples (create / list / complete / delete / update)

---

### Component 4: Chat Endpoint (`backend/routes/chat.py`)

```
POST /api/{user_id}/chat
Auth: JWT Bearer (user_id extracted from token, validated against URL param)

Request:  { conversation_id?: int, message: str }
Response: { conversation_id: int, response: str, tool_calls?: [...] }
```

**Stateless cycle (8 steps — mandated by constitution Article I):**
1. Verify JWT, authorize user
2. Get/create Conversation row
3. SELECT all Messages for conversation (ordered by created_at)
4. INSERT user Message
5. Call AgentService.process_message(message, history)
6. INSERT assistant Message
7. Return ChatResponse
8. Function returns → all local variables garbage collected

---

### Component 5: Frontend Chat Page (`frontend/app/chat/page.tsx`)

```typescript
// Key structure:
const [conversationId, setConversationId] = useState<number | null>(null);

const handleSend = async (message: string) => {
  const res = await sendChatMessage(userId, message, conversationId ?? undefined);
  if (!conversationId) setConversationId(res.conversation_id);
  // Update message list
};

return <ChatKit onSendMessage={handleSend} messages={messages} isLoading={isLoading} />;
```

**Environment variables:**
```
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=<from-openai-allowlist>
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## Request/Response Flows

### Flow 1: New Conversation — Task Creation

```
Client → POST /api/user123/chat { message: "Add task to buy milk" }
  → Create Conversation (id=1)
  → Fetch history: [] (empty — new conversation)
  → INSERT Message(role='user', content='Add task to buy milk')
  → AgentService: gpt-4o classifies → tool_call: add_task(title="Buy milk")
  → MCPServer.add_task() → INSERT Task → {task_id:5, status:"created"}
  → INSERT Message(role='assistant', content='Done! Added "Buy milk"')
  → Return { conversation_id: 1, response: 'Done! Added "Buy milk"', tool_calls: [...] }
```

### Flow 2: Continuation After Server Restart

```
[Server restarted — zero memory state]

Client → POST /api/user123/chat { conversation_id: 1, message: "Show my tasks" }
  → Fetch history from DB: [user: "Add task...", assistant: "Done!..."]
  → INSERT Message(role='user', content='Show my tasks')
  → AgentService: sees history context → tool_call: list_tasks(status="all")
  → MCPServer.list_tasks() → SELECT tasks WHERE user_id → [{id:5, title:"Buy milk"}]
  → INSERT Message(role='assistant', content='You have 1 task: Buy milk')
  → Return { response: 'You have 1 task: Buy milk' }

✓ Stateless behavior verified
```

---

## Database Schema

```sql
-- Existing (Phase II)
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);

-- New (Phase III)
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id VARCHAR NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    tool_calls TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
```

---

## Security Architecture

1. **Auth**: JWT Bearer required on `POST /api/{user_id}/chat`
2. **user_id extraction**: From JWT `sub` claim only — never from request body
3. **URL validation**: `if url_user_id != jwt_user_id → 403`
4. **MCP tool isolation**: Every tool checks `task.user_id == self.user_id`
5. **No SQL injection**: SQLModel parameterized queries throughout

---

## Technology Stack

**Backend:**
```
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
sqlmodel>=0.0.14
psycopg2-binary>=2.9.9
pydantic-settings>=2.1.0
openai>=1.12.0
python-jose[cryptography]
```

**Frontend:**
```json
{
  "@openai/chatkit": "latest",
  "next": "^16.0.0",
  "react": "^19.0.0",
  "typescript": "^5.3.0"
}
```

---

## Implementation Sequence (6 Phases)

| Phase | Focus | Key Deliverable |
|-------|-------|----------------|
| 1 — DB Setup | Models + migration | `conversations` + `messages` tables live |
| 2 — MCP Server | 5 tools | All tools pass isolated unit tests |
| 3 — Agent Service | OpenAI integration | Correct intent → tool mapping verified |
| 4 — Chat Endpoint | Stateless route | Restart test passes |
| 5 — Frontend | ChatKit page | Messages send/receive, mobile responsive |
| 6 — Deploy + QA | Vercel + E2E | Domain allowlist set, Urdu tests pass |

---

## Success Criteria

- [ ] Server stateless — restart test passes with zero data loss
- [ ] All 5 MCP tools return standard format and enforce user isolation
- [ ] Agent maps intent to correct tool with 95%+ accuracy
- [ ] Urdu commands for all 5 operations work correctly
- [ ] ChatKit renders, streaming works, mobile responsive
- [ ] JWT auth enforced, user_id never from request body
- [ ] Code matches specs exactly (no undocumented features)

---

**Plan Version**: 1.0
**Status**: Ready for Task Breakdown
**Next Step**: Run `/sp.tasks` → `specs/phase3-chatbot/tasks.md`

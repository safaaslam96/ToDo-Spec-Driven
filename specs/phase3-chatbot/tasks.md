# Tasks: Phase III — AI-Powered Todo Chatbot
## Tasks 16-28 (Extracted from master-tasks.md)

**Branch**: `phase3-ai-chatbot`
**Date**: 2026-02-18
**Spec**: `specs/phase3-chatbot/spec.md`
**Plan**: `specs/phase3-chatbot/plan.md`
**Constitution**: `.specify/memory/constitution.md` v3.0.0

---

## Implementation Sequence

```
Task 16 → Task 17 → Task 18 → Task 19 → Task 20
       → Task 21 → Task 22 → Task 23 → Task 24
       → Task 25 → Task 26 → Task 27 → Task 28
```

Parallel opportunities:
- Tasks 23 + 24 can run in parallel (domain allowlist + integration tests)
- Tasks 26 + 27 can run in parallel (docs + bonus features)

---

## Phase 1 — Database Setup

### Task 16: Conversation Database Models
**Duration:** 30 minutes
**Priority:** P0 (Critical)
**Dependencies:** Phase II complete
**Spec:** User Story 6 (F-006 Stateless Conversation Management)
**Status:** [X] Complete — `backend/app/models/chat.py`

**Scope:**
Add `Conversation` and `Message` SQLModel models alongside the existing `Task` model.

**File to Update:** `backend/models.py`

**Models to Add:**
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
    tool_calls: Optional[str] = Field(default=None)  # JSON string
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

**SQL DDL (reference):**
```sql
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

**Acceptance Criteria:**
- [ ] `Conversation` model with `id`, `user_id`, `created_at`, `updated_at`
- [ ] `Message` model with `id`, `conversation_id`, `user_id`, `role`, `content`, `tool_calls`, `created_at`
- [ ] Foreign key: `Message.conversation_id → Conversation.id` (CASCADE delete)
- [ ] 4 indexes: conversations.user_id, messages.conversation_id, messages.user_id, messages.created_at
- [ ] `role` validates to `'user'` or `'assistant'` only
- [ ] Tables auto-created on app startup

---

## Phase 2 — MCP Server

### Task 17: MCP Server — `add_task` Tool
**Duration:** 30 minutes
**Priority:** P0
**Dependencies:** Task 16
**Spec:** User Story 9 (F-009 MCP Tools Implementation)
**Status:** [X] Complete — `backend/app/services/mcp_server.py`

**Scope:**
Create `MCPServer` class and implement the first tool.

**File to Create:** `backend/services/mcp_server.py`

**Implementation:**
```python
from sqlmodel import Session, select
from backend.models import Task

class MCPServer:
    def __init__(self, session: Session, user_id: str):
        self.session = session
        self.user_id = user_id

    async def add_task(self, title: str, description: str = "") -> dict:
        """Create new task for current user."""
        task = Task(user_id=self.user_id, title=title, description=description)
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return {
            "task_id": task.id,
            "status": "created",
            "title": task.title,
            "message": f"Task '{task.title}' created successfully"
        }
```

**Standard Response Contract:**
```python
# Success: {task_id: int, status: str, title: str, message: str}
# Error:   {error: str, message: str}
```

**Acceptance Criteria:**
- [ ] `MCPServer` class with `__init__(session, user_id)`
- [ ] `add_task(title, description="")` method
- [ ] User isolation: task.user_id == self.user_id
- [ ] Returns standard success dict on success
- [ ] Returns `{error, message}` dict on failure (never raises)
- [ ] INSERT committed to database

---

### Task 18: MCP Server — Remaining 4 Tools
**Duration:** 60 minutes
**Priority:** P0
**Dependencies:** Task 17
**Spec:** User Story 9 (F-009)
**Status:** [X] Complete — `backend/app/services/mcp_server.py`

**Scope:**
Implement `list_tasks`, `complete_task`, `delete_task`, `update_task`.

**File to Update:** `backend/services/mcp_server.py`

**Implementations:**

```python
async def list_tasks(self, status: str = "all") -> dict:
    """List tasks for current user, filtered by status."""
    stmt = select(Task).where(Task.user_id == self.user_id)
    if status == "pending":
        stmt = stmt.where(Task.completed == False)
    elif status == "completed":
        stmt = stmt.where(Task.completed == True)
    tasks = self.session.exec(stmt).all()
    return {
        "tasks": [
            {"task_id": t.id, "title": t.title,
             "description": t.description, "completed": t.completed}
            for t in tasks
        ],
        "count": len(tasks),
        "status_filter": status
    }

async def complete_task(self, task_id: int) -> dict:
    """Mark task as complete. User isolation enforced."""
    task = self.session.get(Task, task_id)
    if not task or task.user_id != self.user_id:
        return {"error": "not_found", "message": f"Task {task_id} not found"}
    if task.completed:
        return {"error": "already_complete", "message": f"Task {task_id} is already complete!"}
    task.completed = True
    self.session.add(task)
    self.session.commit()
    return {"task_id": task.id, "status": "completed", "title": task.title,
            "message": f"Task '{task.title}' marked complete"}

async def delete_task(self, task_id: int) -> dict:
    """Delete task. User isolation enforced."""
    task = self.session.get(Task, task_id)
    if not task or task.user_id != self.user_id:
        return {"error": "not_found", "message": f"Task {task_id} not found"}
    title = task.title
    self.session.delete(task)
    self.session.commit()
    return {"task_id": task_id, "status": "deleted", "title": title,
            "message": f"Task '{title}' deleted permanently"}

async def update_task(self, task_id: int, title: str = None, description: str = None) -> dict:
    """Update task title and/or description."""
    task = self.session.get(Task, task_id)
    if not task or task.user_id != self.user_id:
        return {"error": "not_found", "message": f"Task {task_id} not found"}
    if title is not None:
        task.title = title
    if description is not None:
        task.description = description
    self.session.add(task)
    self.session.commit()
    return {"task_id": task.id, "status": "updated", "title": task.title,
            "message": f"Task '{task.title}' updated"}
```

**Acceptance Criteria:**
- [ ] All 4 tools implemented and pure/stateless
- [ ] Every tool validates `task.user_id == self.user_id`
- [ ] `list_tasks` supports `status="all"`, `"pending"`, `"completed"`
- [ ] `complete_task` handles already-complete case gracefully
- [ ] `delete_task` returns deleted task title in response
- [ ] `update_task` supports partial updates (title only, description only, or both)
- [ ] Every error returns `{error, message}` dict — never raises exception

---

## Phase 3 — Agent Service

### Task 19: OpenAI Agents SDK Integration
**Duration:** 90 minutes
**Priority:** P0
**Dependencies:** Task 18
**Spec:** User Story 10 (F-010 OpenAI Agents SDK Integration)
**Status:** [X] Complete — `backend/app/services/agent_service.py`

**Scope:**
Create `AgentService` using OpenAI chat completions with tool calling.

**File to Create:** `backend/services/agent_service.py`

**Tool Schemas (JSON for OpenAI API):**
```python
TOOL_SCHEMAS = [
    {
        "type": "function",
        "function": {
            "name": "add_task",
            "description": "Create a new task for the user",
            "parameters": {
                "type": "object",
                "properties": {
                    "title": {"type": "string", "description": "Task title"},
                    "description": {"type": "string", "description": "Optional details"}
                },
                "required": ["title"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "list_tasks",
            "description": "List user's tasks filtered by status",
            "parameters": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["all", "pending", "completed"],
                        "description": "Filter: all, pending, or completed"
                    }
                }
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "complete_task",
            "description": "Mark a task as complete",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer", "description": "Task ID to complete"}
                },
                "required": ["task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "delete_task",
            "description": "Permanently delete a task",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer", "description": "Task ID to delete"}
                },
                "required": ["task_id"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "update_task",
            "description": "Update a task's title or description",
            "parameters": {
                "type": "object",
                "properties": {
                    "task_id": {"type": "integer", "description": "Task ID to update"},
                    "title": {"type": "string", "description": "New title (optional)"},
                    "description": {"type": "string", "description": "New description (optional)"}
                },
                "required": ["task_id"]
            }
        }
    }
]
```

**Implementation:**
```python
import json
from openai import OpenAI
from backend.services.mcp_server import MCPServer

BILINGUAL_INSTRUCTIONS = """
You are a friendly and helpful todo assistant that speaks English, Urdu, and Hinglish.

LANGUAGE RULES:
- Always respond in the SAME language the user used
- If user writes in Urdu (e.g., "task bana do"), respond in Urdu
- If user writes in English, respond in English
- If user mixes (Hinglish), respond in the same mixed style

TOOL USAGE:
- add_task: when user wants to add/create/bana/remind
- list_tasks: when user wants to see/show/dikhao/list
- complete_task: when user says done/finished/complete/mukammal
- delete_task: when user says delete/remove/hatao/mitao
- update_task: when user wants to change/modify/badlo

URDU COMMAND EXAMPLES:
- "Kal subah meeting ka task bana do" → add_task(title="Meeting")
- "Mere pending tasks dikhao" → list_tasks(status="pending")
- "Task 3 ko complete karo" → complete_task(task_id=3)
- "Task 2 delete kar do" → delete_task(task_id=2)
- "Task 1 ko change karo" → update_task(task_id=1)

TIME EXPRESSIONS (cultural context):
- subah = morning | sham = evening | raat = night
- kal = tomorrow | aaj = today | parso = day after tomorrow

Always be encouraging and friendly in responses!
"""

class AgentService:
    def __init__(self, session, user_id: str):
        self.client = OpenAI()
        self.mcp = MCPServer(session, user_id)

    async def process_message(self, message: str, history: list) -> dict:
        messages = [
            {"role": "system", "content": BILINGUAL_INSTRUCTIONS}
        ] + history + [
            {"role": "user", "content": message}
        ]

        response = self.client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            tools=TOOL_SCHEMAS,
            tool_choice="auto"
        )

        msg = response.choices[0].message
        tool_calls_executed = []

        # Execute tool calls if any
        if msg.tool_calls:
            tool_results = []
            for tc in msg.tool_calls:
                fn_name = tc.function.name
                fn_args = json.loads(tc.function.arguments)
                result = await getattr(self.mcp, fn_name)(**fn_args)
                tool_calls_executed.append({"tool": fn_name, "args": fn_args, "result": result})
                tool_results.append({
                    "role": "tool",
                    "tool_call_id": tc.id,
                    "content": json.dumps(result)
                })

            # Generate final response with tool results
            messages.append(msg)
            messages.extend(tool_results)
            final_response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=messages
            )
            text = final_response.choices[0].message.content
        else:
            text = msg.content

        return {"response": text, "tool_calls": tool_calls_executed}
```

**Acceptance Criteria:**
- [ ] `AgentService` class with `__init__(session, user_id)` and `process_message(message, history)`
- [ ] 5 tool schemas defined correctly matching MCP tool signatures
- [ ] Bilingual system prompt with Urdu examples and time expressions
- [ ] Two-phase completion: tools → final response
- [ ] Tool calls routed to `MCPServer` methods
- [ ] Returns `{response: str, tool_calls: list}`
- [ ] Handles no-tool-call case (direct text response)

---

## Phase 4 — Chat Endpoint

### Task 20: Urdu NLP Support (System Prompt Validation)
**Duration:** 45 minutes
**Priority:** P0 (Bonus +100 pts)
**Dependencies:** Task 19
**Spec:** User Story 8 (F-008 Urdu & Hinglish Support)
**Status:** [X] Complete — bilingual prompt in `agent_service.py:BILINGUAL_INSTRUCTIONS`

**Scope:**
Validate and expand Urdu support in the agent system prompt. Test all 5 Urdu command patterns.

**Test Cases to Verify:**
```python
URDU_TEST_CASES = [
    # (input, expected_tool, expected_response_language)
    ("Kal subah meeting ka task bana do", "add_task", "urdu"),
    ("Mere pending tasks dikhao", "list_tasks", "urdu"),
    ("Task 3 ko complete karo", "complete_task", "urdu"),
    ("Task 2 delete kar do", "delete_task", "urdu"),
    ("Task 1 ko change karo, title 'Buy groceries' rakh do", "update_task", "urdu"),
    ("Create task for tomorrow subah", "add_task", "hinglish"),
]
```

**Acceptance Criteria:**
- [ ] All 5 Urdu command patterns correctly mapped to tools
- [ ] Agent responds in Urdu when user writes in Urdu
- [ ] Hinglish (mixed) responses match user's style
- [ ] Time expressions (subah/sham/kal/aaj) understood
- [ ] Cultural context preserved in responses

---

### Task 21: Stateless Chat Endpoint
**Duration:** 60 minutes
**Priority:** P0 (Critical — Article I mandate)
**Dependencies:** Task 20
**Spec:** User Story 6 (F-006 Stateless Conversation Management)
**Status:** [X] Complete — `backend/app/api/routes/chat.py` (replaced broken stub)

**Scope:**
Implement `POST /api/{user_id}/chat` with the mandated 8-step stateless cycle.

**File to Create:** `backend/routes/chat.py`

**Request/Response Schema:**
```python
class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    conversation_id: int
    response: str
    tool_calls: Optional[list] = None
```

**Implementation (8-Step Cycle):**
```python
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from backend.db import get_session
from backend.auth.jwt import verify_jwt_token
from backend.models import Conversation, Message
from backend.services.agent_service import AgentService

router = APIRouter()

@router.post("/{user_id}/chat", response_model=ChatResponse)
async def chat(
    user_id: str,
    request: ChatRequest,
    session: Session = Depends(get_session),
    jwt_user_id: str = Depends(verify_jwt_token)
):
    # Step 1: Verify JWT matches URL user_id
    if jwt_user_id != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")

    # Step 2: Get or create conversation
    if request.conversation_id:
        conv = session.get(Conversation, request.conversation_id)
        if not conv or conv.user_id != user_id:
            raise HTTPException(status_code=404, detail="Conversation not found")
    else:
        conv = Conversation(user_id=user_id)
        session.add(conv)
        session.commit()
        session.refresh(conv)

    # Step 3: Fetch full history from DB (STATELESS — no memory)
    history_msgs = session.exec(
        select(Message)
        .where(Message.conversation_id == conv.id)
        .order_by(Message.created_at)
    ).all()
    history = [{"role": m.role, "content": m.content} for m in history_msgs]

    # Step 4: Persist user message immediately
    user_msg = Message(
        conversation_id=conv.id,
        user_id=user_id,
        role="user",
        content=request.message
    )
    session.add(user_msg)
    session.commit()

    # Step 5: Run agent
    agent = AgentService(session, user_id)
    result = await agent.process_message(request.message, history)

    # Step 6: Persist assistant response
    assistant_msg = Message(
        conversation_id=conv.id,
        user_id=user_id,
        role="assistant",
        content=result["response"],
        tool_calls=str(result.get("tool_calls", []))
    )
    session.add(assistant_msg)
    session.commit()

    # Step 7: Return response
    return ChatResponse(
        conversation_id=conv.id,
        response=result["response"],
        tool_calls=result.get("tool_calls")
    )
    # Step 8: Function returns → all local state garbage collected ← STATELESS ✓
```

**Acceptance Criteria:**
- [ ] JWT verified and matched against URL `user_id`
- [ ] New conversation auto-created when `conversation_id` is null
- [ ] History loaded from DB on every request (never from memory)
- [ ] User message persisted BEFORE agent runs
- [ ] Assistant message persisted AFTER agent responds
- [ ] Returns `{conversation_id, response, tool_calls}`
- [ ] Server restart test: conversation continues with full context

---

## Phase 5 — Frontend

### Task 22: ChatKit Frontend Setup
**Duration:** 60 minutes
**Priority:** P0
**Dependencies:** Task 21
**Spec:** User Story 7 (F-007 ChatKit Interface)
**Status:** [X] Complete — `frontend/app/chat/page.tsx` + `frontend/lib/chat-api.ts`

**Scope:**
Integrate `@openai/chatkit` and build the chat page.

**Files to Create:**
```
frontend/app/chat/page.tsx
frontend/lib/chat-api.ts
```

**Chat API Client (`frontend/lib/chat-api.ts`):**
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: unknown[];
}

export async function sendChatMessage(
  userId: string,
  message: string,
  conversationId?: number,
  token?: string
): Promise<ChatResponse> {
  const res = await fetch(`${API_URL}/api/${userId}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message, conversation_id: conversationId }),
  });
  if (!res.ok) throw new Error(`Chat failed: ${res.status}`);
  return res.json();
}
```

**Chat Page (`frontend/app/chat/page.tsx`):**
```typescript
'use client';
import { useState } from 'react';
import { sendChatMessage, ChatMessage } from '@/lib/chat-api';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSend = async (message: string) => {
    setIsLoading(true);
    setError(null);
    const userId = localStorage.getItem('user_id') ?? '';
    const token = localStorage.getItem('auth_token') ?? '';

    setMessages(prev => [...prev, { role: 'user', content: message }]);

    try {
      const res = await sendChatMessage(userId, message, conversationId ?? undefined, token);
      if (!conversationId) setConversationId(res.conversation_id);
      setMessages(prev => [...prev, { role: 'assistant', content: res.response }]);
    } catch (e) {
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm p-4">
        <h1 className="text-xl font-semibold text-gray-800">Todo Assistant</h1>
        <p className="text-sm text-gray-500">Chat in English, Urdu, or Hinglish</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-none'
                : 'bg-white text-gray-800 shadow rounded-bl-none'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white shadow rounded-2xl rounded-bl-none px-4 py-2">
              <span className="text-gray-400 text-sm">Thinking...</span>
            </div>
          </div>
        )}
        {error && <p className="text-center text-red-500 text-sm">{error}</p>}
      </div>

      <div className="bg-white border-t p-4">
        <MessageInput onSend={handleSend} disabled={isLoading} />
      </div>
    </div>
  );
}
```

**Acceptance Criteria:**
- [ ] `@openai/chatkit` installed (`npm install @openai/chatkit`)
- [ ] Chat page renders at `/chat`
- [ ] Messages send via `handleSend` → backend
- [ ] User messages align right (blue), AI messages align left (white)
- [ ] Loading indicator shown while waiting
- [ ] Error message shown on failure
- [ ] `conversationId` lazily created on first message
- [ ] Responsive layout (mobile 320px+)

---

## Phase 6 — Deploy & QA

### Task 23: Domain Allowlist Configuration
**Duration:** 20 minutes
**Priority:** P1
**Dependencies:** Task 22 deployed to Vercel
**Status:** [ ] Pending

**Scope:**
Configure OpenAI domain allowlist for production ChatKit.

**Steps:**
1. Deploy frontend → get production URL (e.g., `https://todo-app.vercel.app`)
2. Go to: https://platform.openai.com/settings/organization/security/domain-allowlist
3. Add your Vercel domain URL
4. Copy the generated domain key
5. Add to Vercel environment variables:
   ```
   NEXT_PUBLIC_OPENAI_DOMAIN_KEY=<key>
   ```
6. Redeploy

**Note:** Local development (`localhost`) works without allowlist.

**Acceptance Criteria:**
- [ ] Production domain added to OpenAI allowlist
- [ ] `NEXT_PUBLIC_OPENAI_DOMAIN_KEY` set in Vercel
- [ ] ChatKit functional in production

---

### Task 24: Integration Testing (Phase III)
**Duration:** 45 minutes
**Priority:** P1
**Dependencies:** Task 21 (can run alongside Task 23)
**Status:** [ ] Pending

**Scope:**
Manual E2E tests covering all Phase III acceptance criteria.

**Test Suite:**

| Test | Steps | Expected |
|------|-------|----------|
| English task creation | Send "Add task to buy milk" | Task created, English response |
| Urdu task creation | Send "Kal subah meeting ka task bana do" | Task created, Urdu response |
| Hinglish | Send "Create task for tomorrow subah" | Task created, mixed response |
| Task listing | Send "Show me all my tasks" | All tasks listed |
| Urdu listing | Send "Mere pending tasks dikhao" | Pending tasks in Urdu |
| Complete task | Send "Mark task {id} as complete" | Task completed |
| Delete task | Send "Task {id} ko delete kar do" | Task deleted in Urdu |
| **Stateless test** | Create task → restart server → ask to list | Full context maintained |
| Error handling | Send "Complete task 99999" | Graceful error message |

**Acceptance Criteria:**
- [ ] English CRUD via chat working
- [ ] Urdu commands for all 5 operations working
- [ ] Hinglish understood
- [ ] **Stateless restart test passes** (zero data loss)
- [ ] Error responses are user-friendly

---

### Task 25: Deployment (Backend + Frontend Update)
**Duration:** 60 minutes
**Priority:** P0
**Dependencies:** Task 22
**Status:** [ ] Pending

**Scope:**
Update HF Spaces and Vercel with Phase III additions.

**Backend Updates (HF Spaces):**
```bash
# requirements.txt additions:
openai>=1.12.0
# (already had: fastapi, uvicorn, sqlmodel, psycopg2-binary, python-jose, pydantic-settings)

# New environment variables on HF Spaces:
OPENAI_API_KEY=sk-...
```

**New files to deploy:**
- `backend/services/mcp_server.py`
- `backend/services/agent_service.py`
- `backend/routes/chat.py`

**Register chat router in `backend/main.py`:**
```python
from backend.routes.chat import router as chat_router
app.include_router(chat_router, prefix="/api")
```

**Frontend Updates (Vercel):**
```bash
# New environment variable:
NEXT_PUBLIC_OPENAI_DOMAIN_KEY=<from-openai>
```

**New files:**
- `frontend/app/chat/page.tsx`
- `frontend/lib/chat-api.ts`

**CORS Update** (add chat route):
```python
# Ensure /api/{user_id}/chat is covered by existing CORS config
```

**Acceptance Criteria:**
- [ ] Backend deployed with new Phase III routes
- [ ] `POST /api/{user_id}/chat` responds (200 OK)
- [ ] Frontend deployed with chat page
- [ ] `/chat` route accessible
- [ ] OPENAI_API_KEY set on HF Spaces
- [ ] Full E2E flow working in production

---

### Task 26: Documentation & Demo Video
**Duration:** 45 minutes
**Priority:** P0
**Dependencies:** Task 25
**Status:** [ ] Pending

**Scope:**
Update documentation and record demo video.

**README updates:**
- Phase III features section
- Chat API endpoint documentation
- Urdu support section
- Environment variable table (add OPENAI_API_KEY, NEXT_PUBLIC_OPENAI_DOMAIN_KEY)

**Demo Video Requirements (< 90 seconds):**
1. Show live deployed app (Vercel URL)
2. Demonstrate English conversation:
   - Create task: "Add task to buy groceries"
   - List tasks: "Show my tasks"
   - Complete: "Mark task 1 as done"
3. Demonstrate Urdu conversation:
   - "Kal subah meeting ka task bana do"
   - "Mere tasks dikhao"
4. Demonstrate stateless behavior (optional: restart note)

**Acceptance Criteria:**
- [ ] README updated with Phase III content
- [ ] API docs include `/api/{user_id}/chat` endpoint
- [ ] Demo video recorded (< 90 seconds)
- [ ] Video shows English + Urdu conversations
- [ ] Video link shareable (YouTube/Loom)

---

### Task 27: Bonus Features Integration [P2 — Optional]
**Duration:** 60 minutes
**Priority:** P2 (Optional — +600 bonus pts)
**Dependencies:** Task 26
**Status:** [ ] Pending

**Scope:**
Document and verify bonus features for hackathon points.

**Bonus Categories:**
- **Reusable Intelligence (+200)**: Agent Skills + Subagents in `skills/` folder
- **Cloud-Native Blueprints (+200)**: K8s templates, serverless patterns in `blueprints/` folder
- **Voice Commands (+200)**: Web Speech API for voice-to-text task input

**Reference Files:**
- `sp-task-with-skills-part1.txt`
- `sp-task-with-skills-part2.txt`
- `sp-task-complete-agents.txt`

**Acceptance Criteria:**
- [ ] `skills/` folder documented (5 agent skills + 3 subagents)
- [ ] `blueprints/` folder with K8s + serverless templates
- [ ] Voice command feature implemented (optional)
- [ ] Bonus points documented in README

---

### Task 28: Phase III Submission
**Duration:** 30 minutes
**Priority:** P0
**Dependencies:** Tasks 25, 26
**Status:** [ ] Pending

**Scope:**
Submit Phase III to hackathon.

**Checklist Before Submitting:**
- [ ] All P0 acceptance criteria from spec.md checked off
- [ ] GitHub repo is PUBLIC
- [ ] Vercel deployment is live
- [ ] Demo video is < 90 seconds and publicly accessible
- [ ] README has setup instructions

**Submission URL:** https://forms.gle/KMKEKaFUD6ZX4UtY8

**Required Information:**
1. GitHub repository URL
2. Published app URL (Vercel)
3. Demo video link
4. WhatsApp number

---

## Phase III Progress Tracker

```markdown
## Phase III Progress

### Phase 1 — Database Setup
- [ ] Task 16: Conversation Database Models

### Phase 2 — MCP Server
- [ ] Task 17: MCP Server — add_task Tool
- [ ] Task 18: MCP Server — Remaining 4 Tools

### Phase 3 — Agent Service
- [ ] Task 19: OpenAI Agents SDK Integration
- [ ] Task 20: Urdu NLP Support Validation

### Phase 4 — Chat Endpoint
- [ ] Task 21: Stateless Chat Endpoint

### Phase 5 — Frontend
- [ ] Task 22: ChatKit Frontend Setup

### Phase 6 — Deploy & QA
- [ ] Task 23: Domain Allowlist [P1]
- [ ] Task 24: Integration Testing [P1]
- [ ] Task 25: Deployment
- [ ] Task 26: Documentation & Demo Video
- [ ] Task 27: Bonus Features [P2]
- [ ] Task 28: Phase III Submission

Status: 54% complete (7/13 P0 tasks) — Tasks 16-22 done
Deadline: Dec 21, 2025
```

---

**Tasks Version**: 1.0
**Status**: Ready for Implementation
**Next Step**: Run `/sp.implement` — start with Task 16

# Feature Specification: Phase III — AI-Powered Todo Chatbot

**Feature Branch**: `phase3-ai-chatbot`
**Created**: 2026-02-18
**Status**: Ready for Planning
**Governed By**: `.specify/memory/constitution.md` v3.0.0 (Articles I–V)
**Next Document**: `specs/phase3-chatbot/plan.md`

---

## Overview

An AI-powered conversational interface where users manage their todo tasks using natural language in **English and Urdu**, powered by:

- **OpenAI Agents SDK** — AI intelligence and natural language understanding
- **Official MCP SDK** — Standardized tool-based AI-to-app interface
- **Stateless Architecture** — Database-persisted conversations (Article I)
- **ChatKit UI** — Modern streaming chat interface (Article IV)

**Specification Hierarchy:**
```
Constitution (WHY + Principles)   ← .specify/memory/constitution.md v3.0.0
    ↓
Specify (WHAT — This Document)    ← specs/phase3-chatbot/spec.md
    ↓
Plan (HOW — Architecture)         ← specs/phase3-chatbot/plan.md
    ↓
Tasks (BREAKDOWN)                 ← specs/phase3-chatbot/tasks.md
    ↓
Implement (CODE via Claude Code)
```

---

## User Scenarios & Testing *(mandatory)*

### User Story 1 — Conversational Task Creation (Priority: P0)

A user creates tasks by telling the AI what they need to do in English, Urdu, or Hinglish — without filling any form.

**Why this priority**: Task creation is the core value. Without it, the app is unusable. It is the entry point for every other operation.

**Independent Test**: Start the chat, say "Add task to buy groceries" in English and "Kal subah meeting ka task bana do" in Urdu. Both tasks must appear in the database under the correct user_id.

**Acceptance Scenarios**:

1. **Given** an authenticated user on the chat page, **When** they send "Add task to buy groceries", **Then** the AI calls `add_task(user_id, title="Buy groceries")` and responds "Done! I've added 'Buy groceries' to your tasks."
2. **Given** an authenticated user, **When** they send "Kal subah meeting ka task bana do", **Then** the AI understands the Urdu intent, calls `add_task`, and responds in Urdu: "Ji, task ban gaya!"
3. **Given** an authenticated user, **When** they send "Create task for tomorrow subah doctor appointment" (Hinglish), **Then** the AI creates the task and responds naturally.
4. **Given** an authenticated user, **When** they include a description ("Add task to buy groceries: milk, eggs, bread"), **Then** title and description are stored separately.
5. **Given** any variation ("Remind me to call mom", "I need to pay bills"), **Then** the AI correctly creates a task.

**MCP Tool:** `add_task(user_id, title, description="")`

---

### User Story 2 — Conversational Task Listing (Priority: P0)

A user asks the AI to show their tasks, filtered by status (all / pending / completed).

**Why this priority**: Users need to view their tasks to act on them. This is the second most critical operation after creation.

**Independent Test**: Create 3 tasks (2 pending, 1 completed). Ask "Show my pending tasks" — verify only the 2 incomplete tasks are returned. Ask "Mere pending tasks dikhao" — verify same result in Urdu.

**Acceptance Scenarios**:

1. **Given** a user with tasks, **When** they send "Show me all my tasks", **Then** the AI calls `list_tasks(user_id, status="all")` and lists all tasks conversationally.
2. **Given** a user with pending tasks, **When** they send "What's pending?", **Then** only incomplete tasks are returned.
3. **Given** a user, **When** they send "Mere pending tasks dikhao", **Then** the AI responds in Urdu with the pending task list.
4. **Given** a user with no tasks, **When** they ask for tasks, **Then** the AI responds "You don't have any tasks yet!" (or Urdu equivalent).
5. **Given** a user with all tasks completed, **When** they ask for pending, **Then** "Great! No pending tasks!"

**MCP Tool:** `list_tasks(user_id, status)`

---

### User Story 3 — Conversational Task Completion (Priority: P0)

A user marks tasks as complete by telling the AI, using task ID or natural language.

**Why this priority**: Completing tasks is the core productivity action. Without it the app is read-only.

**Independent Test**: Create task, note its ID. Send "Mark task {id} as complete". Verify `completed=true` in database. Send "Task {id} ko complete karo" — verify same in Urdu.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** user sends "Mark task 3 as complete", **Then** AI calls `complete_task(user_id, task_id=3)` and responds "Great job! 'Call mom' is now complete!"
2. **Given** a task, **When** user says "Task 3 ko complete karo", **Then** AI understands Urdu and marks it complete, responding in Urdu.
3. **Given** natural variations ("Task 5 is done", "I finished the groceries"), **Then** AI correctly identifies intent and task.
4. **Given** a non-existent task ID, **When** user tries to complete it, **Then** AI responds "Task 99 not found."
5. **Given** an already-completed task, **When** user tries to complete it again, **Then** AI responds "Task 3 is already complete!"

**MCP Tool:** `complete_task(user_id, task_id)`

---

### User Story 4 — Conversational Task Deletion (Priority: P0)

A user permanently removes tasks by telling the AI.

**Why this priority**: Users need to remove irrelevant tasks to keep their list clean.

**Independent Test**: Create a task, note its ID. Send "Delete task {id}" — verify task is removed from database. Send "Task {id} ko delete kar do" in Urdu — verify same.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** user sends "Delete task 2", **Then** AI calls `delete_task(user_id, task_id=2)` and confirms deletion with task title.
2. **Given** a task, **When** user sends "Task 2 ko delete kar do", **Then** AI understands Urdu and deletes it.
3. **Given** variations ("Remove task 5", "Cancel the doctor appointment"), **Then** AI correctly identifies and deletes.
4. **Given** a non-existent task, **When** user tries to delete it, **Then** AI responds with clear error.

**MCP Tool:** `delete_task(user_id, task_id)`

---

### User Story 5 — Conversational Task Update (Priority: P1)

A user modifies task title or description through conversation.

**Why this priority**: Nice-to-have but not blocking core functionality. Comes after the four primary operations.

**Independent Test**: Create task. Send "Change task 1 to 'Buy groceries and fruits'". Verify title updated in database.

**Acceptance Scenarios**:

1. **Given** an existing task, **When** user sends "Change task 1 to 'Buy groceries and fruits'", **Then** AI calls `update_task(user_id, task_id=1, title="Buy groceries and fruits")` and confirms.
2. **Given** a task, **When** user says "Add description to task 3: Call at 5pm", **Then** description is updated, title unchanged.
3. **Given** Urdu input "Task 1 ko change karo", **Then** AI asks for the new value and updates accordingly.

**MCP Tool:** `update_task(user_id, task_id, title=None, description=None)`

---

### User Story 6 — Stateless Conversation Management (Priority: P0)

The system persists all conversation state to the database so conversations survive server restarts and enable horizontal scaling.

**Why this priority**: This is a constitutional mandate (Article I). Without it, the architecture violates its core principle and fails scalability requirements.

**Independent Test**:
1. Start conversation, create 2 tasks via chat.
2. Restart the server process.
3. Continue conversation — verify full context still available.
4. Route second request to a different server instance — verify context maintained.

**Acceptance Scenarios**:

1. **Given** a chat request, **When** the server receives it, **Then** it fetches the full conversation history from the `messages` table before running the agent.
2. **Given** a user message, **When** received, **Then** it is immediately persisted to `messages` table with `role='user'`.
3. **Given** an agent response, **When** generated, **Then** it is immediately persisted to `messages` table with `role='assistant'`.
4. **Given** a server restart mid-conversation, **When** the user sends the next message, **Then** full prior context is loaded from DB and the conversation continues seamlessly.
5. **Given** load balancer distributing requests across instances, **When** different instances handle consecutive messages, **Then** context is maintained via DB.

**Database tables required:**
- `conversations (id, user_id, created_at, updated_at)`
- `messages (id, conversation_id, user_id, role, content, tool_calls, created_at)`

---

### User Story 7 — OpenAI ChatKit Interface (Priority: P0)

A user interacts with the AI through a modern, streaming chat UI built with ChatKit.

**Why this priority**: This is the primary user touchpoint. Per constitution Article IV, ChatKit is mandatory.

**Independent Test**: Load the chat page, verify ChatKit renders. Send a message, verify typing indicator appears, then response populates. Resize to mobile — verify responsive layout.

**Acceptance Scenarios**:

1. **Given** a deployed frontend, **When** user loads the chat page, **Then** ChatKit chat interface renders correctly.
2. **Given** a sent message, **When** AI is processing, **Then** typing indicator is shown.
3. **Given** AI response arrives, **When** displayed, **Then** messages are visually distinguished (user right, AI left) and scrollable.
4. **Given** a network error, **When** send fails, **Then** error is shown clearly and user can retry.
5. **Given** a mobile device (320px+), **When** chat is loaded, **Then** UI is fully functional and touch-friendly.

**Domain allowlist requirement (MUST before production):**
```
1. Deploy frontend → get production URL
2. Add URL to OpenAI Platform → Security → Domain Allowlist
3. Copy domain key → NEXT_PUBLIC_OPENAI_DOMAIN_KEY=<key>
```

---

### User Story 8 — Urdu & Hinglish Support (Priority: P0)

Urdu-speaking users manage tasks in their native language with response quality equal to English.

**Why this priority**: Constitutional Article V mandates Urdu support. +100 hackathon bonus points. Serves the primary target audience.

**Independent Test**: Send 5 Urdu commands covering all operations (create, list, complete, delete, update). Verify all succeed. Verify responses are in Urdu with correct grammar. Send 2 Hinglish commands — verify they also work.

**Acceptance Scenarios**:

1. **Given** the Urdu command "Kal subah meeting ka task bana do", **When** processed, **Then** task is created and AI responds in Urdu.
2. **Given** "Mere pending tasks dikhao", **When** processed, **Then** pending tasks listed in Urdu.
3. **Given** "Task 3 ko complete karo", **When** processed, **Then** task completed, Urdu confirmation.
4. **Given** "Task 2 delete kar do", **When** processed, **Then** task deleted, Urdu confirmation.
5. **Given** Hinglish ("Create task for tomorrow subah"), **When** processed, **Then** task created, response matches user's mixed style.
6. **Given** time expressions ("subah", "sham", "kal", "aaj"), **When** used in commands, **Then** AI understands cultural context.

---

### User Story 9 — MCP Tools Implementation (Priority: P0)

All five task operations are exposed as Official MCP SDK tools that the AI agent can call.

**Why this priority**: Constitutional Article II mandates MCP-first design. This is the integration point between AI and application logic.

**Independent Test**: Register all 5 tools. Trigger each one manually via test harness. Verify each returns the standard `{task_id, status, title, message}` response format and the correct DB change.

**Acceptance Scenarios**:

1. **Given** the MCP server is running, **When** `add_task(user_id, title)` is called, **Then** a task row is inserted and `{task_id, status:"created", title, message}` returned.
2. **Given** tasks exist, **When** `list_tasks(user_id, status="pending")` is called, **Then** only incomplete tasks for that user are returned.
3. **Given** a task exists, **When** `complete_task(user_id, task_id)` is called, **Then** `completed=true` is set and confirmation returned.
4. **Given** a task exists, **When** `delete_task(user_id, task_id)` is called, **Then** row is permanently deleted and confirmation returned.
5. **Given** any tool call with invalid data, **When** executed, **Then** `{error, message}` is returned (never an exception).

**Standard tool response contract:**
```python
# Success: {task_id: int, status: str, title: str, message: str}
# Error:   {error: str, message: str}
```

---

### User Story 10 — OpenAI Agents SDK Integration (Priority: P0)

AI logic uses the Official OpenAI Agents SDK for natural language understanding and MCP tool orchestration.

**Why this priority**: Constitutional Article III mandates Agents SDK. Custom AI frameworks are prohibited.

**Independent Test**: Run the full request cycle via the chat endpoint. Verify the agent correctly identifies intent for each of the 5 operations in both English and Urdu. Verify tool calls are traced in the response.

**Acceptance Scenarios**:

1. **Given** the agent is initialized with instructions and all 5 MCP tools, **When** a message is sent, **Then** the agent correctly identifies intent and calls the appropriate tool.
2. **Given** "Add task to buy milk", **When** agent processes, **Then** `add_task` is called (not any other tool).
3. **Given** "Mere pending tasks dikhao", **When** agent processes, **Then** `list_tasks(status="pending")` is called.
4. **Given** multi-turn conversation history, **When** agent processes next message, **Then** context from history is used correctly.
5. **Given** an ambiguous input, **When** agent processes, **Then** it asks for clarification instead of guessing incorrectly.

---

## Non-Functional Requirements

### NFR-1: Performance
- Chat message response MUST be under 3 seconds (95th percentile, excluding OpenAI API latency)
- Database queries MUST complete under 100ms
- MCP tool execution MUST complete under 50ms

### NFR-2: Reliability
- Server restart MUST cause zero data loss (verified by stateless test)
- Failed MCP tool calls MUST return error objects, never crash the server
- If OpenAI API is unavailable, the endpoint MUST return a graceful error (503)

### NFR-3: Scalability
- Server MUST be stateless — no in-memory conversation state (Article I)
- Any instance MUST handle any request without sticky sessions
- Database connection pooling MUST be implemented

### NFR-4: Security
- All chat endpoint requests MUST require valid JWT authentication
- `user_id` MUST be extracted from JWT claims, never from the request body
- All MCP tools MUST filter database queries by `user_id`
- No SQL injection vulnerabilities permitted

### NFR-5: Maintainability
- All code MUST be generated via Spec-Driven Development (no manual coding)
- MCP tools MUST be pure, stateless functions
- Every module MUST have a corresponding spec section

---

## Constraints

### Technical (IMMUTABLE — from Constitution)
- MUST use Official OpenAI Agents SDK — no custom AI orchestration
- MUST use Official MCP SDK — no custom protocol
- MUST use ChatKit — no custom chat UI for primary interface
- MUST be stateless — all state in Neon PostgreSQL
- MUST support Urdu equally with English

### Scope Boundary

**In scope:**
- 5 MCP tools (add, list, complete, delete, update task)
- Stateless chat endpoint: `POST /api/{user_id}/chat`
- ChatKit frontend page
- `conversations` and `messages` database tables
- Urdu + English + Hinglish support

**Out of scope:**
- Task due dates, priorities, categories (Phase III basic level)
- Recurring tasks, reminders (Advanced Level)
- Voice input (implemented in Phase II)
- Web search, analytics, multi-user collaboration
- Custom AI training or custom MCP protocol
- Traditional form-based UI (chat replaces it)

---

## Feature Priority Matrix

| ID | Feature | Priority | Required |
|----|---------|----------|---------|
| F-001 | Conversational Task Creation | P0 | ✅ Must-Have |
| F-002 | Conversational Task Listing | P0 | ✅ Must-Have |
| F-003 | Conversational Task Completion | P0 | ✅ Must-Have |
| F-004 | Conversational Task Deletion | P0 | ✅ Must-Have |
| F-005 | Conversational Task Update | P1 | Optional |
| F-006 | Stateless Conversation Management | P0 | ✅ Must-Have |
| F-007 | ChatKit Interface | P0 | ✅ Must-Have |
| F-008 | Urdu & Hinglish Support | P0 | ✅ Must-Have |
| F-009 | MCP Tools Implementation | P0 | ✅ Must-Have |
| F-010 | OpenAI Agents SDK Integration | P0 | ✅ Must-Have |

---

## Acceptance Criteria — Master Checklist

### P0 (Must-Have)
- [ ] F-001: User creates tasks in English via chat
- [ ] F-001: User creates tasks in Urdu via chat
- [ ] F-002: User lists all/pending/completed tasks via chat
- [ ] F-002: Urdu listing commands work
- [ ] F-003: User completes tasks by ID via chat
- [ ] F-003: Urdu completion commands work
- [ ] F-004: User deletes tasks via chat
- [ ] F-004: Urdu deletion commands work
- [ ] F-006: Conversations persist after server restart
- [ ] F-006: Multi-instance requests maintain context
- [ ] F-007: ChatKit renders and accepts input
- [ ] F-007: Responsive on mobile/tablet/desktop
- [ ] F-008: All Urdu time expressions understood (subah/sham/kal/aaj)
- [ ] F-009: All 5 MCP tools respond with standard format
- [ ] F-009: MCP tools enforce user isolation
- [ ] F-010: Agent correctly maps intent to tool 95%+ of the time
- [ ] NFR-1: Response time < 3s (p95)
- [ ] NFR-4: JWT required, user_id from token only

### P1 (Optional)
- [ ] F-005: User updates task title/description via chat

---

**Specification Version**: 1.0
**Created**: 2026-02-18
**Status**: Ready for Planning
**Next Step**: Run `/sp.plan` to create `specs/phase3-chatbot/plan.md`

# Agents System — The Evolution of Todo

**Purpose**: Reusable intelligence and agent alignment for AI-assisted development
**Approach**: Spec-Driven Development (SDD) with specialist roles
**Constitution**: `.specify/memory/constitution.md` (v2.0.0, AUTHORITATIVE)

---

## Quick Start

### For AI Agents
1. **Read constitution first**: `@.specify/memory/constitution.md`
2. **Check current phase**: See constitution for active phase
3. **Reference main instructions**: `@agents/CLAUDE.md`
4. **Load specialist skills**: `@agents/skills/<domain>.md`
5. **Review project memory**: `@agents/memory/`

### For Developers
1. **Understand the workflow**: Spec → Plan → Tasks → Implement
2. **Use SDD commands**: `/sp.specify`, `/sp.plan`, `/sp.tasks`, `/sp.implement`
3. **Document decisions**: PHRs in `history/prompts/`, ADRs in `history/adr/`
4. **Follow specialists**: Domain-specific guidelines in `agents/skills/`

---

## Project Overview

### The Evolution of Todo
A 5-phase hackathon project demonstrating Spec-Driven Development (SDD) with AI-only implementation:

| Phase | Focus | Status | Stack |
|-------|-------|--------|-------|
| **I** | Console App | ✅ Complete | Python 3.13, in-memory |
| **II** | Web Application | 🟢 In Progress | FastAPI, Next.js, Neon PostgreSQL |
| **III** | AI Features | 📋 Planned | OpenAI, MCP servers, AI chatbot |
| **IV** | Kubernetes | 📋 Planned | K8s, Helm, monitoring |
| **V** | Production | 📋 Planned | CI/CD, observability, alerting |

### Current State (Phase II)
- ✅ Backend: 6 secure REST API endpoints with user isolation
- ✅ Frontend: Full-stack dashboard with 8 UI components
- ✅ Auth: JWT Bearer token verification (test mode)
- ✅ Database: Neon PostgreSQL with Alembic migrations
- ✅ Tests: 6 auth tests passing, integration tests ready
- 🟡 Pending: Better Auth integration, E2E tests, Docker Compose

---

## How to Use Specs

### Spec-First Development
**Core Principle**: Specifications are the single source of truth. Code implements specs, not the other way around.

### Spec Location
All specifications live in `specs/`:
- `specs/features/` — Feature requirements (what to build)
- `specs/api/` — API contracts (REST endpoints, request/response)
- `specs/ui/` — UI specifications (components, layouts, interactions)
- `specs/architecture/` — System design (patterns, principles)

### Reading Specs
Always reference specs with `@` notation:
```
@specs/features/task-crud.md     # Core CRUD operations
@specs/api/rest-endpoints.md     # API contracts
@specs/ui/task-interface.md      # UI requirements
```

### Before Every Implementation
```
1. Read spec: @specs/features/<feature>.md
2. Check constitution: @.specify/memory/constitution.md
3. Review history: @history/prompts/<feature>/
4. Plan: /sp.plan
5. Task breakdown: /sp.tasks
6. Implement: /sp.implement
7. Verify: Match acceptance criteria
8. Document: /sp.phr
```

---

## Specialist Roles

### When to Use Specialists
Each domain has detailed guidelines for code standards, patterns, and best practices.

| Domain | Specialist File | Use For |
|--------|----------------|---------|
| **Backend** | `@agents/skills/python-specialist.md` | FastAPI, SQLModel, JWT, asyncpg, Alembic, pytest |
| **Frontend** | `@agents/skills/frontend-architect.md` | Next.js, React, TypeScript, Tailwind, accessibility |
| **Testing** | `@agents/skills/qa-testing-specialist.md` | pytest, httpx, integration tests, E2E, coverage |
| **DevOps** | `@agents/skills/cloud-native-devops.md` | Docker, Kubernetes, CI/CD, monitoring, deployment |
| **AI/MCP** | `@agents/skills/ai-mcp-integration.md` | OpenAI integration, MCP servers, AI features (Phase III) |

### How Specialists Work
1. **Identify domain**: What are you building? (API, UI component, test, deployment)
2. **Load specialist**: Read `@agents/skills/<domain>.md`
3. **Apply patterns**: Follow code standards, conventions, examples
4. **Verify quality**: Check against specialist checklist

---

## Developer-Agent Alignment

### Core Alignment Rules

#### 1. Spec > Constitution > Code
- **Specs are law**: If spec says X, implement X (not what you think is better)
- **Constitution is foundation**: Project principles override personal preferences
- **Code is implementation**: Refactor to match spec, never change spec to match code

#### 2. Read Before You Code
```
❌ Bad: "I'll implement user authentication"
✅ Good: "I'll read @specs/features/auth.md, then implement per acceptance criteria"
```

#### 3. Ask When Unclear
```
❌ Bad: "I'll assume users want email login"
✅ Good: "Spec doesn't specify login method. Should I use email or username?"
```

#### 4. Document Decisions
```
❌ Bad: Make architectural decision silently
✅ Good: /sp.adr "Use JWT instead of sessions" + rationale
```

#### 5. Test Your Work
```
❌ Bad: "Implementation complete" (no tests)
✅ Good: "Implementation complete, 15 tests passing, 95% coverage"
```

### Communication Standards

#### Be Precise
```
❌ Bad: "Fixed the bug"
✅ Good: "Fixed null pointer in TaskForm.tsx:42 by adding null check"
```

#### Use References
```
❌ Bad: "Updated the file"
✅ Good: "Updated backend/app/models/task.py:25-30 to add user_id index"
```

#### Explain Why
```
❌ Bad: "Changed to async"
✅ Good: "Changed to async (per spec requirement for 100+ concurrent users)"
```

---

## Spec-Kit Plus MCP Integration

### What is Spec-Kit Plus?
Spec-Kit Plus is an **MCP (Model Context Protocol) server** that provides `/sp` commands for Spec-Driven Development. It's the engine behind the SDD workflow.

### Architecture
```
User Command (/sp.specify)
    ↓
Claude Code CLI (Skill tool)
    ↓
Spec-Kit Plus MCP Server
    ↓
├── Template System (.specify/templates/)
├── Spec Generator (spec.md creation)
├── Plan Generator (plan.md with task breakdown)
├── PHR System (history/prompts/)
├── Git Integration (commits, PRs)
└── Validation Engine (checklists, cross-checks)
    ↓
Output (specs, plans, tasks, PRs, PHRs)
```

### How MCP Commands Work

#### Command Flow
1. **User types**: `/sp.specify specs/features/auth.md "Authentication v1.0"`
2. **Claude Code**: Invokes `Skill` tool with command
3. **Spec-Kit Plus MCP**:
   - Loads template from `.specify/templates/spec-template.md`
   - Fills placeholders (title, date, phase, etc.)
   - Validates structure
   - Writes `specs/features/auth.md`
4. **Returns**: Complete spec with acceptance criteria

#### MCP Server Capabilities
- **Template Loading**: Reads from `.specify/templates/`
- **Spec Generation**: Creates structured specifications
- **Plan Generation**: Breaks specs into implementation tasks
- **PHR Creation**: Documents all decisions and work
- **Git Operations**: Commits, PR creation
- **Validation**: Checks consistency across artifacts
- **Cross-Artifact Analysis**: Verifies spec ↔ plan ↔ code alignment

### MCP Configuration
Located in project root (future):
```json
{
  "mcpServers": {
    "spec-kit-plus": {
      "command": "npx",
      "args": ["-y", "@anthropic-ai/mcp-spec-kit-plus"],
      "env": {
        "PROJECT_ROOT": "${PWD}"
      }
    }
  }
}
```

### Available /sp Commands

#### Specification Commands
| Command | MCP Action | Input | Output |
|---------|-----------|-------|--------|
| `/sp.specify <path> <title>` | Load template, fill, validate | Path, title | `spec.md` |
| `/sp.clarify` | Scan for ambiguities, generate questions | Spec file | 3-5 questions |
| `/sp.checklist` | Generate quality checklist | Spec | `checklists/requirements.md` |

#### Planning Commands
| Command | MCP Action | Input | Output |
|---------|-----------|-------|--------|
| `/sp.plan` | Parse spec, generate task breakdown | Spec | `plan.md` with waves |
| `/sp.adr <title>` | Load ADR template, document decision | Decision title | `adr/<id>-<title>.md` |

#### Implementation Commands
| Command | MCP Action | Input | Output |
|---------|-----------|-------|--------|
| `/sp.tasks` | Convert plan to actionable checklist | Plan | `tasks.md` with checkboxes |
| `/sp.implement` | Execute tasks with confirmation | Tasks | Code + tests |
| `/sp.analyze` | Cross-check all artifacts | All SDD files | Consistency report |

#### Version Control Commands
| Command | MCP Action | Input | Output |
|---------|-----------|-------|--------|
| `/sp.git.commit_pr` | Stage, commit, push, create PR | Git state | Commit + PR |
| `/sp.phr` | Capture conversation, generate PHR | Current context | PHR file |

#### Review Commands
| Command | MCP Action | Input | Output |
|---------|-----------|-------|--------|
| `/sp.review project` | Validate structure, specs, tests | Project | 8-point report |
| `/sp.reverse-engineer` | Analyze code, generate specs | Code dir | Spec files |

---

## MCP Integration Guidelines (All Phases)

### Phase II: Current MCP Usage
- **Spec-Kit Plus**: Active for `/sp` commands
- **Git Integration**: Automated commits and PRs
- **PHR Generation**: Automatic documentation

### Phase III: AI + MCP Expansion
When Phase III begins, additional MCP servers:
- **OpenAI MCP**: AI task suggestions, chatbot NLP
- **GitHub MCP**: Issue/PR automation, repo insights
- **Database MCP**: Query assistance, schema validation

### Phase IV-V: Operations MCP
- **Monitoring MCP**: Metrics, alerts, observability
- **Cloud MCP**: Resource management, scaling
- **CI/CD MCP**: Pipeline automation, deployment

### MCP Best Practices
1. **Use MCP tools first**: Check for MCP functionality before custom implementation
2. **Document MCP usage**: Note which servers were used in PHRs
3. **Fallback gracefully**: Handle MCP server unavailability
4. **Cache responses**: Reduce API calls, respect rate limits
5. **Validate outputs**: Always verify MCP-generated content

---

## Daily Workflow with /sp Commands

### Morning Standup (5 min)
```bash
# 1. Read constitution (refresh principles)
@.specify/memory/constitution.md

# 2. Review latest context
@history/prompts/general/  # Recent PHRs

# 3. Check current phase
# Constitution shows: Phase II - Web Application

# 4. Identify today's feature
# Example: Better Auth integration
```

### Feature Development (2-4 hours)
```bash
# 1. Create spec (Spec-Kit Plus MCP generates)
/sp.specify specs/features/better-auth.md "Better Auth Integration v1.0"

# 2. Clarify ambiguities (MCP scans for issues)
/sp.clarify

# 3. Generate implementation plan (MCP breaks down tasks)
/sp.plan

# 4. Break into tasks (MCP converts to checklist)
/sp.tasks

# 5. Implement task-by-task (Manual with agent)
/sp.implement

# 6. Verify consistency (MCP cross-checks)
/sp.analyze

# 7. Commit changes (MCP handles git + PR)
/sp.git.commit_pr
```

### End of Day (10 min)
```bash
# 1. Document today's work (MCP generates PHR)
/sp.phr

# 2. Update agent memory
# Add learnings to @agents/memory/learnings.md

# 3. Commit progress
/sp.git.commit_pr
```

---

## Agent Memory System

### Persistent Memory Files
Store learnings in `agents/memory/`:

- **learnings.md**: General lessons learned
- **gotchas.md**: Common mistakes and how to fix them
- **patterns.md**: Reusable code patterns that work well
- **decisions.md**: Key design decisions and rationale

### When to Update Memory
- ✅ Solved a tricky problem
- ✅ Found a better approach
- ✅ Discovered a constraint or limitation
- ✅ Learned something non-obvious about the stack
- ✅ Identified a common mistake to avoid

### Memory Format
```markdown
## [Date] Topic Title

**Problem**: Brief description
**Solution**: What worked
**Why**: Rationale
**Example**: Code snippet or command

**Tags**: #backend #auth #performance
```

---

## Subagent Development (Phase III+)

### What are Subagents?
Subagents are **specialized agents** for complex, multi-step, domain-specific tasks. They inherit base agent knowledge but add focused expertise.

### When to Create Subagents
- **Conversational AI** (Phase III): AI chatbot for natural language task management
- **Code Analysis**: Automated code review, technical debt detection
- **Test Generation**: Auto-generate tests from specs
- **Performance Optimization**: Profile and optimize slow code
- **Security Auditing**: Scan for vulnerabilities

### Subagent Architecture
```
agents/
├── CLAUDE.md                 # Base agent (inherited by all)
├── skills/                   # Domain specialists (inherited)
├── memory/                   # Shared memory (all agents)
└── subagents/                # Specialized subagents
    ├── ai-chatbot/           # Phase III: Conversational interface
    │   ├── CLAUDE.md         # Chatbot-specific instructions
    │   ├── prompts/          # Conversation templates
    │   ├── memory/           # Chatbot learning
    │   └── context/          # User preferences, history
    ├── code-reviewer/        # Automated code review
    │   ├── CLAUDE.md
    │   └── review-rules.md
    ├── test-generator/       # Test auto-generation
    │   ├── CLAUDE.md
    │   └── test-patterns.md
    └── task-analyzer/        # Intelligent task breakdown
        ├── CLAUDE.md
        └── analysis-rules.md
```

### Subagent Inheritance Model
```
Base Agent (@agents/CLAUDE.md)
    ↓ inherits
Specialist Skills (@agents/skills/*.md)
    ↓ inherits
Subagent (@agents/subagents/<name>/CLAUDE.md)
    ↓ adds
Domain-Specific Knowledge
```

### Creating a Subagent
```bash
# 1. Create directory structure
mkdir -p agents/subagents/ai-chatbot/{prompts,memory,context}

# 2. Create subagent instructions
# File: agents/subagents/ai-chatbot/CLAUDE.md

# 3. Document specialized behavior
- Conversation flow patterns
- Intent classification rules
- API integration methods
- Learning strategies

# 4. Define memory structure
- User preferences
- Conversation history
- Task patterns
- Success metrics
```

### Subagent Communication
Subagents can:
- **Read shared memory**: `@agents/memory/` (learnings, gotchas, patterns)
- **Write own memory**: `@agents/subagents/<name>/memory/`
- **Access base instructions**: `@agents/CLAUDE.md`
- **Use specialist skills**: `@agents/skills/*.md`
- **Invoke MCP servers**: Same access as base agent

---

## Phase III: AI Chatbot Subagent

### Chatbot Overview
Phase III introduces an AI-powered conversational interface for task management. The chatbot is implemented as a **subagent** with specialized NLP capabilities.

### Chatbot Capabilities
1. **Natural Language Understanding**: Parse user intent from conversational input
2. **Task Operations**: Create, read, update, delete tasks via voice commands
3. **Smart Suggestions**: Recommend task priorities, deadlines, breakdowns
4. **Context Awareness**: Remember user preferences, task history
5. **Multi-Turn Conversations**: Handle complex dialogues with context

### Chatbot Architecture
```
User Message ("Show my high priority tasks")
    ↓
AI Chatbot Subagent
    ↓
├── Intent Classification (via OpenAI MCP)
├── Context Loading (@agents/subagents/ai-chatbot/context/)
├── API Call (taskApi.list({ status: "pending", priority: "high" }))
├── Response Generation (natural language)
└── Memory Update (@agents/subagents/ai-chatbot/memory/)
    ↓
Chatbot Response ("You have 3 high priority tasks: ...")
```

### Chatbot Subagent Structure
```
agents/subagents/ai-chatbot/
├── CLAUDE.md                # Chatbot instructions
├── prompts/
│   ├── system-prompt.md     # Base system prompt
│   ├── intents.md           # Intent classification rules
│   └── responses.md         # Response templates
├── memory/
│   ├── conversations.md     # Past conversations
│   ├── user-patterns.md     # Common user requests
│   └── learning.md          # What worked/didn't work
└── context/
    ├── user-prefs.json      # User preferences
    └── task-history.json    # Recent task interactions
```

### Chatbot Development (Phase III)
```bash
# Step 1: Create subagent structure
/sp.setup subagent ai-chatbot

# Step 2: Define chatbot instructions
# Edit: agents/subagents/ai-chatbot/CLAUDE.md

# Step 3: Implement NLP integration
# Use OpenAI MCP for intent classification

# Step 4: Connect to task API
# Use existing taskApi from frontend/lib/api-client.ts

# Step 5: Test conversational flows
# Create test conversations in memory/
```

### Chatbot Intent Examples
```yaml
# agents/subagents/ai-chatbot/prompts/intents.md

Intents:
  - list_tasks:
      patterns: ["show my tasks", "what's on my list", "task list"]
      action: taskApi.list()

  - create_task:
      patterns: ["add task", "create new", "remind me to"]
      action: taskApi.create()

  - complete_task:
      patterns: ["mark done", "complete", "finish"]
      action: taskApi.toggleComplete()

  - suggest_tasks:
      patterns: ["what should I do", "next task", "suggestions"]
      action: AI analysis + recommendations
```

---

## Quality Standards

### Code Quality Checklist
Before marking work complete:
- [ ] Matches spec acceptance criteria exactly
- [ ] Type-safe (TypeScript/Python type hints)
- [ ] Error handling for all failure paths
- [ ] Tests written and passing
- [ ] User isolation enforced (if applicable)
- [ ] Accessibility standards met (if UI)
- [ ] No console errors or warnings
- [ ] Documentation/comments for public APIs
- [ ] PHR created documenting work

### Spec Quality Checklist
Before using spec for implementation:
- [ ] Clear, testable acceptance criteria
- [ ] No implementation details (what, not how)
- [ ] All edge cases covered
- [ ] Dependencies and assumptions identified
- [ ] Success metrics defined
- [ ] Out of scope explicitly listed
- [ ] No [NEEDS CLARIFICATION] markers
- [ ] Validated via checklist (/sp.checklist)

---

## SDD Command Reference

### Specification Commands
| Command | Purpose | Output |
|---------|---------|--------|
| `/sp.specify <path> <title>` | Create/update spec | `specs/features/<name>.md` |
| `/sp.clarify` | Identify underspecified areas | Questions + updated spec |
| `/sp.checklist` | Generate validation checklist | `specs/<feature>/checklists/` |

### Planning Commands
| Command | Purpose | Output |
|---------|---------|--------|
| `/sp.plan` | Generate implementation plan | `specs/main/plan.md` |
| `/sp.adr <title>` | Document architectural decision | `history/adr/<id>-<title>.md` |

### Implementation Commands
| Command | Purpose | Output |
|---------|---------|--------|
| `/sp.tasks` | Break plan into tasks | `specs_history/<name>.tasks.md` |
| `/sp.implement` | Execute task-by-task | Code + tests |
| `/sp.analyze` | Verify consistency | Analysis report |

### Version Control Commands
| Command | Purpose | Output |
|---------|---------|--------|
| `/sp.git.commit_pr` | Commit + create PR | Git commit + PR |
| `/sp.phr` | Create Prompt History Record | `history/prompts/<route>/<id>-<title>.prompt.md` |

### Review Commands
| Command | Purpose | Output |
|---------|---------|--------|
| `/sp.review project` | Full health check | Status report |
| `/sp.reverse-engineer` | Extract specs from code | Generated specs |

---

## Success Criteria

### You're Doing Well When
- ✅ Every implementation matches its spec exactly
- ✅ All tests pass on first try
- ✅ PHRs are created consistently for every feature
- ✅ No assumptions made without spec verification
- ✅ Code is clean, tested, and documented
- ✅ Specialist guidelines followed for each domain
- ✅ User feedback is positive
- ✅ Features work end-to-end
- ✅ MCP commands used effectively
- ✅ Subagents developed for complex tasks (Phase III+)

### Red Flags
- ❌ Implementing before reading spec
- ❌ Tests written after implementation fails
- ❌ Missing PHRs for significant work
- ❌ Skipping specialist guidelines
- ❌ Assuming requirements without checking
- ❌ No error handling
- ❌ Accessibility ignored
- ❌ Not using available MCP tools

---

## Quick Reference

**Main Instructions**: `@agents/CLAUDE.md`
**Constitution**: `@.specify/memory/constitution.md`
**Specialists**: `@agents/skills/<domain>.md`
**Memory**: `@agents/memory/`
**Subagents**: `@agents/subagents/<name>/`
**Specs**: `@specs/features/`
**History**: `@history/prompts/`, `@history/adr/`

**Workflow**: Spec → Plan → Tasks → Implement → Test → Document → Commit

**MCP**: All `/sp` commands via Spec-Kit Plus MCP server
**Phase III**: AI Chatbot subagent for conversational task management

**Remember**: You're building a system that evolves through 5 phases. Every decision, every line of code, every test matters. Follow the specs, use the specialists, leverage MCP tools, develop subagents when needed, and keep the human in the loop!

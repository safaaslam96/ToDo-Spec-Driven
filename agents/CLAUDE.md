# Agent Instructions — The Evolution of Todo

**Project**: The Evolution of Todo  
**Current Phase**: Phase II — Full-Stack Web Application  
**Constitution**: `.specify/memory/constitution.md` (v2.0.0, AUTHORITATIVE)  
**Workflow**: Spec-Driven Development (SDD)

---

## Core Principles

### Single Source of Truth
1. **Specs are law**: Always defer to `specs/` directory for requirements
2. **Constitution is foundation**: Read `.specify/memory/constitution.md` at session start
3. **PHRs track history**: `history/prompts/` contains all decision context
4. **Never assume**: Verify facts via specs, constitution, or code inspection

### Developer-Agent Alignment
- **Read before you code**: Always read the spec file before implementing
- **Ask when unclear**: Use clarifying questions instead of assumptions
- **Document decisions**: Create PHRs for significant choices
- **Test your work**: Verify implementation matches acceptance criteria
- **Communicate clearly**: Explain what you're doing and why

---

## Project Structure

```
/
├── .specify/
│   ├── memory/
│   │   └── constitution.md      # v2.0.0 AUTHORITATIVE
│   ├── templates/               # PHR and spec templates
│   └── scripts/                 # Automation helpers
├── agents/
│   ├── CLAUDE.md               # This file
│   ├── skills/                 # Specialist role guidelines
│   ├── subagents/              # Future subagent implementations
│   └── memory/                 # Persistent agent memory
├── specs/
│   ├── features/               # Feature requirements
│   ├── api/                    # API contracts
│   ├── ui/                     # UI specifications
│   └── architecture/           # System design docs
├── history/
│   ├── prompts/                # PHRs (Prompt History Records)
│   └── adr/                    # Architecture Decision Records
├── backend/                    # FastAPI application
├── frontend/                   # Next.js application
├── src/todo_app/               # Phase I (FROZEN)
└── skills/                     # Legacy specialist folders (Phase II)
```

---

## How to Use Specs

### Reading Specs
Always reference specs with `@` notation:
- `@specs/features/task-crud.md` — Core CRUD operations
- `@specs/api/rest-endpoints.md` — API contracts
- `@specs/ui/task-interface.md` — UI requirements
- `@specs/architecture/system-design.md` — Architecture overview

### Before Every Implementation
1. **Read the spec**: `@specs/features/<feature>.md`
2. **Check constitution**: `.specify/memory/constitution.md`
3. **Review PHRs**: `history/prompts/<feature>/` for context
4. **Plan approach**: Break into small, testable steps
5. **Implement**: Follow spec acceptance criteria exactly
6. **Verify**: Test against spec requirements
7. **Document**: Create PHR with `/sp.phr`

### Spec Lifecycle
```
User Request → /sp.specify → spec.md → /sp.plan → plan.md → 
/sp.tasks → tasks.md → /sp.implement → Code → Tests → Done
```

---

## Specialist Roles

When working on specific domains, reference specialist guidelines:

| Domain | File | Use For |
|--------|------|---------|
| **Backend** | `@agents/skills/python-specialist.md` | FastAPI, SQLModel, JWT, asyncpg, Alembic |
| **Frontend** | `@agents/skills/frontend-architect.md` | Next.js, TypeScript, Tailwind, React |
| **Testing** | `@agents/skills/qa-testing-specialist.md` | pytest, httpx, integration tests, E2E |
| **DevOps** | `@agents/skills/cloud-native-devops.md` | Docker, Kubernetes, CI/CD, monitoring |
| **AI/MCP** | `@agents/skills/ai-mcp-integration.md` | Phase III — AI features, MCP servers |

**How to Use Specialists**:
1. Identify the domain (backend, frontend, testing, etc.)
2. Read the relevant skill file: `@agents/skills/<specialist>.md`
3. Follow the guidelines and conventions
4. Apply specialist knowledge to your implementation

---

## SDD Workflow Commands

### Specification Phase
- `/sp.specify <path> <title>` — Create or update feature spec
- `/sp.clarify` — Identify underspecified areas
- `/sp.checklist` — Generate validation checklist

### Planning Phase
- `/sp.plan` — Generate implementation plan from spec
- `/sp.adr <title>` — Document architectural decisions

### Implementation Phase
- `/sp.tasks` — Break plan into granular tasks
- `/sp.implement` — Execute task-by-task implementation
- `/sp.analyze` — Verify consistency across artifacts

### Version Control
- `/sp.git.commit_pr` — Commit changes and create PR
- `/sp.phr` — Create Prompt History Record

### Review & Validation
- `/sp.review project` — Full project health check
- `sp.reverse-engineer` — Extract specs from existing code

---

## MCP Integration (Phase III+)

### Available MCP Servers
When Phase III begins, integrate with:
- **OpenAI MCP**: For AI task suggestions
- **GitHub MCP**: For issue/PR automation
- **Database MCP**: For query assistance
- **Monitoring MCP**: For observability

### MCP Best Practices
1. **Use MCP tools first**: Check for MCP-provided tools before implementing
2. **Document MCP usage**: Note which MCP servers were used
3. **Fallback gracefully**: Handle MCP unavailability
4. **Cache MCP responses**: Reduce API calls when possible

---

## Daily Workflow

### Morning Standup
1. Read `.specify/memory/constitution.md` (refresh on principles)
2. Review latest PHRs in `history/prompts/general/`
3. Check current phase in constitution
4. Identify today's feature/task

### Feature Development
```bash
# 1. Specify
/sp.specify specs/features/my-feature.md "Feature Title v1.0"

# 2. Clarify (if needed)
/sp.clarify

# 3. Plan
/sp.plan

# 4. Break into tasks
/sp.tasks

# 5. Implement
/sp.implement

# 6. Verify
/sp.analyze

# 7. Commit
/sp.git.commit_pr
```

### End of Day
1. Create PHR: `/sp.phr`
2. Update memory: Document learnings in `agents/memory/`
3. Commit work: `/sp.git.commit_pr`

---

## Error Recovery

### When Stuck
1. **Re-read the spec**: `@specs/features/<feature>.md`
2. **Check constitution**: Look for relevant principles
3. **Review PHRs**: Search for similar past decisions
4. **Ask for clarification**: Use `/sp.clarify` or direct questions
5. **Break it down**: Use `/sp.tasks` to make it smaller

### When Tests Fail
1. **Read test output carefully**: Identify exact failure
2. **Check acceptance criteria**: Verify against spec
3. **Inspect implementation**: Compare code to spec requirements
4. **Fix root cause**: Don't just make tests pass
5. **Re-run tests**: Verify fix works

### When Specs Conflict
1. **Constitution wins**: `.specify/memory/constitution.md` is authoritative
2. **Ask user**: Use clarifying questions
3. **Document decision**: Create ADR if architecturally significant
4. **Update specs**: Fix the conflict for future reference

---

## Quality Standards

### Code Quality
- **Type safety**: Use TypeScript (frontend) and type hints (backend)
- **Error handling**: Never fail silently
- **Testing**: Unit tests for logic, integration tests for APIs
- **Documentation**: Docstrings for public APIs
- **Linting**: Follow project linting rules

### Spec Quality
- **Clear requirements**: Testable, unambiguous acceptance criteria
- **No implementation details**: What, not how
- **Complete**: All edge cases covered
- **Validated**: Passes checklist review

### Communication Quality
- **Be concise**: Get to the point quickly
- **Be precise**: Use exact file paths and line numbers
- **Be helpful**: Explain why, not just what
- **Be honest**: Say "I don't know" instead of guessing

---

## Memory Management

### Persistent Memory
Store learnings in `agents/memory/`:
- `learnings.md` — General lessons learned
- `gotchas.md` — Common mistakes and fixes
- `patterns.md` — Reusable code patterns
- `decisions.md` — Key design decisions

### Update Memory When
- You solve a tricky problem
- You find a better approach
- You discover a constraint or limitation
- You learn something non-obvious

---

## Success Criteria

You're doing well when:
- ✅ Every implementation matches its spec exactly
- ✅ All tests pass on first try
- ✅ PHRs are created consistently
- ✅ No assumptions are made without verification
- ✅ Code is clean, tested, and documented
- ✅ User feedback is positive
- ✅ Features work end-to-end

---

## Quick Reference

**Before coding**: Read spec, constitution, PHRs  
**While coding**: Follow specialist guidelines, test frequently  
**After coding**: Verify against acceptance criteria, create PHR  
**When stuck**: Re-read spec, check constitution, ask questions  
**Single source of truth**: Spec > Constitution > Code  

**Remember**: You're not just writing code — you're building a system that evolves from console app to cloud-native platform. Every decision matters!

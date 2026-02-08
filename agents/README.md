# Agents System — The Evolution of Todo

This directory contains the **reusable intelligence system** for AI-assisted development following the Hackathon II documentation.

---

## 📂 Directory Structure

```
agents/
├── CLAUDE.md                    # Main agent instructions (workflow, commands)
├── README.md                    # This file
├── skills/                      # Specialist role guidelines
│   ├── python-specialist.md     # Backend (FastAPI, SQLModel, JWT)
│   ├── frontend-architect.md    # Frontend (Next.js, React, TypeScript)
│   ├── qa-testing-specialist.md # Testing (pytest, integration tests)
│   ├── cloud-native-devops.md   # DevOps (Docker, K8s, CI/CD)
│   └── ai-mcp-integration.md    # AI features (OpenAI, MCP servers)
├── subagents/                   # Future: specialized subagent implementations
└── memory/                      # Persistent agent memory
    ├── learnings.md             # Lessons learned during development
    ├── gotchas.md               # Common mistakes to avoid
    ├── patterns.md              # Reusable code patterns
    └── decisions.md             # Key design decisions
```

---

## 🚀 Quick Start

### For AI Agents
1. **Read main instructions**: `@agents/CLAUDE.md`
2. **Check project overview**: `@AGENTS.md` (root)
3. **Load specialist skills**: `@agents/skills/<domain>.md`
4. **Review memory**: `@agents/memory/` for context

### For Developers
1. **Understand the system**: Read `AGENTS.md` in project root
2. **Use specialist guidelines**: Reference appropriate skill file when working in a domain
3. **Contribute to memory**: Add learnings, gotchas, patterns, decisions as you discover them
4. **Follow SDD workflow**: Spec → Plan → Tasks → Implement → Test → Document

---

## 📚 What Each File Does

### `CLAUDE.md`
Main agent instructions covering:
- Project structure and navigation
- How to use specs (`@specs/features/`)
- Specialist roles and when to use them
- SDD workflow commands (`/sp.specify`, `/sp.plan`, etc.)
- MCP integration guidelines
- Daily workflow (morning standup, feature dev, end of day)
- Error recovery strategies
- Quality standards

### Specialist Skill Files

#### `skills/python-specialist.md`
- FastAPI patterns (dependency injection, response models)
- SQLModel/asyncpg database patterns
- JWT authentication implementation
- User isolation enforcement
- Testing with pytest and httpx
- Alembic migrations
- Security best practices

#### `skills/frontend-architect.md`
- Next.js 16 App Router patterns
- React component patterns (functional, hooks)
- TypeScript strict mode standards
- Tailwind CSS utility classes
- API client with JWT authentication
- Accessibility standards (WCAG AA)
- Form patterns and validation

#### `skills/qa-testing-specialist.md`
- Testing strategy (test pyramid)
- pytest patterns and fixtures
- Integration testing for APIs
- E2E testing (Playwright, future)
- Test coverage goals
- Quality checklists

#### `skills/cloud-native-devops.md`
- Docker Compose (Phase II)
- Kubernetes manifests (Phase IV)
- CI/CD pipelines (Phase V)
- Monitoring and observability
- Environment management
- Deployment strategies

#### `skills/ai-mcp-integration.md`
- OpenAI integration for task suggestions (Phase III)
- MCP server configuration
- AI features implementation
- Rate limiting and cost management
- Testing AI features

### Memory Files

#### `memory/learnings.md`
**What**: Lessons learned from solving problems  
**When to update**: After solving a tricky problem, finding a better approach  
**Format**: Problem → Solution → Why → Example → Tags

#### `memory/gotchas.md`
**What**: Common mistakes and how to avoid them  
**When to update**: When you encounter a mistake that others might make  
**Format**: ❌ Bad → ✅ Good with explanation

#### `memory/patterns.md`
**What**: Proven code patterns that work well  
**When to update**: When you create a reusable pattern  
**Format**: Pattern name → Code example → Explanation

#### `memory/decisions.md`
**What**: Significant design decisions and rationale  
**When to update**: After making architectural decisions  
**Format**: Decision → Rationale → Trade-offs → Status

---

## 🔄 Workflow Integration

### Spec-Driven Development (SDD)
The agents system integrates with SDD workflow:

```
1. /sp.specify → Create spec (@specs/features/)
2. /sp.plan → Generate plan (references specialist skills)
3. /sp.tasks → Break into tasks
4. /sp.implement → Execute (uses specialist patterns)
5. /sp.analyze → Verify consistency
6. /sp.git.commit_pr → Commit
7. /sp.phr → Document in history/prompts/
```

### When to Use Specialists
- **Backend work** → `@agents/skills/python-specialist.md`
- **Frontend work** → `@agents/skills/frontend-architect.md`
- **Writing tests** → `@agents/skills/qa-testing-specialist.md`
- **Deployment** → `@agents/skills/cloud-native-devops.md`
- **AI features** → `@agents/skills/ai-mcp-integration.md`

---

## 🎯 Goals of This System

1. **Reusability**: Capture knowledge once, use many times
2. **Consistency**: All agents follow same patterns and standards
3. **Learning**: Build on previous experiences, avoid repeated mistakes
4. **Alignment**: Developers and AI agents work from shared understanding
5. **Quality**: Maintain high code quality through documented best practices

---

## 🔧 Maintenance

### Adding New Learnings
When you discover something new:
1. Determine type: learning, gotcha, pattern, or decision
2. Add to appropriate memory file
3. Use consistent format (see file headers)
4. Tag for discoverability

### Updating Specialist Skills
When best practices evolve:
1. Update relevant skill file
2. Document what changed and why
3. Update examples to match new approach

### Creating New Specialists
If a new domain emerges (e.g., mobile, ML):
1. Create `skills/new-specialist.md`
2. Follow existing skill file structure
3. Document: stack, responsibilities, patterns, gotchas
4. Reference from `CLAUDE.md` and `AGENTS.md`

---

## 📖 Learn More

- **Project Root**: `../AGENTS.md` — Comprehensive agent system overview
- **Constitution**: `../.specify/memory/constitution.md` — Project principles (v2.0.0)
- **Specs**: `../specs/` — Feature specifications
- **History**: `../history/prompts/` — Prompt History Records

---

**Remember**: This agents system is a living document. Keep it updated as you learn and grow!

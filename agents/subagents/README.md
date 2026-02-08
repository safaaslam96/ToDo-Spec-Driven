# Subagents Directory — The Evolution of Todo

**Purpose**: Specialized agents for complex, domain-specific tasks  
**Phase**: III+ (AI Chatbot is first subagent)  
**Inheritance**: Base Agent → Specialist Skills → Subagent

---

## What are Subagents?

Subagents are **specialized AI agents** that inherit base agent knowledge but add focused expertise for specific tasks:

- **AI Chatbot** (Phase III): Natural language task management
- **Code Reviewer**: Automated code review against specs
- **Test Generator**: Auto-generate tests from specifications
- **Task Analyzer**: Intelligent task breakdown with AI suggestions
- **Performance Optimizer**: Profile and optimize application performance

---

## Subagent Structure

Each subagent follows this structure:

```
subagents/<name>/
├── CLAUDE.md              # Subagent-specific instructions
├── prompts/               # Domain-specific prompts/templates
├── memory/                # Subagent learning and patterns
├── context/               # Runtime context (user prefs, state)
└── README.md              # Subagent documentation
```

---

## Creating a New Subagent

### Step 1: Create Directory Structure
```bash
mkdir -p agents/subagents/my-subagent/{prompts,memory,context}
```

### Step 2: Create CLAUDE.md
Document subagent-specific instructions:
```markdown
# My Subagent — The Evolution of Todo

**Purpose**: [What this subagent does]  
**Domain**: [Specific domain/task]  
**Inherits**: Base Agent + [Relevant Specialists]

## Core Responsibilities
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Additional responsibilities]

## Specialized Knowledge
[Domain-specific patterns, rules, constraints]

## Integration Points
- API: [How it calls backend/frontend]
- MCP: [Which MCP servers it uses]
- Memory: [What it stores and where]
```

### Step 3: Define Prompts
Create domain-specific prompt templates in `prompts/`

### Step 4: Initialize Memory
Create initial memory files in `memory/`:
- `learnings.md` — Domain-specific lessons
- `patterns.md` — Reusable patterns for this domain
- `decisions.md` — Key design decisions

### Step 5: Document Context
Define what context the subagent needs in `context/`

---

## Phase III: AI Chatbot Subagent (First Subagent)

### Overview
The AI Chatbot is the first subagent, providing natural language interface for task management.

### Directory Structure
```
ai-chatbot/
├── CLAUDE.md                 # Chatbot instructions
├── README.md                 # Chatbot documentation
├── prompts/
│   ├── system-prompt.md      # Base system prompt
│   ├── intents.md            # Intent classification
│   ├── responses.md          # Response templates
│   └── examples.md           # Conversation examples
├── memory/
│   ├── conversations.md      # Successful conversations
│   ├── user-patterns.md      # Common user behaviors
│   ├── failures.md           # Failed interactions + fixes
│   └── learning.md           # Continuous learning log
└── context/
    ├── user-preferences.json # User settings
    ├── task-history.json     # Recent task interactions
    └── conversation-state.json # Multi-turn context
```

### Chatbot Capabilities
1. **Intent Classification**: Understands user requests
2. **Task Operations**: CRUD via natural language
3. **Smart Suggestions**: AI-powered recommendations
4. **Context Memory**: Remembers user preferences
5. **Multi-Turn Dialogue**: Handles complex conversations

### Development Timeline
- **Week 1**: Set up structure, define intents
- **Week 2**: Implement OpenAI MCP integration
- **Week 3**: Connect to task API, test flows
- **Week 4**: User testing, refinement, learning

---

## Future Subagents (Phase IV+)

### Code Reviewer Subagent
**Purpose**: Automated code review against specifications  
**Capabilities**:
- Compare implementation vs spec acceptance criteria
- Detect spec violations
- Security vulnerability scanning
- Performance anti-patterns
- Suggest improvements

### Test Generator Subagent
**Purpose**: Auto-generate tests from specifications  
**Capabilities**:
- Parse spec acceptance criteria
- Generate unit tests
- Generate integration tests
- Generate E2E test scenarios
- Test edge cases

### Task Analyzer Subagent
**Purpose**: Intelligent task breakdown and analysis  
**Capabilities**:
- Break large tasks into subtasks
- Estimate effort and complexity
- Identify dependencies
- Suggest task ordering
- Detect potential blockers

### Performance Optimizer Subagent
**Purpose**: Profile and optimize application performance  
**Capabilities**:
- Identify slow queries
- Detect N+1 problems
- Suggest caching strategies
- Database index recommendations
- Frontend bundle analysis

---

## Subagent Communication

### Inheritance Model
```
Base Agent (@agents/CLAUDE.md)
    ↓
Specialist Skills (@agents/skills/*.md)
    ↓
Shared Memory (@agents/memory/)
    ↓
Subagent (@agents/subagents/<name>/CLAUDE.md)
    ↓
Subagent Memory (@agents/subagents/<name>/memory/)
```

### Inter-Subagent Communication (Future)
Subagents can communicate via:
1. **Shared Memory**: Read/write to `@agents/memory/`
2. **Message Queue**: Async task delegation
3. **Context Passing**: Hand off conversations
4. **Learning Sharing**: Share patterns and gotchas

---

## Best Practices

### When to Create a Subagent
✅ **Yes** - Create subagent when:
- Task is complex and multi-step
- Domain-specific expertise required
- Long-running or conversational
- Needs isolated memory/context
- Will be reused across phases

❌ **No** - Don't create subagent when:
- Simple, one-off task
- Base agent + specialist sufficient
- No need for persistent state
- Task completes in single interaction

### Subagent Design Principles
1. **Single Responsibility**: Each subagent has one clear purpose
2. **Inheritance First**: Inherit from base, only add what's unique
3. **Memory Discipline**: Only store domain-specific learnings
4. **MCP Integration**: Use available MCP servers
5. **Testability**: Define success criteria and test cases

---

## Monitoring Subagents

### Success Metrics
- **Task Completion Rate**: % of tasks successfully completed
- **User Satisfaction**: Feedback ratings
- **Response Quality**: Accuracy of responses
- **Learning Rate**: Improvement over time

### Failure Analysis
When subagent fails:
1. Document in `memory/failures.md`
2. Analyze root cause
3. Update `memory/learning.md`
4. Refine `CLAUDE.md` instructions

---

## Quick Reference

**Create subagent**: `mkdir -p agents/subagents/<name>/{prompts,memory,context}`  
**Document instructions**: Create `<name>/CLAUDE.md`  
**Define prompts**: Add templates to `<name>/prompts/`  
**Initialize memory**: Create `<name>/memory/learnings.md`  
**First subagent**: `ai-chatbot/` (Phase III)

**Inherit from**: Base Agent + Specialists + Shared Memory  
**Add**: Domain-specific knowledge, prompts, memory, context

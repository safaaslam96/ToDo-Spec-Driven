# Key Design Decisions — The Evolution of Todo

**Purpose**: Record significant design decisions and their rationale  
**Updated**: 2026-02-08

---

## Phase II Design Decisions

### User Isolation: 404 vs 403
**Decision**: Return 404 (not 403) when user tries to access another user's task  
**Rationale**: Prevents enumeration attacks (attacker can't tell if task exists)  
**Trade-off**: Less explicit error message, but more secure  
**Date**: 2026-02-07  
**Status**: ✅ Implemented

### JWT Storage: localStorage vs httpOnly Cookie
**Decision**: Use localStorage for MVP (test auth), migrate to httpOnly cookie for Better Auth  
**Rationale**: Simpler for MVP, more secure option available for production  
**Trade-off**: localStorage vulnerable to XSS, but acceptable for testing  
**Date**: 2026-02-08  
**Status**: 🟡 Temporary (will upgrade)

### API Path: /api/tasks vs /api/users/{id}/tasks
**Decision**: Use `/api/tasks` with user_id from JWT (not path)  
**Rationale**: Simpler, prevents user_id forgery, cleaner API  
**Trade-off**: Less RESTful resource nesting, but more secure  
**Date**: 2026-02-07  
**Status**: ✅ Implemented

### Component Library: Custom vs Headless UI
**Decision**: Build custom components with Tailwind (no third-party)  
**Rationale**: Full control, no dependencies, matches design system exactly  
**Trade-off**: More initial work, but better maintainability  
**Date**: 2026-02-08  
**Status**: ✅ Implemented (8 components)

### Database: Neon vs Self-Hosted PostgreSQL
**Decision**: Use Neon Serverless PostgreSQL  
**Rationale**: Serverless, auto-scaling, easier for MVP, good for Phase IV  
**Trade-off**: Vendor lock-in, but migration path available  
**Date**: 2026-02-07  
**Status**: ✅ Implemented

### Frontend Framework: Next.js vs Remix vs SvelteKit
**Decision**: Next.js 16 with App Router  
**Rationale**: Best React framework, great docs, large ecosystem  
**Trade-off**: Heavier than alternatives, but most mature  
**Date**: 2026-02-07  
**Status**: ✅ Implemented

### Testing Strategy: Unit First vs E2E First
**Decision**: Integration tests for APIs, unit tests for business logic, E2E for critical paths  
**Rationale**: Follows test pyramid, best ROI  
**Trade-off**: E2E tests are slower but catch more bugs  
**Date**: 2026-02-08  
**Status**: 🟡 In Progress

---

## Phase III Planned Decisions

### AI Provider: OpenAI vs Anthropic vs Local LLM
**Status**: 📋 To Be Decided  
**Options**:
- OpenAI GPT-4: Best quality, expensive
- Anthropic Claude: Good quality, less expensive
- Local LLM: Free, but requires hosting

### MCP Servers: Which to Use
**Status**: 📋 To Be Decided  
**Candidates**:
- @anthropic-ai/mcp-server-openai (definitely)
- @anthropic-ai/mcp-server-github (probably)
- @anthropic-ai/mcp-server-postgres (maybe)

---

## Add New Decisions
Document significant decisions as you make them, especially if they:
- Affect multiple phases
- Have architectural implications
- Involve trade-offs
- Could be questioned later

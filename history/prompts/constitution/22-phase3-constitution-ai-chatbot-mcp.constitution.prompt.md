---
id: 22
title: Phase III Constitution — AI Chatbot MCP
stage: constitution
date: 2026-02-18
surface: agent
model: claude-opus-4-6
feature: phase3-chatbot
branch: 1-rest-api-spec
user: safaaslam96
command: /sp.constitution
labels: ["constitution", "phase3", "mcp", "openai-agents-sdk", "chatkit", "stateless", "urdu"]
links: {spec: null, ticket: null, adr: null, pr: null}
files: [".specify/memory/constitution.md", ".specify/templates/plan-template.md"]
tests: ["Verified constitution v3.0.0 written", "Verified plan-template Constitution Check gate updated"]
---

## Prompt

User provided the full Phase III constitutional document titled:
"Phase III: AI-Powered Todo Chatbot — Constitutional Document for MCP-Based Conversational Task Management"

The document defines five immutable constitutional articles:
- Article I: Stateless Architecture
- Article II: MCP-First Tool Design
- Article III: OpenAI Agents SDK Integration
- Article IV: ChatKit Frontend
- Article V: Multi-Language Support (Urdu)

Executed via `/sp.constitution` skill.

## Response snapshot

Updated `.specify/memory/constitution.md` from **v2.0.0 → v3.0.0** (MAJOR bump).

**Changes made:**
- Retained all Phase II principles (I–VI) verbatim
- Added Phase III Mission & Vision
- Added 5 immutable constitutional Articles (I–V) with mandatory requirements, contracts, and rationale
- Added Phase III Technology Stack (OpenAI Agents SDK, MCP SDK ≥1.0.0, ChatKit)
- Added Phase III Project Structure addendum (new routes, services, models)
- Added Phase III Database Schema: `Conversation` and `Message` SQLModel models
- Added Phase III API endpoint: `POST /api/{user_id}/chat` with request/response contract
- Added Stateless Request Cycle (9-step mandatory pattern)
- Added MCP Tools Specification table (5 tools with full parameter/return contracts)
- Added Phase III Success Criteria (functional + technical + process checklists)
- Added Phase III Anti-Patterns table (prohibited vs required alternatives)
- Updated Governance section with Phase III Constitution Check gate description
- Updated `.specify/templates/plan-template.md` — Constitution Check gate now has explicit Phase II (6 gates) and Phase III (5 gates) checklists

**Version bump rationale:** MAJOR — Five new immutable Articles introduce mandatory architecture (stateless server, Official MCP SDK, OpenAI Agents SDK, ChatKit UI) that are backward-incompatible with any prior custom chat implementations.

**TODOs deferred:**
- `TODO(OPENAI_DOMAIN_KEY)`: Configure after Vercel deployment
- `TODO(CHATKIT_VERSION)`: Pin exact version after stable release
- `TODO(MCP_SDK_VERSION)`: Pin after integration testing
- `.specify/config.yaml`: Add `phase3-chatbot` phase entry manually

## Outcome

- ✅ Impact: Constitution v3.0.0 ratified with 5 immutable Phase III Articles governing stateless architecture, MCP-first design, OpenAI Agents SDK, ChatKit UI, and Urdu multi-language support
- 🧪 Tests: Manual verification — constitution written, plan-template updated, YAML valid
- 📁 Files: 2 files updated (.specify/memory/constitution.md, .specify/templates/plan-template.md)
- 🔁 Next prompts: /sp.specify for Phase III chatbot feature, /sp.plan, /sp.tasks, /sp.implement
- 🧠 Reflection: Clean MAJOR version bump. Phase II principles preserved intact. Phase III articles are precise, testable, and carry explicit rationale. Anti-patterns table makes prohibited approaches unambiguous.

## Evaluation notes (flywheel)

- Failure modes observed: PHR creation script unavailable — used agent-native write
- Graders run and results (PASS/FAIL): YAML validation PASS (inline format used throughout)
- Prompt variant (if applicable): /sp.constitution with full constitutional document provided as user input
- Next experiment (smallest change to try): Run /sp.specify to create Phase III feature spec, then /sp.plan

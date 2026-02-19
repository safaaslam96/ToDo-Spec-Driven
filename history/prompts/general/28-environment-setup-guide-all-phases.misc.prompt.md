---
id: 28
title: Environment Setup Guide All Phases
stage: misc
date: 2026-02-18
surface: agent
model: claude-opus-4-6
feature: none
branch: 1-rest-api-spec
user: safaaslam96
command: review
labels: ["environment", "setup", "config", "deployment", "env-vars", "installation"]
links: {spec: "specs/master-plan.md", ticket: null, adr: null, pr: null}
files:
 - backend/.env.example
 - frontend/.env.example
 - frontend/.env.local
tests:
 - backend/.env.example verified: OPENAI_API_KEY and OPENAI_MODEL present
 - Confirmed BETTER_AUTH_SECRET (not JWT_SECRET) in actual backend config
 - Confirmed postgresql+asyncpg:// prefix required for async engine
---

## Prompt

User provided a comprehensive environment setup guide covering all environment variables,
installation commands, and run commands for all phases of the project:

- Phase I: Python console app (uv, src/todo_app/)
- Phase II: FastAPI backend + Next.js frontend + Neon PostgreSQL
- Phase III: AI chatbot (OpenAI API key additions)
- Phase IV: Kubernetes (minikube)
- Phase V: Oracle Cloud (OKE)

Guide included: all env vars, installation steps, run commands, database setup, deployment targets.

## Response snapshot

Reviewed existing project env files against the provided guide. Key findings:

1. `backend/.env.example` already has:
   - `DATABASE_URL=postgresql+asyncpg://...` (asyncpg prefix required — async backend)
   - `BETTER_AUTH_SECRET=...` (actual var name — guide incorrectly showed `JWT_SECRET`)
   - `OPENAI_API_KEY=sk-proj-your-openai-api-key-here` (Phase III ready)
   - `OPENAI_MODEL=gpt-4o-mini` (override with `OPENAI_MODEL=gpt-4o` for production)

2. `frontend/.env.example` and `frontend/.env.local` both exist.

**Critical discrepancies between guide and actual project:**
- Guide shows `JWT_SECRET` → actual project uses `BETTER_AUTH_SECRET`
- Guide shows `postgresql://` → actual project requires `postgresql+asyncpg://`

## Outcome

- ✅ Impact: Environment configuration verified against actual project setup. Two critical discrepancies documented.
- 🧪 Tests: No tests run; config review only.
- 📁 Files: Read backend/.env.example, frontend/.env.example, frontend/.env.local
- 🔁 Next prompts: /sp.git.commit_pr — commit all Phase III work + create PR
- 🧠 Reflection: Always use BETTER_AUTH_SECRET (not JWT_SECRET) and postgresql+asyncpg:// (not postgresql://) when configuring this project.

## Evaluation notes (flywheel)

- Failure modes observed: Env guide had wrong var names (JWT_SECRET, wrong DB prefix) — discovered by cross-referencing actual .env.example
- Graders run and results (PASS/FAIL): Config review PASS — all required vars present in .env.example
- Prompt variant (if applicable): Environment guide review
- Next experiment (smallest change to try): Run backend locally to verify OPENAI_API_KEY works with gpt-4o-mini

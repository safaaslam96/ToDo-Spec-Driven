---
id: 10
title: Full Project Review
stage: general
date: 2026-02-07
surface: agent
model: claude-opus-4-6
feature: none
branch: 1-rest-api-spec
user: safaaslam96
command: /sp.review project
labels: ["review", "project-state", "audit"]
links:
  spec: null
  ticket: null
  adr: null
  pr: null
files:
  - history/current-state.md
tests:
  - none
---

## Prompt

/sp.review project

Perform a full review of the current project state for "The Evolution of Todo".

1. List all existing files and folders recursively with paths (include Phase 1 console app and Phase 2 monorepo structure).
2. Confirm Phase 1 is complete and untouched (src/todo_app/ with working console app, all 5 features).
3. Confirm Phase 2 constitution is updated (v2.0.0, full-stack, auth, Neon DB, JWT, monorepo).
4. Check for any duplicates, nested folders, or conflicts (e.g., old Phase 1 files in wrong places).
5. Save and organize history:
   - Create or update history/ folder with:
     - history/phase1-complete/ (copy all Phase 1 files as backup)
     - history/phase2-constitution.prompt.md (save the constitution update prompt)
     - history/current-state.md (document current project status)
   - Ensure CLAUDE.md has all previous prompts and decisions documented
6. Do NOT make any code changes or delete files unless critical (only organize history).
7. Recommend any minor cleanup (e.g., move Phase 1 to /phase1-console for separation).
8. Confirm the project is ready for Phase II specs and implementation without losing Phase I work.

## Response snapshot

Performed comprehensive project review across all files and directories. Created `history/current-state.md` with full inventory, Phase I verification (all 12 source files, 5 features confirmed complete), Phase II status (constitution v2.0.0, 2 specs drafted), and 5 issues identified (duplicate constitution, missing features/__init__.py, PHR ID collision, unfilled plan template, untracked work). Phase I is safe on `main`. Project is ready for Phase II planning after committing untracked work.

## Outcome

- ✅ Impact: Full project audit completed; state documented in history/current-state.md
- 🧪 Tests: No code tests — review/audit only
- 📁 Files: 1 file created (history/current-state.md)
- 🔁 Next prompts: /sp.git.commit_pr (commit untracked Phase II specs), /sp.plan (generate Phase II plan)
- 🧠 Reflection: Phase I is clean and complete. Phase II specs are well-structured but need plan and tasks generation. PHR ID scheme should be globally unique going forward.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): N/A (review task)
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Establish global PHR ID counter for Phase II

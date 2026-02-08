# The Evolution of Todo — Project Overview

## Vision

Simulate real-world software evolution — from a console app to a Kubernetes-managed, event-driven distributed system — using Spec-Driven Development with AI-only implementation.

## Phase Roadmap

### Part A: Web Application (Phases 1–3)

| Phase | Name | Status | Description |
|-------|------|--------|-------------|
| 1 | Console App | **Complete** | In-memory Python CLI with 5 CRUD features |
| 2 | Full-Stack Web App | **In Progress** | FastAPI + Next.js + Neon PostgreSQL + Better Auth |
| 3 | Enhanced Web Features | Planned | Filtering, sorting, search, bulk operations |

### Part B: Cloud Deployment (Phases 4–5)

| Phase | Name | Status | Description |
|-------|------|--------|-------------|
| 4 | Containerization | Planned | Docker containers, docker-compose, CI/CD |
| 5 | Kubernetes & Events | Planned | K8s orchestration, event-driven architecture, AI chatbot |

## Current Phase: Phase 2 — Full-Stack Web App

### Goals
- Multi-user task management via web interface
- JWT-based authentication with Better Auth
- User-isolated data storage in Neon PostgreSQL
- RESTful API with FastAPI backend
- Responsive Next.js frontend with Tailwind CSS

### Key Specs
- [Task CRUD Feature](features/task-crud.md)
- [REST API Endpoints](api/rest-endpoints.md)
- [Authentication](features/authentication.md)
- [Database Schema](database/schema.md)
- [UI Pages](ui/pages.md)
- [UI Components](ui/components.md)

### Architecture
See [architecture.md](architecture.md) for the system design.

## Constitution
All development governed by `.specify/memory/constitution.md` (v2.0.0).

## Monorepo Structure

```
/                       # Root: specs, config, history
├── src/todo_app/       # Phase 1: Console app (FROZEN)
├── backend/            # Phase 2+: FastAPI application
├── frontend/           # Phase 2+: Next.js application
├── specs/              # All specifications
└── history/            # PHRs, ADRs, state reports
```

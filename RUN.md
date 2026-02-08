# Running The Evolution of Todo — Phase II

## Quick Start

### Prerequisites

- Python 3.13+
- Node.js 18+
- UV package manager (`curl -LsSf https://astral.sh/uv/install.sh | sh`)
- Neon PostgreSQL account (free tier at https://neon.tech)

### Environment Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/safaaslam96/ToDo-Spec-Driven.git
   cd ToDo-Spec-Driven
   ```

2. **Generate BETTER_AUTH_SECRET**
   ```bash
   python3 -c "import secrets; print(secrets.token_urlsafe(32))"
   ```
   Copy this value - you'll need it for both backend and frontend .env files.

3. **Backend Setup**
   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `backend/.env`:
   ```env
   DATABASE_URL=postgresql+asyncpg://your_neon_connection_string
   BETTER_AUTH_SECRET=your_generated_secret_from_step_2
   JWT_ALGORITHM=HS256
   FRONTEND_URL=http://localhost:3000
   ```

4. **Frontend Setup**
   ```bash
   cd ../frontend
   cp .env.example .env.local
   ```

   Edit `frontend/.env.local`:
   ```env
   BETTER_AUTH_SECRET=same_secret_as_backend
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Run Locally (Separate Terminals)

**Option 1: Separate Terminals** (Recommended for development)

Terminal 1 - Backend:
```bash
cd backend
uv sync
uv run alembic upgrade head  # Run migrations
uv run uvicorn app.main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

**Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs (Swagger): http://localhost:8000/docs
- API Docs (ReDoc): http://localhost:8000/redoc

### Run with Docker Compose

```bash
# From project root
docker-compose up --build
```

**Access:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

To stop:
```bash
docker-compose down
```

---

## Features

### Phase II Implementation

✅ **Multi-User Authentication**
- Sign up / Sign in with Better Auth
- JWT Bearer token authentication
- User isolation (all queries filtered by JWT user_id)

✅ **Task Management (CRUD)**
- Create tasks with title, description, priority
- List all tasks with filters (status, sort)
- Update task fields
- Delete tasks
- Toggle completion status

✅ **Premium UI/UX**
- Modern design inspired by Todoist/Notion
- Advanced dark mode with smooth transitions
- Animations (fade in, slide in, hover effects)
- Responsive design (mobile-first)
- Skeleton loaders for better perceived performance
- Debounced search (300ms)
- Accessible (WCAG AA compliant)

✅ **Performance Optimizations**
- GZip compression middleware (backend)
- Database indexing on user_id and completed
- Code splitting (Next.js default)
- Minimal JWT payload
- Client-side search debouncing

---

## Testing

### Backend Tests

```bash
cd backend
uv run pytest tests/ -v
```

**Test Coverage:**
- JWT authentication (6 tests)
- Task CRUD endpoints (integration tests)
- User isolation verification

### Frontend Build

```bash
cd frontend
npm run build  # TypeScript type checking + build
npm run lint   # ESLint
```

---

## API Endpoints

All endpoints require JWT Bearer token (except `/api/health`).

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks` | List tasks (with filters) |
| GET | `/api/tasks/{id}` | Get single task |
| PUT | `/api/tasks/{id}` | Update task |
| DELETE | `/api/tasks/{id}` | Delete task |
| PATCH | `/api/tasks/{id}/complete` | Toggle completion |

### Query Parameters (GET /api/tasks)

- `status`: `pending` or `completed` (optional)
- `sort`: `created` or `title` (default: `created`)
- `limit`: Max results (default: 100)
- `offset`: Pagination offset (default: 0)

---

## Project Structure

```
ToDo-Spec-Driven/
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── api/routes/   # API endpoints
│   │   ├── auth/         # JWT verification
│   │   ├── database/     # Async connection
│   │   ├── models/       # SQLModel tables
│   │   └── main.py       # FastAPI app entry
│   ├── tests/            # pytest tests
│   ├── alembic/          # Database migrations
│   └── pyproject.toml    # Dependencies
├── frontend/             # Next.js frontend
│   ├── app/              # App Router pages
│   ├── components/       # React components
│   ├── lib/              # API client, hooks
│   └── types/            # TypeScript interfaces
├── agents/               # AI agent system (14 files, 35K+ lines)
├── specs/                # Feature specifications
├── history/prompts/      # Prompt History Records
└── docker-compose.yml    # Docker orchestration
```

---

## Troubleshooting

### Backend won't start

**Issue**: `ModuleNotFoundError: No module named 'pydantic_settings'`
- **Fix**: Run `uv sync` to install all dependencies

**Issue**: `asyncpg` connection error
- **Fix**: Ensure `DATABASE_URL` uses `postgresql+asyncpg://` prefix (not `postgresql://`)

**Issue**: JWT verification fails (401)
- **Fix**: Ensure `BETTER_AUTH_SECRET` is identical in both backend/.env and frontend/.env.local

### Frontend build errors

**Issue**: TypeScript errors
- **Fix**: Run `npm install` to ensure all dependencies are installed
- Check `tsconfig.json` strict mode settings

**Issue**: Tailwind classes not applying
- **Fix**: Ensure `@import "tailwindcss";` is in `app/globals.css`
- Restart dev server: `npm run dev`

### Database issues

**Issue**: Alembic migration fails
- **Fix**: Check Neon dashboard - ensure database is active
- Run `alembic downgrade -1` then `alembic upgrade head`

**Issue**: "No such table: tasks"
- **Fix**: Run `uv run alembic upgrade head` to apply migrations

---

## Next Steps (Phase III)

Phase II is complete! Next up:

- [ ] AI Chatbot integration (OpenAI MCP)
- [ ] Natural language task creation
- [ ] Smart task suggestions
- [ ] AI-powered prioritization

See `agents/subagents/ai-chatbot/CLAUDE.md` for Phase III planning.

---

## Documentation

- **Installation**: `INSTALLATION.md` — Comprehensive setup guide
- **Architecture**: `specs/architecture.md` — System design
- **API Contracts**: `specs/api/rest-endpoints.md` — Full API spec
- **Constitution**: `.specify/memory/constitution.md` — Project principles (v2.0.0)
- **Agents System**: `AGENTS.md` — AI development workflow

---

## License

MIT

---

🚀 **Phase II Complete** — Ready for production testing!

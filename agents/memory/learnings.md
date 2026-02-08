# Agent Learnings — The Evolution of Todo

**Purpose**: Persistent knowledge about successful patterns, solutions, and approaches  
**Updated**: 2026-02-08  
**Tags**: #lessons #patterns #solutions

---

## 2026-02-08: Phase II Implementation

### SQLModel + Alembic Async Configuration
**Problem**: Alembic autogenerate used `sqlmodel.sql.sqltypes.AutoString()` which caused NameError  
**Solution**: Manually replace with `sa.String()` in migration files  
**Why**: SQLModel types need to be converted to SQLAlchemy types for Alembic  
**Tags**: #backend #database #alembic

### asyncpg Connection String Format
**Problem**: `sslmode=require` query parameter caused TypeError with asyncpg  
**Solution**: Remove `sslmode` from DATABASE_URL for asyncpg connections  
**Why**: asyncpg doesn't support the `sslmode` parameter like psycopg2 does  
**Example**: Use `postgresql+asyncpg://user:pass@host/db` (no query params)  
**Tags**: #backend #database #asyncpg

### pytest-asyncio Fixture Decorators
**Problem**: Async fixtures caused PytestRemovedIn9Warning  
**Solution**: Use `@pytest_asyncio.fixture` instead of `@pytest.fixture` for async fixtures  
**Why**: pytest-asyncio requires explicit decorator for async fixtures  
**Tags**: #testing #pytest #async

### Tailwind CSS v4 Configuration
**Problem**: Tailwind v4 uses different config format  
**Solution**: Use `@import "tailwindcss";` in globals.css, configure via PostCSS  
**Why**: Tailwind v4 moved to PostCSS-based configuration  
**Tags**: #frontend #tailwind #styling

### Next.js 16 TypeScript Strict Mode
**Problem**: Type errors with conditional onSubmit prop  
**Solution**: Wrap in async function that handles both TaskCreate and TaskUpdate  
**Example**:
```typescript
onSubmit={async (data) => {
  if (editingTask) {
    await handleUpdate(data as TaskUpdate);
  } else {
    await handleCreate(data as TaskCreate);
  }
}}
```
**Tags**: #frontend #typescript #nextjs

---

## Best Practices Discovered

### User Isolation in REST APIs
**Pattern**: Always filter by `user_id` from JWT, never from request body  
**Implementation**:
```python
async def _get_user_task(session: AsyncSession, task_id: int, user_id: str) -> Task:
    query = select(Task).where(Task.id == task_id, Task.user_id == user_id)
    task = (await session.execute(query)).scalar_one_or_none()
    if task is None:
        raise HTTPException(404, f"Task {task_id} not found")  # 404, not 403
    return task
```
**Why**: 404 prevents enumeration attacks, filtering by JWT ensures security  
**Tags**: #security #backend #api

### Component Library Structure
**Pattern**: Build atomic UI components first (Button, Input), then compose them  
**Structure**:
```
components/
├── ui/              # Atomic components (Button, Input, Dialog)
└── tasks/           # Composed components (TaskForm, TaskItem)
```
**Why**: Reusability, consistency, easier testing  
**Tags**: #frontend #architecture #components

---

## Tools & Commands

### UV Package Manager
**Fast dependency installation**: `uv sync` (faster than pip)  
**Run commands**: `uv run <command>` (auto-activates venv)  
**Add dependency**: Edit `pyproject.toml`, then `uv sync`  
**Tags**: #tools #backend #python

### Next.js Build Verification
**Quick type check**: `npm run build` (catches TypeScript errors)  
**Dev mode**: `npm run dev` (hot reload, faster than build)  
**Tags**: #tools #frontend #nextjs

---

## Keep Updated
Add new learnings as you discover them during development.

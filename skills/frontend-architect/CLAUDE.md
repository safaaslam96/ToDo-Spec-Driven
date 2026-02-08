# Frontend Architect — Next.js Guidelines

You are a frontend architect for the Todo Full-Stack Web Application (Phase II). Your domain is the `frontend/` directory.

## Technology Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript 5.7+ (strict mode)
- **Styling**: Tailwind CSS v4 (utility-first)
- **Auth**: Better Auth (client-side SDK)
- **State**: React 19 hooks (useState, useEffect, useCallback)
- **Testing**: Vitest + React Testing Library

## Project Layout

```
frontend/
├── app/
│   ├── layout.tsx           # Root layout, global providers
│   ├── page.tsx             # Landing page (/)
│   ├── globals.css          # Tailwind directives + global styles
│   ├── auth/
│   │   └── page.tsx         # Sign in / Sign up (/auth)
│   └── dashboard/
│       └── page.tsx         # Task management (/dashboard)
├── components/
│   ├── tasks/
│   │   ├── task-item.tsx    # Single task row
│   │   ├── task-form.tsx    # Create/edit task form
│   │   ├── task-list.tsx    # Task list container
│   │   └── task-filters.tsx # Status/sort filters
│   └── ui/
│       ├── button.tsx       # Button variants
│       ├── input.tsx        # Input with label/error
│       ├── select.tsx       # Dropdown select
│       ├── dialog.tsx       # Confirmation dialog
│       ├── badge.tsx        # Priority badge
│       └── spinner.tsx      # Loading indicator
├── lib/
│   ├── api-client.ts        # Typed API client with JWT
│   └── auth.ts              # Better Auth client init
├── types/
│   └── task.ts              # Task, TaskCreate, TaskUpdate interfaces
├── package.json
├── tsconfig.json
├── next.config.ts
├── postcss.config.mjs
└── Dockerfile
```

## Patterns to Follow

### Server vs Client Components
- Default to **Server Components** (no `"use client"` directive)
- Use `"use client"` only for interactive components (forms, toggles, filters)
- Client components: TaskForm, TaskItem (checkbox), TaskFilters, auth page

### TypeScript Interfaces
Define props as explicit interfaces:
```typescript
interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}
```

### API Client Usage
All API calls go through `lib/api-client.ts`:
```typescript
import { taskApi } from "@/lib/api-client";

const tasks = await taskApi.list({ status: "pending" });
const created = await taskApi.create({ title: "New task" });
await taskApi.toggleComplete(task.id);
```

The API client automatically attaches the JWT Bearer token from local storage.

### Auth Flow
1. Better Auth client handles sign-up/sign-in on `/auth`
2. On success, JWT token stored (localStorage or Better Auth session)
3. Token attached to every API request via `Authorization: Bearer {token}`
4. `/dashboard` checks auth state; redirects to `/auth` if unauthenticated
5. Sign out clears token and redirects to `/auth`

### Responsive Design
Mobile-first with Tailwind breakpoints:
```
Mobile (< 640px)    → Single column, stacked elements
Tablet (640-1024px) → Wider task cards, side padding
Desktop (> 1024px)  → Centered max-w-4xl container
```

### Component Styling
- Tailwind utility classes only — no custom CSS modules
- Priority badge colors: high = red, medium = yellow, low = green
- Completed tasks: strikethrough title + muted text
- Button variants: primary (blue), secondary (gray), danger (red)

## Key Constraints

- API base URL proxied via `next.config.ts` rewrites (frontend:3000 → backend:8000)
- No user_id in API paths — backend extracts from JWT
- Task type: `id: number`, `user_id: string`, `priority: "low" | "medium" | "high"`
- No due_date field in Phase II
- No prop drilling beyond 2 levels — use composition or context
- `NEXT_PUBLIC_` prefix required for client-side env vars

## Running the Frontend

```bash
cd frontend
npm install                  # Install dependencies
npm run dev                  # Start dev server (port 3000)
npm run build                # Production build
npm run lint                 # ESLint check
```

## Reference Specs

- UI pages: `specs/ui/pages.md`
- UI components: `specs/ui/components.md`
- API contract: `specs/api/rest-endpoints.md`
- Auth: `specs/features/authentication.md`
- Architecture: `specs/architecture.md`

# Frontend Guidelines — The Evolution of Todo

## Stack
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4
- **Auth**: Better Auth (client-side) with JWT tokens
- **API Communication**: Custom fetch-based client (`lib/api-client.ts`)

## Project Layout

```
frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (html, body, global styles)
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Tailwind CSS import
│   ├── auth/page.tsx           # Sign in / sign up
│   └── dashboard/page.tsx      # Main task management view
├── components/
│   ├── tasks/
│   │   ├── task-item.tsx       # Single task row
│   │   ├── task-form.tsx       # Create/edit form
│   │   └── task-list.tsx       # Task list container
│   └── ui/                     # Shared UI primitives
├── lib/
│   └── api-client.ts           # API client with JWT attachment
├── types/
│   └── task.ts                 # TypeScript interfaces
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── .env.example
```

## Running Locally

```bash
cd frontend
npm install
cp .env.example .env.local   # Fill in values
npm run dev                   # http://localhost:3000
```

API calls are proxied to `http://localhost:8000` via `next.config.ts` rewrites during development.

## Code Standards

### Components
- Use functional components with TypeScript interfaces for props.
- Server Components by default; add `"use client"` only when needed (state, effects, event handlers).
- Keep components small and focused (single responsibility).
- Place shared/reusable components in `components/ui/`.
- Feature-specific components in `components/<feature>/`.

### Styling
- Tailwind CSS utility classes only — no custom CSS files (except `globals.css` import).
- Use `className` strings directly; avoid `cn()` helpers unless complexity demands it.
- Responsive design: mobile-first (`sm:`, `md:`, `lg:` breakpoints).

### Authentication
- Better Auth handles sign-in/sign-up flows.
- JWT token stored securely (httpOnly cookie preferred, localStorage as fallback).
- `lib/api-client.ts` automatically attaches Bearer token to all API requests.
- Protected routes should check auth state before rendering.

### API Client
- All backend communication goes through `lib/api-client.ts`.
- Never call `fetch()` directly for API routes — use `taskApi` methods.
- Errors are thrown as `Error` objects with the server's `detail` message.

### TypeScript
- Strict mode enabled. No `any` types.
- Shared types in `types/` directory.
- Props interfaces defined inline or in the component file.

### Testing
```bash
npm run lint       # ESLint
npm run build      # Type checking + build verification
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | No | API base URL (default: empty, uses proxy) |
| `BETTER_AUTH_SECRET` | Yes | Shared secret for Better Auth |

## Constitution Reference

See `../.specify/memory/constitution.md` for project principles (v2.0.0).
Specs: `../specs/ui/pages.md`, `../specs/ui/components.md`, `../specs/features/task-crud.md`.

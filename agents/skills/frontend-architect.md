# Frontend Architect — The Evolution of Todo

**Domain**: Frontend Development  
**Stack**: Next.js 16+, React 19, TypeScript 5.7+, Tailwind CSS v4  
**Role**: Build responsive, accessible, type-safe UIs

---

## Core Responsibilities

1. **Component Development**: Reusable React components with TypeScript
2. **State Management**: React hooks (useState, useEffect, useRouter)
3. **API Integration**: Type-safe API client with JWT authentication
4. **Styling**: Tailwind CSS utility classes (no custom CSS)
5. **Accessibility**: WCAG AA compliance, keyboard navigation, ARIA
6. **Testing**: Component testing, E2E tests (future)

---

## Tech Stack

### Framework & Runtime
- **Next.js**: 16.0+ (App Router, Server Components)
- **React**: 19.0+ (functional components, hooks)
- **TypeScript**: 5.7+ (strict mode)
- **Node.js**: 22+ LTS

### Styling & UI
- **Tailwind CSS**: v4 (utility-first, no custom CSS)
- **PostCSS**: For Tailwind processing
- **Design System**: Custom component library in `components/ui/`

### Authentication
- **Better Auth**: 0.4.0+ (Phase II planned, test auth for now)
- **JWT**: Stored in localStorage, attached to API calls
- **jose**: JWT token generation/validation

### Build & Dev Tools
- **npm**: Package manager
- **ESLint**: Linting (Next.js config)
- **TypeScript**: Type checking

---

## Project Structure

```
frontend/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (html, body, fonts)
│   ├── page.tsx                # Landing page (/)
│   ├── globals.css             # Tailwind import only
│   ├── auth/page.tsx           # Authentication page
│   ├── dashboard/page.tsx      # Main task dashboard
│   └── api/                    # API routes (server-side)
│       └── test-token/route.ts # Test JWT generation
├── components/
│   ├── ui/                     # Shared UI primitives
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Dialog.tsx
│   │   └── ... (8 components)
│   └── tasks/                  # Task-specific components
│       ├── TaskForm.tsx
│       ├── TaskItem.tsx
│       └── TaskList.tsx
├── lib/
│   └── api-client.ts           # API client with JWT
├── types/
│   └── task.ts                 # TypeScript interfaces
├── public/                     # Static assets
├── package.json
├── tsconfig.json               # TypeScript config (strict)
├── next.config.ts              # Next.js config (API proxy)
├── postcss.config.mjs          # Tailwind PostCSS
└── .env.local                  # Environment variables
```

---

## Code Standards

### TypeScript (Strict Mode)
```typescript
// Good — Explicit types
interface Task {
  id: number;
  title: string;
  completed: boolean;
}

function updateTask(task: Task): Promise<Task> {
  return taskApi.update(task.id, task);
}

// Bad — No types
function updateTask(task) {  // ❌ Implicit any
  return taskApi.update(task.id, task);
}
```

### Component Props
```typescript
// Good — Interface for props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({ variant = "primary", loading, ...props }: ButtonProps) {
  ...
}

// Bad — No interface
export function Button({ variant, loading, ...props }) {  // ❌ No types
  ...
}
```

### Client vs Server Components
```typescript
// Server Component (default)
export default function HomePage() {
  return <main>...</main>;
}

// Client Component (with state/effects)
"use client";

import { useState } from "react";

export function TaskForm() {
  const [title, setTitle] = useState("");
  ...
}
```

---

## Component Patterns

### Functional Components
```typescript
// Good — Functional with TypeScript
export function TaskItem({ task, onEdit, onDelete }: TaskItemProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3>{task.title}</h3>
      <button onClick={() => onEdit(task)}>Edit</button>
    </div>
  );
}

// Bad — Class component
class TaskItem extends React.Component {  // ❌ Use functions
  render() {
    return <div>...</div>;
  }
}
```

### State Management
```typescript
// Good — useState for local state
const [tasks, setTasks] = useState<Task[]>([]);
const [isLoading, setIsLoading] = useState(false);

// Good — useEffect for side effects
useEffect(() => {
  loadTasks();
}, []);

// Bad — Direct mutation
tasks.push(newTask);  // ❌ Use setTasks
```

### Event Handlers
```typescript
// Good — Async handlers with error handling
const handleCreate = async (data: TaskCreate) => {
  try {
    await taskApi.create(data);
    await loadTasks();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed");
  }
};

// Bad — No error handling
const handleCreate = async (data) => {
  await taskApi.create(data);  // ❌ What if it fails?
  await loadTasks();
};
```

---

## Styling with Tailwind

### Utility Classes (Only)
```typescript
// Good — Utility classes
<button className="rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700">
  Submit
</button>

// Bad — Custom CSS
<button className="custom-button">Submit</button>
// ❌ Don't create .custom-button in CSS file
```

### Responsive Design
```typescript
// Good — Mobile-first responsive
<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {/* 1 col on mobile, 2 on tablet, 3 on desktop */}
</div>

// Good — Conditional classes
<div className={`rounded-lg border ${task.completed ? "opacity-60" : ""}`}>
  ...
</div>
```

### Touch Targets (44px minimum)
```typescript
// Good — Min 44px for buttons
<button className="min-h-[44px] min-w-[44px] rounded-full p-2">
  <Icon />
</button>

// Bad — Too small for touch
<button className="p-1">  // ❌ < 44px
  <Icon />
</button>
```

---

## API Client Patterns

### Token Management
```typescript
// lib/api-client.ts
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}
```

### API Methods
```typescript
// Good — Typed API client
export const taskApi = {
  list(params?: TaskListParams): Promise<Task[]> {
    return apiFetch<Task[]>("/api/tasks?" + buildQuery(params));
  },
  
  create(data: TaskCreate): Promise<Task> {
    return apiFetch<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
  
  update(id: number, data: TaskUpdate): Promise<Task> {
    return apiFetch<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },
};
```

### Error Handling
```typescript
// Good — Parse error from response
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}
```

---

## Accessibility Standards

### Semantic HTML
```typescript
// Good — Semantic elements
<main>
  <header>
    <h1>Dashboard</h1>
  </header>
  <article>
    <h2>Task Title</h2>
    <p>Description</p>
  </article>
</main>

// Bad — Divs everywhere
<div>
  <div>
    <div>Dashboard</div>
  </div>
</div>
```

### ARIA Labels
```typescript
// Good — ARIA for screen readers
<button
  onClick={handleDelete}
  aria-label="Delete task"
>
  <TrashIcon />
</button>

<div role="alert" aria-live="assertive">
  {error}
</div>
```

### Keyboard Navigation
```typescript
// Good — Handle Escape key
useEffect(() => {
  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === "Escape" && isOpen) {
      onClose();
    }
  };
  document.addEventListener("keydown", handleEscape);
  return () => document.removeEventListener("keydown", handleEscape);
}, [isOpen, onClose]);
```

### Focus Management
```typescript
// Good — Focus indicators
<button className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Click Me
</button>
```

---

## Form Patterns

### Controlled Inputs
```typescript
// Good — Controlled input with state
const [title, setTitle] = useState("");

<Input
  label="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
/>
```

### Form Submission
```typescript
// Good — Prevent default, validate, handle errors
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!title.trim()) {
    setError("Title is required");
    return;
  }
  
  setIsLoading(true);
  try {
    await onSubmit({ title: title.trim(), description });
    onClose();
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed");
  } finally {
    setIsLoading(false);
  }
};
```

### Validation
```typescript
// Good — Client-side validation with server fallback
{error && (
  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
    {error}
  </div>
)}

<Input
  label="Title"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  error={error ? "Title is required" : undefined}
  required
/>
```

---

## Next.js Patterns

### App Router Structure
```
app/
├── layout.tsx        # Root layout (wraps all pages)
├── page.tsx          # Home page (/)
├── auth/page.tsx     # /auth
└── dashboard/page.tsx # /dashboard
```

### API Routes (Server-Side)
```typescript
// app/api/test-token/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { user_id } = await request.json();
  // ... generate token
  return NextResponse.json({ token });
}
```

### Environment Variables
```typescript
// Public (client-side)
const apiUrl = process.env.NEXT_PUBLIC_API_URL;

// Private (server-side only)
const secret = process.env.BETTER_AUTH_SECRET;
```

### Rewrites (API Proxy)
```typescript
// next.config.ts
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:8000/api/:path*",
      },
    ];
  },
};
```

---

## Common Pitfalls

### ❌ Custom CSS instead of Tailwind
```css
/* Bad — Don't create custom CSS */
.button-primary {
  background: blue;
  padding: 12px;
}
```

### ❌ Missing "use client" directive
```typescript
// Bad — useState in Server Component
export default function Page() {
  const [state, setState] = useState();  // ❌ Add "use client"
}
```

### ❌ Implicit any types
```typescript
// Bad — No types
function handleClick(event) {  // ❌ event: any
  ...
}
```

### ❌ Direct state mutation
```typescript
// Bad
tasks.push(newTask);  // ❌ Use setTasks([...tasks, newTask])
```

### ❌ No error handling
```typescript
// Bad
const data = await taskApi.create(task);  // ❌ What if it fails?
```

---

## UI Component Library

Our `components/ui/` provides:
- **Button**: 4 variants, loading states, disabled states
- **Input**: Labels, validation, error messages
- **Textarea**: Same as Input with multiline
- **Select**: Custom dropdown with options
- **Dialog**: Modal with backdrop, keyboard support
- **Badge**: Priority/status indicators
- **Spinner**: 3 sizes (sm/md/lg)
- **EmptyState**: Placeholder for empty lists
- **ErrorState**: Error display with retry

**Always use these** instead of creating new components!

---

## Quick Reference

**Run dev**: `npm run dev`  
**Build**: `npm run build`  
**Lint**: `npm run lint`  
**Install**: `npm install`

**Always**: TypeScript types, Tailwind classes, accessibility, error handling  
**Never**: Custom CSS, class components, implicit any, state mutation

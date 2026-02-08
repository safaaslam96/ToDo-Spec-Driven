# UI Pages Specification — Phase II

## Overview

Defines the page structure for the Next.js App Router frontend. All pages are responsive (mobile-first) and use Tailwind CSS for styling.

## Page Map

| Route | Page | Auth Required | Description |
|-------|------|---------------|-------------|
| `/` | Landing | No | Welcome page with sign-in/dashboard links |
| `/auth` | Authentication | No | Sign in / sign up forms |
| `/dashboard` | Dashboard | Yes | Main task management view |

## Page Details

### `/` — Landing Page
- Hero section with project title and description
- CTA buttons: "Sign In" → `/auth`, "Dashboard" → `/dashboard`
- No task data displayed

### `/auth` — Authentication Page
- Toggle between Sign In and Sign Up forms
- Email + password fields
- Form validation with inline error messages
- On success: redirect to `/dashboard`
- On error: display error message (e.g., "Invalid credentials")

### `/dashboard` — Dashboard (Task Management)
- **Header**: Page title "My Tasks" + "New Task" button
- **Filters bar**: Status filter (All / Pending / Completed), Sort (Created / Title)
- **Task list**: Scrollable list of TaskItem components
- **Empty state**: Message when no tasks exist
- **New/Edit task**: TaskForm component (inline or modal)
- **Delete confirmation**: Dialog before deletion

## Navigation

- Unauthenticated users see Landing and Auth pages
- Authenticated users are redirected from `/auth` to `/dashboard`
- Dashboard checks auth state; redirects to `/auth` if not authenticated

## Responsive Breakpoints

| Breakpoint | Layout |
|------------|--------|
| Mobile (< 640px) | Single column, stacked elements |
| Tablet (640px–1024px) | Wider task cards, side padding |
| Desktop (> 1024px) | Centered max-width container (max-w-4xl) |

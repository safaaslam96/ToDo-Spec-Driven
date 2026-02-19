# Frontend Architect — Best Practices

## Core Principles

### 1. TypeScript Strict Mode
- ✅ Enable strict mode in `tsconfig.json`
- ✅ Define interfaces for all props and data
- ✅ Use type guards for runtime type safety
- ✅ No `any` types (use `unknown` if necessary)

### 2. Component Organization
```
components/
├── tasks/
│   ├── task-card.tsx        # Task display
│   ├── task-form.tsx        # Create/edit form
│   └── task-list.tsx        # List container
└── ui/
    ├── button.tsx           # Reusable button
    ├── input.tsx            # Styled input
    └── modal.tsx            # Modal dialog
```

### 3. State Management
- ✅ Use `useState` for component-local state
- ✅ Use `useEffect` for side effects (API calls, subscriptions)
- ✅ Lift state up when multiple components need it
- ✅ Consider context for deeply nested state
- ❌ Don't prop-drill beyond 2-3 levels

### 4. API Client Pattern
```typescript
// ✅ GOOD: Centralized API client with JWT
const api = {
  getTasks: async () => {
    const token = getAuthToken();
    const res = await fetch(`${API_URL}/api/tasks`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch tasks");
    return res.json();
  }
};

// ❌ BAD: Scattered fetch calls throughout components
```

### 5. Loading & Error States
- ✅ **Always** show loading state during async operations
- ✅ **Always** handle and display errors
- ✅ **Always** show empty state when no data
- ✅ Use skeleton loaders for better UX

### 6. Responsive Design (Mobile-First)
```tsx
// ✅ GOOD: Mobile-first Tailwind classes
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
</div>

// Breakpoints:
// - default: Mobile (< 640px)
// - sm: Small (640px+)
// - md: Tablet (768px+)
// - lg: Desktop (1024px+)
// - xl: Large desktop (1280px+)
```

### 7. Accessibility (WCAG AA)
- ✅ Use semantic HTML (`<button>`, `<form>`, `<label>`)
- ✅ Add ARIA labels for icon-only buttons
- ✅ Keyboard navigation support (Tab, Enter, Escape)
- ✅ Minimum touch target: 44px × 44px
- ✅ Sufficient color contrast (4.5:1 for text)
- ✅ Focus indicators visible

### 8. Performance Optimization
- ✅ Code splitting (Next.js automatic)
- ✅ Image optimization (`next/image`)
- ✅ Lazy load non-critical components
- ✅ Debounce search inputs (300ms)
- ✅ Minimize bundle size
- ❌ Don't over-fetch data

### 9. Dark Mode Support
```tsx
// ✅ GOOD: Dark mode classes
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  {/* Automatically adapts to system preference */}
</div>
```

### 10. Error Boundaries
```tsx
// ✅ Add error boundary for graceful failures
"use client";

import { Component, ReactNode } from "react";

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong</div>;
    }
    return this.props.children;
  }
}
```

## Common Mistakes to Avoid

❌ **DON'T** forget "use client" directive for hooks
❌ **DON'T** mutate state directly (use setState)
❌ **DON'T** forget to cleanup useEffect subscriptions
❌ **DON'T** use inline functions in JSX (causes re-renders)
❌ **DON'T** forget loading/error states
❌ **DON'T** hardcode API URLs (use environment variables)
❌ **DON'T** commit `.env.local` to git
❌ **DON'T** skip TypeScript types (no `any`)
❌ **DON'T** nest components too deeply (extract sub-components)
❌ **DON'T** use `!important` in CSS (fix specificity instead)

## Quick Checklist

Before deploying:
- [ ] All components have TypeScript types
- [ ] Loading/error/empty states for async operations
- [ ] Responsive on mobile, tablet, desktop (test all breakpoints)
- [ ] Dark mode works throughout
- [ ] Keyboard navigation works
- [ ] ARIA labels on icon-only buttons
- [ ] Forms have validation and error messages
- [ ] No console errors or warnings
- [ ] Build succeeds with no TypeScript errors
- [ ] Environment variables documented in `.env.example`

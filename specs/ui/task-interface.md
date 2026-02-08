# Task Interface UI Specification — Phase II

**Version**: 1.0.0
**Date**: 2026-02-07
**Status**: Draft
**Target**: Phase II — Full-Stack Web Application

---

## Overview

This specification defines the visual design, interaction patterns, and user experience for the Task CRUD interface in the Phase II multi-user web todo application. The interface must provide a modern, clean, and professional experience across all device sizes while maintaining excellent readability, accessibility, and usability.

The design is inspired by industry-leading task management applications (Todoist, Notion) and prioritizes user efficiency, visual clarity, and responsive behavior. All UI components will be built using Tailwind CSS utility classes following modern design principles.

---

## Design Principles

### 1. Readability First

**Typography**:
- **Font family**: System font stack or Inter (sans-serif)
  - Primary: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - Fallback: Inter from Google Fonts if custom fonts desired
- **Base font size**: 16px (1rem) — ensures readability on all devices
- **Font sizes**:
  - Headings (h1): 2rem (32px) — page titles
  - Headings (h2): 1.5rem (24px) — section headers
  - Headings (h3): 1.25rem (20px) — card titles
  - Body text: 1rem (16px) — default
  - Small text: 0.875rem (14px) — secondary labels, timestamps
  - Fine print: 0.75rem (12px) — helper text, badges
- **Line height**:
  - Headings: 1.2 (tight)
  - Body text: 1.5 (relaxed for readability)
  - Dense lists: 1.4 (compact but readable)
- **Font weight**:
  - Headings: 600-700 (semi-bold to bold)
  - Body: 400 (normal)
  - Emphasized text: 500 (medium)
  - Labels: 500 (medium)

**Color Contrast**:
- **Text on light background**:
  - Primary text: #1F2937 (gray-800) or darker — minimum 7:1 contrast ratio
  - Secondary text: #6B7280 (gray-500) — minimum 4.5:1 contrast ratio
  - Disabled text: #9CA3AF (gray-400)
- **Text on dark background** (if dark mode):
  - Primary text: #F9FAFB (gray-50)
  - Secondary text: #D1D5DB (gray-300)
- All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)

---

### 2. Responsive Design

**Breakpoints** (Tailwind defaults):
- **Mobile**: < 640px (sm)
- **Tablet**: 640px – 1024px (md, lg)
- **Desktop**: > 1024px (xl, 2xl)

**Layout Behavior**:
- **Mobile**:
  - Single column layout
  - Full-width cards with minimal side margins (16px/1rem)
  - Stacked form inputs (full width)
  - Bottom-fixed action buttons or full-width buttons
  - Touch-optimized spacing (minimum 44×44px touch targets)
- **Tablet**:
  - Wider cards with more generous margins (24px/1.5rem)
  - Two-column forms where appropriate
  - Sidebar navigation (if applicable)
- **Desktop**:
  - Maximum content width: 1024px (max-w-4xl) centered
  - Cards in grid or list with ample whitespace
  - Multi-column forms
  - Hover states clearly visible

**Adaptive Components**:
- Buttons: Full width on mobile, auto width on desktop
- Forms: Stacked on mobile, horizontal on desktop
- Navigation: Hamburger menu on mobile, full menu on desktop

---

### 3. Accessibility

**Keyboard Navigation**:
- All interactive elements must be keyboard-accessible (Tab, Enter, Space, Escape)
- **Tab order**: Logical flow (top to bottom, left to right)
- **Focus indicators**: Visible 2px blue outline (`focus:ring-2 focus:ring-blue-500`)
- **Skip links**: "Skip to main content" for screen readers

**ARIA Labels**:
- All buttons, inputs, and interactive elements have descriptive `aria-label` attributes
- Form inputs have associated `<label>` elements (not just placeholders)
- Status messages use `aria-live` regions
- Loading states use `aria-busy="true"`

**Screen Reader Support**:
- Semantic HTML (use `<button>`, `<input>`, `<form>`, not `<div onclick>`)
- Clear labels for all form controls
- Error messages announced via `role="alert"`
- Task status changes announced

**Color and Contrast**:
- Do not rely on color alone to convey information (use icons + color)
- All text meets WCAG AA contrast requirements
- Focus indicators visible against all backgrounds

---

## Component Library

### Buttons

**Variants**:

1. **Primary Button** (main actions: Save, Add Task, Sign In):
   - Background: `bg-blue-600` (or `bg-green-600` for positive actions)
   - Text: `text-white`
   - Hover: `hover:bg-blue-700`
   - Focus: `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`
   - Disabled: `disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`
   - Padding: `px-6 py-3` (desktop), `px-4 py-3` (mobile)
   - Border radius: `rounded-lg` (8px)
   - Font: `font-medium text-base`
   - Min height: 44px (touch target)

2. **Secondary Button** (cancel, back, less prominent actions):
   - Background: `bg-gray-200` or `bg-white`
   - Border: `border border-gray-300`
   - Text: `text-gray-700`
   - Hover: `hover:bg-gray-100`
   - Focus: `focus:ring-2 focus:ring-gray-400`
   - Same sizing as primary

3. **Danger Button** (delete, destructive actions):
   - Background: `bg-red-600`
   - Text: `text-white`
   - Hover: `hover:bg-red-700`
   - Focus: `focus:ring-2 focus:ring-red-500`

4. **Icon Button** (edit, delete, actions in task cards):
   - Size: 40×40px minimum (touch target)
   - Icon: 20×20px (or use Tailwind's `w-5 h-5`)
   - Padding: `p-2`
   - Border radius: `rounded-md`
   - Hover: `hover:bg-gray-100`
   - Focus: `focus:ring-2 focus:ring-gray-400`

**Button States**:
- Default: Clearly defined with color
- Hover: Slightly darker background
- Focus: Visible ring (2px blue outline)
- Active: Pressed state (slightly darker than hover)
- Disabled: Grayed out, no pointer cursor
- Loading: Spinner icon, text "Loading...", disabled state

**Spacing**:
- Between buttons: `space-x-3` (12px horizontal gap)

---

### Form Inputs

**Text Input**:
- Border: `border border-gray-300`
- Padding: `px-4 py-3` (generous padding for touch)
- Border radius: `rounded-lg` (8px)
- Font size: `text-base` (16px to prevent mobile zoom)
- Background: `bg-white`
- Placeholder: `placeholder-gray-400`
- Focus: `focus:ring-2 focus:ring-blue-500 focus:border-blue-500`
- Error state: `border-red-500 focus:ring-red-500`
- Disabled: `bg-gray-100 cursor-not-allowed`

**Label**:
- Font: `text-sm font-medium text-gray-700`
- Margin bottom: `mb-2` (8px)
- Required indicator: Red asterisk `<span class="text-red-500">*</span>`

**Textarea** (for task description):
- Same styling as text input
- Min height: 100px (3-4 lines)
- Resize: `resize-y` (vertical only)

**Select Dropdown** (for priority):
- Same styling as text input
- Icon: Chevron down on right side
- Options: Clear, readable text with ample padding

**Checkbox** (for task completion):
- Size: 20×20px minimum
- Border: `border-2 border-gray-300`
- Border radius: `rounded`
- Checked: `bg-blue-600 border-blue-600` with white checkmark
- Focus: `focus:ring-2 focus:ring-blue-500`
- Hover: `hover:border-blue-400`

**Error Message**:
- Color: `text-red-600 text-sm`
- Icon: Red exclamation circle (optional)
- Margin top: `mt-1` (4px)
- Example: "Title is required."

**Helper Text**:
- Color: `text-gray-500 text-sm`
- Margin top: `mt-1` (4px)
- Example: "Enter a brief description for your task."

---

### Cards (Task Items)

**Task Card Structure**:
```
┌─────────────────────────────────────┐
│ [✓] Task Title              [Edit] │
│     Task description here...  [Del] │
│     [Priority Badge] [Timestamp]    │
└─────────────────────────────────────┘
```

**Styling**:
- Background: `bg-white`
- Border: `border border-gray-200`
- Shadow: `shadow-sm` (subtle), `hover:shadow-md` (on hover)
- Border radius: `rounded-lg` (8px)
- Padding: `p-4` (16px) on desktop, `p-3` (12px) on mobile
- Margin bottom: `mb-3` (12px between cards)

**Hover State**:
- Shadow: `hover:shadow-md` (elevated)
- Border: `hover:border-gray-300` (slightly darker)
- Transition: `transition-shadow duration-200`

**Completed Task**:
- Opacity: `opacity-75` (slight fade)
- Title: `line-through text-gray-500` (strikethrough + muted)
- Description: `text-gray-400` (muted)

**Card Elements**:
- Checkbox: 20×20px on left
- Title: `text-lg font-medium text-gray-900` (18px, semi-bold)
- Description: `text-sm text-gray-600` (14px, secondary color)
- Priority badge: Small colored pill (see Badges)
- Timestamp: `text-xs text-gray-400` (12px)
- Edit button: Icon button (pencil icon)
- Delete button: Icon button (trash icon)

---

### Badges (Priority Indicators)

**Priority Badge**:
- **High**: `bg-red-100 text-red-800 border border-red-200`
- **Medium**: `bg-yellow-100 text-yellow-800 border border-yellow-200`
- **Low**: `bg-green-100 text-green-800 border border-green-200`

**Styling**:
- Padding: `px-2.5 py-0.5` (10px horizontal, 2px vertical)
- Border radius: `rounded-full` (pill shape)
- Font: `text-xs font-medium` (12px, medium weight)
- Example: `<span class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">High</span>`

---

### Modals/Dialogs

**Modal Container**:
- Overlay: `fixed inset-0 bg-gray-900 bg-opacity-50 z-50` (dark overlay)
- Center: Flexbox centered (`flex items-center justify-center`)
- Modal box: `bg-white rounded-lg shadow-xl max-w-md w-full mx-4` (responsive max width)

**Modal Content**:
- Padding: `p-6` (24px)
- Title: `text-xl font-semibold text-gray-900 mb-4`
- Body: Regular text spacing
- Actions: Bottom-aligned buttons with spacing

**Close Button**:
- Position: Top-right corner
- Style: `text-gray-400 hover:text-gray-600`
- Icon: X icon

**Confirmation Dialog** (for delete):
- Title: "Delete Task?"
- Message: "Are you sure you want to delete this task? This action cannot be undone."
- Buttons: "Cancel" (secondary) + "Delete" (danger)

---

### Loading States

**Spinner**:
- Use Tailwind's `animate-spin` utility
- SVG or CSS spinner (rotating circle)
- Size: 24×24px (inline), 40×40px (full page)
- Color: `text-blue-600`

**Skeleton Loading** (optional for task list):
- Gray rectangles with pulse animation: `bg-gray-200 animate-pulse`
- Mimics card layout while loading

**Button Loading State**:
- Spinner icon + text "Loading..."
- Disabled state
- Example: `<button disabled><svg class="animate-spin...">...</svg> Loading...</button>`

---

## Page Layouts

### 1. Dashboard / Task List Page

**URL**: `/dashboard`

**Layout Structure**:
```
┌───────────────────────────────────────────────┐
│ Header: "My Tasks"          [+ New Task] Btn │
├───────────────────────────────────────────────┤
│ Filters: [All] [Pending] [Completed]         │
│ Sort: [Created ▼]                              │
├───────────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐       │
│ │ [✓] Task 1 Title           [Edit][✕]│       │
│ │     Description...                   │       │
│ │     [High] 2 hours ago               │       │
│ └─────────────────────────────────────┘       │
│ ┌─────────────────────────────────────┐       │
│ │ [ ] Task 2 Title           [Edit][✕]│       │
│ │     Description...                   │       │
│ │     [Medium] 1 day ago               │       │
│ └─────────────────────────────────────┘       │
│ ...                                            │
└───────────────────────────────────────────────┘
```

**Header**:
- Container: `max-w-4xl mx-auto px-4 py-6`
- Title: `text-3xl font-bold text-gray-900`
- "New Task" button: Primary button, aligned right on desktop, full width on mobile
- Border bottom: `border-b border-gray-200 pb-4`

**Filters Section**:
- Container: `max-w-4xl mx-auto px-4 py-4`
- Filter buttons: Tab-like buttons (active state highlighted)
  - Active: `bg-blue-600 text-white`
  - Inactive: `bg-gray-100 text-gray-700 hover:bg-gray-200`
- Sort dropdown: Select input aligned right

**Task List Section**:
- Container: `max-w-4xl mx-auto px-4 py-4`
- List: Stack of task cards (see Cards section)
- Empty state: Centered message "No tasks yet. Create your first task!"
  - Icon: Large clipboard or checkmark icon
  - Button: "Create Task" (primary)

**Spacing**:
- Between header and filters: `mb-4` (16px)
- Between filters and list: `mb-4` (16px)
- Between tasks: `mb-3` (12px)

---

### 2. Add / Edit Task Form

**Display Options**:
- **Option A**: Modal dialog (overlay on dashboard)
- **Option B**: Inline form on dashboard (expands when "+ New Task" clicked)
- **Option C**: Dedicated page (`/tasks/new`, `/tasks/:id/edit`)

**Recommended**: Modal dialog for simplicity and focus

**Form Structure**:
```
┌─────────────────────────────────────┐
│ Add New Task                    [X] │
├─────────────────────────────────────┤
│ Title *                             │
│ ┌─────────────────────────────────┐ │
│ │ Enter task title                │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Description                         │
│ ┌─────────────────────────────────┐ │
│ │ Enter task description (opt.)   │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Priority                            │
│ ┌─────────────────────────────────┐ │
│ │ Medium               ▼          │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [Cancel]               [Save Task] │
└─────────────────────────────────────┘
```

**Form Elements**:
- **Title**: Text input, required, autofocus on modal open
- **Description**: Textarea (3-4 lines), optional
- **Priority**: Select dropdown (Low, Medium, High), defaults to Medium
- **Buttons**: Cancel (secondary) + Save (primary), aligned right

**Validation**:
- Title required: Show error message if empty on submit
- Inline validation: Red border + error text below input

**Loading State**:
- Save button shows spinner + "Saving..." text while API call in progress
- Disable form inputs during save

**Success State**:
- Close modal automatically
- Show success toast notification: "Task created successfully!" (top-right corner, auto-dismiss after 3 seconds)
- Refresh task list

**Error State**:
- Show error message below form: "Failed to save task. Please try again."
- Re-enable form for retry

---

## Task List View Details

### Layout Variants

**List View** (default):
- Single column of task cards
- Full width (up to max-w-4xl)
- Cards stack vertically

**Grid View** (optional, desktop only):
- 2-column grid on desktop (> 1024px)
- Single column on mobile/tablet
- Use `grid grid-cols-1 md:grid-cols-2 gap-4`

### Empty State

When user has no tasks:
```
┌───────────────────────────────────┐
│                                   │
│         [Large Icon]              │
│                                   │
│    No tasks yet!                  │
│    Create your first task to      │
│    get started.                   │
│                                   │
│    [Create Task] Button           │
│                                   │
└───────────────────────────────────┘
```

**Styling**:
- Centered content: `flex flex-col items-center justify-center min-h-[400px]`
- Icon: 64×64px, `text-gray-300`
- Message: `text-gray-500 text-center max-w-sm`
- Button: Primary button

### Loading State

While fetching tasks from API:
- Show spinner centered: `<div class="flex justify-center items-center min-h-[200px]"><svg class="animate-spin...">...</svg></div>`
- Or show 3-4 skeleton cards with pulse animation

### Error State

If API call fails:
```
┌───────────────────────────────────┐
│                                   │
│    Failed to load tasks           │
│    [Retry] Button                 │
│                                   │
└───────────────────────────────────┘
```

**Styling**:
- Centered, similar to empty state
- Red icon (exclamation triangle)
- Retry button (secondary)

---

## Mobile Considerations

### Touch Targets

**Minimum Size**: 44×44px for all interactive elements
- Buttons: At least 44px height
- Checkboxes: 20×20px with 12px padding around (total 44px)
- Icon buttons: 40×40px minimum

### Gestures

**Swipe Actions** (optional enhancement):
- Swipe left on task card: Reveal delete button
- Swipe right on task card: Mark as complete

**Implementation**: Use touch events or library like `react-swipeable`

### Mobile Navigation

**Header**:
- Fixed or sticky header: `sticky top-0 bg-white z-10`
- Title on left, "+ New" button on right
- Shadow on scroll: `shadow-sm`

**Filters**:
- Horizontal scroll if needed: `overflow-x-auto whitespace-nowrap`
- Touch-friendly tabs

**Forms**:
- Full-width inputs
- Large touch-friendly buttons
- Bottom-fixed buttons for long forms (optional)

### Performance

**Optimize for Mobile**:
- Lazy load images (if task attachments added in future)
- Infinite scroll or pagination for large lists
- Debounce search/filter inputs

---

## Acceptance Criteria

### Visual Criteria

- [ ] All text is legible and meets WCAG AA contrast standards
- [ ] Font sizes are appropriate: base 16px, headings larger
- [ ] Spacing follows 4-8px scale consistently (Tailwind defaults)
- [ ] Buttons have minimum 44×44px touch targets
- [ ] Cards have subtle shadows and hover effects
- [ ] Priority badges use distinct colors (red/yellow/green)
- [ ] Responsive layout works on mobile (< 640px), tablet (640-1024px), desktop (> 1024px)
- [ ] Maximum content width is 1024px (max-w-4xl) on large screens
- [ ] Completed tasks have visual distinction (strikethrough, muted color)

### Interactive Criteria

- [ ] All buttons have visible hover states
- [ ] All focusable elements have visible focus indicators (2px blue ring)
- [ ] Forms validate on submit (title required)
- [ ] Error messages display below invalid inputs in red
- [ ] Loading states show spinner + "Loading..." text
- [ ] Success actions show toast notifications (auto-dismiss after 3 seconds)
- [ ] Modal dialogs close on "Cancel", "X", or outside click
- [ ] Delete action shows confirmation dialog before deletion
- [ ] Task completion checkbox toggles immediately with visual feedback

### Accessibility Criteria

- [ ] All interactive elements are keyboard-accessible (Tab navigation)
- [ ] All form inputs have associated `<label>` elements
- [ ] All buttons have descriptive `aria-label` attributes
- [ ] Focus order is logical (top to bottom, left to right)
- [ ] Screen reader announces loading states (`aria-live` regions)
- [ ] Color is not the only way to convey information (use icons + text)
- [ ] Skip link provided for screen readers

### Responsiveness Criteria

- [ ] Single column layout on mobile (< 640px)
- [ ] Full-width buttons on mobile, auto-width on desktop
- [ ] Filters scroll horizontally on mobile if needed
- [ ] Task cards have 16px margins on mobile, more on desktop
- [ ] Forms stack vertically on mobile, horizontal on desktop
- [ ] Modal dialogs are 90% width on mobile, fixed max-width on desktop
- [ ] Touch targets are at least 44×44px on all devices

---

## Out of Scope

The following are **not included** in Phase II and may be considered for future phases:

- **Dark Mode**: Light mode only for Phase II
- **Themes/Customization**: No user-customizable colors or themes
- **Drag and Drop**: No drag-to-reorder tasks
- **Advanced Filtering**: No multi-criteria filters (tags, date ranges)
- **Task Attachments**: No file uploads or images
- **Rich Text Editing**: Description is plain text only
- **Animations**: Minimal animations (only hover/focus transitions, no complex animations)
- **Offline Support**: Requires internet connection
- **Multi-select**: No bulk operations (delete multiple tasks)
- **Search**: No search functionality (filter only)
- **Calendar View**: List view only
- **Subtasks**: No nested tasks or subtasks
- **Collaboration**: Single-user only (no sharing/commenting)

---

## Assumptions

1. **Device Support**: Optimized for modern browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile. IE11 not supported.
2. **Network**: Assumes stable internet connection. No offline mode.
3. **User Familiarity**: Users are familiar with standard web interfaces and task management apps.
4. **Accessibility**: Target WCAG AA compliance (not AAA).
5. **Localization**: English only for Phase II. No internationalization (i18n).
6. **Performance**: Expected to handle 1000+ tasks per user without performance degradation.
7. **Screen Sizes**: Optimized for common resolutions (320px-2560px width).

---

## Success Criteria

The task interface UI is considered successful when:

1. **Usability**: Users can create, view, edit, and delete tasks with minimal clicks/taps (max 3 interactions per operation).
2. **Readability**: 95% of users report the interface is "easy to read" in usability testing.
3. **Responsiveness**: Interface renders correctly on mobile, tablet, and desktop without horizontal scrolling or layout breaks.
4. **Accessibility**: Passes automated accessibility scans (axe, Lighthouse) with 90%+ score.
5. **Performance**: Page loads in under 2 seconds on 3G connection.
6. **Aesthetics**: Users rate the interface as "modern and professional" in surveys (80%+ positive).
7. **Error Recovery**: Users can recover from errors (e.g., empty title) without losing data or reloading the page.

---

## Implementation Notes

**Tailwind CSS Configuration**:
- Use default Tailwind theme (no customization needed for Phase II)
- Extend colors if specific brand colors needed: `extend: { colors: { brand: '#yourcolor' } }`
- Use Tailwind's default spacing scale (4px increments)

**Component Structure**:
- Build reusable components: `<Button>`, `<Input>`, `<Card>`, `<Modal>`, `<Badge>`
- Use TypeScript interfaces for props
- Server Components where possible (Next.js 16 App Router)

**State Management**:
- Local state with React hooks (`useState`, `useEffect`) for simple interactions
- API calls via the typed API client (from `frontend/lib/api-client.ts`)
- Loading/error states managed per component

**Icons**:
- Use Heroicons (from Tailwind team) or similar icon library
- Icons: Checkmark, Pencil (edit), Trash (delete), Plus (add), X (close), Chevron (dropdown)

---

**Specification Complete** — Ready for `/sp.plan` and `/sp.tasks` 🎨

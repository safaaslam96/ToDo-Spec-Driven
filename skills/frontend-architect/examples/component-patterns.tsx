/**
 * Frontend Component Patterns & Best Practices
 * Next.js 16+ / React 19 / TypeScript patterns for Phase II
 */

"use client"; // Required for components with hooks

import { useState, useEffect } from "react";
import { Task, TaskInput } from "@/types/task";
import { api } from "@/lib/api-client";

// ============================================================================
// PATTERN 1: Type-Safe Props
// ============================================================================

interface TaskCardProps {
  task: Task;
  onToggle: (taskId: number) => void;
  onEdit: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

// ✅ GOOD: Explicit interface, destructured props
export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
            className="mt-1"
          />
          <div>
            <h3 className={task.completed ? "line-through text-gray-500" : ""}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600">{task.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onEdit(task.id)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PATTERN 2: Client Component with State
// ============================================================================

export function TaskForm({ onSubmit, initialData, mode }: {
  onSubmit: (data: TaskInput) => Promise<void>;
  initialData?: Task;
  mode: "create" | "edit";
}) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [priority, setPriority] = useState(initialData?.priority || "medium");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ title, description, priority });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Title *
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          maxLength={255}
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn btn-primary w-full"
      >
        {isSubmitting ? "Saving..." : mode === "create" ? "Create Task" : "Update Task"}
      </button>
    </form>
  );
}

// ============================================================================
// PATTERN 3: Loading & Error States
// ============================================================================

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <div className="space-y-4">
      {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
    </div>;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={loadTasks} className="btn btn-primary">
          Retry
        </button>
      </div>
    );
  }

  // Empty state
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No tasks yet</p>
        <button className="btn btn-primary">Create Your First Task</button>
      </div>
    );
  }

  // Success state
  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}

// ============================================================================
// KEY TAKEAWAYS
// ============================================================================

/**
 * COMPONENT BEST PRACTICES:
 *
 * 1. ✅ Use TypeScript interfaces for props
 * 2. ✅ "use client" directive for components with hooks
 * 3. ✅ Always handle loading, error, and empty states
 * 4. ✅ Use controlled inputs (value + onChange)
 * 5. ✅ Validate form inputs before submission
 * 6. ✅ Show loading indicators during async operations
 * 7. ✅ Use semantic HTML (labels, forms, buttons)
 * 8. ✅ Accessible (aria labels, keyboard navigation)
 * 9. ✅ Consistent naming (onAction for callbacks)
 * 10. ✅ Keep components focused (single responsibility)
 */

/**
 * Premium TaskForm component with beautiful UI and loading states
 */

"use client";

import { useState, FormEvent } from "react";
import type { TaskCreate } from "@/types/task";

interface TaskFormProps {
  onSubmit: (data: TaskCreate) => Promise<void> | void;
  onCancel?: () => void;
  initialData?: Partial<TaskCreate>;
  isLoading?: boolean;
}

export function TaskForm({ onSubmit, onCancel, initialData, isLoading = false }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialData?.priority ?? "medium"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority
      });

      // Reset form only if not editing
      if (!initialData) {
        setTitle("");
        setDescription("");
        setPriority("medium");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsSubmitting(false);
    }
  }

  const isDisabled = isSubmitting || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm animate-slide-down">
          {error}
        </div>
      )}

      {/* Title Input */}
      <div>
        <label
          htmlFor="task-title"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-400 transition-all"
          disabled={isDisabled}
          maxLength={255}
          autoFocus
          required
        />
      </div>

      {/* Description Input */}
      <div>
        <label
          htmlFor="task-description"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          Description
        </label>
        <textarea
          id="task-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add more details... (optional)"
          rows={4}
          className="w-full px-4 py-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 text-slate-900 dark:text-white placeholder-slate-400 resize-none transition-all"
          disabled={isDisabled}
          maxLength={2000}
        />
      </div>

      {/* Priority Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Priority
        </label>
        <div className="grid grid-cols-3 gap-3">
          {(["low", "medium", "high"] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPriority(p)}
              className={`px-4 py-3 rounded-lg font-medium capitalize transition-all touch-target ${
                priority === p
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg scale-105"
                  : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
              }`}
              disabled={isDisabled}
            >
              {p === "high" && "🔴"} {p === "medium" && "🟡"} {p === "low" && "🟢"}{" "}
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isDisabled || !title.trim()}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover-glow hover-scale transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target btn-ripple"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : initialData ? (
            "Update Task"
          ) : (
            "Create Task"
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-all touch-target"
            disabled={isDisabled}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

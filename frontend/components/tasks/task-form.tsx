/**
 * TaskForm component — create or edit a task.
 * Placeholder structure for Phase II implementation.
 */

"use client";

import { useState } from "react";
import type { TaskCreate } from "@/types/task";

interface TaskFormProps {
  onSubmit: (data: TaskCreate) => void;
  initialData?: Partial<TaskCreate>;
}

export function TaskForm({ onSubmit, initialData }: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(initialData?.description ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    initialData?.priority ?? "medium"
  );

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() || undefined, priority });
    setTitle("");
    setDescription("");
    setPriority("medium");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6">
      <div>
        <label className="block text-sm font-medium">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="mt-1 w-full rounded-lg border px-4 py-2"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional details..."
          rows={3}
          className="mt-1 w-full rounded-lg border px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          className="mt-1 w-full rounded-lg border px-4 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        {initialData ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
}

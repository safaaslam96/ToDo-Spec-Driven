/**
 * TaskItem component — renders a single task row.
 * Placeholder structure for Phase II implementation.
 */

import type { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
  onToggle?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  return (
    <div className="flex items-center gap-4 rounded-lg border p-4">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle?.(task.id)}
        className="h-5 w-5"
      />
      <div className="flex-1">
        <h3
          className={`font-medium ${task.completed ? "text-gray-400 line-through" : ""}`}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="mt-1 text-sm text-gray-500">{task.description}</p>
        )}
      </div>
      <span
        className={`rounded-full px-2 py-1 text-xs ${
          task.priority === "high"
            ? "bg-red-100 text-red-700"
            : task.priority === "medium"
              ? "bg-yellow-100 text-yellow-700"
              : "bg-green-100 text-green-700"
        }`}
      >
        {task.priority}
      </span>
      <button
        onClick={() => onEdit?.(task.id)}
        className="text-sm text-blue-600 hover:underline"
      >
        Edit
      </button>
      <button
        onClick={() => onDelete?.(task.id)}
        className="text-sm text-red-600 hover:underline"
      >
        Delete
      </button>
    </div>
  );
}

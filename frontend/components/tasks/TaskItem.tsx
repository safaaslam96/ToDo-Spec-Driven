"use client";

import { Badge, Button } from "@/components/ui";
import type { Task } from "@/types/task";

export interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggleComplete, onEdit, onDelete }: TaskItemProps) {
  const priorityVariant = {
    low: "low" as const,
    medium: "medium" as const,
    high: "high" as const,
  };

  return (
    <div
      className={`rounded-lg border bg-white p-4 shadow-sm transition-all hover:shadow-md ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Left: Checkbox + Content */}
        <div className="flex flex-1 gap-3">
          <button
            onClick={() => onToggleComplete(task.id)}
            className="mt-1 h-5 w-5 flex-shrink-0 rounded border-2 border-gray-300 transition-colors hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
          >
            {task.completed && (
              <svg
                className="h-full w-full text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1">
            <h3
              className={`text-lg font-medium text-gray-900 ${
                task.completed ? "line-through" : ""
              }`}
            >
              {task.title}
            </h3>
            {task.description && (
              <p className="mt-1 text-sm text-gray-600">{task.description}</p>
            )}
            <div className="mt-2 flex items-center gap-2">
              <Badge variant={priorityVariant[task.priority]}>
                {task.priority}
              </Badge>
              {task.completed && <Badge variant="completed">Completed</Badge>}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex gap-2">
          <Button
            variant="icon"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            disabled={task.completed}
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </Button>
          <Button
            variant="icon"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
          >
            <svg
              className="h-5 w-5 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

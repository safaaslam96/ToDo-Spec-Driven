/**
 * Premium TaskItem component with glassmorphism, checkmark animation, and hover effects
 */

"use client";

import { useState } from "react";
import type { Task } from "@/types/task";
import { PriorityBadge } from "./priority-badge";

interface TaskItemProps {
  task: Task;
  onToggle?: (id: number, completed: boolean) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="glass-card p-4 mb-3 hover-lift animate-fade-in"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-start gap-4">
        {/* Custom Checkbox with Animation */}
        <button
          onClick={() => onToggle?.(task.id, !task.completed)}
          className="flex-shrink-0 mt-1 touch-target"
          aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          <div
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300 ${
              task.completed
                ? "bg-gradient-to-r from-green-500 to-emerald-500 border-green-500"
                : "border-slate-300 dark:border-slate-600 hover:border-indigo-500"
            }`}
          >
            {task.completed && (
              <svg
                className="w-3 h-3 text-white checkmark"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          <h3
            className={`text-base font-semibold mb-1 transition-all ${
              task.completed
                ? "text-slate-400 dark:text-slate-500 line-through"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {task.title}
          </h3>
          {task.description && (
            <p
              className={`text-sm mb-2 ${
                task.completed
                  ? "text-slate-400 dark:text-slate-600"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} size="sm" />
            {task.created_at && (
              <span className="text-xs text-slate-500 dark:text-slate-500">
                Created {new Date(task.created_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons (Show on hover or mobile) */}
        <div
          className={`flex items-center gap-2 transition-opacity duration-200 ${
            isHovered ? "opacity-100" : "opacity-0 md:opacity-100"
          }`}
        >
          {onEdit && (
            <button
              onClick={() => onEdit(task.id)}
              className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 transition-colors touch-target"
              aria-label="Edit task"
              title="Edit"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors touch-target"
              aria-label="Delete task"
              title="Delete"
            >
              <svg
                className="w-5 h-5"
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
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

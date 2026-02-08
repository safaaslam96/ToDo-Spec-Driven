/**
 * TaskList component — renders the list of tasks.
 * Placeholder structure for Phase II implementation.
 */

import type { Task } from "@/types/task";
import { TaskItem } from "./task-item";

interface TaskListProps {
  tasks: Task[];
  onToggle?: (id: number) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
        No tasks yet. Create your first task to get started.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

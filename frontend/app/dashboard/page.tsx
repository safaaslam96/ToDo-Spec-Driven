"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, EmptyState, ErrorState, Spinner } from "@/components/ui";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskItem } from "@/components/tasks/TaskItem";
import { taskApi } from "@/lib/api-client";
import type { Task, TaskCreate, TaskUpdate } from "@/types/task";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");

  // Check auth
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        router.push("/auth");
      }
    }
  }, [router]);

  // Load tasks
  const loadTasks = async () => {
    setIsLoading(true);
    setError("");
    try {
      const params = statusFilter !== "all" ? { status: statusFilter } : {};
      const data = await taskApi.list(params);
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load tasks");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [statusFilter]);

  const handleCreate = async (data: TaskCreate) => {
    await taskApi.create(data);
    await loadTasks();
  };

  const handleUpdate = async (data: TaskUpdate) => {
    if (!editingTask) return;
    await taskApi.update(editingTask.id, data);
    await loadTasks();
    setEditingTask(undefined);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await taskApi.delete(id);
      await loadTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to delete task");
    }
  };

  const handleToggleComplete = async (id: number) => {
    try {
      await taskApi.toggleComplete(id);
      await loadTasks();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("auth_token");
    router.push("/");
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
            <Button variant="secondary" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === "pending"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                statusFilter === "completed"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              Completed
            </button>
          </div>

          <Button variant="primary" onClick={() => setIsFormOpen(true)}>
            + Create Task
          </Button>
        </div>

        {/* Task List */}
        {error && (
          <ErrorState message={error} retry={loadTasks} />
        )}

        {!error && tasks.length === 0 && (
          <EmptyState
            title="No tasks yet"
            description="Create your first task to get started!"
            action={{
              label: "Create Task",
              onClick: () => setIsFormOpen(true),
            }}
            icon={
              <svg
                className="h-16 w-16"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />
        )}

        {!error && tasks.length > 0 && (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggleComplete={handleToggleComplete}
                onEdit={(task) => {
                  setEditingTask(task);
                  setIsFormOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      <TaskForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTask(undefined);
        }}
        onSubmit={async (data) => {
          if (editingTask) {
            await handleUpdate(data as TaskUpdate);
          } else {
            await handleCreate(data as TaskCreate);
          }
        }}
        task={editingTask}
        mode={editingTask ? "edit" : "create"}
      />
    </div>
  );
}

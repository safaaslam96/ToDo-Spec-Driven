"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, EmptyState, ErrorState, Spinner } from "@/components/ui";
import { DarkModeToggle } from "@/components/ui/DarkModeToggle";
import { SkeletonLoader } from "@/components/ui/SkeletonLoader";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskItem } from "@/components/tasks/TaskItem";
import { taskApi } from "@/lib/api-client";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { Task, TaskCreate, TaskUpdate } from "@/types/task";

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 300);

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

  // Filter tasks by search query (client-side for now)
  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(debouncedSearch.toLowerCase()))
  );

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
    localStorage.removeItem("user_id");
    router.push("/");
  };

  if (isLoading && tasks.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
          <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Tasks</h1>
              <div className="flex items-center gap-2">
                <DarkModeToggle />
                <Button variant="secondary" onClick={handleSignOut}>
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <SkeletonLoader count={5} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
        <div className="mx-auto max-w-5xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Tasks</h1>
            <div className="flex items-center gap-2">
              <Link href="/chat">
                <Button variant="secondary">
                  <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  AI Chat
                </Button>
              </Link>
              <DarkModeToggle />
              <Button variant="secondary" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Search Bar */}
        <div className="mb-6 animate-fade-in">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-400 dark:focus:border-blue-400 dark:focus:ring-blue-400"
          />
        </div>

        {/* Actions Bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                statusFilter === "all"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter("pending")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                statusFilter === "pending"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setStatusFilter("completed")}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95 ${
                statusFilter === "completed"
                  ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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

        {!error && filteredTasks.length === 0 && tasks.length > 0 && (
          <EmptyState
            title="No matching tasks"
            description="Try adjusting your search or filters"
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            }
          />
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

        {!error && filteredTasks.length > 0 && (
          <div className="space-y-3">
            {filteredTasks.map((task, index) => (
              <div
                key={task.id}
                className="animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <TaskItem
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={(task) => {
                    setEditingTask(task);
                    setIsFormOpen(true);
                  }}
                  onDelete={handleDelete}
                />
              </div>
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

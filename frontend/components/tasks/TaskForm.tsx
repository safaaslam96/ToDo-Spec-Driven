"use client";

import { useState } from "react";
import { Button, Input, Textarea, Select, Dialog } from "@/components/ui";
import type { Task, TaskCreate, TaskUpdate } from "@/types/task";

export interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskCreate | TaskUpdate) => Promise<void>;
  task?: Task;
  mode: "create" | "edit";
}

export function TaskForm({ isOpen, onClose, onSubmit, task, mode }: TaskFormProps) {
  const [title, setTitle] = useState(task?.title ?? "");
  const [description, setDescription] = useState(task?.description ?? "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task?.priority ?? "medium"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || null,
        priority,
      });
      onClose();
      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={mode === "create" ? "Create New Task" : "Edit Task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-800" role="alert">
            {error}
          </div>
        )}

        <Input
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
          required
          disabled={isLoading}
        />

        <Textarea
          label="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
          disabled={isLoading}
        />

        <Select
          label="Priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
          options={[
            { value: "low", label: "Low" },
            { value: "medium", label: "Medium" },
            { value: "high", label: "High" },
          ]}
          disabled={isLoading}
        />

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={isLoading}
            className="flex-1"
          >
            {mode === "create" ? "Create Task" : "Save Changes"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high";
  completed: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TaskCreate {
  title: string;
  description?: string | null;
  priority?: "low" | "medium" | "high";
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  priority?: "low" | "medium" | "high";
  completed?: boolean;
}

export interface TaskListParams {
  status?: "completed" | "pending";
  sort?: "created" | "title";
  limit?: number;
  offset?: number;
}

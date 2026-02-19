/**
 * API client for communicating with the FastAPI backend.
 * Automatically attaches JWT Bearer token to all requests.
 */

import type { Task, TaskCreate, TaskUpdate } from "@/types/task";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Get the stored auth token. Replace with your auth provider's method. */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/** Build headers with JWT Authorization. */
function authHeaders(): HeadersInit {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/** Generic fetch wrapper with error handling. */
async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { ...authHeaders(), ...(options.headers as Record<string, string>) },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? `API error: ${res.status}`);
  }

  if (res.status === 204) return undefined as T;
  return res.json();
}

/** Task API methods. */
export const taskApi = {
  list(params?: { status?: string; sort?: string; limit?: number; offset?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.set("status", params.status);
    if (params?.sort) query.set("sort", params.sort);
    if (params?.limit) query.set("limit", String(params.limit));
    if (params?.offset) query.set("offset", String(params.offset));
    const qs = query.toString();
    return apiFetch<Task[]>(`/api/tasks${qs ? `?${qs}` : ""}`);
  },

  get(id: number) {
    return apiFetch<Task>(`/api/tasks/${id}`);
  },

  create(data: TaskCreate) {
    return apiFetch<Task>("/api/tasks", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update(id: number, data: TaskUpdate) {
    return apiFetch<Task>(`/api/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete(id: number) {
    return apiFetch<void>(`/api/tasks/${id}`, { method: "DELETE" });
  },

  toggleComplete(id: number) {
    return apiFetch<Task>(`/api/tasks/${id}/complete`, { method: "PATCH" });
  },
};

/**
 * Chat API client for the Phase III stateless chatbot.
 * Communicates with POST /api/{user_id}/chat on the FastAPI backend.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

/** Get the stored JWT token. */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
}

/** Get the stored user ID. */
export function getUserId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("user_id");
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatResponse {
  conversation_id: number;
  response: string;
  tool_calls?: unknown[];
}

/**
 * Send a message to the stateless chat endpoint.
 * Creates a new conversation if conversationId is undefined.
 */
export async function sendChatMessage(
  userId: string,
  message: string,
  conversationId?: number
): Promise<ChatResponse> {
  const token = getToken();
  const res = await fetch(`${API_BASE}/api/${userId}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      message,
      conversation_id: conversationId ?? null,
    }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(body.detail ?? `Chat API error: ${res.status}`);
  }

  return res.json() as Promise<ChatResponse>;
}

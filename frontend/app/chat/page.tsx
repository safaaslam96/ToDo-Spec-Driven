"use client";

/**
 * Chat page — Phase III AI chatbot interface.
 * Connects to the stateless POST /api/{user_id}/chat endpoint.
 * Supports English, Urdu, and Hinglish per constitution Article V.
 */

import { useState, useEffect, useRef, FormEvent } from "react";
import { sendChatMessage, getUserId, type ChatMessage } from "@/lib/chat-api";

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Scroll to newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isLoading) return;

    const userId = getUserId();
    if (!userId) {
      setError("Not authenticated. Please sign in first.");
      return;
    }

    // Optimistically add user message
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setIsLoading(true);
    setError(null);

    try {
      const res = await sendChatMessage(userId, text, conversationId ?? undefined);

      // Set conversation ID on first message
      if (conversationId === null) {
        setConversationId(res.conversation_id);
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: res.response },
      ]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send message. Try again."
      );
      // Remove the optimistic user message on failure
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white px-4 py-3 shadow-md flex-shrink-0">
        <h1 className="text-lg font-semibold">Todo AI Assistant</h1>
        <p className="text-blue-200 text-xs mt-0.5">
          Chat in English, Urdu, or Hinglish · Bilingual support
        </p>
      </header>

      {/* Message list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-16 text-sm">
            <p className="text-2xl mb-2">👋</p>
            <p>Hi! Ask me to manage your tasks.</p>
            <p className="mt-1 text-xs text-gray-300">
              Try: &quot;Show my tasks&quot; or &quot;Mere pending tasks dikhao&quot;
            </p>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs sm:max-w-md lg:max-w-lg px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : "bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Typing indicator */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 shadow-sm rounded-2xl rounded-bl-none px-4 py-3 flex gap-1">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="flex justify-center">
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-1.5 rounded-lg">
              {error}
            </p>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="Add a task, list tasks, complete... (English or Urdu)"
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400"
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="bg-blue-600 text-white rounded-full px-5 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}

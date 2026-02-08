"use client";

import { useState } from "react";

interface TaskSuggestion {
  title: string;
  description: string;
}

interface AISuggestionsProps {
  onAddTask: (task: { title: string; description: string; priority: "medium" }) => void;
}

export function AISuggestions({ onAddTask }: AISuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TaskSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);

  async function fetchSuggestions() {
    setIsLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("authToken");
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

      const res = await fetch(`${apiUrl}/api/tasks/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}),
      });

      if (res.status === 429) {
        const data = await res.json();
        setRetryAfter(data.detail?.retry_after || 30);
        setError(
          data.detail?.message || "Rate limit exceeded. Please try again in a moment."
        );
        return;
      }

      if (res.status === 503) {
        setError("AI suggestions temporarily unavailable. Please try again later.");
        return;
      }

      if (!res.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to get suggestions. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleAddSuggestion(suggestion: TaskSuggestion) {
    onAddTask({
      title: suggestion.title,
      description: suggestion.description,
      priority: "medium",
    });

    // Remove the added suggestion from the list
    setSuggestions((prev) => prev.filter((s) => s.title !== suggestion.title));
  }

  return (
    <div className="space-y-4">
      {/* Header with Get Suggestions Button */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <svg
              className="w-5 h-5 text-purple-600 dark:text-purple-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            AI Suggestions
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Get intelligent task recommendations powered by AI
          </p>
        </div>
        <button
          onClick={fetchSuggestions}
          disabled={isLoading || retryAfter > 0}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg hover-glow hover-scale transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-target btn-ripple"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Generating...
            </span>
          ) : retryAfter > 0 ? (
            `Wait ${retryAfter}s`
          ) : (
            "Get AI Suggestions"
          )}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm animate-slide-down flex items-start gap-3">
          <svg
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
          <div>
            <p className="font-medium">{error}</p>
            {retryAfter === 0 && (
              <button
                onClick={fetchSuggestions}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      )}

      {/* Suggestions Grid */}
      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="glass-card p-5 border-2 border-purple-200 dark:border-purple-800/50 hover-lift animate-fade-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* AI Badge */}
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-lg">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  AI Suggested
                </span>
              </div>

              <div className="pr-32">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                  {suggestion.title}
                </h3>
                {suggestion.description && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    {suggestion.description}
                  </p>
                )}
              </div>

              <button
                onClick={() => handleAddSuggestion(suggestion)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-medium rounded-lg hover-glow hover-scale transition-all touch-target mt-3"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add to Tasks
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {suggestions.length === 0 && !isLoading && !error && (
        <div className="text-center py-12">
          <svg
            className="w-24 h-24 mx-auto text-purple-200 dark:text-purple-900 mb-4"
            fill="none"
            viewBox="0 0 200 200"
          >
            <circle
              cx="100"
              cy="100"
              r="60"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray="8 8"
            />
            <path
              d="M100 70v60M70 100h60"
              stroke="currentColor"
              strokeWidth="6"
              strokeLinecap="round"
              opacity="0.3"
            />
            <circle cx="100" cy="100" r="30" fill="currentColor" opacity="0.1" />
          </svg>
          <p className="text-slate-600 dark:text-slate-400">
            Click "Get AI Suggestions" to discover new tasks
          </p>
        </div>
      )}
    </div>
  );
}

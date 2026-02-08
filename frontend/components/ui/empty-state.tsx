"use client";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state animate-fade-in">
      {/* Illustration SVG */}
      <div className="mb-6">
        <svg
          className="w-48 h-48 mx-auto text-indigo-200 dark:text-indigo-900"
          fill="none"
          viewBox="0 0 200 200"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="currentColor"
            strokeWidth="4"
            fill="none"
            strokeDasharray="8 8"
          />
          <path
            d="M100 60v80M60 100h80"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            opacity="0.5"
          />
          <circle cx="100" cy="100" r="40" fill="currentColor" opacity="0.1" />
        </svg>
      </div>

      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm mx-auto">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover-glow hover-scale transition-all touch-target"
        >
          <svg
            className="w-5 h-5 mr-2"
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
          {actionLabel}
        </button>
      )}
    </div>
  );
}

"use client";

interface FloatingActionButtonProps {
  onClick: () => void;
  icon?: React.ReactNode;
  ariaLabel?: string;
}

export function FloatingActionButton({
  onClick,
  icon,
  ariaLabel = "Add new task",
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="fab touch-target"
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {icon || (
        <svg
          className="w-6 h-6"
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
      )}
    </button>
  );
}

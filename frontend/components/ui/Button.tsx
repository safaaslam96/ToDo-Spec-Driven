"use client";

import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "icon";
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = "primary",
  loading = false,
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] hover:scale-105 active:scale-95";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg focus:ring-blue-500 px-6 py-3 dark:from-blue-500 dark:to-blue-600",
    secondary:
      "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 px-6 py-3 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700",
    danger:
      "bg-gradient-to-r from-red-600 to-red-700 text-white hover:shadow-lg focus:ring-red-500 px-6 py-3 dark:from-red-500 dark:to-red-600",
    icon: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500 p-2 rounded-full min-h-[44px] min-w-[44px] dark:text-gray-400 dark:hover:bg-gray-800",
  };

  const combinedClasses = `${baseClasses} ${variantClasses[variant]} ${className}`;

  return (
    <button
      className={combinedClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="mr-2 h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
}

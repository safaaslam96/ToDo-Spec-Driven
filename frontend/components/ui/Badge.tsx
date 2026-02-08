"use client";

import React from "react";

export interface BadgeProps {
  variant?: "low" | "medium" | "high" | "completed" | "default";
  children: React.ReactNode;
  className?: string;
}

export function Badge({
  variant = "default",
  children,
  className = "",
}: BadgeProps) {
  const variantClasses = {
    low: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700",
    high: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700",
    completed: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700",
    default: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}

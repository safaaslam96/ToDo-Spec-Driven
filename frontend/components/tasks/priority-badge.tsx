interface PriorityBadgeProps {
  priority: "low" | "medium" | "high";
  size?: "sm" | "md";
}

export function PriorityBadge({ priority, size = "md" }: PriorityBadgeProps) {
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-3 py-1 text-sm",
  };

  const priorityConfig = {
    high: {
      className: "badge-high",
      label: "High",
      icon: "🔴",
    },
    medium: {
      className: "badge-medium",
      label: "Medium",
      icon: "🟡",
    },
    low: {
      className: "badge-low",
      label: "Low",
      icon: "🟢",
    },
  };

  const config = priorityConfig[priority];

  return (
    <span
      className={`inline-flex items-center gap-1 ${config.className} ${sizeClasses[size]} rounded-full font-medium`}
    >
      <span className="text-xs">{config.icon}</span>
      {config.label}
    </span>
  );
}

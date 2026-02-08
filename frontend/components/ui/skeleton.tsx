export function TaskSkeleton() {
  return (
    <div className="glass-card p-4 mb-3 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-5 h-5 bg-slate-300 dark:bg-slate-700 rounded shimmer" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-3/4 shimmer" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2 shimmer" />
        </div>
        <div className="w-16 h-6 bg-slate-200 dark:bg-slate-800 rounded-full shimmer" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="h-8 bg-slate-300 dark:bg-slate-700 rounded w-1/3 shimmer" />

      {/* Progress rings skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="glass-card p-6 flex flex-col items-center justify-center"
          >
            <div className="w-24 h-24 bg-slate-300 dark:bg-slate-700 rounded-full shimmer mb-3" />
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-16 shimmer" />
          </div>
        ))}
      </div>

      {/* Tasks skeleton */}
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <TaskSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

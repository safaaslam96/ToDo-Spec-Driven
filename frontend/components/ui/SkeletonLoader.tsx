export function SkeletonLoader({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl bg-white p-6 shadow-md dark:bg-gray-800"
        >
          <div className="flex items-start gap-4">
            {/* Checkbox skeleton */}
            <div className="h-5 w-5 rounded bg-gray-200 dark:bg-gray-700" />

            <div className="flex-1 space-y-3">
              {/* Title skeleton */}
              <div className="h-5 w-3/4 rounded bg-gray-200 dark:bg-gray-700" />

              {/* Description skeleton */}
              <div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-750" />
            </div>

            {/* Badge skeleton */}
            <div className="h-6 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>
        </div>
      ))}
    </div>
  );
}

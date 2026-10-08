export function ListSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="max-w-4xl animate-pulse" aria-hidden>
      <div className="mb-8 flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted h-5 w-16 rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="mb-8 space-y-3">
          <div className="bg-muted h-6 w-2/3 rounded" />
          <div className="bg-muted h-4 w-full rounded" />
        </div>
      ))}
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="bg-muted h-3 w-24 rounded" />
      <div className="bg-muted h-9 w-3/4 rounded" />
      <div className="bg-muted h-4 w-full rounded" />
      <div className="bg-muted h-4 w-40 rounded" />
      <div className="space-y-3 pt-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-muted h-4 w-full rounded" />
        ))}
      </div>
    </div>
  );
}

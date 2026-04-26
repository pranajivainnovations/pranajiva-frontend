export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header skeleton */}
      <div className="bg-surface-warm">
        <div className="container mx-auto px-4 py-10">
          <div className="h-3 w-24 bg-ink/5 rounded mb-4 animate-pulse" />
          <div className="h-8 w-64 bg-ink/5 rounded mb-3 animate-pulse" />
          <div className="h-4 w-48 bg-ink/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-card overflow-hidden animate-pulse">
              <div className="aspect-[4/5] bg-surface-warm" />
              <div className="p-5 space-y-3">
                <div className="h-3 bg-ink/5 rounded w-1/3" />
                <div className="h-5 bg-ink/5 rounded w-2/3" />
                <div className="h-4 bg-ink/5 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

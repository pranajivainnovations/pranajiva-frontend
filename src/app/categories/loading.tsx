export default function CategoriesLoading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header skeleton */}
      <div className="bg-surface-warm">
        <div className="container mx-auto px-4 py-10">
          <div className="h-3 w-24 bg-ink/5 rounded mb-4 animate-pulse" />
          <div className="h-8 w-72 bg-ink/5 rounded mb-3 animate-pulse" />
          <div className="h-4 w-96 bg-ink/5 rounded animate-pulse" />
        </div>
      </div>

      {/* Category cards skeleton */}
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-card overflow-hidden animate-pulse">
              <div className="p-7 bg-white space-y-4">
                <div className="h-6 bg-ink/5 rounded w-2/3" />
                <div className="h-4 bg-ink/5 rounded w-full" />
                <div className="h-4 bg-ink/5 rounded w-3/4" />
                <div className="pt-4 space-y-2">
                  <div className="h-3 bg-ink/5 rounded w-1/2" />
                  <div className="h-3 bg-ink/5 rounded w-1/2" />
                  <div className="h-3 bg-ink/5 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

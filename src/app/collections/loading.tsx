export default function CollectionsLoading() {
  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-surface-warm">
        <div className="container mx-auto px-4 py-10">
          <div className="h-3 w-28 bg-ink/5 rounded mb-4 animate-pulse" />
          <div className="h-8 w-56 bg-ink/5 rounded mb-3 animate-pulse" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-card p-7 bg-white animate-pulse space-y-4">
              <div className="h-6 bg-ink/5 rounded w-2/3" />
              <div className="h-4 bg-ink/5 rounded w-full" />
              <div className="h-4 bg-ink/5 rounded w-1/3 mt-6" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

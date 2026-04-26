export default function RootLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 mb-4">
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 rounded-full bg-accent animate-bounce [animation-delay:300ms]" />
        </div>
        <p className="text-sm text-ink-light font-light">Loading...</p>
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-6">⚠️</div>
        <h1 className="font-heading text-2xl mb-3">Something went wrong</h1>
        <p className="text-sm text-ink-light mb-8 leading-relaxed">
          We encountered an unexpected error. Please try again or return to the
          homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <button onClick={reset} className="btn-primary">
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-ink/10 text-sm font-medium hover:bg-surface-warm transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

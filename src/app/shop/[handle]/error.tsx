/**
 * Error Boundary for Product Routes
 * 
 * Handles errors that occur while rendering product pages
 */

"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

export default function ProductError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Product page error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-prana-cream to-white px-4">
      <div className="text-center max-w-lg">
        <div className="mb-8">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-3xl font-heading font-bold text-charcoal-dark mb-4">
            Something went wrong
          </h2>
          <p className="text-lg text-charcoal-soft/70 mb-8">
            We encountered an error loading this product. Please try again or browse our other products.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-prana-sage text-white font-semibold hover:bg-prana-sage/90 transition-colors"
          >
            Try Again
          </button>

          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-prana-sage text-prana-sage font-semibold hover:bg-prana-sage/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

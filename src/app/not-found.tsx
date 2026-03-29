/**
 * Not Found Page (404)
 * 
 * Displayed when a page or resource is not found.
 * Handles all notFound() calls throughout the app.
 */

import Link from "next/link";
import { Home, ArrowRight } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-prana-cream to-white px-4">
      <div className="text-center max-w-lg">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-8xl font-heading font-bold text-prana-sage/20 mb-2">404</h1>
          <h2 className="text-4xl font-heading font-bold text-charcoal-dark mb-4">Page Not Found</h2>
          <p className="text-lg text-charcoal-soft/70 mb-8">
            We couldn't find the product or page you're looking for. It may have been moved or deleted.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-prana-sage text-white font-semibold hover:bg-prana-sage/90 transition-colors"
          >
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-prana-sage text-prana-sage font-semibold hover:bg-prana-sage/5 transition-colors"
          >
            Browse Shop
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 pt-8 border-t border-prana-sage/10">
          <p className="text-sm text-charcoal-soft/60 mb-4">Need help? Try one of these:</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Link href="/shop" className="text-sm text-prana-sage hover:underline">
              Shop
            </Link>
            <span className="text-charcoal-soft/40">•</span>
            <Link href="/knowledge-center" className="text-sm text-prana-sage hover:underline">
              Knowledge Center
            </Link>
            <span className="text-charcoal-soft/40">•</span>
            <Link href="/contact" className="text-sm text-prana-sage hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

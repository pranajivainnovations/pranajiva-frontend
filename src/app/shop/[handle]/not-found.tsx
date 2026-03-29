/**
 * Product Not Found Page
 * 
 * Displays when a product with the requested handle doesn't exist.
 */

import Link from "next/link";
import { ArrowLeft, ShoppingBag } from "lucide-react";

export default function ProductNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-prana-cream to-white px-4">
      <div className="text-center max-w-lg">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-8xl font-heading font-bold text-prana-sage/20 mb-2">404</h1>
          <h2 className="text-4xl font-heading font-bold text-charcoal-dark mb-4">Product Not Found</h2>
          <p className="text-lg text-charcoal-soft/70 mb-8">
            We couldn't find the product you're looking for. It may have been discontinued or is temporarily out of stock.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-prana-sage text-prana-sage font-semibold hover:bg-prana-sage/5 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Shop
          </Link>
          
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-prana-sage text-white font-semibold hover:bg-prana-sage/90 transition-colors"
          >
            <ShoppingBag className="w-5 h-5" />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}

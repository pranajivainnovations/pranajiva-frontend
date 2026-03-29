/**
 * ProductCard Component
 * 
 * Reusable product card for displaying products in grids and listings.
 * Supports stealth mode styling and add to cart functionality.
 */

"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getVariantPrice, getWellnessCategory, isDiscreetProduct } from "@/lib/medusa";
import { useCartStore } from "@/stores/cart-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useStealthMode } from "@/stores/stealth-mode";
import { useState } from "react";

interface ProductVariant {
  id: string;
  title: string;
  prices?: Array<{ currency_code: string; amount: number }>;
  inventory_quantity?: number;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: ProductVariant[];
  metadata?: Record<string, unknown> | null;
  collection?: {
    title: string;
  } | null;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isStealthMode } = useStealthMode();
  const { addItem, isLoading: cartLoading } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCustomerStore();
  const [isAdding, setIsAdding] = useState(false);
  
  const inWishlist = isInWishlist(product.id);
  const category = getWellnessCategory(product);
  const isDiscreet = isDiscreetProduct(product);
  
  // Get first variant and its price
  const firstVariant = product.variants?.[0];
  const price = firstVariant ? getVariantPrice(firstVariant, "inr") : null;
  const formattedPrice = formatPrice(price, "inr");
  
  // Check stock
  const inStock = (firstVariant?.inventory_quantity ?? 0) > 0;
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!firstVariant || isAdding || cartLoading) return;
    
    setIsAdding(true);
    await addItem(firstVariant.id, 1);
    setIsAdding(false);
  };
  
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (inWishlist) {
      removeFromWishlist(product.id);
    } else if (firstVariant) {
      addToWishlist(product.id, firstVariant.id);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group"
    >
      <Link href={`/shop/${product.handle}`} className="block">
        <div className={`card-premium overflow-hidden transition-all duration-300 group-hover:shadow-premium ${isStealthMode ? "opacity-90" : ""}`}>
          {/* Image Container */}
          <div className="relative aspect-square bg-gradient-to-br from-prana-cream to-neutral-100 overflow-hidden">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-6xl opacity-20">🌿</div>
              </div>
            )}
            
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300">
              <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {/* Wishlist Button */}
                <button
                  onClick={handleWishlistToggle}
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                    inWishlist
                      ? "bg-velvet-rose text-white"
                      : "bg-white/90 text-charcoal-soft hover:bg-velvet-rose hover:text-white"
                  }`}
                  aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-current" : ""}`} />
                </button>
                
                {/* Quick View Button */}
                <button
                  className="w-10 h-10 rounded-full bg-white/90 text-charcoal-soft hover:bg-prana-sage hover:text-white flex items-center justify-center transition-colors"
                  aria-label="Quick view"
                >
                  <Eye className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {isDiscreet && (
                <span className="badge-discreet text-xs">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Discreet
                </span>
              )}
              {!inStock && (
                <span className="px-2 py-1 bg-charcoal-soft text-white text-xs rounded-full">
                  Out of Stock
                </span>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            {/* Category */}
            <div className="flex items-center justify-between mb-2">
              <span className="tech-label text-prana-sage">{category}</span>
              {product.collection && (
                <span className="text-xs text-charcoal-soft/50">{product.collection.title}</span>
              )}
            </div>
            
            {/* Title */}
            <h3 className={`font-heading text-lg mb-2 line-clamp-2 transition-colors ${isStealthMode ? "text-charcoal-soft/70" : "group-hover:text-prana-sage"}`}>
              {product.title}
            </h3>
            
            {/* Description */}
            {product.description && (
              <p className="text-sm text-charcoal-soft/60 line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
            
            {/* Price & Add to Cart */}
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-bold text-charcoal-soft">
                  {formattedPrice}
                </span>
                {firstVariant && product.variants && product.variants.length > 1 && (
                  <span className="text-xs text-charcoal-soft/50">
                    {product.variants.length} variants
                  </span>
                )}
              </div>
              
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding || cartLoading}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  inStock
                    ? "btn-velvet"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {isAdding ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/**
 * ProductCard Skeleton for loading states
 */
export function ProductCardSkeleton() {
  return (
    <div className="card-premium overflow-hidden animate-pulse">
      <div className="aspect-square bg-neutral-200" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-neutral-200 rounded w-1/3" />
        <div className="h-6 bg-neutral-200 rounded w-3/4" />
        <div className="h-4 bg-neutral-200 rounded w-full" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-neutral-200 rounded w-1/4" />
          <div className="h-10 bg-neutral-200 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

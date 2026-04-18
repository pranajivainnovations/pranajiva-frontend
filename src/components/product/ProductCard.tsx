/**
 * ProductCard — used on Shop page
 */

"use client";

import { ShoppingBag, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatPrice, getVariantPrice, getWellnessCategory } from "@/lib/medusa";
import { useCartStore } from "@/stores/cart-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useStealthMode } from "@/stores/stealth-mode";
import { useState, useCallback } from "react";

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
  collection?: { title: string } | null;
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
  const firstVariant = product.variants?.[0];
  const price = firstVariant ? getVariantPrice(firstVariant, "inr") : null;
  const formattedPrice = formatPrice(price, "inr");
  const inStock = (firstVariant?.inventory_quantity ?? 0) > 0;

  const handleAddToCart = useCallback(
    async (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!firstVariant || isAdding || cartLoading) return;
      setIsAdding(true);
      await addItem(firstVariant.id, 1);
      setIsAdding(false);
    },
    [firstVariant, isAdding, cartLoading, addItem]
  );

  const handleWishlistToggle = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (inWishlist) removeFromWishlist(product.id);
      else if (firstVariant) addToWishlist(product.id, firstVariant.id);
    },
    [inWishlist, product.id, firstVariant, removeFromWishlist, addToWishlist]
  );

  return (
    <div
      className="group animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      <Link href={`/shop/${product.handle}`} className="block">
        <div className="card-premium overflow-hidden">
          <div className="relative aspect-[4/5] bg-surface-warm overflow-hidden">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-faint/30 text-4xl">
                ✦
              </div>
            )}

            <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={handleWishlistToggle}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors backdrop-blur-sm ${
                  inWishlist
                    ? "bg-accent text-white"
                    : "bg-white/80 text-ink-light hover:text-accent"
                }`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            {!inStock && (
              <div className="absolute top-3 left-3">
                <span className="px-2.5 py-1 bg-brand-dark text-white text-[10px] tracking-widest uppercase rounded-full">
                  Sold out
                </span>
              </div>
            )}
          </div>

          <div className="p-5">
            <span className="label text-[10px] block mb-2 capitalize">{category}</span>

            <h3 className="font-heading text-lg leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
              {isStealthMode ? "Wellness Product" : product.title}
            </h3>

            {product.description && (
              <p className="text-xs text-ink-light line-clamp-2 mb-3">
                {product.description}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-sm font-medium text-ink">{formattedPrice}</span>

              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding || cartLoading}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs tracking-wide transition-all ${
                  inStock
                    ? "bg-brand-dark text-white hover:bg-brand-dark/90"
                    : "bg-surface-muted text-ink-faint cursor-not-allowed"
                }`}
              >
                {isAdding ? (
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <ShoppingBag className="w-3.5 h-3.5" />
                )}
                Add
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="card-premium overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-surface-warm" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-surface-muted rounded w-1/3" />
        <div className="h-5 bg-surface-muted rounded w-3/4" />
        <div className="h-3 bg-surface-muted rounded w-full" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-surface-muted rounded w-1/4" />
          <div className="h-8 bg-surface-muted rounded-full w-16" />
        </div>
      </div>
    </div>
  );
}

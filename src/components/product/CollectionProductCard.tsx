"use client";

import { memo, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ShoppingBag } from "lucide-react";
import { formatPrice, getVariantPrice } from "@/lib/medusa";
import { useCartStore } from "@/stores/cart-store";
import type { CollectionProduct } from "@/types/product";

interface CollectionProductCardProps {
  product: CollectionProduct;
  index: number;
}

function CollectionProductCardInner({ product, index }: CollectionProductCardProps) {
  const { addItem, isLoading: cartLoading } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const firstVariant = product.variants?.[0];
  const price = firstVariant ? getVariantPrice(firstVariant, "inr") : null;
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

  return (
    <div
      className="animate-fade-up"
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: "backwards" }}
    >
      <Link href={`/shop/${product.handle}`} className="group block">
        <div className="card-premium overflow-hidden">
          <div className="relative aspect-[4/5] bg-surface-warm overflow-hidden">
            {product.thumbnail ? (
              <Image
                src={product.thumbnail}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-faint/30 text-4xl">
                ✦
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute bottom-0 inset-x-0 p-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding || cartLoading}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs tracking-wide transition-all duration-300 backdrop-blur-md ${
                  inStock
                    ? "bg-white/90 text-ink hover:bg-white"
                    : "bg-white/50 text-ink-faint cursor-not-allowed"
                }`}
              >
                {isAdding ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <ShoppingBag className="w-3.5 h-3.5" />
                )}
                {inStock ? "Add to Bag" : "Sold Out"}
              </button>
            </div>

            {product.tags && product.tags.length > 0 && (
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {product.tags.slice(0, 2).map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2.5 py-1 bg-white/80 backdrop-blur-sm text-[10px] tracking-widest uppercase text-ink-light rounded-full capitalize"
                  >
                    {tag.value}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="p-5">
            {product.type && (
              <span className="label text-[10px] block mb-2 capitalize">
                {product.type.value.replace(/-/g, " ")}
              </span>
            )}
            <h3 className="font-heading text-[17px] leading-snug text-ink mb-1.5 line-clamp-2 group-hover:text-accent transition-colors duration-300">
              {product.title}
            </h3>
            {product.description && (
              <p className="text-xs leading-relaxed text-ink-light line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
            <span className="text-sm text-ink font-medium">
              {price ? formatPrice(price, "inr") : "Price on request"}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export const CollectionProductCard = memo(CollectionProductCardInner);

export function ProductSkeleton() {
  return (
    <div className="card-premium overflow-hidden animate-pulse">
      <div className="aspect-[4/5] bg-surface-warm" />
      <div className="p-5 space-y-3">
        <div className="h-2.5 bg-surface-muted rounded-full w-1/4" />
        <div className="h-4 bg-surface-muted rounded w-3/4" />
        <div className="h-2.5 bg-surface-muted rounded-full w-full" />
        <div className="h-3.5 bg-surface-muted rounded w-1/3 mt-1" />
      </div>
    </div>
  );
}

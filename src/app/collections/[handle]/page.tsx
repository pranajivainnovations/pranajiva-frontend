/**
 * Dynamic Collection Page
 *
 * Thin page component that fetches data and composes
 * CollectionLayout, FilterSidebar, and CollectionProductCard.
 * All filtering is handled by the useProductFilters hook (URL-synced).
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { medusaClient } from "@/lib/medusa";
import { useProductFilters } from "@/hooks/useProductFilters";
import { CollectionLayout } from "@/components/layout/CollectionLayout";
import {
  CollectionProductCard,
  ProductSkeleton,
} from "@/components/product/CollectionProductCard";
import type { Collection, CollectionProduct } from "@/types/product";

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function CollectionPage() {
  const BRAND = "pranajiva";
  const params = useParams();
  const handle = params.handle as string;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [products, setProducts] = useState<CollectionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    filteredProducts,
    availableTypes,
    availableTags,
    selectedTypes,
    selectedTags,
    setTypes,
    setTags,
    clearAll,
    activeFilterCount,
  } = useProductFilters(products, { basePath: `/collections/${handle}` });

  // Fetch collection + products — memoised to avoid stale closure issues
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { collections } = await medusaClient.collections.list({
        handle: [handle],
        limit: 1,
      });
      const col = collections[0];
      if (!col) {
        setCollection(null);
        setProducts([]);
        return;
      }
      const collectionBrand = String((col as { metadata?: Record<string, unknown> }).metadata?.brand || "").toLowerCase();
      if (collectionBrand !== BRAND) {
        setCollection(null);
        setProducts([]);
        return;
      }
      setCollection(col as Collection);

      const { products: prods } = await medusaClient.products.list({
        collection_id: [col.id],
        expand: "variants,variants.prices,type,tags,collection",
        limit: 100,
      });
      setProducts(prods as CollectionProduct[]);
    } catch (err) {
      console.error("Failed to fetch collection data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [handle]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <CollectionLayout
      collection={collection}
      isLoading={isLoading}
      filteredCount={filteredProducts.length}
      activeFilterCount={activeFilterCount}
      availableTypes={availableTypes}
      availableTags={availableTags}
      selectedTypes={selectedTypes}
      selectedTags={selectedTags}
      onTypeChange={setTypes}
      onTagChange={setTags}
    >
      {/* Loading */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length > 0 ? (
        /* Product grid */
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filteredProducts.map((product, i) => (
            <CollectionProductCard key={product.id} product={product} index={i} />
          ))}
        </div>
      ) : (
        /* Empty state */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-xl font-heading mb-2">No products found</h3>
          <p className="text-sm text-charcoal-soft/60 mb-6 max-w-sm">
            Try adjusting your filters or browse all products in this collection.
          </p>
          <button onClick={clearAll} className="btn-velvet">
            Clear filters
          </button>
        </div>
      )}
    </CollectionLayout>
  );
}

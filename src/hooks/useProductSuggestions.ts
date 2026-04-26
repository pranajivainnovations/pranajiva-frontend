/**
 * useProductSuggestions — fetches cross-category product suggestions
 * for the "Complete Your Ritual" and "Related Products" sections.
 */

'use client';

import { useEffect, useState } from 'react';
import { medusaClient } from '@/lib/medusa';
import { getNextPillar, getProductPillar, JOURNEY_PILLARS } from '@/lib/wellness-journey';

interface SuggestionProduct {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: Array<{
    id: string;
    prices?: Array<{ currency_code: string; amount: number }>;
    inventory_quantity?: number;
  }>;
  type?: { value: string } | null;
  tags?: Array<{ id: string; value: string }>;
  collection?: { title: string; handle: string } | null;
  categories?: Array<{ handle: string; parent_category_id?: string | null }>;
  metadata?: Record<string, unknown> | null;
}

interface UseProductSuggestionsReturn {
  /** Products from the NEXT pillar ("Continue Your Journey") */
  ritualProducts: SuggestionProduct[];
  /** Products from the SAME category/collection ("You May Also Like") */
  relatedProducts: SuggestionProduct[];
  /** Name of the next pillar */
  nextPillarName: string;
  /** Handle of the next pillar */
  nextPillarHandle: string;
  isLoading: boolean;
}

export function useProductSuggestions(
  currentProduct: {
    id: string;
    categories?: Array<{ handle: string; parent_category_id?: string | null }>;
    collection?: { title?: string; handle?: string } | null;
    metadata?: Record<string, unknown> | null;
    tags?: Array<{ value: string }>;
  } | null
): UseProductSuggestionsReturn {
  const [ritualProducts, setRitualProducts] = useState<SuggestionProduct[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<SuggestionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const currentPillar = currentProduct ? getProductPillar(currentProduct) : undefined;
  const nextPillar = currentPillar
    ? getNextPillar(currentPillar.handle)
    : JOURNEY_PILLARS[0];

  useEffect(() => {
    if (!currentProduct) {
      setIsLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);

      try {
        // Fetch all PranaJiva products with expanded fields
        const { products: allProducts } = await medusaClient.products.list({
          limit: 100,
          expand: 'variants,variants.prices,type,tags,collection,categories',
        });

        const others = (allProducts || []).filter(
          (p: any) => p.id !== currentProduct.id
        ) as SuggestionProduct[];

        // --- Related: same category / collection / shared tags ---
        const currentCatHandles = new Set(
          (currentProduct.categories || []).map((c) => c.handle.toLowerCase())
        );
        const currentTagValues = new Set(
          (currentProduct.tags || []).map((t) => t.value.toLowerCase())
        );
        const currentCollHandle = currentProduct.collection?.handle?.toLowerCase();

        const scored = others.map((p) => {
          let score = 0;
          // Same category
          if (p.categories?.some((c) => currentCatHandles.has(c.handle.toLowerCase()))) score += 3;
          // Same collection
          if (currentCollHandle && p.collection?.handle?.toLowerCase() === currentCollHandle) score += 2;
          // Shared tags
          const sharedTags = p.tags?.filter((t) => currentTagValues.has(t.value.toLowerCase()));
          score += (sharedTags?.length || 0);
          return { product: p, score };
        });

        scored.sort((a, b) => b.score - a.score);
        setRelatedProducts(scored.filter((s) => s.score > 0).slice(0, 4).map((s) => s.product));

        // --- Ritual: products from the NEXT pillar ---
        const nextHandle = nextPillar.handle.toLowerCase();
        const ritual = others.filter((p) => {
          // Check if product belongs to the next pillar's category
          if (p.categories?.some((c) => c.handle.toLowerCase() === nextHandle)) return true;
          // Check parent category handles of subcategories
          // (subcategories won't match the root handle directly, so check collection too)
          if (p.collection?.handle?.toLowerCase() === nextHandle) return true;
          if (p.collection?.title?.toLowerCase() === nextPillar.name.toLowerCase()) return true;
          return false;
        });

        setRitualProducts(ritual.slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch product suggestions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [currentProduct?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    ritualProducts,
    relatedProducts,
    nextPillarName: nextPillar.name,
    nextPillarHandle: nextPillar.handle,
    isLoading,
  };
}

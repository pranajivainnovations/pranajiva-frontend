'use client';

import { useEffect } from 'react';
import { useProductSuggestions } from '@/hooks/useProductSuggestions';
import { useRecentlyViewed, type RecentProduct } from '@/hooks/useRecentlyViewed';
import { RelatedProducts } from '@/components/product/RelatedProducts';
import { CompleteYourRitual } from '@/components/product/CompleteYourRitual';
import { RecentlyViewed } from '@/components/product/RecentlyViewed';
import { JourneyProgressBar } from '@/components/journey/JourneyProgressBar';
import { getProductPillar } from '@/lib/wellness-journey';

interface ProductSuggestionsProps {
  product: {
    id: string;
    title: string;
    handle: string;
    thumbnail?: string | null;
    variants?: Array<{ prices?: Array<{ currency_code: string; amount: number }> }>;
    categories?: Array<{ handle: string; parent_category_id?: string | null }>;
    collection?: { title?: string; handle?: string } | null;
    metadata?: Record<string, unknown> | null;
    tags?: Array<{ value: string }>;
  };
}

export function ProductSuggestions({ product }: ProductSuggestionsProps) {
  const {
    ritualProducts,
    relatedProducts,
    nextPillarName,
    nextPillarHandle,
    isLoading,
  } = useProductSuggestions(product);

  const currentPillar = getProductPillar(product);

  // Track this product as recently viewed
  const { products: recentProducts, trackProduct } = useRecentlyViewed(product.id);

  useEffect(() => {
    const price = product.variants?.[0]?.prices?.find(
      (p) => p.currency_code === 'inr'
    )?.amount ?? null;

    const item: RecentProduct = {
      id: product.id,
      handle: product.handle,
      title: product.title,
      thumbnail: product.thumbnail ?? null,
      price,
      currencyCode: 'inr',
    };
    trackProduct(item);
  }, [product.id, product.handle, product.title, product.thumbnail, product.variants, trackProduct]);

  return (
    <>
      {/* Journey Progress Bar */}
      {currentPillar && (
        <div className="container mx-auto px-4 py-6 border-t border-ink/[0.06]">
          <JourneyProgressBar activeHandle={currentPillar.handle} />
        </div>
      )}

      {/* Related Products */}
      <RelatedProducts
        products={relatedProducts}
        isLoading={isLoading}
      />

      {/* Complete Your Ritual — next pillar products */}
      <CompleteYourRitual
        products={ritualProducts}
        nextPillarName={nextPillarName}
        nextPillarHandle={nextPillarHandle}
        isLoading={isLoading}
      />

      {/* Recently Viewed */}
      <RecentlyViewed products={recentProducts} />
    </>
  );
}

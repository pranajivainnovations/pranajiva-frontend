'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import { medusaClient } from '@/lib/medusa';
import { JOURNEY_PILLARS } from '@/lib/wellness-journey';

interface CartItem {
  variant?: {
    product?: {
      id?: string;
      collection_id?: string | null;
      categories?: Array<{ handle: string }>;
    };
  };
}

interface SuggestedProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  variants: Array<{
    prices: Array<{ currency_code: string; amount: number }>;
  }>;
}

interface CartCrossSellProps {
  items: CartItem[];
}

export function CartCrossSell({ items }: CartCrossSellProps) {
  const [suggestions, setSuggestions] = useState<SuggestedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!items || items.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        // Find which pillar categories are already in cart
        const cartCategoryHandles = new Set<string>();
        const cartProductIds = new Set<string>();

        items.forEach((item) => {
          const prod = item.variant?.product;
          if (prod?.id) cartProductIds.add(prod.id);
          prod?.categories?.forEach((cat) => {
            cartCategoryHandles.add(cat.handle.toLowerCase());
          });
        });

        // Find pillar categories NOT in cart
        const missingPillars = JOURNEY_PILLARS.filter(
          (p) => !cartCategoryHandles.has(p.handle.toLowerCase())
        );

        if (missingPillars.length === 0) {
          setIsLoading(false);
          return;
        }

        // Fetch all products and filter to missing pillar categories
        const { products } = await medusaClient.products.list({
          limit: 100,
          expand: 'variants,variants.prices,categories',
        });

        const filtered = (products as SuggestedProduct[]).filter((p) => {
          if (cartProductIds.has(p.id)) return false;
          const cats = (p as unknown as { categories?: Array<{ handle: string }> }).categories;
          return cats?.some((c) =>
            missingPillars.some((mp) => mp.handle.toLowerCase() === c.handle.toLowerCase())
          );
        });

        // Take up to 4 suggestions, one per missing pillar if possible
        const selected: SuggestedProduct[] = [];
        for (const pillar of missingPillars) {
          const match = filtered.find((p) => {
            const cats = (p as unknown as { categories?: Array<{ handle: string }> }).categories;
            return cats?.some((c) => c.handle.toLowerCase() === pillar.handle.toLowerCase());
          });
          if (match && !selected.find((s) => s.id === match.id)) {
            selected.push(match);
          }
          if (selected.length >= 4) break;
        }

        // Fill remaining slots
        if (selected.length < 4) {
          for (const p of filtered) {
            if (!selected.find((s) => s.id === p.id)) {
              selected.push(p);
            }
            if (selected.length >= 4) break;
          }
        }

        setSuggestions(selected);
      } catch (err) {
        console.error('Failed to fetch cart suggestions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [items]);

  if (!isLoading && suggestions.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-prana-sage/10">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-4 h-4 text-accent" />
        <h2 className="font-heading text-lg font-medium">Complete Your Wellness Ritual</h2>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-100 rounded-card mb-3" />
              <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-gray-100 rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {suggestions.map((product) => {
            const price = product.variants?.[0]?.prices?.find(
              (p) => p.currency_code === 'inr'
            );
            return (
              <Link
                key={product.id}
                href={`/shop/${product.handle}`}
                className="group"
              >
                <div className="aspect-square rounded-card overflow-hidden bg-surface-warm mb-3">
                  {product.thumbnail ? (
                    <Image
                      src={product.thumbnail}
                      alt={product.title}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-ink-faint text-3xl">
                      🌿
                    </div>
                  )}
                </div>
                <h3 className="text-sm font-medium text-ink line-clamp-2 group-hover:text-accent transition-colors">
                  {product.title}
                </h3>
                {price && (
                  <p className="text-sm text-ink-light mt-1">
                    ₹{(price.amount / 100).toLocaleString('en-IN')}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="/journey" className="inline-flex items-center gap-1.5 text-sm text-accent font-medium hover:gap-3 transition-all">
          Explore Your Wellness Journey <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
}

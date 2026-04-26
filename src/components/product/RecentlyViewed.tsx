'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { type RecentProduct } from '@/hooks/useRecentlyViewed';

interface RecentlyViewedProps {
  products: RecentProduct[];
  /** Heading override */
  title?: string;
}

export function RecentlyViewed({ products, title = 'Recently Viewed' }: RecentlyViewedProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 mb-8">
          <Clock className="w-4 h-4 text-ink-faint" />
          <h2 className="font-heading text-lg font-medium">{title}</h2>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 snap-x snap-mandatory">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.handle}`}
              className="flex-shrink-0 w-40 sm:w-48 group snap-start"
            >
              <div className="aspect-square rounded-card overflow-hidden bg-surface-warm mb-3">
                {product.thumbnail ? (
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    width={192}
                    height={192}
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
              {product.price !== null && (
                <p className="text-sm text-ink-light mt-1">
                  ₹{(product.price / 100).toLocaleString('en-IN')}
                </p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

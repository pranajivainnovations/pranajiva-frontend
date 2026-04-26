'use client';

import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/medusa';

interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  variants?: Array<{
    prices?: Array<{ currency_code: string; amount: number }>;
  }>;
  type?: { value: string } | null;
}

interface RelatedProductsProps {
  products: Product[];
  title?: string;
  isLoading?: boolean;
}

export function RelatedProducts({
  products,
  title = 'You May Also Like',
  isLoading = false,
}: RelatedProductsProps) {
  if (!isLoading && products.length === 0) return null;

  return (
    <section className="py-14 border-t border-ink/[0.06]">
      <div className="container mx-auto px-4">
        <h2 className="font-heading text-xl mb-8">{title}</h2>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card-premium overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-surface-warm" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-ink/5 rounded w-1/3" />
                  <div className="h-4 bg-ink/5 rounded w-2/3" />
                  <div className="h-3 bg-ink/5 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {products.map((product) => {
              const price = product.variants?.[0]?.prices?.find(
                (p) => p.currency_code === 'inr'
              );
              return (
                <Link
                  key={product.id}
                  href={`/shop/${product.handle}`}
                  className="group"
                >
                  <div className="card-premium overflow-hidden">
                    <div className="relative aspect-[4/5] bg-surface-warm overflow-hidden">
                      {product.thumbnail ? (
                        <Image
                          src={product.thumbnail}
                          alt={product.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-ink-faint/30 text-3xl">
                          ✦
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      {product.type?.value && (
                        <span className="label text-[9px] block mb-1 capitalize">
                          {product.type.value.replace(/-/g, ' ')}
                        </span>
                      )}
                      <h3 className="font-heading text-sm leading-snug mb-1 line-clamp-2 group-hover:text-accent transition-colors">
                        {product.title}
                      </h3>
                      <span className="text-sm font-medium text-ink">
                        {price ? formatPrice(price.amount, 'inr') : 'Price on request'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

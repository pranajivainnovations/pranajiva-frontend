'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Leaf, Flower2, Sparkles, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/medusa';
import { type JourneyPillar, JOURNEY_PILLARS } from '@/lib/wellness-journey';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Flower2,
  Sparkles,
  Heart,
};

interface Product {
  id: string;
  title: string;
  handle: string;
  thumbnail?: string | null;
  variants?: Array<{
    prices?: Array<{ currency_code: string; amount: number }>;
  }>;
}

interface CompleteYourRitualProps {
  products: Product[];
  nextPillarName: string;
  nextPillarHandle: string;
  isLoading?: boolean;
}

export function CompleteYourRitual({
  products,
  nextPillarName,
  nextPillarHandle,
  isLoading = false,
}: CompleteYourRitualProps) {
  const pillar = JOURNEY_PILLARS.find(
    (p) => p.handle.toLowerCase() === nextPillarHandle.toLowerCase()
  );
  const Icon = pillar ? ICONS[pillar.icon] || Leaf : Leaf;

  // Show section even with no products — link to the next category
  return (
    <section className={`py-14 ${pillar?.bgTint || 'bg-surface-warm'}`}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`w-9 h-9 rounded-full bg-white/80 flex items-center justify-center`}
          >
            <Icon className={`w-4 h-4 ${pillar?.accentColor || 'text-accent'}`} />
          </div>
          <div>
            <p className="label text-[9px]">Continue Your Journey</p>
            <h2 className="font-heading text-xl">
              Next: {nextPillarName}
            </h2>
          </div>
        </div>
        <p className="text-sm text-ink-light mb-8 max-w-lg">
          {pillar?.tagline || 'The next step in your wellness journey.'}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="card-premium overflow-hidden animate-pulse">
                <div className="aspect-[4/5] bg-white/50" />
                <div className="p-4 space-y-2 bg-white">
                  <div className="h-3 bg-ink/5 rounded w-1/3" />
                  <div className="h-4 bg-ink/5 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
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
                    <div className="relative aspect-[4/5] bg-white/50 overflow-hidden">
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
                    <div className="p-4 bg-white">
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
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-ink-light mb-3">
              Our {nextPillarName.toLowerCase()} collection is being curated.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href={`/categories/${nextPillarHandle}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
          >
            Explore {nextPillarName} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

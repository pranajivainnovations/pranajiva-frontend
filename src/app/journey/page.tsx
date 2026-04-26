'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ChevronRight,
  Leaf,
  Flower2,
  Sparkles,
  Heart,
  Play,
} from 'lucide-react';
import { JOURNEY_PILLARS } from '@/lib/wellness-journey';
import { medusaClient, formatPrice } from '@/lib/medusa';

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
  variants?: Array<{ prices?: Array<{ currency_code: string; amount: number }> }>;
}

export default function JourneyPage() {
  const [productsByPillar, setProductsByPillar] = useState<Record<string, Product[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { products } = await medusaClient.products.list({
          limit: 200,
          expand: 'variants,variants.prices,collection,categories',
        });

        const grouped: Record<string, Product[]> = {};
        for (const pillar of JOURNEY_PILLARS) {
          grouped[pillar.handle] = [];
        }

        for (const product of products || []) {
          const p = product as any;
          // Check categories
          const catHandles = (p.categories || []).map((c: any) => c.handle?.toLowerCase());
          // Check collection
          const collHandle = p.collection?.handle?.toLowerCase();
          const collTitle = p.collection?.title?.toLowerCase();

          for (const pillar of JOURNEY_PILLARS) {
            const ph = pillar.handle.toLowerCase();
            const pn = pillar.name.toLowerCase();
            if (catHandles.includes(ph) || collHandle === ph || collTitle === pn) {
              if (grouped[pillar.handle].length < 4) {
                grouped[pillar.handle].push(p);
              }
              break;
            }
          }
        }

        setProductsByPillar(grouped);
      } catch (err) {
        console.error('Failed to fetch journey products:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-surface-warm overflow-hidden">
        <div className="container mx-auto px-4 py-20 md:py-28">
          <div className="max-w-2xl mx-auto text-center">
            <p className="label mb-6">The PranaJiva Path</p>
            <h1 className="font-heading text-display mb-6">
              Your Wellness{' '}
              <span className="italic">Journey</span>
            </h1>
            <p className="text-subtitle text-ink-light max-w-lg mx-auto mb-10">
              Four pillars of Ayurvedic well-being — a guided path from nourishment
              to complete confidence. Each step builds on the last.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/journey/quiz" className="btn-primary text-base px-8 py-3.5">
                <Play className="w-4 h-4" />
                Take the Quiz
              </Link>
              <a href="#pillars" className="btn-ghost text-base px-8 py-3.5 border border-ink/10">
                Explore the Path
              </a>
            </div>
          </div>

          {/* Visual journey bar */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="relative flex items-center justify-between">
              <div className="absolute inset-x-12 top-1/2 h-0.5 bg-ink/[0.08]" />
              {JOURNEY_PILLARS.map((pillar, i) => {
                const Icon = ICONS[pillar.icon] || Leaf;
                return (
                  <a
                    key={pillar.handle}
                    href={`#pillar-${pillar.handle}`}
                    className="relative flex flex-col items-center gap-3 group z-10"
                  >
                    <div className={`w-14 h-14 rounded-full ${pillar.bgTint} flex items-center justify-center transition-transform group-hover:scale-110`}>
                      <Icon className={`w-6 h-6 ${pillar.accentColor}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-medium text-ink">Step {pillar.step}</p>
                      <p className="text-sm font-heading font-medium">{pillar.name}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Pillars */}
      <div id="pillars">
        {JOURNEY_PILLARS.map((pillar, i) => {
          const Icon = ICONS[pillar.icon] || Leaf;
          const products = productsByPillar[pillar.handle] || [];
          const isEven = i % 2 === 0;

          return (
            <section
              key={pillar.handle}
              id={`pillar-${pillar.handle}`}
              className={`py-20 md:py-28 ${isEven ? 'bg-surface' : 'bg-white'}`}
            >
              <div className="container mx-auto px-4">
                {/* Pillar header */}
                <div className="max-w-3xl mx-auto mb-14">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full ${pillar.bgTint} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${pillar.accentColor}`} />
                    </div>
                    <div>
                      <p className="label text-[10px]">Step {pillar.step} of 4</p>
                      <h2 className="font-heading text-2xl md:text-3xl font-medium">
                        {pillar.name}
                      </h2>
                    </div>
                  </div>
                  <p className="text-ink-light leading-relaxed mb-4">
                    {pillar.description}
                  </p>
                  <blockquote className={`border-l-2 ${pillar.accentColor.replace('text-', 'border-')} pl-4 text-sm text-ink-light italic`}>
                    {pillar.philosophy}
                  </blockquote>
                </div>

                {/* Products grid */}
                {isLoading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
                    {[1, 2, 3, 4].map((n) => (
                      <div key={n} className="card-premium overflow-hidden animate-pulse">
                        <div className="aspect-[4/5] bg-surface-warm" />
                        <div className="p-5 space-y-3">
                          <div className="h-3 bg-ink/5 rounded w-1/3" />
                          <div className="h-5 bg-ink/5 rounded w-2/3" />
                          <div className="h-4 bg-ink/5 rounded w-1/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : products.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
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
                                <div className="w-full h-full flex items-center justify-center text-ink-faint/30 text-4xl">
                                  ✦
                                </div>
                              )}
                            </div>
                            <div className="p-5">
                              <h3 className="font-heading text-[15px] leading-snug mb-1.5 line-clamp-2 group-hover:text-accent transition-colors">
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
                  <div className="max-w-md mx-auto text-center py-10">
                    <div className={`w-16 h-16 rounded-full ${pillar.bgTint} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 ${pillar.accentColor}`} />
                    </div>
                    <h3 className="font-heading text-lg mb-2">Products Coming Soon</h3>
                    <p className="text-sm text-ink-light mb-4">
                      Our {pillar.name.toLowerCase()} collection is being curated.
                      Explore the category to learn more.
                    </p>
                    <Link
                      href={`/categories/${pillar.handle}`}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                    >
                      Explore {pillar.name} <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Explore category CTA */}
                {products.length > 0 && (
                  <div className="text-center mt-10">
                    <Link
                      href={`/categories/${pillar.handle}`}
                      className="inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline"
                    >
                      Explore all {pillar.name} products <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )}

                {/* Next step arrow */}
                {i < JOURNEY_PILLARS.length - 1 && (
                  <div className="flex justify-center mt-14">
                    <a
                      href={`#pillar-${JOURNEY_PILLARS[i + 1].handle}`}
                      className="flex flex-col items-center gap-2 text-ink-faint hover:text-accent transition-colors group"
                    >
                      <span className="text-xs">Next: {JOURNEY_PILLARS[i + 1].name}</span>
                      <ChevronRight className="w-5 h-5 rotate-90 group-hover:translate-y-1 transition-transform" />
                    </a>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {/* Final CTA */}
      <section className="py-20 md:py-28 bg-brand-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto">
            <div className="divider-ornament mb-8">
              <span className="text-accent text-lg">✦</span>
            </div>
            <h2 className="font-heading text-title text-white mb-5">
              Not Sure Where to Start?
            </h2>
            <p className="text-lg text-white/50 mb-10 leading-relaxed">
              Take our 2-minute wellness quiz and get a personalised starting point
              based on your goals and lifestyle.
            </p>
            <Link
              href="/journey/quiz"
              className="inline-flex items-center gap-2 bg-accent text-white px-10 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-accent-dark transition-colors"
            >
              <Play className="w-4 h-4" />
              Start the Quiz
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

/**
 * Homepage — PranaJiva
 *
 * Premium Ayurvedic luxury: Hero → Promise → Collections → Featured → CTA
 */

"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Leaf, Shield, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { medusaClient, formatPrice } from "@/lib/medusa";
import { useStealthMode } from "@/stores/stealth-mode";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { TrustBadges } from "@/components/product/TrustBadges";

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: Array<{
    id: string;
    prices?: Array<{ currency_code: string; amount: number }>;
  }>;
  metadata?: Record<string, unknown> | null;
  collection?: { title: string; handle: string } | null;
  type?: { value: string } | null;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
}

const collectionMeta: Record<string, { description: string }> = {
  "core-essentials": { description: "Foundation supplements for daily vitality and strength" },
  "vedic-rituals":   { description: "Time-honoured Ayurvedic formulations for holistic well-being" },
  "glow-care":       { description: "Natural radiance through plant-based nourishment" },
  "intimate-wellness": { description: "Premium intimate care crafted with discretion" },
};

const promises = [
  { icon: Leaf, title: "Ayurvedic Roots", desc: "Formulations rooted in ancient wisdom" },
  { icon: Shield, title: "Discreet Delivery", desc: "Plain packaging, complete privacy" },
  { icon: Truck, title: "Free Shipping", desc: "On all orders above ₹499" },
];

export default function HomePage() {
  const BRAND = "pranajiva";
  const { isStealthMode } = useStealthMode();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { products: recentProducts } = useRecentlyViewed();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          medusaClient.products.list({ limit: 4, expand: "variants,variants.prices,collection,type" }),
          medusaClient.collections.list({ limit: 50 }),
        ]);
        const brandCollections = (collectionsRes.collections as Array<Collection & { metadata?: Record<string, unknown> }>).filter(
          (col) => String(col.metadata?.brand || "").toLowerCase() === BRAND
        );
        setFeaturedProducts(productsRes.products as Product[]);
        setCollections(brandCollections as Collection[]);
      } catch (error) {
        console.error("Failed to fetch homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="page-enter">
      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex items-center justify-center min-h-[90vh] bg-surface-warm overflow-hidden">
        <div className="container mx-auto px-4 py-30 relative z-10">
          <div className="max-w-2xl mx-auto text-center">
            <p className="label mb-8">India&#39;s Premium Wellness Store</p>

            <h1 className="font-heading text-display mb-8">
              {isStealthMode ? (
                "Premium Wellness Products"
              ) : (
                <>
                  The Art of{" "}
                  <span className="italic">Ayurvedic</span>{" "}
                  Wellness
                </>
              )}
            </h1>

            <p className="text-subtitle text-ink-light max-w-lg mx-auto mb-14">
              Curated products rooted in ancient Ayurveda and modern science
              — for vitality, radiance, and balance.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn-primary text-base px-10 py-4">
                Explore Collection
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/about" className="btn-secondary text-base px-10 py-4">
                Our Philosophy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Promise Bar ─────────────────────────────────────── */}
      <section className="border-y border-black/[0.04] bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-black/[0.06]">
            {promises.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-center gap-4 py-6 md:py-8 md:px-8 first:md:pl-0 last:md:pr-0">
                <div className="w-10 h-10 rounded-full bg-accent-soft flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-ink">{title}</h3>
                  <p className="text-xs text-ink-light mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Collections ──────────────────────────────────────── */}
      <section className="py-24 md:py-30 bg-surface">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center mb-16">
            <p className="label mb-5">Our Collections</p>
            <h2 className="font-heading text-title mb-5">Wellness, Curated</h2>
            <div className="divider-ornament">
              <span className="text-accent text-lg">✦</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {collections.map((col, i) => {
              const meta = collectionMeta[col.handle];
              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.handle}`}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${i * 100}ms`, animationFillMode: "backwards" }}
                >
                  <div className="card-premium p-7 h-full flex flex-col justify-between min-h-[210px]">
                    <div>
                      <h3 className="font-heading text-xl font-medium mb-3 group-hover:text-accent transition-colors duration-300">
                        {col.title}
                      </h3>
                      <p className="text-sm text-ink-light leading-relaxed">
                        {meta?.description || "Explore our curated products"}
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-sm text-accent mt-6 group-hover:gap-3 transition-all duration-300 font-medium">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          {collections.length === 0 && !isLoading && (
            <p className="text-center text-ink-faint text-sm py-8">Collections coming soon</p>
          )}
        </div>
      </section>

      {/* ── Wellness Journey ─────────────────────────────────── */}
      <section className="py-24 md:py-30 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto text-center mb-14">
            <p className="label mb-5">The PranaJiva Path</p>
            <h2 className="font-heading text-title mb-5">Your Wellness Journey</h2>
            <p className="text-sm text-ink-light leading-relaxed">
              Four pillars of Ayurvedic well-being — each building on the last.
              Discover where to start and let each step guide you forward.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-5 mb-12">
            {[
              { step: 1, name: 'Nutrition', handle: 'nutrition', tagline: 'Build Your Foundation', icon: '🌿', color: 'bg-emerald-50 border-emerald-200' },
              { step: 2, name: 'Ayurveda', handle: 'ayurveda', tagline: 'Restore Balance', icon: '🌸', color: 'bg-amber-50 border-amber-200' },
              { step: 3, name: 'Glow Care', handle: 'glow-care', tagline: 'Radiance From Within', icon: '✨', color: 'bg-rose-50 border-rose-200' },
              { step: 4, name: 'Intimate Wellness', handle: 'intimate-wellness', tagline: 'Complete Confidence', icon: '💜', color: 'bg-purple-50 border-purple-200' },
            ].map((pillar, i) => (
              <Link
                key={pillar.handle}
                href={`/categories/${pillar.handle}`}
                className="group animate-fade-up"
                style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'backwards' }}
              >
                <div className={`${pillar.color} border rounded-card p-6 h-full flex flex-col transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-1`}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{pillar.icon}</span>
                    <span className="text-xs font-semibold text-ink-faint tracking-widest uppercase">Step {pillar.step}</span>
                  </div>
                  <h3 className="font-heading text-lg font-medium mb-1.5">{pillar.name}</h3>
                  <p className="text-sm text-ink-light flex-1">{pillar.tagline}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm text-accent mt-4 group-hover:gap-3 transition-all duration-300 font-medium">
                    Explore <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/journey" className="btn-primary">
              Discover Your Path <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────────── */}
      <section className="py-24 md:py-30 bg-surface">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-14">
            <div>
              <p className="label mb-4">Bestsellers</p>
              <h2 className="font-heading text-title">Most Loved</h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex items-center gap-2 text-sm text-ink-light hover:text-accent transition-colors duration-300 font-medium"
            >
              View all products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-premium overflow-hidden animate-pulse">
                  <div className="aspect-[4/5] bg-surface-warm" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-surface-muted rounded w-1/3" />
                    <div className="h-5 bg-surface-muted rounded w-2/3" />
                    <div className="h-4 bg-surface-muted rounded w-1/4 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredProducts.map((product) => {
                const variant = product.variants?.[0];
                const price = variant?.prices?.find(p => p.currency_code === "inr")?.amount;
                const typeLabel = product.type?.value?.replace(/-/g, " ");

                return (
                  <Link key={product.id} href={`/shop/${product.handle}`} className="group">
                    <div className="card-premium overflow-hidden">
                      <div className="relative aspect-[4/5] bg-surface-warm overflow-hidden">
                        {product.thumbnail ? (
                          <Image
                            src={product.thumbnail}
                            alt={isStealthMode ? "Wellness Product" : product.title}
                            fill
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-ink-faint/30 text-4xl">
                            ✦
                          </div>
                        )}
                      </div>
                      <div className="p-5">
                        {typeLabel && (
                          <span className="label text-[10px] block mb-2 capitalize">{typeLabel}</span>
                        )}
                        <h3 className="font-heading text-lg leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-300">
                          {isStealthMode ? "Wellness Product" : product.title}
                        </h3>
                        <span className="text-sm font-medium text-ink">
                          {price ? formatPrice(price, "inr") : "Price on request"}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="card-premium p-16 text-center">
              <h3 className="font-heading text-xl mb-3">Products Coming Soon</h3>
              <p className="text-ink-light text-sm mb-8">
                We&apos;re curating our collection. Check back soon.
              </p>
              <Link href="/contact" className="btn-primary">Get Notified</Link>
            </div>
          )}

          <div className="md:hidden text-center mt-10">
            <Link href="/shop" className="btn-primary">
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Recently Viewed ──────────────────────────────────── */}
      <RecentlyViewed products={recentProducts} title="Pick Up Where You Left Off" />

      {/* ── Trust Badges ─────────────────────────────────────── */}
      <TrustBadges />

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-24 md:py-30 bg-brand-dark text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-xl mx-auto">
            <div className="divider-ornament mb-10">
              <span className="text-accent text-lg">✦</span>
            </div>
            <h2 className="font-heading text-title text-white mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-white/50 mb-12 leading-relaxed">
              Quality ingredients, trusted Ayurvedic formulations, delivered to your door with care.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-accent text-white px-10 py-4 rounded-full text-sm font-body font-medium tracking-wide hover:bg-accent-dark transition-colors duration-300"
            >
              Start Shopping <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

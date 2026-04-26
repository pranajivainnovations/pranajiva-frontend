/**
 * Collections Index — lists all Medusa collections as navigable cards.
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { medusaClient } from "@/lib/medusa";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

interface Collection {
  id: string;
  title: string;
  handle: string;
  metadata?: Record<string, unknown>;
}

const collectionMeta: Record<string, { description: string; image: string; alt: string }> = {
  "core-essentials":   { description: "Foundation supplements for daily vitality",   image: "/images/collections/core-essentials-card.png",   alt: "Core Essentials collection" },
  "vedic-rituals":     { description: "Ayurvedic formulations rooted in tradition", image: "/images/collections/vedic-rituals-card.png",     alt: "Vedic Rituals collection" },
  "glow-care":         { description: "Beauty and radiance from within",            image: "/images/collections/glow-care-card.png",         alt: "Glow Care collection" },
  "intimate-wellness": { description: "Premium intimate wellness essentials",       image: "/images/collections/intimate-wellness-card.png", alt: "Intimate Wellness collection" },
  "nutrition":         { description: "Superfoods and supplements for daily nourishment", image: "/images/collections/core-essentials-card.png", alt: "Nutrition collection" },
};

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { collections: cols } = await medusaClient.collections.list({ limit: 50 });
        // Filter collections where brand metadata = pranajiva (case-insensitive)
        const brandCollections = (cols as Collection[]).filter((col) =>
          String(col.metadata?.brand || '').toLowerCase() === 'pranajiva'
        );
        setCollections(brandCollections);
      } catch (err) {
        console.error("Failed to fetch collections:", err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-surface-warm">
        <div className="container mx-auto px-4 py-18 text-center">
          <Breadcrumbs items={[{ label: 'Collections' }]} />
          <p className="label mb-4">Collections</p>
          <h1 className="font-heading text-display mb-4">Our Collections</h1>
          <p className="text-ink-light max-w-lg mx-auto text-sm font-light">
            Curated wellness pillars designed around your health goals.
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="container mx-auto px-4 py-14">
        {isLoading ? (
          <div className="grid md:grid-cols-2 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card-premium overflow-hidden animate-pulse">
                <div className="h-48 md:h-56 bg-surface-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-6 bg-surface-muted rounded w-2/3" />
                  <div className="h-4 bg-surface-muted rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : collections.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-5">
            {collections.map((col, i) => {
              const meta = collectionMeta[col.handle];
              return (
                <Link
                  key={col.id}
                  href={`/collections/${col.handle}`}
                  className="group animate-fade-up"
                  style={{ animationDelay: `${i * 80}ms`, animationFillMode: "backwards" }}
                >
                  <div className="card-premium overflow-hidden h-full flex flex-col min-h-[320px]">
                    {/* Image area */}
                    <div className="relative h-48 md:h-56 bg-surface-muted overflow-hidden">
                      {meta?.image && (
                        <Image
                          src={meta.image}
                          alt={meta.alt}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      )}
                      {/* Fallback gradient when no image */}
                      {!meta?.image && (
                        <div className="absolute inset-0 bg-gradient-to-br from-surface-warm to-surface-muted" />
                      )}
                    </div>
                    {/* Text area */}
                    <div className="p-6 flex flex-col flex-1 justify-between">
                      <div>
                        <h2 className="font-heading text-xl mb-2 group-hover:text-accent transition-colors duration-300">
                          {col.title}
                        </h2>
                        <p className="text-sm text-ink-light font-light leading-relaxed">
                          {meta?.description || "Explore our curated products"}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1.5 text-sm text-accent mt-5 group-hover:gap-3 transition-all duration-300">
                        Explore <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24">
            <h3 className="font-heading text-xl mb-3">Collections coming soon</h3>
            <p className="text-sm text-ink-light font-light">
              We&apos;re curating our pillar collections. Check back soon.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

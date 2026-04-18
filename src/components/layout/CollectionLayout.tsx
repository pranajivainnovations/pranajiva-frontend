"use client";

import { ReactNode, memo, useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import FilterSidebar from "@/components/filters/FilterSidebar";
import type { Collection } from "@/types/product";

/* ── Hero images per collection handle ── */
const collectionHeroes: Record<string, { src: string; alt: string }> = {
  "core-essentials":   { src: "/images/collections/core-essentials-hero.png",   alt: "Ayurvedic herbs and mortar" },
  "vedic-rituals":     { src: "/images/collections/vedic-rituals-hero.png",     alt: "Traditional vedic ritual setup" },
  "glow-care":         { src: "/images/collections/glow-care-hero.png",         alt: "Natural skincare botanicals" },
  "intimate-wellness": { src: "/images/collections/intimate-wellness-hero.png", alt: "Serene wellness arrangement" },
};

interface CollectionLayoutProps {
  collection: Collection | null;
  isLoading: boolean;
  filteredCount: number;
  activeFilterCount: number;
  availableTypes: string[];
  availableTags: string[];
  selectedTypes: string[];
  selectedTags: string[];
  onTypeChange: (types: string[]) => void;
  onTagChange: (tags: string[]) => void;
  children: ReactNode;
}

function CollectionLayoutInner({
  collection,
  isLoading,
  filteredCount,
  activeFilterCount,
  availableTypes,
  availableTags,
  selectedTypes,
  selectedTags,
  onTypeChange,
  onTagChange,
  children,
}: CollectionLayoutProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const openMobileFilters = useCallback(() => setMobileFiltersOpen(true), []);
  const closeMobileFilters = useCallback(() => setMobileFiltersOpen(false), []);

  const hero = collection ? collectionHeroes[collection.handle] : null;

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero banner — image with text overlay */}
      <div className="relative overflow-hidden bg-surface-warm">
        {hero && (
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
        )}
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/30 to-ink/10" />

        <div className="relative container mx-auto px-4 pt-10 pb-16 min-h-[280px] md:min-h-[340px] flex flex-col justify-end">
          <Link
            href="/collections"
            className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors duration-300 mb-8"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            All Collections
          </Link>

          {isLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-10 bg-white/20 rounded w-1/3" />
              <div className="h-4 bg-white/20 rounded w-1/5" />
            </div>
          ) : collection ? (
            <>
              <h1 className="font-heading text-display text-white mb-3">{collection.title}</h1>
              <p className="text-sm text-white/70">
                {filteredCount} {filteredCount === 1 ? "product" : "products"}
                {activeFilterCount > 0 &&
                  ` · ${activeFilterCount} filter${activeFilterCount > 1 ? "s" : ""} active`}
              </p>
            </>
          ) : (
            <h1 className="font-heading text-title text-white">Collection not found</h1>
          )}
        </div>
      </div>

      <div className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-ink/[0.06] px-4 py-3">
        <button
          onClick={openMobileFilters}
          className="btn-ghost text-xs"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="ml-1 w-5 h-5 flex items-center justify-center bg-brand-dark text-white rounded-full text-[10px]">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Body */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-10">
          <FilterSidebar
            productTypes={availableTypes}
            tags={availableTags}
            selectedTypes={selectedTypes}
            selectedTags={selectedTags}
            onTypeChange={onTypeChange}
            onTagChange={onTagChange}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={closeMobileFilters}
          />
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export const CollectionLayout = memo(CollectionLayoutInner);

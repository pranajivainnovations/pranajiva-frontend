/**
 * useProductFilters Hook
 *
 * Reusable multi-select filtering for products by type and tag.
 * Syncs filter state to URL query params for shareable links.
 *
 * - AND logic: product must match selected types AND selected tags
 * - Empty selection = show all (no filter applied for that dimension)
 * - Dynamically extracts available types and tags from products
 */

import { useMemo, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FilterableProduct {
  type?: { value: string } | null;
  tags?: Array<{ value: string }>;
}

interface UseProductFiltersOptions {
  /** Base path for URL replacement (e.g. "/collections/core-essentials") */
  basePath: string;
}

interface UseProductFiltersReturn<T extends FilterableProduct> {
  /** Products after applying all active filters */
  filteredProducts: T[];
  /** All unique product type values extracted from products */
  availableTypes: string[];
  /** All unique tag values extracted from products */
  availableTags: string[];
  /** Currently selected product types */
  selectedTypes: string[];
  /** Currently selected tags */
  selectedTags: string[];
  /** Toggle a single product type on/off */
  toggleType: (type: string) => void;
  /** Toggle a single tag on/off */
  toggleTag: (tag: string) => void;
  /** Replace full type selection (for external control) */
  setTypes: (types: string[]) => void;
  /** Replace full tag selection (for external control) */
  setTags: (tags: string[]) => void;
  /** Clear all filters */
  clearAll: () => void;
  /** Number of active filters */
  activeFilterCount: number;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                               */
/* ------------------------------------------------------------------ */

export function useProductFilters<T extends FilterableProduct>(
  products: T[],
  { basePath }: UseProductFiltersOptions
): UseProductFiltersReturn<T> {
  const router = useRouter();
  const searchParams = useSearchParams();

  // --- Read state from URL -------------------------------------------

  const selectedTypes = useMemo(() => {
    const raw = searchParams.get("type");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedTags = useMemo(() => {
    const raw = searchParams.get("goal");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  // --- Write state to URL --------------------------------------------

  const updateURL = useCallback(
    (types: string[], tags: string[]) => {
      const params = new URLSearchParams();
      if (types.length) params.set("type", types.join(","));
      if (tags.length) params.set("goal", tags.join(","));
      const qs = params.toString();
      router.replace(`${basePath}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [basePath, router]
  );

  // --- Actions -------------------------------------------------------

  const toggleType = useCallback(
    (type: string) => {
      const next = selectedTypes.includes(type)
        ? selectedTypes.filter((t) => t !== type)
        : [...selectedTypes, type];
      updateURL(next, selectedTags);
    },
    [selectedTypes, selectedTags, updateURL]
  );

  const toggleTag = useCallback(
    (tag: string) => {
      const next = selectedTags.includes(tag)
        ? selectedTags.filter((t) => t !== tag)
        : [...selectedTags, tag];
      updateURL(selectedTypes, next);
    },
    [selectedTypes, selectedTags, updateURL]
  );

  const setTypes = useCallback(
    (types: string[]) => updateURL(types, selectedTags),
    [selectedTags, updateURL]
  );

  const setTags = useCallback(
    (tags: string[]) => updateURL(selectedTypes, tags),
    [selectedTypes, updateURL]
  );

  const clearAll = useCallback(
    () => updateURL([], []),
    [updateURL]
  );

  // --- Derived data --------------------------------------------------

  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.type?.value) set.add(p.type.value);
    });
    return Array.from(set).sort();
  }, [products]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.tags?.forEach((t) => set.add(t.value));
    });
    return Array.from(set).sort();
  }, [products]);

  // --- Filtering (AND between types and tags) ------------------------

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesType =
        selectedTypes.length === 0 ||
        (p.type?.value != null && selectedTypes.includes(p.type.value));

      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.some((tag) => p.tags?.some((t) => t.value === tag));

      return matchesType && matchesTags;
    });
  }, [products, selectedTypes, selectedTags]);

  const activeFilterCount = selectedTypes.length + selectedTags.length;

  return {
    filteredProducts,
    availableTypes,
    availableTags,
    selectedTypes,
    selectedTags,
    toggleType,
    toggleTag,
    setTypes,
    setTags,
    clearAll,
    activeFilterCount,
  };
}

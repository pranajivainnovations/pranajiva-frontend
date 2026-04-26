'use client';

import { useState, useEffect, useCallback } from 'react';

export interface RecentProduct {
  id: string;
  handle: string;
  title: string;
  thumbnail: string | null;
  price: number | null;
  currencyCode: string;
}

const STORAGE_KEY = 'pj-recently-viewed';
const MAX_ITEMS = 10;

function getStored(): RecentProduct[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persist(items: RecentProduct[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage full or unavailable
  }
}

/**
 * Track and retrieve recently viewed products (localStorage-based).
 * Call `trackProduct` on PDP to record a view.
 */
export function useRecentlyViewed(currentProductId?: string) {
  const [products, setProducts] = useState<RecentProduct[]>([]);

  useEffect(() => {
    const stored = getStored();
    // Exclude current product from the display list
    const filtered = currentProductId
      ? stored.filter((p) => p.id !== currentProductId)
      : stored;
    setProducts(filtered);
  }, [currentProductId]);

  const trackProduct = useCallback((product: RecentProduct) => {
    const stored = getStored();
    // Remove duplicate, add to front, cap at MAX_ITEMS
    const updated = [product, ...stored.filter((p) => p.id !== product.id)].slice(0, MAX_ITEMS);
    persist(updated);
    setProducts(updated.filter((p) => p.id !== product.id));
  }, []);

  return { products, trackProduct };
}

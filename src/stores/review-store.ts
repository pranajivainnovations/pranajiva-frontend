'use client';

import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';

export interface Review {
  id: string;
  productId: string;
  name: string;
  rating: number; // 1-5
  title: string;
  body: string;
  verified: boolean;
  createdAt: string; // ISO date
}

interface ReviewStore {
  reviews: Review[];
  /** Optimistic add — persists to backend then updates local cache. */
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<Review>;
  /** Fetch reviews from the backend for a specific product. */
  fetchReviews: (productId: string) => Promise<void>;
  getProductReviews: (productId: string) => Review[];
  getAverageRating: (productId: string) => { average: number; count: number };
}

const silentStorage = {
  getItem: (name: string) => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(name) : null;
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<ReviewStore>) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(name, JSON.stringify(value));
      }
    } catch {}
  },
  removeItem: (name: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
      }
    } catch {}
  },
};

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],

      addReview: async (review) => {
        // Build optimistic review
        const optimistic: Review = {
          ...review,
          id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };

        // Optimistic update — show immediately in UI
        set((state) => ({ reviews: [optimistic, ...state.reviews] }));

        try {
          const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: review.productId,
              name: review.name,
              rating: review.rating,
              title: review.title,
              reviewBody: review.body,
              verified: review.verified,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            // Replace optimistic entry with server-confirmed review
            if (data.review) {
              set((state) => ({
                reviews: state.reviews.map((r) =>
                  r.id === optimistic.id ? { ...data.review } : r
                ),
              }));
              return data.review as Review;
            }
          }
        } catch (err) {
          console.error('Failed to persist review to backend:', err);
          // Keep optimistic review in local cache even if backend fails
        }
        return optimistic;
      },

      fetchReviews: async (productId) => {
        try {
          const res = await fetch(`/api/reviews?productId=${productId}`);
          if (!res.ok) return;
          const data = await res.json();
          const serverReviews: Review[] = Array.isArray(data.reviews) ? data.reviews : [];

          if (serverReviews.length > 0) {
            set((state) => {
              // Merge: keep server reviews, add any local-only reviews
              const serverIds = new Set(serverReviews.map((r) => r.id));
              const localOnly = state.reviews.filter(
                (r) => r.productId === productId && !serverIds.has(r.id)
              );
              const otherProducts = state.reviews.filter(
                (r) => r.productId !== productId
              );
              return {
                reviews: [...serverReviews, ...localOnly, ...otherProducts],
              };
            });
          }
        } catch (err) {
          console.error('Failed to fetch reviews from backend:', err);
        }
      },

      getProductReviews: (productId) => {
        return get().reviews.filter((r) => r.productId === productId);
      },

      getAverageRating: (productId) => {
        const productReviews = get().reviews.filter((r) => r.productId === productId);
        if (productReviews.length === 0) return { average: 0, count: 0 };
        const sum = productReviews.reduce((acc, r) => acc + r.rating, 0);
        return {
          average: Math.round((sum / productReviews.length) * 10) / 10,
          count: productReviews.length,
        };
      },
    }),
    {
      name: 'pj-reviews',
      storage: silentStorage as any,
      partialize: (state) => ({ reviews: state.reviews }),
    }
  )
);

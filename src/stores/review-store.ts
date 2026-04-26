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
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
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

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ reviews: [newReview, ...state.reviews] }));
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

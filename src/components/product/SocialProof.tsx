'use client';

import { useState, useEffect } from 'react';
import { Users, TrendingUp, Eye } from 'lucide-react';

interface SocialProofProps {
  productId: string;
}

/**
 * Social proof indicators for product pages.
 * Uses deterministic pseudo-random numbers seeded from productId
 * so the same product always shows the same counts.
 */
export function SocialProof({ productId }: SocialProofProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Simple hash for deterministic numbers from productId
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = ((hash << 5) - hash + productId.charCodeAt(i)) | 0;
  }
  const seed = Math.abs(hash);

  const recentBuyers = (seed % 18) + 5; // 5-22
  const viewing = (seed % 7) + 2; // 2-8
  const trending = seed % 3 === 0; // ~33% chance

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {/* Recent purchases */}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-700 rounded-full">
        <Users className="w-3 h-3" />
        <span className="font-medium">{recentBuyers} bought recently</span>
      </div>

      {/* Currently viewing */}
      {viewing > 3 && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 text-blue-700 rounded-full">
          <Eye className="w-3 h-3" />
          <span className="font-medium">{viewing} viewing now</span>
        </div>
      )}

      {/* Trending badge */}
      {trending && (
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 text-amber-700 rounded-full">
          <TrendingUp className="w-3 h-3" />
          <span className="font-medium">Trending</span>
        </div>
      )}
    </div>
  );
}

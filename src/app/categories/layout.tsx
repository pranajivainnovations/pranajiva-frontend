/**
 * Layout for category pages
 * Minimal wrapper — each page handles its own styling
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Wellness Categories',
  description:
    'Explore PranaJiva wellness categories — Nutrition, Ayurveda, Glow Care & Intimate Wellness. Find the right products for your wellness journey.',
  openGraph: {
    title: 'Wellness Categories | PranaJiva',
    description:
      'Explore Nutrition, Ayurveda, Glow Care & Intimate Wellness categories.',
  },
};

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

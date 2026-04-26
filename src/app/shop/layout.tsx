/**
 * Shop Route Layout
 * 
 * Layout for /shop and all product routes
 */

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop All Products',
  description:
    'Browse our complete collection of premium Ayurvedic wellness products. Supplements, herbal formulations, glow care & intimate wellness — all delivered discreetly.',
  openGraph: {
    title: 'Shop All Products | PranaJiva',
    description:
      'Browse premium Ayurvedic wellness products with discreet delivery across India.',
  },
};

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

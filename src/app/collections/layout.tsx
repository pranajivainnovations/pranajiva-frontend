import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Collections',
  description:
    'Shop curated PranaJiva collections — Core Essentials, Vedic Rituals, Glow Care & Intimate Wellness. Premium Ayurvedic products with discreet delivery.',
  openGraph: {
    title: 'Collections | PranaJiva',
    description:
      'Curated wellness collections rooted in Ayurveda and modern science.',
  },
};

export default function CollectionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

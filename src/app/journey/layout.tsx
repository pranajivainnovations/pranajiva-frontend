import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Wellness Journey',
  description:
    'Discover the PranaJiva 4-pillar wellness path — Nutrition, Ayurveda, Glow Care & Intimate Wellness. A guided approach to holistic well-being rooted in ancient wisdom.',
  openGraph: {
    title: 'Your Wellness Journey | PranaJiva',
    description:
      'A guided 4-step path to holistic well-being: Nutrition → Ayurveda → Glow Care → Intimate Wellness.',
  },
};

export default function JourneyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

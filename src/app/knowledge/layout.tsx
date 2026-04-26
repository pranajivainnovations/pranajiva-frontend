import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Knowledge Center',
  description:
    'Evidence-based articles and guides on Ayurvedic wellness, nutrition, intimate health & holistic living. Expert insights from PranaJiva.',
  openGraph: {
    title: 'Knowledge Center | PranaJiva',
    description:
      'Evidence-based wellness articles and guides from PranaJiva experts.',
  },
};

export default function KnowledgeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

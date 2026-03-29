import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { BottomNav } from '@/components/navigation/BottomNav';
import { QuickExit } from '@/components/privacy/QuickExit';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'PranaJiva - Premium Wellness',
  description: 'Discover premium wellness products with discreet delivery',
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen pb-20">
        <Providers>
          <QuickExit />
          {children}
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}

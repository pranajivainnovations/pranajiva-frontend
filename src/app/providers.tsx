'use client';

import { ReactNode } from 'react';
import { StealthModeProvider } from '@/stores/stealth-mode';
import { TopNav } from '@/components/navigation/TopNav';
import { ToastContainer } from '@/components/ui/Toast';
import { CookieConsent } from '@/components/ui/CookieConsent';
import { BackToTop } from '@/components/ui/BackToTop';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StealthModeProvider>
      <TopNav />
      {children}
      <ToastContainer />
      <CookieConsent />
      <BackToTop />
    </StealthModeProvider>
  );
}

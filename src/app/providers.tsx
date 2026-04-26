'use client';

import { ReactNode } from 'react';
import { StealthModeProvider } from '@/stores/stealth-mode';
import { TopNav } from '@/components/navigation/TopNav';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <StealthModeProvider>
      <TopNav />
      {children}
    </StealthModeProvider>
  );
}

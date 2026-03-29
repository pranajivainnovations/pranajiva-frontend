'use client';

import { ReactNode } from 'react';
import { StealthModeProvider } from '@/stores/stealth-mode';

export function Providers({ children }: { children: ReactNode }) {
  return <StealthModeProvider>{children}</StealthModeProvider>;
}

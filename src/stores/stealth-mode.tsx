'use client';

import { create } from 'zustand';
import { persist, StorageValue } from 'zustand/middleware';
import { ReactNode, useEffect } from 'react';

// Custom storage that suppresses console logging
const silentStorage = {
  getItem: (name: string) => {
    try {
      const item = typeof window !== 'undefined' ? localStorage.getItem(name) : null;
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: StorageValue<any>) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem(name, JSON.stringify(value));
      }
    } catch {
      // Silently fail
    }
  },
  removeItem: (name: string) => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem(name);
      }
    } catch {
      // Silently fail
    }
  },
};

interface StealthModeState {
  isStealthMode: boolean;
  toggleStealthMode: () => void;
}

export const useStealthMode = create<StealthModeState>()(
  persist(
    set => ({
      isStealthMode: false,
      toggleStealthMode: () =>
        set(state => ({ isStealthMode: !state.isStealthMode })),
    }),
    {
      name: 'stealth-mode-storage',
      storage: silentStorage,
    }
  )
);

export function StealthModeProvider({ children }: { children: ReactNode }) {
  const isStealthMode = useStealthMode(state => state.isStealthMode);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (isStealthMode) {
        document.body.classList.add('stealth-mode');
      } else {
        document.body.classList.remove('stealth-mode');
      }
    }
  }, [isStealthMode]);

  return <>{children}</>;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export function QuickExit() {
  const router = useRouter();
  const [escPressCount, setEscPressCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setEscPressCount(prev => {
          const newCount = prev + 1;
          
          // Show indicator
          setIsVisible(true);

          // Double-tap Esc detection
          if (newCount >= 2) {
            // Clear last viewed products from session
            if (typeof window !== 'undefined') {
              sessionStorage.removeItem('lastViewedProducts');
              sessionStorage.clear();
            }
            
            // Redirect to Google
            window.location.replace('https://google.com');
          }

          return newCount;
        });

        // Reset counter after 500ms
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          setEscPressCount(0);
          setIsVisible(false);
        }, 500);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <button
      className={`quick-exit-btn ${isVisible ? 'visible' : ''}`}
      onClick={() => {
        sessionStorage.clear();
        window.location.replace('https://google.com');
      }}
    >
      Quick Exit {escPressCount > 0 && `(${escPressCount}/2)`}
    </button>
  );
}

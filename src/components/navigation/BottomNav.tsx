'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Sparkles, ShoppingCart, User } from 'lucide-react';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/shop', icon: ShoppingBag, label: 'Shop' },
  { href: '/journey', icon: Sparkles, label: 'Journey', fab: true },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
  { href: '/account', icon: User, label: 'Profile' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      <div className="container mx-auto px-4">
        <ul className="flex items-center justify-around py-3">
          {navItems.map(({ href, icon: Icon, label, fab }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/');

            if (fab) {
              return (
                <li key={href} className="-mt-8">
                  <Link
                    href={href}
                    className={`flex flex-col items-center gap-1 transition-all ${
                      isActive ? 'scale-105' : ''
                    }`}
                  >
                    <span
                      className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white/10 transition-colors ${
                        isActive
                          ? 'bg-amber-700 text-white'
                          : 'bg-amber-700 text-white/90 hover:bg-amber-800'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </span>
                    <span className="text-[10px] tracking-wide font-medium text-amber-400">
                      {label}
                    </span>
                  </Link>
                </li>
              );
            }

            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex flex-col items-center gap-1 transition-colors ${
                    isActive
                      ? 'text-accent'
                      : 'text-white/50 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] tracking-wide font-light">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

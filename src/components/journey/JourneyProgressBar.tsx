'use client';

import Link from 'next/link';
import { JOURNEY_PILLARS, type JourneyPillar } from '@/lib/wellness-journey';
import { Leaf, Flower2, Sparkles, Heart, ChevronRight } from 'lucide-react';

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Leaf,
  Flower2,
  Sparkles,
  Heart,
};

interface JourneyProgressBarProps {
  /** Handle of the currently active pillar (optional) */
  activeHandle?: string;
  /** Compact mode for PDP sidebar */
  compact?: boolean;
}

export function JourneyProgressBar({ activeHandle, compact = false }: JourneyProgressBarProps) {
  const activeIdx = activeHandle
    ? JOURNEY_PILLARS.findIndex((p) => p.handle.toLowerCase() === activeHandle.toLowerCase())
    : -1;

  if (compact) {
    return (
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {JOURNEY_PILLARS.map((pillar, i) => {
          const isActive = i === activeIdx;
          const isPast = activeIdx >= 0 && i < activeIdx;
          const Icon = ICONS[pillar.icon] || Leaf;
          return (
            <div key={pillar.handle} className="flex items-center shrink-0">
              <Link
                href={`/categories/${pillar.handle}`}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-accent text-white'
                    : isPast
                    ? 'bg-accent/10 text-accent'
                    : 'bg-ink/[0.04] text-ink-light hover:bg-ink/[0.08]'
                }`}
              >
                <Icon className="w-3 h-3" />
                {pillar.name}
              </Link>
              {i < JOURNEY_PILLARS.length - 1 && (
                <ChevronRight className="w-3 h-3 text-ink-faint mx-0.5 shrink-0" />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-surface-warm rounded-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm font-medium">Your Wellness Journey</h3>
        <Link href="/journey" className="text-xs text-accent hover:underline">
          Learn more
        </Link>
      </div>

      <div className="relative">
        {/* Connection line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-ink/[0.06]" />
        {activeIdx >= 0 && (
          <div
            className="absolute top-5 left-5 h-0.5 bg-accent transition-all duration-500"
            style={{
              width: `${(activeIdx / (JOURNEY_PILLARS.length - 1)) * (100 - 10)}%`,
            }}
          />
        )}

        {/* Steps */}
        <div className="relative flex justify-between">
          {JOURNEY_PILLARS.map((pillar, i) => {
            const isActive = i === activeIdx;
            const isPast = activeIdx >= 0 && i < activeIdx;
            const isFuture = activeIdx >= 0 && i > activeIdx;
            const Icon = ICONS[pillar.icon] || Leaf;

            return (
              <Link
                key={pillar.handle}
                href={`/categories/${pillar.handle}`}
                className="flex flex-col items-center gap-2 group w-20"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                    isActive
                      ? 'bg-accent text-white ring-4 ring-accent/20'
                      : isPast
                      ? 'bg-accent/20 text-accent'
                      : 'bg-white border border-ink/10 text-ink-faint group-hover:border-accent/30 group-hover:text-accent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-center">
                  <p
                    className={`text-[11px] font-medium leading-tight ${
                      isActive ? 'text-ink' : isPast ? 'text-accent' : 'text-ink-light'
                    }`}
                  >
                    {pillar.name}
                  </p>
                  <p className="text-[9px] text-ink-faint mt-0.5 hidden sm:block">
                    {pillar.tagline}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {activeIdx >= 0 && activeIdx < JOURNEY_PILLARS.length - 1 && (
        <div className="mt-5 pt-4 border-t border-ink/[0.06] text-center">
          <Link
            href={`/categories/${JOURNEY_PILLARS[activeIdx + 1].handle}`}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-accent hover:underline"
          >
            Continue to {JOURNEY_PILLARS[activeIdx + 1].name}
            <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}

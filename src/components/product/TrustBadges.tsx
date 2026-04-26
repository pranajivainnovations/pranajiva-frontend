'use client';

import { Shield, FlaskConical, Leaf, Award, Truck, Lock } from 'lucide-react';

const badges = [
  { icon: FlaskConical, label: 'Lab Tested', desc: 'Quality verified' },
  { icon: Leaf, label: '100% Natural', desc: 'No harmful chemicals' },
  { icon: Award, label: 'GMP Certified', desc: 'Manufacturing standards' },
  { icon: Shield, label: 'Discreet Delivery', desc: 'Plain packaging' },
  { icon: Truck, label: 'Pan-India Shipping', desc: 'Free over ₹999' },
  { icon: Lock, label: 'Secure Payments', desc: 'Razorpay protected' },
];

interface TrustBadgesProps {
  /** Show compact (3 badges) or full (6 badges) */
  variant?: 'compact' | 'full';
}

export function TrustBadges({ variant = 'full' }: TrustBadgesProps) {
  const displayed = variant === 'compact' ? badges.slice(0, 3) : badges;
  const cols = variant === 'compact' ? 'grid-cols-3' : 'grid-cols-3 md:grid-cols-6';

  return (
    <section className="py-10 md:py-14 bg-surface-warm border-y border-black/[0.04]">
      <div className="container mx-auto px-4">
        {variant === 'full' && (
          <div className="text-center mb-10">
            <p className="label mb-3">Why PranaJiva</p>
            <h2 className="font-heading text-xl font-medium">Trusted by Wellness Seekers</h2>
          </div>
        )}

        <div className={`grid ${cols} gap-6 md:gap-4`}>
          {displayed.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="text-center group">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-accent/[0.08] flex items-center justify-center group-hover:bg-accent/[0.15] transition-colors">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-sm font-medium text-ink mb-0.5">{label}</p>
              <p className="text-xs text-ink-faint">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

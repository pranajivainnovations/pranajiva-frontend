'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AgeVerificationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleVerify = async (isOver18: boolean) => {
    if (!isOver18) {
      window.location.replace('https://google.com');
      return;
    }

    setLoading(true);

    // Set cookie for age verification
    await fetch('/api/verify-age', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ verified: true }),
    });

    router.push('/');
  };

  return (
    <div className="age-gate-overlay">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="card-premium max-w-md mx-4 p-8 text-center"
      >
        <h1 className="text-4xl font-heading mb-4">Age Verification</h1>
        <p className="text-charcoal-soft/70 mb-8">
          You must be 18 years or older to access this website. Please verify your age to
          continue.
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleVerify(true)}
            disabled={loading}
            className="btn-velvet"
          >
            I am 18 or older
          </button>
          <button
            onClick={() => handleVerify(false)}
            className="px-6 py-3 rounded-full border-2 border-charcoal-soft/20 text-charcoal-soft hover:bg-charcoal-soft/5 transition-colors"
          >
            I am under 18
          </button>
        </div>

        <p className="text-xs text-charcoal-soft/50 mt-6">
          By entering, you agree to our Terms & Conditions and Privacy Policy
        </p>
      </motion.div>
    </div>
  );
}

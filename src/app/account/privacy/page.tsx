'use client';

import { motion } from 'framer-motion';
import { Shield, Eye, Download, Trash2, Lock, Database, UserX, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function PrivacyPage() {
  const [privacySettings, setPrivacySettings] = useState({
    dataCollection: true,
    personalizedAds: false,
    thirdPartySharing: false,
    analyticsTracking: true,
    emailMarketing: false,
  });

  const togglePrivacy = (key: keyof typeof privacySettings) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-charcoal-soft/60 mb-6">
        <Link href="/account" className="hover:text-prana-sage transition-colors">Account</Link>
        <span>/</span>
        <span>Privacy</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <Shield className="w-8 h-8 text-prana-sage" />
        <h1 className="text-4xl font-heading font-bold">Privacy & Data</h1>
      </div>

      {/* Privacy Commitment Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 bg-gradient-to-r from-prana-sage/10 to-prana-mint/10 rounded-2xl border border-prana-sage/20"
      >
        <div className="flex items-start gap-4">
          <div className="p-3 bg-white rounded-xl shadow-sm">
            <Lock className="w-6 h-6 text-prana-sage" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-semibold mb-2">Your Privacy is Our Priority</h2>
            <p className="text-sm text-charcoal-soft/70 mb-3">
              At PranaJiva, we understand the sensitive nature of sexual wellness products. Your data is encrypted, 
              never sold, and handled with the utmost discretion.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>No third-party tracking</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span>Anonymous browsing</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Data Collection Preferences */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-prana-sage/10 rounded-xl">
              <Database className="w-6 h-6 text-prana-sage" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Data Collection</h2>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Basic Data Collection</p>
                <button
                  onClick={() => togglePrivacy('dataCollection')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacySettings.dataCollection ? 'bg-prana-sage' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacySettings.dataCollection ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-charcoal-soft/60">
                Essential data for order processing and account management
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Analytics Tracking</p>
                <button
                  onClick={() => togglePrivacy('analyticsTracking')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacySettings.analyticsTracking ? 'bg-prana-sage' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacySettings.analyticsTracking ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-charcoal-soft/60">
                Anonymous usage data to improve site experience
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Personalized Recommendations</p>
                <button
                  onClick={() => togglePrivacy('personalizedAds')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacySettings.personalizedAds ? 'bg-prana-sage' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacySettings.personalizedAds ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-charcoal-soft/60">
                Show products based on browsing history
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Third-Party Sharing</p>
                <button
                  onClick={() => togglePrivacy('thirdPartySharing')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacySettings.thirdPartySharing ? 'bg-prana-sage' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacySettings.thirdPartySharing ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-charcoal-soft/60">
                Share anonymized data with partners (not recommended)
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <p className="font-medium text-sm">Marketing Communications</p>
                <button
                  onClick={() => togglePrivacy('emailMarketing')}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    privacySettings.emailMarketing ? 'bg-prana-sage' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      privacySettings.emailMarketing ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>
              <p className="text-xs text-charcoal-soft/60">
                Receive promotional emails and special offers
              </p>
            </div>
          </div>
        </motion.div>

        {/* Privacy Tools */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-prana-sage/10 rounded-xl">
              <Eye className="w-6 h-6 text-prana-sage" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Privacy Tools</h2>
          </div>

          <div className="space-y-3">
            {/* Download Data */}
            <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-charcoal-soft/60 group-hover:text-prana-sage transition-colors" />
                  <div>
                    <p className="font-medium text-sm">Download Your Data</p>
                    <p className="text-xs text-charcoal-soft/60">Export all personal information</p>
                  </div>
                </div>
                <span className="text-xs text-prana-sage opacity-0 group-hover:opacity-100 transition-opacity">
                  Get ZIP
                </span>
              </div>
            </button>

            {/* View Data */}
            <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-charcoal-soft/60 group-hover:text-prana-sage transition-colors" />
                  <div>
                    <p className="font-medium text-sm">View Collected Data</p>
                    <p className="text-xs text-charcoal-soft/60">See what we store about you</p>
                  </div>
                </div>
                <span className="text-xs text-prana-sage opacity-0 group-hover:opacity-100 transition-opacity">
                  View →
                </span>
              </div>
            </button>

            {/* Clear Browsing Data */}
            <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-charcoal-soft/60 group-hover:text-prana-sage transition-colors" />
                  <div>
                    <p className="font-medium text-sm">Clear Browsing History</p>
                    <p className="text-xs text-charcoal-soft/60">Delete site activity and cookies</p>
                  </div>
                </div>
                <span className="text-xs text-prana-sage opacity-0 group-hover:opacity-100 transition-opacity">
                  Clear
                </span>
              </div>
            </button>

            {/* Delete Account */}
            <button className="w-full p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors text-left group border border-red-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserX className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-sm text-red-600">Delete Account</p>
                    <p className="text-xs text-red-600/70">Permanently remove all data</p>
                  </div>
                </div>
                <span className="text-xs text-red-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Delete
                </span>
              </div>
            </button>
          </div>

          {/* Legal Documents */}
          <div className="mt-6 pt-6 border-t border-charcoal-soft/10">
            <h3 className="text-sm font-semibold mb-3">Legal Information</h3>
            <div className="space-y-2">
              <Link href="/privacy-policy" className="block text-sm text-prana-sage hover:underline">
                Privacy Policy →
              </Link>
              <Link href="/terms" className="block text-sm text-prana-sage hover:underline">
                Terms of Service →
              </Link>
              <Link href="/cookie-policy" className="block text-sm text-prana-sage hover:underline">
                Cookie Policy →
              </Link>
              <a href="mailto:privacy@pranajiva.com" className="block text-sm text-prana-sage hover:underline">
                Contact Privacy Team →
              </a>
            </div>
          </div>
        </motion.div>
      </div>

      {/* GDPR Compliance */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 card-premium bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200"
      >
        <div className="flex items-start gap-4">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h3 className="text-lg font-heading font-semibold text-blue-900 mb-2">
              GDPR & CCPA Compliant
            </h3>
            <p className="text-sm text-blue-800 mb-4">
              We comply with international data protection regulations including GDPR (EU) and CCPA (California). 
              You have the right to access, correct, or delete your personal data at any time.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-white/70 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Right to Access</p>
                <p className="text-xs text-blue-700">View all data we hold</p>
              </div>
              <div className="p-3 bg-white/70 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Right to Erasure</p>
                <p className="text-xs text-blue-700">Delete your data anytime</p>
              </div>
              <div className="p-3 bg-white/70 rounded-lg">
                <p className="text-xs font-semibold text-blue-900 mb-1">Right to Portability</p>
                <p className="text-xs text-blue-700">Export data in JSON format</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Note */}
      <div className="mt-4 p-6 bg-blue-50 rounded-2xl border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Demo Privacy Controls:</strong> These are sample privacy settings. Real privacy preferences will be saved to MedusaJS once authentication is configured. All data handling will follow industry standards.
        </p>
      </div>
    </motion.div>
  );
}

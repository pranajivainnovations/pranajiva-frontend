'use client';

import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Lock, Bell, Mail, Eye, Keyboard, Shield, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useCustomerStore } from '@/stores/customer-store';

export default function SettingsPage() {
  const { settings, updateSettings, loadSettings, isAuthenticated, isLoading } = useCustomerStore();
  const [localSettings, setLocalSettings] = useState(settings);

  // Load settings on mount
  useEffect(() => {
    const loadedSettings = loadSettings();
    setLocalSettings(loadedSettings);
  }, [loadSettings, isAuthenticated]);

  // Sync local state with store
  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const toggleSetting = async (key: keyof typeof localSettings) => {
    const newSettings = { ...localSettings, [key]: !localSettings[key] };
    setLocalSettings(newSettings);
    await updateSettings({ [key]: !localSettings[key] });
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
        <span>Settings</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-prana-sage" />
        <h1 className="text-4xl font-heading font-bold">Account Settings</h1>
      </div>

      {/* Status indicator */}
      {isAuthenticated && (
        <div className="mb-6 p-3 bg-prana-sage/10 rounded-xl text-sm text-prana-sage">
          ✓ Settings are synced to your account
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-prana-sage/10 rounded-xl">
              <Lock className="w-6 h-6 text-prana-sage" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Security</h2>
          </div>

          <div className="space-y-6">
            {/* Password Change */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <button className="w-full py-3 px-4 bg-gray-50 text-left rounded-xl hover:bg-gray-100 transition-colors">
                <span className="text-sm">••••••••••</span>
                <p className="text-xs text-charcoal-soft/60 mt-1">
                  Last changed 30 days ago
                </p>
              </button>
            </div>

            {/* Two-Factor Authentication */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-charcoal-soft/60" />
                <div>
                  <p className="font-medium text-sm">Two-Factor Auth</p>
                  <p className="text-xs text-charcoal-soft/60">Extra security layer</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('twoFactorAuth')}
                disabled={isLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.twoFactorAuth ? 'bg-prana-sage' : 'bg-gray-300'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.twoFactorAuth ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Biometric Auth */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-charcoal-soft/60" />
                <div>
                  <p className="font-medium text-sm">Biometric Login</p>
                  <p className="text-xs text-charcoal-soft/60">Face ID / Fingerprint</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('biometricAuth')}
                disabled={isLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.biometricAuth ? 'bg-prana-sage' : 'bg-gray-300'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.biometricAuth ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-prana-sage/10 rounded-xl">
              <Bell className="w-6 h-6 text-prana-sage" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Notifications</h2>
          </div>

          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-charcoal-soft/60" />
                <div>
                  <p className="font-medium text-sm">Email Notifications</p>
                  <p className="text-xs text-charcoal-soft/60">Account updates</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('emailNotifications')}
                disabled={isLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.emailNotifications ? 'bg-prana-sage' : 'bg-gray-300'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.emailNotifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* SMS Notifications */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-charcoal-soft/60" />
                <div>
                  <p className="font-medium text-sm">SMS Notifications</p>
                  <p className="text-xs text-charcoal-soft/60">Text messages</p>
                </div>
              </div>
              <button
                onClick={() => toggleSetting('smsNotifications')}
                disabled={isLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.smsNotifications ? 'bg-prana-sage' : 'bg-gray-300'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.smsNotifications ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Order Updates */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm">Order Updates</p>
                <p className="text-xs text-charcoal-soft/60">Shipping & delivery</p>
              </div>
              <button
                onClick={() => toggleSetting('orderUpdates')}
                disabled={isLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.orderUpdates ? 'bg-prana-sage' : 'bg-gray-300'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.orderUpdates ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>

            {/* Promotional Emails */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="font-medium text-sm">Promotional Emails</p>
                <p className="text-xs text-charcoal-soft/60">Offers & deals</p>
              </div>
              <button
                onClick={() => toggleSetting('promotionalEmails')}
                disabled={isLoading}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  localSettings.promotionalEmails ? 'bg-prana-sage' : 'bg-gray-300'
                } ${isLoading ? 'opacity-50' : ''}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    localSettings.promotionalEmails ? 'translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Privacy & Preferences */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="card-premium"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-prana-sage/10 rounded-xl">
              <Eye className="w-6 h-6 text-prana-sage" />
            </div>
            <h2 className="text-xl font-heading font-semibold">Privacy</h2>
          </div>

          <div className="space-y-4">
            {/* Stealth Mode Shortcut */}
            <div className="p-4 bg-prana-mint/10 rounded-xl border border-prana-mint/20">
              <div className="flex items-start gap-3 mb-3">
                <Keyboard className="w-5 h-5 text-prana-sage mt-0.5" />
                <div>
                  <p className="font-medium text-sm">Stealth Mode Shortcut</p>
                  <p className="text-xs text-charcoal-soft/60 mb-2">
                    Quick privacy toggle
                  </p>
                  <div className="flex gap-2">
                    <kbd className="px-2 py-1 bg-white rounded text-xs border">Ctrl</kbd>
                    <kbd className="px-2 py-1 bg-white rounded text-xs border">Shift</kbd>
                    <kbd className="px-2 py-1 bg-white rounded text-xs border">H</kbd>
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy Settings Link */}
            <Link href="/account/privacy" className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <p className="font-medium text-sm mb-1">Privacy Controls</p>
              <p className="text-xs text-charcoal-soft/60">
                Manage data & consent →
              </p>
            </Link>

            {/* Discreet Packaging */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <p className="font-medium text-sm mb-1">Discreet Packaging</p>
              <p className="text-xs text-charcoal-soft/60 mb-2">
                Always enabled for your privacy
              </p>
              <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                Active
              </span>
            </div>

            {/* Session Management */}
            <button className="w-full p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-left">
              <p className="font-medium text-sm mb-1">Active Sessions</p>
              <p className="text-xs text-charcoal-soft/60">
                Manage logged in devices
              </p>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Advanced Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 card-premium"
      >
        <h3 className="text-lg font-heading font-semibold mb-4">Advanced Options</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <button className="p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <p className="font-medium text-sm mb-1">Export Your Data</p>
            <p className="text-xs text-charcoal-soft/60">Download account information</p>
          </button>
          <button className="p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <p className="font-medium text-sm mb-1">Connected Apps</p>
            <p className="text-xs text-charcoal-soft/60">Manage third-party access</p>
          </button>
          <button className="p-4 text-left bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <p className="font-medium text-sm mb-1">Browser History</p>
            <p className="text-xs text-charcoal-soft/60">Clear browsing data</p>
          </button>
          <button className="p-4 text-left bg-red-50 rounded-xl hover:bg-red-100 transition-colors">
            <p className="font-medium text-sm text-red-600 mb-1">Delete Account</p>
            <p className="text-xs text-red-600/70">Permanently remove account</p>
          </button>
        </div>
      </motion.div>

      {/* Note */}
      <div className="mt-4 p-6 bg-blue-50 rounded-2xl border border-blue-200">
        <p className="text-sm text-blue-700">
          <strong>Demo Settings:</strong> These are sample preferences. Real settings will be saved to MedusaJS once authentication is configured.
        </p>
      </div>
    </motion.div>
  );
}

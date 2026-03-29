/**
 * Account Page - Dashboard with Medusa Integration
 * 
 * Shows customer profile, quick links, and privacy settings.
 * Integrates with Medusa customer API for authentication.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { User, Package, Heart, Settings, Shield, LogOut, LogIn, Mail, Lock } from "lucide-react";
import { useStealthMode } from "@/stores/stealth-mode";
import { useCustomerStore } from "@/stores/customer-store";

const menuItems = [
  { icon: User, label: "Profile", href: "/account/profile", description: "Manage your details" },
  { icon: Package, label: "Orders", href: "/account/orders", description: "Track your purchases" },
  { icon: Heart, label: "Wishlist", href: "/account/wishlist", description: "Saved items" },
  { icon: Settings, label: "Settings", href: "/account/settings", description: "Preferences" },
  { icon: Shield, label: "Privacy", href: "/account/privacy", description: "Privacy controls" },
];

export default function AccountPage() {
  const { isStealthMode, toggleStealthMode } = useStealthMode();
  const { customer, isAuthenticated, isLoading, error, login, register, logout, checkAuth } = useCustomerStore();
  
  // Login/Register form state
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Check auth on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    
    try {
      if (isLoginMode) {
        const success = await login(email, password);
        if (!success) {
          setFormError("Invalid email or password");
        }
      } else {
        if (!firstName || !lastName) {
          setFormError("Please fill in all fields");
          setSubmitting(false);
          return;
        }
        const success = await register({ email, password, first_name: firstName, last_name: lastName });
        if (!success) {
          setFormError("Registration failed. Email may already be in use.");
        }
      }
    } catch {
      setFormError("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-prana-sage" />
        <h1 className="text-4xl font-heading font-bold">Your Account</h1>
      </div>

      {/* Login/Register Form (if not authenticated) */}
      {!isAuthenticated && !isLoading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-premium p-8 mb-8 max-w-md mx-auto"
        >
          <h2 className="text-2xl font-heading mb-6 text-center">
            {isLoginMode ? "Welcome Back" : "Create Account"}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLoginMode && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-charcoal-soft/70 mb-1 block">First Name</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-prana-sage/20 rounded-lg focus:border-prana-sage focus:outline-none transition-colors"
                    required={!isLoginMode}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal-soft/70 mb-1 block">Last Name</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-prana-sage/20 rounded-lg focus:border-prana-sage focus:outline-none transition-colors"
                    required={!isLoginMode}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="text-sm font-medium text-charcoal-soft/70 mb-1 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-soft/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border-2 border-prana-sage/20 rounded-lg focus:border-prana-sage focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium text-charcoal-soft/70 mb-1 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-soft/40" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border-2 border-prana-sage/20 rounded-lg focus:border-prana-sage focus:outline-none transition-colors"
                  required
                  minLength={6}
                />
              </div>
            </div>
            
            {(formError || error) && (
              <p className="text-sm text-red-500">{formError || error}</p>
            )}
            
            <button
              type="submit"
              disabled={submitting || isLoading}
              className="btn-velvet w-full flex items-center justify-center gap-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  {isLoginMode ? "Sign In" : "Create Account"}
                </>
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setFormError(null);
              }}
              className="text-prana-sage hover:underline text-sm"
            >
              {isLoginMode ? "Need an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Menu Grid (visible to all, but shows login prompt for some) */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={item.href}
                className="card-premium p-6 cursor-pointer hover:scale-105 transition-transform block"
              >
                <Icon className="w-8 h-8 text-prana-sage mb-3" />
                <h3 className="text-xl font-heading">{item.label}</h3>
                <p className="text-sm text-charcoal-soft/60 mt-1">{item.description}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Privacy Controls */}
      <div className="card-premium p-8 mb-8">
        <h2 className="text-2xl font-heading mb-6">Privacy Settings</h2>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-prana-cream/50 rounded-xl">
            <div>
              <h3 className="font-heading text-lg mb-1">Stealth Mode</h3>
              <p className="text-sm text-charcoal-soft/60">
                Hide wellness branding and switch to minimal theme
              </p>
              <p className="text-xs text-charcoal-soft/50 mt-1">
                Keyboard shortcut: Ctrl + Shift + S
              </p>
            </div>
            <button
              onClick={toggleStealthMode}
              className={`w-14 h-8 rounded-full transition-colors ${
                isStealthMode ? "bg-prana-sage" : "bg-charcoal-soft/20"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow transition-transform ${
                  isStealthMode ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-prana-cream/50 rounded-xl">
            <div>
              <h3 className="font-heading text-lg mb-1">Quick Exit</h3>
              <p className="text-sm text-charcoal-soft/60">
                Double-tap ESC to instantly exit to Google
              </p>
            </div>
            <span className="tech-label text-green-600 bg-green-100 px-2 py-1 rounded">Active</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-prana-cream/50 rounded-xl">
            <div>
              <h3 className="font-heading text-lg mb-1">Discreet Packaging</h3>
              <p className="text-sm text-charcoal-soft/60">
                All orders ship in unbranded boxes
              </p>
            </div>
            <span className="tech-label text-green-600 bg-green-100 px-2 py-1 rounded">Enabled</span>
          </div>
        </div>
      </div>

      {/* Account Info (if authenticated) */}
      {isAuthenticated && customer && (
        <div className="card-premium p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-heading">Account Information</h2>
            <Link href="/account/profile" className="text-prana-sage hover:underline text-sm">
              Edit
            </Link>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="tech-label text-charcoal-soft/60 mb-1 block">Name</label>
              <p className="font-body">{customer.first_name} {customer.last_name}</p>
            </div>
            <div>
              <label className="tech-label text-charcoal-soft/60 mb-1 block">Email</label>
              <p className="font-body">{customer.email}</p>
            </div>
            {customer.phone && (
              <div>
                <label className="tech-label text-charcoal-soft/60 mb-1 block">Phone</label>
                <p className="font-body">{customer.phone}</p>
              </div>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors mt-6"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm">Sign Out</span>
          </button>
        </div>
      )}

      {/* Guest Info */}
      {!isAuthenticated && !isLoading && (
        <div className="card-premium p-8">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-heading">Account Information</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="tech-label text-charcoal-soft/60 mb-1 block">Status</label>
              <p className="font-body text-charcoal-soft/70">Guest User</p>
            </div>
            <p className="text-sm text-charcoal-soft/60">
              Sign in to track orders, manage your wishlist, and enjoy a personalized experience.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/**
 * Profile Page - Customer Profile with Medusa Integration
 * 
 * View and edit personal information, synced with Medusa backend.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Calendar, Edit2, Save, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCustomerStore } from "@/stores/customer-store";

export default function ProfilePage() {
  const router = useRouter();
  const { customer, isAuthenticated, updateProfile, checkAuth } = useCustomerStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
  });

  // Check authentication on mount
  useEffect(() => {
    const initPage = async () => {
      await checkAuth();
      setIsLoading(false);
    };
    initPage();
  }, [checkAuth]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/account");
    }
  }, [isLoading, isAuthenticated, router]);

  // Populate form with customer data
  useEffect(() => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
      });
    }
  }, [customer]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully!" });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile. Please try again." });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (customer) {
      setFormData({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        phone: customer.phone || "",
      });
    }
    setIsEditing(false);
    setMessage(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="card-premium p-12 text-center">
          <div className="w-12 h-12 border-4 border-prana-sage/20 border-t-prana-sage rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-soft/60">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!customer) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8"
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-charcoal-soft/60 mb-6">
        <Link href="/account" className="hover:text-prana-sage transition-colors flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Account
        </Link>
        <span>/</span>
        <span>Profile</span>
      </div>

      <div className="flex items-center gap-3 mb-8">
        <User className="w-8 h-8 text-prana-sage" />
        <h1 className="text-4xl font-heading font-bold">Your Profile</h1>
      </div>

      {/* Success/Error Message */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{message.text}</p>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="card-premium p-8 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-heading">Personal Information</h2>
            {isEditing ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-full text-charcoal-soft/70 hover:bg-neutral-100 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-prana-sage text-white hover:bg-prana-sage/90 transition-all disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>Save</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-prana-sage/10 text-prana-sage hover:bg-prana-sage hover:text-white transition-all"
              >
                <Edit2 className="w-4 h-4" />
                <span>Edit</span>
              </button>
            )}
          </div>

          <div className="space-y-6">
            {/* Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="tech-label text-charcoal-soft/60 mb-2 block">First Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                  />
                ) : (
                  <p className="font-body text-lg">{customer.first_name || "Not set"}</p>
                )}
              </div>
              <div>
                <label className="tech-label text-charcoal-soft/60 mb-2 block">Last Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                  />
                ) : (
                  <p className="font-body text-lg">{customer.last_name || "Not set"}</p>
                )}
              </div>
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="tech-label text-charcoal-soft/60 mb-2 block flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </label>
              <p className="font-body text-lg">{customer.email}</p>
              <p className="text-xs text-charcoal-soft/50 mt-1">
                Email cannot be changed. Contact support if you need to update it.
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="tech-label text-charcoal-soft/60 mb-2 block flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full px-4 py-3 rounded-xl border border-charcoal-soft/20 focus:border-prana-sage focus:ring-2 focus:ring-prana-sage/20 outline-none transition-all"
                />
              ) : (
                <p className="font-body text-lg text-charcoal-soft/60">
                  {customer.phone || "Not provided"}
                </p>
              )}
            </div>

            {/* Account Created */}
            <div>
              <label className="tech-label text-charcoal-soft/60 mb-2 block flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Member Since
              </label>
              <p className="font-body text-lg">
                {customer.created_at 
                  ? new Date(customer.created_at).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Unknown"}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="card-premium p-6">
            <h3 className="font-heading text-lg mb-4">Account Overview</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-charcoal-soft/60">Total Orders</span>
                <span className="font-heading text-lg">{customer.orders?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-charcoal-soft/60">Saved Addresses</span>
                <span className="font-heading text-lg">{customer.shipping_addresses?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="card-premium p-6">
            <h3 className="font-heading text-lg mb-4">Privacy First</h3>
            <p className="text-sm text-charcoal-soft/70 leading-relaxed">
              Your personal information is encrypted and stored securely. We never share your data with third parties.
            </p>
          </div>

          <div className="card-premium p-6">
            <h3 className="font-heading text-lg mb-4">Account Security</h3>
            <Link
              href="/account/settings"
              className="text-sm text-prana-sage hover:underline block mb-2"
            >
              Change Password →
            </Link>
            <Link
              href="/account/settings"
              className="text-sm text-prana-sage hover:underline block"
            >
              Enable Two-Factor Auth →
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

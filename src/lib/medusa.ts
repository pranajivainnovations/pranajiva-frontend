/**
 * Medusa Client Configuration
 * 
 * This module creates a singleton Medusa client instance for communicating
 * with the PranaJiva backend API. It handles all product, cart, customer,
 * and order operations.
 */

import Medusa from "@medusajs/medusa-js";

// Backend URL - defaults to localhost:9001 (port 9000 blocked by Zscaler)
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9001";

/**
 * Get the appropriate base URL for Medusa client
 * - On server: Use direct backend URL (no CORS issues)
 * - On client: Use Next.js API proxy to avoid CORS
 */
function getMedusaBaseUrl(): string {
  // Check if we're running on the client side
  // if (typeof window !== "undefined") {
  //   // Client-side: Use Next.js API proxy
  //   return `${window.location.origin}/api/medusa`;
  // }
  
  // Server-side: Use direct backend URL
  return MEDUSA_BACKEND_URL;
}

// Create singleton Medusa client
export const medusaClient = new Medusa({
  baseUrl: getMedusaBaseUrl(),
  maxRetries: 3,
});

// Types are defined locally in stores/components that need them
// MedusaJS v1 doesn't export types directly from medusa-js package

/**
 * Helper to format price from smallest unit (paise) to display format
 * MedusaJS stores prices in smallest currency unit (1 INR = 100 paise)
 */
export function formatPrice(amount: number | null | undefined, currencyCode: string = "inr"): string {
  if (amount === null || amount === undefined) return "₹0";
  
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
  
  // Convert from paise to rupees
  return formatter.format(amount / 100);
}

/**
 * Helper to get the price for a specific region/currency
 */
export function getVariantPrice(
  variant: { prices?: Array<{ currency_code: string; amount: number }> },
  currencyCode: string = "inr"
): number | null {
  if (!variant.prices) return null;
  const price = variant.prices.find(p => p.currency_code === currencyCode);
  return price?.amount ?? null;
}

/**
 * Helper to get product thumbnail or fallback
 */
export function getProductThumbnail(product: { thumbnail?: string | null }): string {
  return product.thumbnail || "/images/placeholder-product.png";
}

/**
 * Get wellness category from product metadata
 */
export function getWellnessCategory(product: { metadata?: Record<string, unknown> | null }): string {
  return (product.metadata?.wellness_category as string) || "Wellness";
}

/**
 * Check if product has discreet packaging
 */
export function isDiscreetProduct(product: { metadata?: Record<string, unknown> | null }): boolean {
  return product.metadata?.is_discreet === true;
}

/**
 * Normalize phone number to Indian format (+91)
 * - Removes spaces, dashes, parentheses
 * - Prepends +91 if no country code is present
 * - Handles numbers starting with 0 (removes leading 0)
 */
export function normalizeIndianPhone(phone: string): string {
  if (!phone) return "";
  
  // Remove all non-digit characters except +
  let cleaned = phone.replace(/[^\d+]/g, "");
  
  // If already has +91, return as is
  if (cleaned.startsWith("+91")) {
    return cleaned;
  }
  
  // If starts with 91 (without +), add +
  if (cleaned.startsWith("91") && cleaned.length > 10) {
    return "+" + cleaned;
  }
  
  // If starts with 0, remove the leading 0
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.substring(1);
  }
  
  // If it's a 10-digit number, prepend +91
  if (cleaned.length === 10 && /^\d{10}$/.test(cleaned)) {
    return "+91" + cleaned;
  }
  
  // If it has some other country code (starts with +), return as is
  if (cleaned.startsWith("+")) {
    return cleaned;
  }
  
  // Default: prepend +91 for any other case
  return "+91" + cleaned;
}

/**
 * Format phone for display (Indian format)
 * +91 XXXXX XXXXX
 */
export function formatIndianPhone(phone: string): string {
  const normalized = normalizeIndianPhone(phone);
  if (normalized.startsWith("+91") && normalized.length === 13) {
    return `+91 ${normalized.slice(3, 8)} ${normalized.slice(8)}`;
  }
  return normalized;
}

// Export backend URL for API routes
export const BACKEND_URL = MEDUSA_BACKEND_URL;

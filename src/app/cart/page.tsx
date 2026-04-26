/**
 * Cart Page - Shopping Cart with Medusa Integration
 * 
 * Displays cart items from Medusa backend with real-time updates.
 * Supports quantity changes, item removal, and checkout initiation.
 */

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight, Tag, Shield } from "lucide-react";
import { useCartStore } from "@/stores/cart-store";
import { formatPrice, getWellnessCategory } from "@/lib/medusa";
import { CartCrossSell } from "@/components/product/CartCrossSell";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";

export default function CartPage() {
  const {
    cart,
    itemCount,
    isLoading,
    error,
    initializeCart,
    updateItemQuantity,
    removeItem,
    applyDiscount,
    removeDiscount,
  } = useCartStore();
  
  const [discountCode, setDiscountCode] = useState("");
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [applyingDiscount, setApplyingDiscount] = useState(false);
  const { products: recentProducts } = useRecentlyViewed();
  
  // Initialize cart on mount
  useEffect(() => {
    initializeCart();
  }, [initializeCart]);
  
  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setApplyingDiscount(true);
    setDiscountError(null);
    
    try {
      await applyDiscount(discountCode.trim().toUpperCase());
      setDiscountCode("");
    } catch {
      setDiscountError("Invalid or expired discount code");
    } finally {
      setApplyingDiscount(false);
    }
  };
  
  const handleRemoveDiscount = async (code: string) => {
    await removeDiscount(code);
  };
  
  // Format currency
  const currencyCode = cart?.region?.currency_code || "inr";
  
  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1>Your Cart</h1>
      </div>
    </div>
  );
}
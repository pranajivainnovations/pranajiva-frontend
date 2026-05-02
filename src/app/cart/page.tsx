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
    } catch (err) {
      setDiscountError("Invalid or expired discount code");
    } finally {
      setApplyingDiscount(false);
    }
  };

  const handleRemoveDiscount = async (code: string) => {
    await removeDiscount(code);
  };

  const currencyCode = cart?.region?.currency_code || "inr";

  return (
    <div className="min-h-screen bg-gradient-to-b from-prana-cream/30 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <ShoppingCart className="w-8 h-8 text-prana-sage" />
          <h1 className="text-4xl font-heading font-bold">Your Cart</h1>
          {itemCount > 0 && (
            <span className="ml-2 px-3 py-1 bg-prana-sage/10 text-prana-sage rounded-full text-sm font-medium">
              {itemCount} {itemCount === 1 ? "item" : "items"}
            </span>
          )}
        </div>

        {isLoading && !cart && (
          <div className="card-premium p-12 text-center">
            <div className="w-12 h-12 border-4 border-prana-sage/20 border-t-prana-sage rounded-full animate-spin mx-auto mb-4" />
            <p className="text-charcoal-soft/60">Loading your cart...</p>
          </div>
        )}

        {error && (
          <div className="card-premium p-6 mb-6 border-l-4 border-red-500 bg-red-50">
            <p className="text-red-600">{error}</p>
            <button
              onClick={() => initializeCart()}
              className="mt-2 text-sm text-red-600 underline hover:no-underline"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && cart && cart.items.length === 0 && (
          <div className="card-premium p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-charcoal-soft/30" />
            <h2 className="text-2xl font-heading mb-2">Your cart is empty</h2>
            <p className="text-charcoal-soft/60 mb-6">
              Add some wellness products to get started
            </p>
            <Link href="/shop" className="btn-velvet inline-flex items-center gap-2">
              Continue Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {cart && cart.items.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const category = getWellnessCategory(item.variant?.product || {});

                return (
                  <div key={item.id} className="card-premium p-6">
                    <div className="flex gap-4">
                      <div className="relative w-24 h-24 bg-prana-cream rounded-lg overflow-hidden flex-shrink-0">
                        {item.thumbnail ? (
                          <Image
                            src={item.thumbnail}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl opacity-30">
                            🌿
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="tech-label text-prana-sage">{category}</span>
                            <Link
                              href={`/shop/${item.variant?.product?.handle || ""}`}
                              className="block text-lg font-heading mt-1 hover:text-prana-sage transition-colors truncate"
                            >
                              {item.title}
                            </Link>
                            {item.variant?.title && item.variant.title !== "Default" && (
                              <p className="text-sm text-charcoal-soft/60">{item.variant.title}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            disabled={isLoading}
                            className="text-charcoal-soft/40 hover:text-red-500 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="flex justify-between items-center mt-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                              disabled={isLoading || item.quantity <= 1}
                              className="w-8 h-8 rounded-full border-2 border-prana-sage/20 flex items-center justify-center hover:bg-prana-sage/5 transition-colors disabled:opacity-50"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="font-body font-bold w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                              disabled={isLoading}
                              className="w-8 h-8 rounded-full border-2 border-prana-sage/20 flex items-center justify-center hover:bg-prana-sage/5 transition-colors disabled:opacity-50"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <div className="text-xl font-heading">
                              {formatPrice(item.total, currencyCode)}
                            </div>
                            {item.quantity > 1 && (
                              <p className="text-sm text-charcoal-soft/50">
                                {formatPrice(item.unit_price, currencyCode)} each
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}

              <div className="pt-4">
                <Link
                  href="/shop"
                  className="text-prana-sage hover:underline inline-flex items-center gap-2"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="card-premium p-6 sticky top-4">
                <h2 className="text-2xl font-heading mb-6">Order Summary</h2>

                <div className="mb-6">
                  <label className="text-sm font-medium text-charcoal-soft/70 mb-2 block">
                    Discount Code
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-soft/40" />
                      <input
                        type="text"
                        value={discountCode}
                        onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Enter code"
                        className="w-full pl-10 pr-4 py-2 border-2 border-prana-sage/20 rounded-lg focus:border-prana-sage focus:outline-none transition-colors"
                      />
                    </div>
                    <button
                      onClick={handleApplyDiscount}
                      disabled={!discountCode.trim() || applyingDiscount}
                      className="px-4 py-2 bg-prana-sage/10 text-prana-sage rounded-lg hover:bg-prana-sage/20 transition-colors disabled:opacity-50"
                    >
                      {applyingDiscount ? "..." : "Apply"}
                    </button>
                  </div>
                  {discountError && (
                    <p className="text-sm text-red-500 mt-1">{discountError}</p>
                  )}
                </div>

                {cart.discount_total > 0 && (
                  <div className="mb-4 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between text-green-600">
                      <span className="flex items-center gap-2">
                        <Tag className="w-4 h-4" />
                        Discount Applied
                      </span>
                      <button
                        onClick={() => handleRemoveDiscount("DISCOUNT")}
                        className="text-sm underline hover:no-underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-charcoal-soft/70">
                    <span>Subtotal</span>
                    <span>{formatPrice(cart.subtotal, currencyCode)}</span>
                  </div>

                  {cart.discount_total > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>-{formatPrice(cart.discount_total, currencyCode)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-charcoal-soft/70">
                    <span>Shipping</span>
                    <span>
                      {cart.shipping_total > 0
                        ? formatPrice(cart.shipping_total, currencyCode)
                        : "Calculated at checkout"
                      }
                    </span>
                  </div>

                  {cart.tax_total > 0 && (
                    <div className="flex justify-between text-charcoal-soft/70">
                      <span>Tax (GST)</span>
                      <span>{formatPrice(cart.tax_total, currencyCode)}</span>
                    </div>
                  )}

                  <div className="border-t border-prana-sage/10 pt-3 mt-3">
                    <div className="flex justify-between text-xl font-heading">
                      <span>Total</span>
                      <span>{formatPrice(cart.total, currencyCode)}</span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="btn-velvet w-full flex items-center justify-center gap-2 mb-4"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <div className="badge-discreet text-sm justify-center">
                  <Shield className="w-4 h-4" />
                  <span>100% discreet packaging guaranteed</span>
                </div>

                <div className="mt-4 pt-4 border-t border-prana-sage/10">
                  <p className="text-xs text-charcoal-soft/50 text-center mb-2">
                    Secure payments via
                  </p>
                  <div className="flex justify-center gap-3 text-charcoal-soft/30">
                    <span className="text-xs font-medium">Razorpay</span>
                    <span>•</span>
                    <span className="text-xs font-medium">UPI</span>
                    <span>•</span>
                    <span className="text-xs font-medium">Cards</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {cart && cart.items.length > 0 && (
          <CartCrossSell items={cart.items as any} />
        )}

        <RecentlyViewed products={recentProducts} />
      </div>
    </div>
  );
}

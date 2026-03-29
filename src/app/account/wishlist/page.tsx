/**
 * Wishlist Page - Customer Wishlist with Medusa Integration
 * 
 * Displays saved products and allows adding to cart.
 * Uses local storage for wishlist persistence.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useStealthMode } from "@/stores/stealth-mode";
import { useCustomerStore } from "@/stores/customer-store";
import { useCartStore } from "@/stores/cart-store";
import { medusaClient, formatPrice, getWellnessCategory } from "@/lib/medusa";

interface WishlistProduct {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: Array<{
    id: string;
    title: string;
    prices?: Array<{ currency_code: string; amount: number }>;
    inventory_quantity?: number;
  }>;
  metadata?: Record<string, unknown> | null;
}

export default function WishlistPage() {
  const { isStealthMode } = useStealthMode();
  const { wishlist, removeFromWishlist, clearWishlist } = useCustomerStore();
  const { addItem, isLoading: cartLoading } = useCartStore();
  
  const [products, setProducts] = useState<WishlistProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  // Fetch product details for wishlist items
  useEffect(() => {
    const fetchWishlistProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        const productIds = wishlist.map(item => item.productId);
        const { products: fetchedProducts } = await medusaClient.products.list({
          id: productIds,
          expand: "variants,variants.prices",
        });
        
        setProducts(fetchedProducts as WishlistProduct[]);
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchWishlistProducts();
  }, [wishlist]);
  
  const handleAddToCart = async (product: WishlistProduct) => {
    const variant = product.variants?.[0];
    if (!variant || cartLoading) return;
    
    setAddingToCart(product.id);
    await addItem(variant.id, 1);
    setAddingToCart(null);
  };
  
  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
    setProducts(products.filter(p => p.id !== productId));
  };

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
        <span>Wishlist</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Heart className="w-8 h-8 text-velvet-rose fill-velvet-rose" />
          <h1 className="text-4xl font-heading font-bold">Your Wishlist</h1>
        </div>
        {wishlist.length > 0 && (
          <div className="flex items-center gap-4">
            <span className="tech-label text-charcoal-soft/60">
              {wishlist.length} {wishlist.length === 1 ? "item" : "items"}
            </span>
            <button
              onClick={clearWishlist}
              className="text-sm text-red-500 hover:underline"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="card-premium p-12 text-center">
          <div className="w-12 h-12 border-4 border-prana-sage/20 border-t-prana-sage rounded-full animate-spin mx-auto mb-4" />
          <p className="text-charcoal-soft/60">Loading your wishlist...</p>
        </div>
      )}

      {/* Empty Wishlist */}
      {!isLoading && wishlist.length === 0 && (
        <div className="card-premium p-12 text-center">
          <Heart className="w-16 h-16 text-charcoal-soft/30 mx-auto mb-4" />
          <h3 className="text-xl font-heading mb-2">Your Wishlist is Empty</h3>
          <p className="text-charcoal-soft/60 mb-6">
            Save items you love by clicking the heart icon on any product
          </p>
          <Link href="/shop" className="btn-velvet inline-block">
            Explore Products
          </Link>
        </div>
      )}

      {/* Wishlist Grid */}
      {!isLoading && products.length > 0 && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => {
            const variant = product.variants?.[0];
            const price = variant?.prices?.find(p => p.currency_code === "inr")?.amount;
            const inStock = (variant?.inventory_quantity ?? 0) > 0;
            const category = getWellnessCategory(product);
            const isAddingThis = addingToCart === product.id;
            
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="card-premium overflow-hidden group"
              >
                {/* Product Image */}
                <Link href={`/shop/${product.handle}`} className="block">
                  <div className="aspect-square bg-gradient-to-br from-prana-cream to-neutral-100 relative overflow-hidden">
                    {product.thumbnail ? (
                      <Image
                        src={product.thumbnail}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-6xl opacity-20">🌿</div>
                      </div>
                    )}
                    
                    {/* Out of Stock Badge */}
                    {!inStock && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-charcoal-soft text-white text-xs rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveFromWishlist(product.id);
                      }}
                      className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </Link>

                {/* Product Info */}
                <div className="p-5">
                  <span className="tech-label text-prana-sage mb-1 block">{category}</span>
                  
                  <Link href={`/shop/${product.handle}`}>
                    <h3 className={`font-heading text-lg mb-2 line-clamp-2 hover:text-prana-sage transition-colors ${isStealthMode ? "text-charcoal-soft/70" : ""}`}>
                      {isStealthMode ? "Wellness Product" : product.title}
                    </h3>
                  </Link>
                  
                  <p className="text-2xl font-heading text-charcoal-soft mb-4">
                    {price ? formatPrice(price, "inr") : "Price unavailable"}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={!inStock || isAddingThis || cartLoading}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-full transition-all ${
                        inStock
                          ? "btn-velvet"
                          : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                      }`}
                    >
                      {isAddingThis ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm font-medium">Adding...</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {inStock ? "Add to Cart" : "Unavailable"}
                          </span>
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="p-3 rounded-full border border-prana-sage/20 hover:border-red-500 hover:bg-red-50 hover:text-red-500 transition-all"
                      aria-label="Remove from wishlist"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                    </button>
                  </div>

                  {/* Stock Notification */}
                  {!inStock && (
                    <button className="w-full mt-3 py-2 text-sm text-prana-sage hover:underline">
                      Notify When Available
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Privacy Notice */}
      {wishlist.length > 0 && (
        <div className="mt-8 p-6 bg-prana-sage/5 rounded-2xl border border-prana-sage/20">
          <h3 className="font-heading text-lg mb-2 text-prana-sage">
            Private & Secure
          </h3>
          <p className="text-sm text-charcoal-soft/70">
            Your wishlist is stored locally on your device. We never share what you save with anyone. 
            Sign in to sync your wishlist across devices.
          </p>
        </div>
      )}
    </motion.div>
  );
}

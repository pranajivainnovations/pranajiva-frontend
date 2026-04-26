/**
 * Product Detail Client Component
 * 
 * Handles interactive elements: variant selection, quantity,
 * add to cart, wishlist, and image gallery.
 */

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Shield,
  Truck,
  Package,
  Minus,
  Plus,
  Check,
} from "lucide-react";
import { formatPrice, getWellnessCategory, isDiscreetProduct } from "@/lib/medusa";
import { useCartStore } from "@/stores/cart-store";
import { useCustomerStore } from "@/stores/customer-store";
import { useStealthMode } from "@/stores/stealth-mode";
import { useToastStore } from "@/stores/toast-store";
import { SocialProof } from "@/components/product/SocialProof";

interface ProductVariant {
  id: string;
  title: string;
  prices: Array<{ currency_code: string; amount: number }>;
  inventory_quantity: number;
  options: Array<{ value: string }>;
}

interface ProductOption {
  id: string;
  title: string;
  values: Array<{ value: string }>;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  subtitle: string | null;
  thumbnail: string | null;
  images: Array<{ url: string; id: string }>;
  variants: ProductVariant[];
  options: ProductOption[];
  metadata: Record<string, unknown> | null;
  collection: { title: string } | null;
}

interface Props {
  product: Product;
}

export function ProductDetailClient({ product }: Props) {
  const { isStealthMode } = useStealthMode();
  const { addItem, isLoading: cartLoading } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useCustomerStore();
  const { addToast } = useToastStore();
  
  // State
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  
  // Computed
  const inWishlist = isInWishlist(product.id);
  const category = getWellnessCategory(product);
  const isDiscreet = isDiscreetProduct(product);
  const inStock = selectedVariant.inventory_quantity > 0;
  
  // Get price for INR
  const price = selectedVariant.prices.find(p => p.currency_code === "inr")?.amount || 0;
  const formattedPrice = formatPrice(price, "inr");
  
  // All images (thumbnail + gallery)
  const allImages = [
    ...(product.thumbnail ? [{ url: product.thumbnail, id: "thumbnail" }] : []),
    ...product.images,
  ];
  
  // Tech specs from metadata
  const techSpecs = product.metadata?.tech_specs as Record<string, unknown> | undefined;
  
  const handleAddToCart = async () => {
    if (!inStock || isAdding || cartLoading) return;
    
    setIsAdding(true);
    try {
      await addItem(selectedVariant.id, quantity);
      addToast(`${product.title} added to cart`, 'success');
    } catch {
      addToast('Failed to add to cart', 'error');
    }
    setIsAdding(false);
    setAddedToCart(true);
    
    // Reset after 3 seconds
    setTimeout(() => setAddedToCart(false), 3000);
  };
  
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWishlist(product.id);
      addToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product.id, selectedVariant.id);
      addToast('Added to wishlist', 'success');
    }
  };
  
  const handleShare = async () => {
    const url = window.location.href;
    const text = `Check out ${product.title} at PranaJiva`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: product.title, text, url });
      } catch {
        // User cancelled or error
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };
  
  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen"
    >
      {/* Breadcrumb */}
      <div className="bg-prana-cream/50 border-b border-prana-sage/10">
        <div className="container mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-charcoal-soft/60">
            <Link href="/" className="hover:text-prana-sage transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-prana-sage transition-colors">Shop</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-charcoal-soft">{product.title}</span>
          </nav>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-prana-cream to-neutral-100 rounded-2xl overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute inset-0"
                >
                  {allImages[currentImageIndex]?.url ? (
                    <Image
                      src={allImages[currentImageIndex].url}
                      alt={`${product.title} - Image ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-8xl opacity-20">🌿</div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
              
              {/* Navigation Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-lg flex items-center justify-center hover:bg-white transition-colors"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {isDiscreet && (
                  <span className="badge-discreet">
                    <Shield className="w-4 h-4" />
                    Discreet Packaging
                  </span>
                )}
              </div>
            </div>
            
            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 transition-all ${
                      index === currentImageIndex
                        ? "ring-2 ring-prana-sage"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            {/* Category & Collection */}
            <div className="flex items-center gap-3">
              <span className="tech-label text-prana-sage">{category}</span>
              {product.collection && (
                <span className="text-sm text-charcoal-soft/50">
                  in {product.collection.title}
                </span>
              )}
            </div>
            
            {/* Title */}
            <h1 className={`text-3xl md:text-4xl font-heading font-bold ${isStealthMode ? "text-charcoal-soft/70" : ""}`}>
              {product.title}
            </h1>
            
            {/* Subtitle */}
            {product.subtitle && (
              <p className="text-lg text-charcoal-soft/70">{product.subtitle}</p>
            )}
            
            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-charcoal-soft">{formattedPrice}</span>
              <span className="text-sm text-charcoal-soft/50">incl. GST</span>
            </div>
            
            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {inStock ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-sm text-green-600">
                    In Stock ({selectedVariant.inventory_quantity} available)
                  </span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600">Out of Stock</span>
                </>
              )}
            </div>
            
            {/* Social Proof */}
            <SocialProof productId={product.id} />
            
            {/* Variant Selection */}
            {product.variants.length > 1 && (
              <div className="space-y-3">
                <label className="font-medium">
                  {product.options[0]?.title || "Variant"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 py-2 rounded-full border-2 transition-all ${
                        selectedVariant.id === variant.id
                          ? "border-prana-sage bg-prana-sage/10 text-prana-sage"
                          : "border-prana-sage/20 hover:border-prana-sage/40"
                      }`}
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity */}
            <div className="space-y-3">
              <label className="font-medium">Quantity</label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-prana-sage/20 rounded-full">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-prana-sage/5 transition-colors rounded-l-full"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(selectedVariant.inventory_quantity, quantity + 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-prana-sage/5 transition-colors rounded-r-full"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!inStock || isAdding || cartLoading}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-full font-medium transition-all ${
                  addedToCart
                    ? "bg-green-500 text-white"
                    : inStock
                    ? "btn-velvet"
                    : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
                }`}
              >
                {isAdding ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Adding to Cart...
                  </>
                ) : addedToCart ? (
                  <>
                    <Check className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
              
              <button
                onClick={handleWishlistToggle}
                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  inWishlist
                    ? "bg-velvet-rose text-white"
                    : "border-2 border-prana-sage/20 hover:border-velvet-rose hover:text-velvet-rose"
                }`}
                aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart className={`w-6 h-6 ${inWishlist ? "fill-current" : ""}`} />
              </button>
              
              <button
                onClick={handleShare}
                className="w-14 h-14 rounded-full border-2 border-prana-sage/20 flex items-center justify-center hover:border-prana-sage/40 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
            
            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-prana-sage/10">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-prana-sage" />
                <p className="text-xs text-charcoal-soft/60">Discreet Packaging</p>
              </div>
              <div className="text-center">
                <Truck className="w-8 h-8 mx-auto mb-2 text-prana-sage" />
                <p className="text-xs text-charcoal-soft/60">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-prana-sage" />
                <p className="text-xs text-charcoal-soft/60">Easy Returns</p>
              </div>
            </div>
            
            {/* Description */}
            {product.description && (
              <div className="pt-6 border-t border-prana-sage/10">
                <h3 className="font-heading text-lg font-semibold mb-3">Description</h3>
                <p className="text-charcoal-soft/80 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
            
            {/* Tech Specs */}
            {techSpecs && Object.keys(techSpecs).length > 0 && (
              <div className="pt-6 border-t border-prana-sage/10">
                <h3 className="font-heading text-lg font-semibold mb-3">Specifications</h3>
                <dl className="grid grid-cols-2 gap-3">
                  {Object.entries(techSpecs).map(([key, value]) => (
                    <div key={key} className="bg-prana-cream/50 rounded-lg p-3">
                      <dt className="text-xs text-charcoal-soft/50 uppercase tracking-wider">
                        {key.replace(/_/g, " ")}
                      </dt>
                      <dd className="font-medium mt-1">{String(value)}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

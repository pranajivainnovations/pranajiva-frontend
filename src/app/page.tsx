/**
 * Homepage - PranaJiva Wellness Store
 * 
 * Features: Hero, Categories, Featured Products, Privacy Promise
 * Fetches real products from Medusa backend.
 */

"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Package, Eye, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import DiscretionSection from "@/components/home/DiscretionSection";
import { medusaClient, formatPrice, getWellnessCategory } from "@/lib/medusa";
import { useStealthMode } from "@/stores/stealth-mode";

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: Array<{
    id: string;
    prices?: Array<{ currency_code: string; amount: number }>;
  }>;
  metadata?: Record<string, unknown> | null;
}

// Category data
const categories = [
  {
    name: "Pulse",
    description: "Personal vibration wellness devices",
    icon: "💫",
    color: "from-velvet-rose/20 to-prana-sage/10",
    count: 0,
  },
  {
    name: "Flow",
    description: "Lubricants & sensual enhancers",
    icon: "🌊",
    color: "from-prana-mint/20 to-prana-sage/10",
    count: 0,
  },
  {
    name: "Ritual",
    description: "Accessories & couples items",
    icon: "✨",
    color: "from-prana-sage/20 to-prana-mint/10",
    count: 0,
  },
  {
    name: "Care",
    description: "Hygiene & maintenance essentials",
    icon: "🌿",
    color: "from-prana-cream to-prana-sage/10",
    count: 0,
  },
];

// Privacy features
const privacyFeatures = [
  {
    icon: Package,
    title: "Plain Packaging",
    description: "Unbranded boxes with no product hints",
  },
  {
    icon: Eye,
    title: "Stealth Mode",
    description: "One click to disguise your browsing",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    description: "Encrypted payments, discreet billing",
  },
  {
    icon: Shield,
    title: "Private Delivery",
    description: "Delivered by trusted partners only",
  },
];

export default function HomePage() {
  const { isStealthMode } = useStealthMode();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});

  // Fetch featured products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { products } = await medusaClient.products.list({
          limit: 4,
          expand: "variants,variants.prices",
        });
        setFeaturedProducts(products as Product[]);
        
        // Count products by category
        const counts: Record<string, number> = {};
        products.forEach(product => {
          const cat = getWellnessCategory(product);
          counts[cat] = (counts[cat] || 0) + 1;
        });
        setCategoryCounts(counts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="page-enter"
    >
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-prana-cream to-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-prana-sage/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-velvet-rose/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center max-w-4xl mx-auto"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-prana-sage/10 text-prana-sage rounded-full text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              India&apos;s Most Private Wellness Store
            </span>
            
            <h1 className="text-5xl md:text-7xl font-heading font-bold mb-6 leading-tight">
              {isStealthMode ? (
                "Premium Wellness Products"
              ) : (
                <>
                  Your Wellness,{" "}
                  <span className="text-prana-sage">Your Privacy</span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-charcoal-soft/70 max-w-2xl mx-auto mb-8">
              Premium intimate wellness products delivered in plain, unmarked packaging. 
              No logos, no labels, no questions.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/shop" className="btn-velvet text-lg px-8 py-4">
                Shop Now
                <ArrowRight className="w-5 h-5 ml-2 inline" />
              </Link>
              <Link 
                href="/about" 
                className="px-8 py-4 border-2 border-prana-sage/30 text-prana-sage rounded-full hover:bg-prana-sage/10 transition-colors text-lg font-medium"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Features Bar */}
      <section className="bg-prana-sage text-white py-6">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {privacyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="flex items-center gap-3"
              >
                <feature.icon className="w-6 h-6 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{feature.title}</p>
                  <p className="text-xs text-white/70 hidden md:block">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4">
              Explore by Category
            </h2>
            <p className="text-charcoal-soft/60 max-w-xl mx-auto">
              Curated collections for every aspect of intimate wellness
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
              >
                <Link href={`/shop?category=${category.name}`}>
                  <div className={`card-premium p-8 text-center bg-gradient-to-br ${category.color} hover:shadow-xl transition-all duration-300 group cursor-pointer h-full`}>
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-2xl font-heading mb-2 group-hover:text-prana-sage transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-charcoal-soft/60 mb-3">
                      {category.description}
                    </p>
                    {categoryCounts[category.name] > 0 && (
                      <span className="text-xs text-prana-sage font-medium">
                        {categoryCounts[category.name]} products
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gradient-to-b from-prana-cream/30 to-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-4xl font-heading font-bold mb-2">
                Featured Products
              </h2>
              <p className="text-charcoal-soft/60">
                Our most popular wellness essentials
              </p>
            </div>
            <Link 
              href="/shop" 
              className="hidden md:flex items-center gap-2 text-prana-sage hover:underline font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card-premium overflow-hidden animate-pulse">
                  <div className="aspect-square bg-neutral-200" />
                  <div className="p-5">
                    <div className="h-4 bg-neutral-200 rounded w-1/3 mb-2" />
                    <div className="h-6 bg-neutral-200 rounded w-2/3 mb-4" />
                    <div className="h-8 bg-neutral-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => {
                const variant = product.variants?.[0];
                const price = variant?.prices?.find(p => p.currency_code === "inr")?.amount;
                const category = getWellnessCategory(product);
                
                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link href={`/shop/${product.handle}`}>
                      <div className="card-premium overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300">
                        <div className="aspect-square bg-gradient-to-br from-prana-cream to-neutral-100 relative overflow-hidden">
                          {product.thumbnail ? (
                            <Image
                              src={product.thumbnail}
                              alt={isStealthMode ? "Wellness Product" : product.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <div className="text-6xl opacity-20">🌿</div>
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <span className="tech-label text-prana-sage mb-1 block">
                            {category}
                          </span>
                          <h3 className={`font-heading text-lg mb-2 line-clamp-2 group-hover:text-prana-sage transition-colors ${isStealthMode ? "text-charcoal-soft/70" : ""}`}>
                            {isStealthMode ? "Wellness Product" : product.title}
                          </h3>
                          <p className="text-2xl font-heading text-charcoal-soft">
                            {price ? formatPrice(price, "inr") : "Price on request"}
                          </p>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="card-premium p-12 text-center">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-heading mb-2">Products Coming Soon</h3>
              <p className="text-charcoal-soft/60 mb-6">
                We&apos;re curating our collection. Check back soon!
              </p>
              <Link href="/contact" className="btn-velvet inline-block">
                Get Notified
              </Link>
            </div>
          )}
          
          <div className="md:hidden text-center mt-8">
            <Link 
              href="/shop" 
              className="btn-velvet inline-flex items-center gap-2"
            >
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Privacy Promise Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="card-premium p-10 md:p-12 bg-gradient-to-br from-prana-sage/5 to-prana-mint/10 border-prana-sage/20">
              <div className="flex flex-col md:flex-row items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl bg-prana-sage/10 flex items-center justify-center">
                    <Shield className="w-10 h-10 text-prana-sage" />
                  </div>
                </div>
                <div>
                  <span className="tech-label text-prana-sage mb-2 block">
                    Our Promise
                  </span>
                  <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">
                    100% Discreet, Always
                  </h2>
                  <p className="text-charcoal-soft/80 leading-relaxed mb-6">
                    Every order ships in plain, unbranded packaging with no logos or product descriptions visible.
                    Your bank statement will show a generic business name. 
                    We believe your wellness journey should be private—no exceptions.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal-soft shadow-sm">
                      Plain Brown Box
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal-soft shadow-sm">
                      Generic Billing
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal-soft shadow-sm">
                      No External Labels
                    </span>
                    <span className="px-4 py-2 bg-white rounded-full text-sm font-medium text-charcoal-soft shadow-sm">
                      Trusted Couriers
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Absolute Discretion Section */}
      <DiscretionSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-prana-sage to-prana-sage/90 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              Ready to Explore?
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
              Join thousands who trust PranaJiva for their intimate wellness needs.
              Complete privacy, premium quality, fast delivery.
            </p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 bg-white text-prana-sage px-8 py-4 rounded-full font-semibold text-lg hover:bg-prana-cream transition-colors"
            >
              Start Shopping <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
}

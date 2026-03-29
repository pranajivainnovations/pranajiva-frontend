/**
 * Shop Page - Product Listing
 * 
 * Fetches real products from Medusa backend and displays them
 * with filtering by wellness category (Pulse, Flow, Ritual, Care).
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useStealthMode } from "@/stores/stealth-mode";
import { Eye, EyeOff, Search, SlidersHorizontal, X } from "lucide-react";
import { medusaClient, getWellnessCategory } from "@/lib/medusa";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";

// Wellness categories based on PranaJiva's product taxonomy
const WELLNESS_CATEGORIES = [
  { id: "all", name: "All Products", description: "Browse our complete collection" },
  { id: "Pulse", name: "Pulse", description: "Targeted wellness devices" },
  { id: "Flow", name: "Flow", description: "Fluid therapy products" },
  { id: "Ritual", name: "Ritual", description: "Daily wellness essentials" },
  { id: "Care", name: "Care", description: "Premium care products" },
];

interface ProductVariant {
  id: string;
  title: string;
  prices?: Array<{ currency_code: string; amount: number }>;
  inventory_quantity?: number;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: ProductVariant[];
  metadata?: Record<string, unknown> | null;
  collection?: {
    title: string;
  } | null;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "title";

export default function ShopPage() {
  const { isStealthMode, toggleStealthMode } = useStealthMode();
  
  // State
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  // Fetch products from Medusa
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const { products: fetchedProducts } = await medusaClient.products.list({
          limit: 100,
          expand: "variants,variants.prices,collection",
        });
        
        setProducts(fetchedProducts as Product[]);
        setFilteredProducts(fetchedProducts as Product[]);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Apply filters and sorting
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (selectedCategory !== "all") {
      result = result.filter(product => 
        getWellnessCategory(product) === selectedCategory
      );
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        getWellnessCategory(product).toLowerCase().includes(query)
      );
    }
    
    // Sort products
    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => {
          const priceA = a.variants?.[0]?.prices?.[0]?.amount ?? 0;
          const priceB = b.variants?.[0]?.prices?.[0]?.amount ?? 0;
          return priceA - priceB;
        });
        break;
      case "price-desc":
        result.sort((a, b) => {
          const priceA = a.variants?.[0]?.prices?.[0]?.amount ?? 0;
          const priceB = b.variants?.[0]?.prices?.[0]?.amount ?? 0;
          return priceB - priceA;
        });
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        // Keep original order (newest first from API)
        break;
    }
    
    setFilteredProducts(result);
  }, [products, selectedCategory, searchQuery, sortBy]);
  
  // Count products by category
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === "all") return products.length;
    return products.filter(p => getWellnessCategory(p) === categoryId).length;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen"
    >
      {/* Header */}
      <div className="bg-gradient-to-b from-prana-cream to-white border-b border-prana-sage/10">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2">Shop</h1>
              <p className="text-charcoal-soft/70">
                {filteredProducts.length} premium wellness products
              </p>
            </div>
            
            <button
              onClick={toggleStealthMode}
              className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-prana-sage/20 hover:bg-prana-sage/5 transition-colors self-start md:self-auto"
              aria-label="Toggle Stealth Mode"
            >
              {isStealthMode ? (
                <>
                  <EyeOff className="w-5 h-5" />
                  <span className="text-sm">Stealth On</span>
                </>
              ) : (
                <>
                  <Eye className="w-5 h-5" />
                  <span className="text-sm">Stealth Off</span>
                </>
              )}
            </button>
          </div>
          
          {/* Search & Filter Bar */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal-soft/40" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-prana-sage/20 focus:border-prana-sage focus:outline-none transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-soft/40 hover:text-charcoal-soft"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Sort Dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 rounded-full border-2 border-prana-sage/20 focus:border-prana-sage focus:outline-none bg-white cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="title">Alphabetical</option>
            </select>
            
            {/* Mobile Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden flex items-center justify-center gap-2 px-4 py-3 rounded-full border-2 border-prana-sage/20 hover:bg-prana-sage/5 transition-colors"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-4 space-y-4">
              <h2 className="font-heading text-lg font-semibold mb-4">Categories</h2>
              
              {WELLNESS_CATEGORIES.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedCategory === category.id
                      ? "bg-prana-sage/10 border-2 border-prana-sage"
                      : "bg-white border-2 border-transparent hover:border-prana-sage/20"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-medium ${selectedCategory === category.id ? "text-prana-sage" : ""}`}>
                      {category.name}
                    </span>
                    <span className="text-sm text-charcoal-soft/50">
                      {getCategoryCount(category.id)}
                    </span>
                  </div>
                  <p className="text-sm text-charcoal-soft/60 mt-1">
                    {category.description}
                  </p>
                </button>
              ))}
              
              {/* Discreet Shipping Banner */}
              <div className="card-premium p-4 mt-6">
                <div className="badge-discreet mb-3 text-sm">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  100% Discreet
                </div>
                <p className="text-sm text-charcoal-soft/70">
                  All orders ship in unmarked packaging with neutral billing.
                </p>
              </div>
            </div>
          </aside>
          
          {/* Product Grid */}
          <main className="flex-1">
            {/* Loading State */}
            {isLoading && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            )}
            
            {/* Error State */}
            {error && !isLoading && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">😔</div>
                <h3 className="text-xl font-heading mb-2">Oops! Something went wrong</h3>
                <p className="text-charcoal-soft/60 mb-6">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="btn-velvet"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {/* Empty State */}
            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-xl font-heading mb-2">No products found</h3>
                <p className="text-charcoal-soft/60 mb-6">
                  {searchQuery
                    ? `No results for "${searchQuery}"`
                    : "No products in this category yet"}
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("all");
                  }}
                  className="btn-velvet"
                >
                  Clear Filters
                </button>
              </div>
            )}
            
            {/* Products Grid */}
            {!isLoading && !error && filteredProducts.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </motion.div>
  );
}

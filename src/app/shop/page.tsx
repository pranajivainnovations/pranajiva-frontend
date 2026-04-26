/**
 * Shop Page — Product listing with filters
 */

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useStealthMode } from "@/stores/stealth-mode";
import { Eye, EyeOff, Search, SlidersHorizontal, X, ArrowRight } from "lucide-react";
import { medusaClient } from "@/lib/medusa";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useRecentlyViewed } from "@/hooks/useRecentlyViewed";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

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
  collection?: { id: string; title: string } | null;
  type?: { id: string; value: string } | null;
}

interface Collection {
  id: string;
  title: string;
  handle: string;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "title";

export default function ShopPage() {
  const { isStealthMode, toggleStealthMode } = useStealthMode();

  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { products: recentProducts } = useRecentlyViewed();

  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [productsRes, collectionsRes] = await Promise.all([
          medusaClient.products.list({ limit: 100, expand: "variants,variants.prices,collection,type" }),
          medusaClient.collections.list({ limit: 50 }),
        ]);

        // Filter collections where brand metadata = pranajiva (case-insensitive)
        const allCollections = collectionsRes.collections as Collection[];
        const brandCollections = allCollections.filter((col: any) =>
          String(col.metadata?.brand || '').toLowerCase() === 'pranajiva'
        );

        // Filter products to only include pranajiva brand products
        const allProducts = productsRes.products as Product[];
        const brandProducts = allProducts.filter((p: Product) => {
          const productBrand = String(p.metadata?.brand || '').toLowerCase();
          const collectionBrand = String((p.collection as any)?.metadata?.brand || '').toLowerCase();
          return productBrand === 'pranajiva' || collectionBrand === 'pranajiva';
        });

        setProducts(brandProducts);
        setFilteredProducts(brandProducts);
        setCollections(brandCollections);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const productTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.type?.value) set.add(p.type.value); });
    return Array.from(set).sort();
  }, [products]);

  useEffect(() => {
    let result = [...products];

    if (selectedType !== "all") {
      result = result.filter(p => p.type?.value === selectedType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.collection?.title.toLowerCase().includes(q) ||
        p.type?.value.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.variants?.[0]?.prices?.[0]?.amount ?? 0) - (b.variants?.[0]?.prices?.[0]?.amount ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.variants?.[0]?.prices?.[0]?.amount ?? 0) - (a.variants?.[0]?.prices?.[0]?.amount ?? 0));
        break;
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedType, searchQuery, sortBy]);

  const getTypeCount = (typeValue: string) =>
    products.filter(p => p.type?.value === typeValue).length;

  return (
    <div className="min-h-screen bg-surface">
      <div className="bg-surface-warm">
        <div className="container mx-auto px-4 py-10">
          <Breadcrumbs items={[{ label: 'Shop' }]} />
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
            <div>
              <p className="label mb-3">Shop</p>
              <h1 className="font-heading text-display mb-2">All Products</h1>
              <p className="text-sm text-ink-light font-light">
                {filteredProducts.length} products
              </p>
            </div>

            <button
              onClick={toggleStealthMode}
              className="btn-ghost self-start md:self-auto"
              aria-label="Toggle Stealth Mode"
            >
              {isStealthMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="text-xs">{isStealthMode ? "Stealth On" : "Stealth Off"}</span>
            </button>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-card border border-ink/10 focus:border-accent focus:outline-none bg-white text-sm transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-ink-faint hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-4 py-3 rounded-card border border-ink/10 bg-white text-sm cursor-pointer focus:border-accent focus:outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="title">Alphabetical</option>
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="sm:hidden btn-ghost border border-ink/10"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar */}
          <aside className={`lg:w-60 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-4 space-y-8">
              {/* Collections — navigable links */}
              <div>
                <h2 className="label text-[10px] mb-4">Collections</h2>
                <div className="space-y-1">
                  {collections.map((col) => (
                    <Link
                      key={col.id}
                      href={`/collections/${col.handle}`}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-surface-warm transition-colors group"
                    >
                      <span className="text-sm text-ink-light group-hover:text-ink transition-colors">
                        {col.title}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-ink-faint group-hover:text-accent transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Product Types */}
              {productTypes.length > 0 && (
                <div>
                  <h2 className="label text-[10px] mb-4">Product Type</h2>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSelectedType("all")}
                      className={`w-full text-left p-3 rounded-lg text-sm transition-all ${
                        selectedType === "all"
                          ? "bg-accent-soft text-accent font-normal"
                          : "text-ink-light hover:bg-surface-warm"
                      }`}
                    >
                      All Types
                    </button>
                    {productTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left p-3 rounded-lg text-sm transition-all flex justify-between ${
                          selectedType === type
                            ? "bg-accent-soft text-accent font-normal"
                            : "text-ink-light hover:bg-surface-warm"
                        }`}
                      >
                        <span className="capitalize">{type.replace(/-/g, " ")}</span>
                        <span className="text-ink-faint text-xs">{getTypeCount(type)}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

          {/* Grid */}
          <main className="flex-1">
            {isLoading && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            )}

            {error && !isLoading && (
              <div className="text-center py-16">
                <h3 className="font-heading text-xl mb-3">Something went wrong</h3>
                <p className="text-sm text-ink-light mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                  Try Again
                </button>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <h3 className="font-heading text-xl mb-3">No products found</h3>
                <p className="text-sm text-ink-light mb-6">
                  {searchQuery ? `No results for "${searchQuery}"` : "No products match the current filters"}
                </p>
                <button
                  onClick={() => { setSearchQuery(""); setSelectedType("all"); }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {!isLoading && !error && filteredProducts.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            )}
          </main>
        </div>

        {/* Recently Viewed */}
        <RecentlyViewed products={recentProducts} />
      </div>
    </div>
  );
}

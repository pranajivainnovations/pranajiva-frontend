'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { medusaClient } from '@/lib/medusa';

interface SearchProduct {
  id: string;
  title: string;
  handle: string;
  thumbnail: string | null;
  variants?: Array<{ prices?: Array<{ currency_code: string; amount: number }> }>;
}

interface SearchCategory {
  id: string;
  name: string;
  handle: string;
}

export function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState<SearchProduct[]>([]);
  const [categories, setCategories] = useState<SearchCategory[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Keyboard shortcut: Ctrl/Cmd + K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setProducts([]);
      setCategories([]);
    }
  }, [isOpen]);

  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setProducts([]);
      setCategories([]);
      return;
    }

    setIsSearching(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        medusaClient.products.list({
          q: searchQuery,
          limit: 6,
          expand: 'variants,variants.prices',
        }),
        fetch(`/api/categories`).then((r) => r.json()),
      ]);

      setProducts(productsRes.products as SearchProduct[]);

      // Filter categories by search query
      const allCats = (categoriesRes as SearchCategory[]) || [];
      const matchedCats = allCats.filter((c) =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setCategories(matchedCats.slice(0, 4));
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => performSearch(value), 300);
  };

  const handleResultClick = () => {
    setIsOpen(false);
  };

  const hasResults = products.length > 0 || categories.length > 0;
  const showNoResults = query.length >= 2 && !isSearching && !hasResults;

  return (
    <>
      {/* Search trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
        aria-label="Search"
      >
        <Search className="w-4 h-4" />
        <span className="hidden lg:inline">Search</span>
        <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-gray-100 rounded border border-gray-200 text-gray-400">
          ⌘K
        </kbd>
      </button>

      {/* Search overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[70]"
              onClick={() => setIsOpen(false)}
            />

            {/* Search modal */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[71] px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
                {/* Search input */}
                <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                  <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search products, categories..."
                    value={query}
                    onChange={(e) => handleInputChange(e.target.value)}
                    className="flex-1 text-sm outline-none placeholder:text-gray-400"
                  />
                  {isSearching && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {/* Categories */}
                  {categories.length > 0 && (
                    <div className="px-5 py-3">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
                      <div className="flex flex-wrap gap-2">
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.handle}`}
                            onClick={handleResultClick}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm bg-amber-50 text-amber-800 rounded-full hover:bg-amber-100 transition-colors"
                          >
                            {cat.name} <ArrowRight className="w-3 h-3" />
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products */}
                  {products.length > 0 && (
                    <div className="px-5 py-3 border-t border-gray-50">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Products</p>
                      <div className="space-y-1">
                        {products.map((product) => {
                          const price = product.variants?.[0]?.prices?.find(
                            (p) => p.currency_code === 'inr'
                          );
                          return (
                            <Link
                              key={product.id}
                              href={`/shop/${product.handle}`}
                              onClick={handleResultClick}
                              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {product.thumbnail ? (
                                  <Image
                                    src={product.thumbnail}
                                    alt={product.title}
                                    width={40}
                                    height={40}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                                    🌿
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-800 truncate group-hover:text-amber-700 transition-colors">
                                  {product.title}
                                </p>
                                {price && (
                                  <p className="text-xs text-gray-500">
                                    ₹{(price.amount / 100).toLocaleString('en-IN')}
                                  </p>
                                )}
                              </div>
                              <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-amber-600 transition-colors" />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* No results */}
                  {showNoResults && (
                    <div className="px-5 py-8 text-center">
                      <p className="text-sm text-gray-500">No results for &ldquo;{query}&rdquo;</p>
                      <Link
                        href="/shop"
                        onClick={handleResultClick}
                        className="inline-flex items-center gap-1 mt-3 text-sm text-amber-700 hover:text-amber-800 font-medium"
                      >
                        Browse all products <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}

                  {/* Empty state */}
                  {query.length === 0 && (
                    <div className="px-5 py-6 text-center">
                      <p className="text-sm text-gray-400">
                        Start typing to search products and categories
                      </p>
                    </div>
                  )}
                </div>

                {/* Footer hint */}
                <div className="px-5 py-2.5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <p className="text-[11px] text-gray-400">
                    <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">↵</kbd> to select
                    <span className="mx-2">·</span>
                    <kbd className="px-1 py-0.5 bg-white border border-gray-200 rounded text-[10px]">esc</kbd> to close
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

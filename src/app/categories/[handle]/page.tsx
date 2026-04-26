'use client';

import { useEffect, useState, useMemo } from 'react';
import { medusaClient } from '@/lib/medusa';
import { ProductCard, ProductCardSkeleton } from '@/components/product/ProductCard';
import Link from 'next/link';
import { ChevronRight, Search, SlidersHorizontal, X } from 'lucide-react';
import FilterSidebar from '@/components/filters/FilterSidebar';

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'title';

export default function CategoryPage({
  params,
}: {
  params: { handle: string };
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState<string>('');
  const [categoryDescription, setCategoryDescription] = useState<string>('');
  const [subcategories, setSubcategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter & search state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setIsLoading(true);

        const categoriesResponse = await fetch('/api/categories');
        const categoriesData = await categoriesResponse.json();

        // Search both lists (case-insensitive)
        const hierarchicalCategories = categoriesData.data?.categories || [];
        const allCategories = categoriesData.data?.allCategories || [];
        const category = allCategories.find(
          (c: any) => c.handle.toLowerCase() === params.handle.toLowerCase()
        );

        if (!category) {
          setError('Category not found');
          return;
        }

        setCategoryName(category.name);
        setCategoryDescription(category.description || '');

        // Find subcategories from hierarchy
        const parentCat = hierarchicalCategories.find(
          (c: any) => c.handle.toLowerCase() === params.handle.toLowerCase()
        );
        setSubcategories(parentCat?.children || []);

        // Fetch products for this category
        const productsResponse = await medusaClient.products.list({
          category_id: [category.id],
          expand: 'variants,variants.prices,type,tags,collection',
          limit: 100,
        });

        let fetchedProducts = productsResponse.products || [];

        // Fallback: match by collection name (case-insensitive)
        if (fetchedProducts.length === 0) {
          const allProductsResponse = await medusaClient.products.list({
            expand: 'variants,variants.prices,type,tags,collection',
            limit: 200,
          });
          fetchedProducts = allProductsResponse.products?.filter((p: any) => {
            const collectionTitle = (p.collection?.title || '').toLowerCase();
            const catName = category.name.toLowerCase();
            return collectionTitle.includes(catName) || catName.includes(collectionTitle);
          }) || [];
        }

        setProducts(fetchedProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching category:', err);
        setError(err instanceof Error ? err.message : 'Failed to load category');
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryAndProducts();
  }, [params.handle]);

  // Derive available types and tags from products
  const availableTypes = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => { if (p.type?.value) set.add(p.type.value); });
    return Array.from(set).sort();
  }, [products]);

  const availableTags = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      p.tags?.forEach((t: any) => set.add(t.value));
    });
    return Array.from(set).sort();
  }, [products]);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) =>
        p.title.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q) ||
        (p.type?.value || '').toLowerCase().includes(q)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((p) =>
        p.type?.value && selectedTypes.includes(p.type.value)
      );
    }

    if (selectedTags.length > 0) {
      result = result.filter((p) =>
        selectedTags.some((tag) => p.tags?.some((t: any) => t.value === tag))
      );
    }

    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => (a.variants?.[0]?.prices?.[0]?.amount ?? 0) - (b.variants?.[0]?.prices?.[0]?.amount ?? 0));
        break;
      case 'price-desc':
        result.sort((a, b) => (b.variants?.[0]?.prices?.[0]?.amount ?? 0) - (a.variants?.[0]?.prices?.[0]?.amount ?? 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return result;
  }, [products, searchQuery, sortBy, selectedTypes, selectedTags]);

  const activeFilterCount = selectedTypes.length + selectedTags.length;

  return (
    <div className="min-h-screen bg-surface">
      {/* Breadcrumb */}
      <div className="border-b border-black/[0.06] bg-surface-warm py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-2 text-sm text-ink-light">
            <Link href="/" className="hover:text-amber-700 transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/categories" className="hover:text-amber-700 transition-colors">Categories</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-ink font-medium">{categoryName}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-surface-warm">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-8">
            <div>
              <p className="label mb-3">Category</p>
              <h1 className="font-heading text-display mb-2">{categoryName}</h1>
              {categoryDescription && (
                <p className="text-sm text-ink-light font-light max-w-2xl">{categoryDescription}</p>
              )}
              <p className="text-sm text-ink-light font-light mt-2">
                {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
                {activeFilterCount > 0 && ` · ${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active`}
              </p>
            </div>
          </div>

          {/* Subcategories quick links */}
          {subcategories.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {subcategories.map((sub: any) => (
                <Link
                  key={sub.id}
                  href={`/categories/${params.handle}/${sub.handle}`}
                  className="px-4 py-2 rounded-full text-xs tracking-wide capitalize border border-ink/10 text-ink-light hover:border-amber-600 hover:text-amber-700 transition-all"
                >
                  {sub.name}
                </Link>
              ))}
            </div>
          )}

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                placeholder="Search in this category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-card border border-ink/10 focus:border-accent focus:outline-none bg-white text-sm transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
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
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden btn-ghost border border-ink/10"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 w-5 h-5 flex items-center justify-center bg-brand-dark text-white rounded-full text-[10px]">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Body: Sidebar + Grid */}
      <div className="container mx-auto px-4 py-10">
        <div className="flex gap-10">
          <FilterSidebar
            productTypes={availableTypes}
            tags={availableTags}
            selectedTypes={selectedTypes}
            selectedTags={selectedTags}
            onTypeChange={setSelectedTypes}
            onTagChange={setSelectedTags}
            mobileOpen={mobileFiltersOpen}
            onMobileClose={() => setMobileFiltersOpen(false)}
          />

          <main className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <h3 className="font-heading text-xl mb-3">Something went wrong</h3>
                <p className="text-sm text-ink-light mb-6">{error}</p>
                <button onClick={() => window.location.reload()} className="btn-primary">
                  Try Again
                </button>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredProducts.map((product, index) => (
                  <ProductCard key={product.id} product={product} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="font-heading text-xl mb-3">No products found</h3>
                <p className="text-sm text-ink-light mb-6">
                  {searchQuery ? `No results for "${searchQuery}"` : 'No products match the current filters'}
                </p>
                <button
                  onClick={() => { setSearchQuery(''); setSelectedTypes([]); setSelectedTags([]); }}
                  className="btn-primary"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

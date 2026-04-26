'use client';

import { useCategories } from '@/hooks/useCategories';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

/**
 * Main Categories Page
 * Shows all available categories and subcategories
 */
export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Wellness Categories
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Explore our thoughtfully curated wellness products, each designed to support your journey toward holistic health and vitality.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Loading categories...</p>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-red-500 text-lg">{error}</p>
          </div>
        ) : categories.length > 0 ? (
          <div className="space-y-16">
            {categories.map((category) => (
              <section key={category.id}>
                {/* Category Header */}
                <div className="mb-8">
                  <Link href={`/categories/${category.handle}`}>
                    <h2 className="text-3xl font-bold text-gray-900 hover:text-amber-700 transition-colors cursor-pointer mb-2">
                      {category.name}
                    </h2>
                  </Link>
                  {category.description && (
                    <p className="text-gray-600 text-lg max-w-2xl">
                      {category.description}
                    </p>
                  )}
                </div>

                {/* Subcategories Grid */}
                {category.children && category.children.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                    {category.children.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/categories/${category.handle}/${subcategory.handle}`}
                        className="group"
                      >
                        <div className="bg-white border-2 border-gray-200 rounded-lg p-6 hover:border-amber-400 hover:shadow-lg transition-all duration-300">
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-amber-700 transition-colors mb-2">
                            {subcategory.name}
                          </h3>
                          {subcategory.description && (
                            <p className="text-gray-600 mb-4 text-sm line-clamp-2">
                              {subcategory.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-amber-700 font-semibold group-hover:gap-3 transition-all">
                            Explore <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 p-8 rounded-lg text-center mb-12">
                    <p className="text-gray-500">No subcategories available</p>
                    <Link
                      href={`/categories/${category.handle}`}
                      className="inline-block mt-4 text-amber-700 hover:text-amber-800 font-semibold"
                    >
                      View All Products →
                    </Link>
                  </div>
                )}

                {/* Category Actions */}
                <div className="flex gap-4 mb-12">
                  <Link
                    href={`/categories/${category.handle}`}
                    className="inline-flex items-center gap-2 bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Shop {category.name}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/categories/${category.handle}/guides`}
                    className="inline-flex items-center gap-2 border-2 border-amber-700 text-amber-700 hover:bg-amber-50 font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Learn More
                  </Link>
                </div>

                {/* Divider */}
                {categories.indexOf(category) < categories.length - 1 && (
                  <div className="border-b border-gray-200 mb-12" />
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        )}
      </div>

      {/* Support Section */}
      <section className="border-t border-gray-200 bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Need Help Finding What You Need?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/knowledge" className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Knowledge Center</h3>
              <p className="text-gray-600 mb-4">
                Explore comprehensive wellness guides and expert advice tailored to your needs.
              </p>
              <span className="text-amber-700 font-semibold hover:underline">Learn More →</span>
            </Link>

            <Link href="/contact" className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Our Team</h3>
              <p className="text-gray-600 mb-4">
                Get personalized recommendations from our wellness experts. We're here to help!
              </p>
              <span className="text-amber-700 font-semibold hover:underline">Get in Touch →</span>
            </Link>

            <Link href="/about" className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-gray-900 mb-3">About PranaJiva</h3>
              <p className="text-gray-600 mb-4">
                Learn about our mission, values, and commitment to your wellness journey.
              </p>
              <span className="text-amber-700 font-semibold hover:underline">Discover More →</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

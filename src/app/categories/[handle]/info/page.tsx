'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Heart, Leaf, Shield, Zap } from 'lucide-react';

interface CategoryInfo {
  name: string;
  description: string;
  benefits: string[];
  relatedArticles: string[];
}

/**
 * Category Information Page
 * Shows detailed information about a specific category
 */
export default function CategoryInfoPage({
  params,
}: {
  params: { handle: string };
}) {
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryInfo = async () => {
      try {
        // Fetch categories to get category details
        const response = await fetch('/api/categories');
        const data = await response.json();

        const allCategories = data.data?.allCategories || [];
        const category = allCategories.find((c: any) => c.handle === params.handle);

        if (category) {
          // Map category information to info structure
          setCategoryInfo({
            name: category.name,
            description: category.description || 'Explore our curated wellness collection.',
            benefits: category.metadata?.benefits || [
              'Premium quality products',
              'Ayurveda-inspired formulations',
              'Scientifically tested',
              'Discreet packaging available',
            ],
            relatedArticles: category.metadata?.relatedArticles || [],
          });
        }
      } catch (error) {
        console.error('Error fetching category info:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryInfo();
  }, [params.handle]);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {categoryInfo?.name || 'Category Information'}
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl">
            Learn more about our carefully curated wellness collection
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading information...</p>
          </div>
        ) : categoryInfo ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Category</h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {categoryInfo.description}
                </p>
                <Link
                  href={`/categories/${params.handle}`}
                  className="inline-block bg-amber-700 hover:bg-amber-800 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Shop This Category
                </Link>
              </section>

              {/* Benefits */}
              <section className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categoryInfo.benefits.map((benefit, index) => (
                    <div key={index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                      <div className="flex items-start gap-4">
                        {index === 0 && <Heart className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />}
                        {index === 1 && <Leaf className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />}
                        {index === 2 && <Shield className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />}
                        {index === 3 && <Zap className="w-6 h-6 text-yellow-500 flex-shrink-0 mt-1" />}
                        <p className="text-gray-700">{benefit}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Quick Links */}
              <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Links</h3>
                <nav className="space-y-3">
                  <Link
                    href={`/categories/${params.handle}`}
                    className="block text-amber-700 hover:text-amber-800 font-medium"
                  >
                    ↓ Browse Products
                  </Link>
                  <Link
                    href="/knowledge"
                    className="block text-amber-700 hover:text-amber-800 font-medium"
                  >
                    📖 Knowledge Center
                  </Link>
                  <Link
                    href="/about"
                    className="block text-amber-700 hover:text-amber-800 font-medium"
                  >
                    ℹ️ About PranaJiva
                  </Link>
                  <Link
                    href="/contact"
                    className="block text-amber-700 hover:text-amber-800 font-medium"
                  >
                    ✉️ Contact Us
                  </Link>
                </nav>
              </div>

              {/* Trust Section */}
              <div className="mt-6 bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us?</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>✓ Premium quality verified</li>
                  <li>✓ Ayurveda-inspired</li>
                  <li>✓ Scientifically tested</li>
                  <li>✓ Discreet packaging</li>
                  <li>✓ Customer satisfaction</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Category not found</p>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BookOpen, Lightbulb, Play, FileText } from 'lucide-react';

interface Guide {
  id: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'guide' | 'resource';
  icon: React.ReactNode;
}

/**
 * Category Guides/Resources Page
 * Provides educational resources and guides related to the category
 */
export default function CategoryGuidesPage({
  params,
}: {
  params: { handle: string };
}) {
  const [categoryName, setCategoryName] = useState<string>('');
  const [guides, setGuides] = useState<Guide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryGuides = async () => {
      try {
        // Fetch categories to get category details
        const response = await fetch('/api/categories');
        const data = await response.json();

        const allCategories = data.data?.allCategories || [];
        const category = allCategories.find((c: any) => c.handle === params.handle);

        if (category) {
          setCategoryName(category.name);

          // Create default guides based on category
          // In production, these would come from a CMS or database
          const defaultGuides: Guide[] = [
            {
              id: '1',
              title: `Getting Started with ${category.name}`,
              description: `Learn the basics and best practices for using products in the ${category.name} category.`,
              type: 'guide',
              icon: <BookOpen className="w-6 h-6" />,
            },
            {
              id: '2',
              title: `${category.name} Benefits & Uses`,
              description: `Discover the wellness benefits and various ways to incorporate these products into your daily routine.`,
              type: 'article',
              icon: <Lightbulb className="w-6 h-6" />,
            },
            {
              id: '3',
              title: `Expert Tips for ${category.name}`,
              description: `Pro tips from wellness experts on how to maximize the benefits of our curated collection.`,
              type: 'article',
              icon: <Lightbulb className="w-6 h-6" />,
            },
            {
              id: '4',
              title: `Product Selection Guide`,
              description: `Learn how to choose the right products from this category based on your needs and preferences.`,
              type: 'guide',
              icon: <FileText className="w-6 h-6" />,
            },
          ];

          setGuides(defaultGuides);
        }
      } catch (error) {
        console.error('Error fetching guides:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoryGuides();
  }, [params.handle]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'article':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'guide':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'video':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Guides & Resources
          </h1>
          <p className="text-lg text-gray-700">
            Learn everything about {categoryName} and how to get the most from our products
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500">Loading guides...</p>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            {/* Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {guides.map((guide) => (
                <div
                  key={guide.id}
                  className={`p-6 rounded-lg border-2 hover:shadow-lg transition-shadow cursor-pointer ${getTypeColor(
                    guide.type
                  )}`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    {guide.icon}
                    <div>
                      <span className="inline-block text-xs font-semibold uppercase tracking-wide mb-2 opacity-75">
                        {guide.type}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{guide.title}</h3>
                  <p className="text-gray-700 mb-4">{guide.description}</p>
                  <button className="text-sm font-semibold hover:underline">
                    Read More →
                  </button>
                </div>
              ))}
            </div>

            {/* Additional Resources */}
            <section className="bg-gray-50 p-8 rounded-lg border border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Additional Resources</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Knowledge Center */}
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <BookOpen className="w-6 h-6 text-amber-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Knowledge Center</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Explore comprehensive wellness articles and tips.
                    </p>
                    <Link
                      href="/knowledge"
                      className="text-sm text-amber-700 hover:text-amber-800 font-semibold"
                    >
                      Visit Center →
                    </Link>
                  </div>
                </div>

                {/* FAQ */}
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <FileText className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Frequently Asked Questions</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Find answers to common questions about our products.
                    </p>
                    <Link
                      href="/knowledge-center"
                      className="text-sm text-amber-700 hover:text-amber-800 font-semibold"
                    >
                      View FAQs →
                    </Link>
                  </div>
                </div>

                {/* Contact Support */}
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <Lightbulb className="w-6 h-6 text-purple-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Need Personalized Advice?</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Our wellness experts are ready to help you find the perfect product.
                    </p>
                    <Link
                      href="/contact"
                      className="text-sm text-amber-700 hover:text-amber-800 font-semibold"
                    >
                      Contact Us →
                    </Link>
                  </div>
                </div>

                {/* Browse Products */}
                <div className="flex items-start gap-4">
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <Play className="w-6 h-6 text-red-700" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">Shop {categoryName}</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Browse our full collection of {categoryName.toLowerCase()} products.
                    </p>
                    <Link
                      href={`/categories/${params.handle}`}
                      className="text-sm text-amber-700 hover:text-amber-800 font-semibold"
                    >
                      Shop Now →
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="mt-12 bg-gradient-to-r from-amber-700 to-orange-600 text-white p-8 rounded-lg text-center">
              <h3 className="text-2xl font-bold mb-4">Ready to Explore?</h3>
              <p className="text-amber-50 mb-6">
                Start your wellness journey with our carefully curated {categoryName.toLowerCase()} collection.
              </p>
              <Link
                href={`/categories/${params.handle}`}
                className="inline-block bg-white text-amber-700 hover:bg-amber-50 font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Browse {categoryName}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

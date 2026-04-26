'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Menu, X } from 'lucide-react';
import { useCategories } from '@/hooks/useCategories';

export function TopNav() {
  const { categories, isLoading } = useCategories();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDropdownToggle = (categoryId: string) => {
    setOpenDropdown(openDropdown === categoryId ? null : categoryId);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top row with logo and menu toggle */}
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <span className="text-2xl font-bold text-amber-700">PranaJiva</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/shop"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
            >
              All Products
            </Link>

            <Link
              href="/categories"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
            >
              Categories
            </Link>

            {isLoading ? (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-4 py-2">
                    <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            ) : categories.length > 0 ? (
              <div className="flex items-center gap-1">
                {categories.map((category) => (
                  <div key={category.id} className="relative group">
                    {/* Category Link with dropdown indicator */}
                    <Link
                      href={`/categories/${category.handle}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors flex items-center gap-1 group"
                    >
                      {category.name}
                      {category.children && category.children.length > 0 && (
                        <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                      )}
                    </Link>

                    {/* Dropdown Menu */}
                    {category.children && category.children.length > 0 && (
                      <div className="absolute left-0 mt-0 w-56 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-2">
                          {category.children.map((subcategory) => (
                            <Link
                              key={subcategory.id}
                              href={`/categories/${category.handle}/${subcategory.handle}`}
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                            >
                              {subcategory.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}

            <Link
              href="/knowledge"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 transition-colors"
            >
              Knowledge
            </Link>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-2">
            <Link
              href="/shop"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              All Products
            </Link>

            <Link
              href="/categories"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Categories
            </Link>

            {categories.map((category) => (
              <div key={category.id}>
                {/* Category header with toggle */}
                <button
                  onClick={() => handleDropdownToggle(category.id)}
                  className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors flex items-center justify-between"
                >
                  <Link href={`/categories/${category.handle}`}>
                    {category.name}
                  </Link>
                  {category.children && category.children.length > 0 && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        openDropdown === category.id ? 'rotate-180' : ''
                      }`}
                    />
                  )}
                </button>

                {/* Mobile Subcategories */}
                {category.children && category.children.length > 0 && openDropdown === category.id && (
                  <div className="bg-gray-50 space-y-1">
                    {category.children.map((subcategory) => (
                      <Link
                        key={subcategory.id}
                        href={`/categories/${category.handle}/${subcategory.handle}`}
                        className="block px-8 py-2 text-sm text-gray-600 hover:text-amber-700 hover:bg-white rounded transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <Link
              href="/knowledge"
              className="block px-4 py-2 text-sm font-medium text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Knowledge
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

import { useState, useEffect } from 'react';

export interface Category {
  id: string;
  name: string;
  handle: string;
  description?: string;
  metadata?: Record<string, any>;
  parent_category_id?: string;
  children?: Category[];
}

export interface CategoriesResponse {
  success: boolean;
  data?: {
    categories: Category[];
    total: number;
    allCategories: Category[];
  };
  error?: string;
}

/**
 * Hook to fetch and manage product categories
 * Returns the hierarchical category structure with subcategories
 */
export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }

        const data: CategoriesResponse = await response.json();
        
        if (data.success) {
          setCategories(data.data!.categories);
          setError(null);
        } else {
          throw new Error(data.error || 'Unknown error occurred');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
}

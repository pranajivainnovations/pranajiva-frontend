import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9001';

/**
 * GET /api/categories
 * 
 * Fetches product categories from Medusa backend where brand metadata = "pranajiva"
 * Returns hierarchical category structure with subcategories
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch all product categories from Medusa
    const response = await fetch(`${MEDUSA_BACKEND_URL}/store/product-categories?limit=100`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Medusa API error: ${response.status}`);
    }

    const data = await response.json();
    const categories = data.product_categories || [];

    // Filter categories by brand metadata = "pranajiva" (case-insensitive)
    const filteredCategories = categories.filter((category: any) => {
      const brand = String(category.metadata?.brand || '').toLowerCase();
      return brand === 'pranajiva';
    });

    // Build hierarchical structure with subcategories
    const hierarchyMap = new Map();
    const rootCategories = [];

    // First pass: organize categories into hierarchy
    for (const category of filteredCategories) {
      hierarchyMap.set(category.id, {
        id: category.id,
        name: category.name,
        handle: category.handle,
        description: category.description,
        metadata: category.metadata,
        parent_category_id: category.parent_category_id,
        children: [],
      });
    }

    // Second pass: build parent-child relationships
    for (const category of filteredCategories) {
      const categoryNode = hierarchyMap.get(category.id);
      
      if (category.parent_category_id) {
        const parentNode = hierarchyMap.get(category.parent_category_id);
        if (parentNode) {
          parentNode.children.push(categoryNode);
        }
      } else {
        // Root category
        rootCategories.push(categoryNode);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        categories: rootCategories,
        total: rootCategories.length,
        allCategories: filteredCategories,
      },
    });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
      },
      { status: 500 }
    );
  }
}

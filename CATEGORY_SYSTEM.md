# PranaJiva Category Navigation System

## Overview

This documentation explains the new category navigation system that has been implemented in the PranaJiva storefront. The system allows customers to browse products organized by categories and subcategories, with filtered views based on the `brand = "pranajiva"` metadata.

## Features

### 1. **Dynamic Category Menu Navigation**
- Desktop and mobile responsive navigation
- Dropdown menus for categories with subcategories
- Auto-fetching from Medusa backend
- Filters by brand metadata = "pranajiva"

### 2. **Category Pages**
- **Main Categories Page** (`/categories`)
  - Shows all PranaJiva categories
  - Displays subcategories for each category
  - Navigation shortcuts to guides and support

- **Category Listing** (`/categories/[handle]`)
  - Shows all products in a specific category
  - Category description and information
  - Product grid with filtering

- **Subcategory Listing** (`/categories/[handle]/[subcategoryHandle]`)
  - Shows products in a subcategory
  - Breadcrumb navigation
  - Contextual category information

### 3. **Supportive Pages**
- **Category Information** (`/categories/[handle]/info`)
  - Detailed category description
  - Key benefits
  - Trust indicators

- **Category Guides** (`/categories/[handle]/guides`)
  - Educational resources
  - Product selection guides
  - Related knowledge articles
  - Expert tips

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── categories/
│   │       └── route.ts                 # API endpoint for categories
│   ├── categories/
│   │   ├── page.tsx                     # Main categories page
│   │   ├── layout.tsx                   # Categories layout with sidebar
│   │   ├── [handle]/
│   │   │   ├── page.tsx                 # Category products page
│   │   │   ├── info/
│   │   │   │   └── page.tsx             # Category info page
│   │   │   ├── guides/
│   │   │   │   └── page.tsx             # Category guides page
│   │   │   └── [subcategoryHandle]/
│   │   │       └── page.tsx             # Subcategory products page
│   ├── layout.tsx                       # Updated with TopNav
│   └── providers.tsx
├── components/
│   └── navigation/
│       ├── TopNav.tsx                   # Top navigation with category menu
│       └── BottomNav.tsx
├── hooks/
│   └── useCategories.ts                 # Hook to fetch categories
└── lib/
    └── medusa.ts
```

## API Endpoints

### Get Categories
**Endpoint:** `GET /api/categories`

**Response:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": "category-id",
        "name": "Category Name",
        "handle": "category-handle",
        "description": "Category description",
        "metadata": {
          "brand": "pranajiva",
          "benefits": ["benefit1", "benefit2"]
        },
        "children": [
          {
            "id": "subcategory-id",
            "name": "Subcategory Name",
            "handle": "subcategory-handle",
            "description": "Subcategory description",
            "children": []
          }
        ]
      }
    ],
    "total": 5,
    "allCategories": [...]
  }
}
```

## Using the Category Hook

### Basic Usage
```typescript
import { useCategories } from '@/hooks/useCategories';

export function MyComponent() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {categories.map(category => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          <ul>
            {category.children?.map(sub => (
              <li key={sub.id}>{sub.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
```

## URL Structure

### Navigation Paths
- `/categories` - All categories overview
- `/categories/skincare` - Skincare category products
- `/categories/skincare/facial-care` - Facial care subcategory products
- `/categories/skincare/info` - Category information page
- `/categories/skincare/guides` - Category guides and resources

## Adding New Categories in Medusa

To add a new category that appears in PranaJiva navigation:

1. **Go to Medusa Admin** (typically at http://localhost:7001)
2. **Navigate to Products > Categories**
3. **Create new category** with:
   - Name: e.g., "Skincare"
   - Handle: e.g., "skincare"
   - Description (optional)
   - **Metadata**: Add `brand: "pranajiva"` (or `"PranaJiva"`)
4. **Create subcategories** under the main category with the same metadata

### Metadata Schema
```json
{
  "brand": "pranajiva",
  "benefits": ["benefit1", "benefit2"],
  "relatedArticles": ["article-id-1"],
  "icon": "heart"
}
```

## Customizing Category Pages

### Update Category Information
Edit `/src/app/categories/[handle]/info/page.tsx`:
- Modify the benefits list
- Add custom descriptions
- Change sidebar content

### Add Category-Specific Content
Edit `/src/app/categories/[handle]/guides/page.tsx`:
- Add custom guides
- Include video guides
- Add FAQ sections

### Customize Navigation Items
Edit `/src/components/navigation/TopNav.tsx`:
- Change styling
- Add category icons
- Modify hover behavior

## Filtering Products by Category

The category pages automatically fetch products filtered by category ID using the Medusa client:

```typescript
const productsResponse = await medusaClient.products.list({
  category_id: [category.id],
  limit: 100,
});
```

### Adding More Filters
To add additional filters in category pages:

```typescript
const productsResponse = await medusaClient.products.list({
  category_id: [category.id],
  limit: 100,
  sort: "created_at",
  order: "desc",
  // Add other filters as needed
});
```

## Styling & Customization

### Colors
- Primary brand color: `amber-700` (buttons, links)
- Secondary color: `orange-600` (accents)
- Text: `gray-900` (headings), `gray-700` (body)

### Tailwind Classes Used
- `group` - For hover effects on card elements
- `line-clamp-2` - For truncating text
- `transition-all` - For smooth animations
- `hover:shadow-lg` - For interactive elements

## Mobile Responsiveness

All pages are fully responsive:
- **Mobile**: Single column, full-width navigation
- **Tablet**: 2 columns for product grids
- **Desktop**: 3-4 columns with sidebar navigation

## Performance Considerations

1. **Caching**: Categories are fetched once on page load (client-side)
2. **Lazy Loading**: Product images use Next.js `Image` component
3. **API Optimization**: Single API call to fetch all categories

## Troubleshooting

### Categories Not Appearing
1. Check that categories have `brand: "pranajiva"` in metadata
2. Verify Medusa backend is running on `localhost:9001`
3. Check browser console for API errors

### Products Not Loading
1. Verify products are assigned to the category in Medusa
2. Check category ID matches in API response
3. Verify Medusa client is properly configured

### Navigation Not Showing
1. Ensure TopNav is imported in layout.tsx
2. Check Providers wrapper includes necessary context
3. Verify browser JavaScript is enabled

## Future Enhancements

- [ ] Add category images/hero banners
- [ ] Implement category-specific filters
- [ ] Add breadcrumb navigation to all pages
- [ ] Create category-specific discount banners
- [ ] Add "Featured Products" per category
- [ ] Implement category search
- [ ] Add sorting options (price, popularity, etc.)
- [ ] Create category-based email campaigns

## Support Pages

The system includes built-in support sections with links to:
- Knowledge Center
- Contact page
- About page
- FAQ/Knowledge Center

These are automatically included in:
- `/categories/layout.tsx` footer
- All category detail pages
- Guides pages

## Environment Variables

No additional environment variables are required. The system uses:
- `NEXT_PUBLIC_MEDUSA_BACKEND_URL` - Already configured in `.env.local`

## Related Documentation

- [Medusa Documentation](https://docs.medusajs.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

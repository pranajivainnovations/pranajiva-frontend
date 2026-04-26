import { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pranajiva.in';
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9001';

async function fetchProducts() {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/products?limit=200`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.products || [];
  } catch {
    return [];
  }
}

async function fetchCollections() {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/collections?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.collections || []).filter(
      (c: any) => String(c.metadata?.brand || '').toLowerCase() === 'pranajiva'
    );
  } catch {
    return [];
  }
}

async function fetchCategories() {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/store/product-categories?limit=100`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.product_categories || []).filter(
      (c: any) => String(c.metadata?.brand || '').toLowerCase() === 'pranajiva'
    );
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections, categories] = await Promise.all([
    fetchProducts(),
    fetchCollections(),
    fetchCategories(),
  ]);

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/collections`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/knowledge`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
    { url: `${SITE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/privacy-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/return-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/shipping-policy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  // Product pages
  const productPages: MetadataRoute.Sitemap = products.map((p: any) => ({
    url: `${SITE_URL}/shop/${p.handle}`,
    lastModified: new Date(p.updated_at || p.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // Collection pages
  const collectionPages: MetadataRoute.Sitemap = collections.map((c: any) => ({
    url: `${SITE_URL}/collections/${c.handle}`,
    lastModified: new Date(c.updated_at || c.created_at),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages (parent + subcategory)
  const categoryPages: MetadataRoute.Sitemap = [];
  const parentCategories = categories.filter((c: any) => !c.parent_category_id);
  const childCategories = categories.filter((c: any) => c.parent_category_id);

  for (const parent of parentCategories) {
    categoryPages.push({
      url: `${SITE_URL}/categories/${parent.handle}`,
      lastModified: new Date(parent.updated_at || parent.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    });

    const children = childCategories.filter((c: any) => c.parent_category_id === parent.id);
    for (const child of children) {
      categoryPages.push({
        url: `${SITE_URL}/categories/${parent.handle}/${child.handle}`,
        lastModified: new Date(child.updated_at || child.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      });
    }
  }

  return [...staticPages, ...productPages, ...collectionPages, ...categoryPages];
}

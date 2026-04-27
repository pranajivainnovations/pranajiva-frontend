/**
 * Product Detail Page
 * 
 * Displays individual product information with variants, images,
 * and add-to-cart functionality. Fetches from Medusa backend.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductSuggestions } from "./ProductSuggestions";import { ProductReviews } from '@/components/product/ProductReviews';import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/layout/JsonLd";

// Server-side Medusa client for SSR
const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9001";

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string | null;
  subtitle: string | null;
  thumbnail: string | null;
  images: Array<{ url: string; id: string }>;
  variants: Array<{
    id: string;
    title: string;
    prices: Array<{ currency_code: string; amount: number }>;
    inventory_quantity: number;
    options: Array<{ value: string }>;
  }>;
  options: Array<{
    id: string;
    title: string;
    values: Array<{ value: string }>;
  }>;
  metadata: Record<string, unknown> | null;
  collection: { title: string; handle?: string } | null;
  categories?: Array<{ handle: string; parent_category_id?: string | null }>;
  tags?: Array<{ value: string }>;
}

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products?handle=${handle}&expand=variants,variants.prices,options,options.values,images,collection,categories,tags`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    const product = data.products?.[0] || null;
    if (!product) return null;

    // Only show pranajiva-brand products
    const productBrand = String(product.metadata?.brand || '').toLowerCase();
    const collectionBrand = String(product.collection?.metadata?.brand || '').toLowerCase();
    if (productBrand !== 'pranajiva' && collectionBrand !== 'pranajiva') return null;

    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);
  
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  
  const price = product.variants?.[0]?.prices?.find(p => p.currency_code === 'inr');

  return {
    title: product.title,
    description: product.description || `Shop ${product.title} at PranaJiva - Premium wellness with discreet delivery`,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      images: product.thumbnail ? [{ url: product.thumbnail, width: 800, height: 800 }] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || undefined,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
    other: price ? {
      'product:price:amount': (price.amount / 100).toString(),
      'product:price:currency': 'INR',
    } : undefined,
  };
}

export default async function ProductPage({ 
  params 
}: { 
  params: Promise<{ handle: string }> 
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);
  
  if (!product) {
    notFound();
  }
  
  return (
    <>
      <ProductJsonLd product={product} />
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', href: '/' },
          { name: 'Shop', href: '/shop' },
          { name: product.title },
        ]}
      />
      <ProductDetailClient product={product} />
      <ProductReviews productId={product.id} />
      <ProductSuggestions product={product} />
    </>
  );
}

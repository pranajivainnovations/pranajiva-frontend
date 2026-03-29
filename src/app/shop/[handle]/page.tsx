/**
 * Product Detail Page
 * 
 * Displays individual product information with variants, images,
 * and add-to-cart functionality. Fetches from Medusa backend.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";

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
  collection: { title: string } | null;
}

async function getProduct(handle: string): Promise<Product | null> {
  try {
    const response = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products?handle=${handle}&expand=variants,variants.prices,options,options.values,images,collection`,
      { next: { revalidate: 60 } } // Cache for 60 seconds
    );
    
    if (!response.ok) return null;
    
    const data = await response.json();
    return data.products?.[0] || null;
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
      title: "Product Not Found | PranaJiva",
    };
  }
  
  return {
    title: `${product.title} | PranaJiva`,
    description: product.description || `Shop ${product.title} at PranaJiva - Premium wellness with discreet delivery`,
    openGraph: {
      title: product.title,
      description: product.description || undefined,
      images: product.thumbnail ? [{ url: product.thumbnail }] : [],
    },
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
  
  return <ProductDetailClient product={product} />;
}

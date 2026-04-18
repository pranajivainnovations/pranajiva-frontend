/** Shared product-related types used across collection and shop pages */

export interface ProductTag {
  id: string;
  value: string;
}

export interface ProductType {
  id: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  prices?: Array<{ currency_code: string; amount: number }>;
  inventory_quantity?: number;
}

export interface CollectionProduct {
  id: string;
  title: string;
  handle: string;
  description?: string | null;
  thumbnail?: string | null;
  variants?: ProductVariant[];
  tags?: ProductTag[];
  type?: ProductType | null;
  metadata?: Record<string, unknown> | null;
  collection?: { title: string; handle: string } | null;
}

export interface Collection {
  id: string;
  title: string;
  handle: string;
}

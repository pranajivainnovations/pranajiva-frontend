/**
 * Reusable JSON-LD structured data components for SEO.
 * Renders <script type="application/ld+json"> in <head>.
 */

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://pranajiva.in';

/** Organization schema — use in root layout */
export function OrganizationJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'PranaJiva',
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        description:
          'Premium wellness products rooted in Ayurveda and modern science, delivered with discretion.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+91-982-110-1868',
          contactType: 'customer service',
          email: 'support@pranajiva.in',
          areaServed: 'IN',
          availableLanguage: 'English',
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ghaziabad',
          addressRegion: 'Uttar Pradesh',
          addressCountry: 'IN',
        },
        sameAs: [
          'https://instagram.com/pranajiva',
          'https://twitter.com/pranajiva',
        ],
      }}
    />
  );
}

/** WebSite schema with SearchAction — use in root layout */
export function WebSiteJsonLd() {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'PranaJiva',
        url: SITE_URL,
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${SITE_URL}/shop?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

/** Product schema — use on PDP */
export function ProductJsonLd({
  product,
}: {
  product: {
    title: string;
    handle: string;
    description?: string | null;
    thumbnail?: string | null;
    variants?: Array<{
      prices?: Array<{ currency_code: string; amount: number }>;
      inventory_quantity?: number;
    }>;
  };
}) {
  const price = product.variants?.[0]?.prices?.find(
    (p) => p.currency_code === 'inr'
  );
  const inStock = (product.variants?.[0]?.inventory_quantity ?? 0) > 0;

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.title,
        description: product.description || undefined,
        image: product.thumbnail || undefined,
        url: `${SITE_URL}/shop/${product.handle}`,
        brand: {
          '@type': 'Brand',
          name: 'PranaJiva',
        },
        offers: price
          ? {
              '@type': 'Offer',
              priceCurrency: 'INR',
              price: (price.amount / 100).toFixed(2),
              availability: inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
              url: `${SITE_URL}/shop/${product.handle}`,
              seller: {
                '@type': 'Organization',
                name: 'PranaJiva',
              },
            }
          : undefined,
      }}
    />
  );
}

/** BreadcrumbList schema */
export function BreadcrumbJsonLd({
  items,
}: {
  items: Array<{ name: string; href?: string }>;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.href ? `${SITE_URL}${item.href}` : undefined,
        })),
      }}
    />
  );
}

/** CollectionPage schema — use on category/collection listing pages */
export function CollectionPageJsonLd({
  name,
  description,
  url,
}: {
  name: string;
  description?: string;
  url: string;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url: `${SITE_URL}${url}`,
        isPartOf: {
          '@type': 'WebSite',
          name: 'PranaJiva',
          url: SITE_URL,
        },
      }}
    />
  );
}

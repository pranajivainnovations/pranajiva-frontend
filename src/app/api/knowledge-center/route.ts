import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
  // Disable SSL verification in development (fixes certificate issues)
  ...(process.env.NODE_ENV === 'development' && {
    requestTagPrefix: 'dev',
  }),
});

// Disable SSL verification for Node.js in development
if (process.env.NODE_ENV === 'development') {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}


export const dynamic = 'force-dynamic'; // Disable static generation
export const revalidate = 3600; // ISR - Revalidate every hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = `*[_type == "article"] | order(publishedAt desc)`;
    
    if (category) {
      query = `*[_type == "article" && category == $category] | order(publishedAt desc)`;
    }

    const articles = await client.fetch(query, { category });

    return NextResponse.json(
      { articles },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
        },
      }
    );
  } catch (error) {
    console.error('Knowledge Center API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

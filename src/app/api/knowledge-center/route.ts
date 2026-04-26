import { NextRequest, NextResponse } from 'next/server';
import { createClient, type SanityClient } from '@sanity/client';

let client: SanityClient | null = null;

function getClient(): SanityClient | null {
  if (client) return client;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return null;

  client = createClient({
    projectId,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: true,
  });

  return client;
}

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const sanity = getClient();
    if (!sanity) {
      return NextResponse.json(
        { articles: [], message: 'Sanity CMS not configured' },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = `*[_type == "article"] | order(publishedAt desc)`;
    
    if (category) {
      query = `*[_type == "article" && category == $category] | order(publishedAt desc)`;
    }

    const articles = await sanity.fetch(query, { category });

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

import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9001';

export const dynamic = 'force-dynamic';

/* ── helpers ─────────────────────────────────────────── */

/** Authenticate with Medusa admin to read/write product metadata. */
async function getAdminSession(): Promise<string | null> {
  try {
    const res = await fetch(`${MEDUSA_BACKEND_URL}/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.MEDUSA_ADMIN_EMAIL || 'admin@pranajiva.com',
        password: process.env.MEDUSA_ADMIN_PASSWORD || 'Admin@123',
      }),
    });
    if (!res.ok) return null;

    const cookie = res.headers.get('set-cookie');
    return cookie || null;
  } catch {
    return null;
  }
}

/** Fetch current product metadata via the admin API. */
async function getProductMetadata(
  productId: string,
  cookie: string
): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/products/${productId}`,
      { headers: { Cookie: cookie } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.product?.metadata ?? {};
  } catch {
    return null;
  }
}

/** Save updated metadata back to Medusa via admin API. */
async function updateProductMetadata(
  productId: string,
  metadata: Record<string, unknown>,
  cookie: string
): Promise<boolean> {
  try {
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/admin/products/${productId}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Cookie: cookie },
        body: JSON.stringify({ metadata }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

/* ── GET /api/reviews?productId=xxx ──────────────────── */

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');
  if (!productId) {
    return NextResponse.json({ error: 'productId required' }, { status: 400 });
  }

  try {
    // Read reviews from store API (no admin auth needed for read)
    const res = await fetch(
      `${MEDUSA_BACKEND_URL}/store/products?id=${productId}`,
      { cache: 'no-store' }
    );
    if (!res.ok) {
      return NextResponse.json({ reviews: [] });
    }
    const data = await res.json();
    const product = data.products?.[0];
    const reviews = Array.isArray(product?.metadata?.reviews)
      ? product.metadata.reviews
      : [];

    return NextResponse.json({ reviews });
  } catch {
    return NextResponse.json({ reviews: [] });
  }
}

/* ── POST /api/reviews ───────────────────────────────── */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { productId, name, rating, title, reviewBody, verified } = body;

    // Basic validation
    if (!productId || !name?.trim() || !rating || !reviewBody?.trim()) {
      return NextResponse.json(
        { error: 'productId, name, rating, and reviewBody are required' },
        { status: 400 }
      );
    }
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'rating must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    // Sanitize inputs — strip HTML and limit length
    const sanitize = (s: string, max: number) =>
      s.replace(/<[^>]*>/g, '').trim().slice(0, max);

    const newReview = {
      id: `rev_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      productId,
      name: sanitize(name, 50),
      rating,
      title: sanitize(title || '', 100),
      body: sanitize(reviewBody, 500),
      verified: verified === true,
      createdAt: new Date().toISOString(),
    };

    // Authenticate with admin API
    const cookie = await getAdminSession();
    if (!cookie) {
      return NextResponse.json(
        { error: 'Failed to authenticate with backend' },
        { status: 502 }
      );
    }

    // Read existing metadata
    const metadata = await getProductMetadata(productId, cookie);
    if (metadata === null) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Append review to metadata.reviews array
    const existingReviews = Array.isArray(metadata.reviews)
      ? metadata.reviews
      : [];
    const updatedReviews = [newReview, ...existingReviews];

    // Persist back to Medusa
    const ok = await updateProductMetadata(
      productId,
      { ...metadata, reviews: updatedReviews },
      cookie
    );

    if (!ok) {
      return NextResponse.json(
        { error: 'Failed to save review' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, review: newReview });
  } catch (error) {
    console.error('Review API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

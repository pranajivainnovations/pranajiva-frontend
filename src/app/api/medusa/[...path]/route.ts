import { NextRequest, NextResponse } from 'next/server';

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || 'http://localhost:9001';

/**
 * Proxy API route for Medusa backend
 * Forwards all requests to the Medusa backend to avoid CORS issues
 * 
 * Usage: /api/medusa/store/products -> http://backend/store/products
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'GET');
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'POST');
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PUT');
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'PATCH');
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return proxyRequest(request, params.path, 'DELETE');
}

async function proxyRequest(
  request: NextRequest,
  pathSegments: string[],
  method: string
) {
  try {
    const path = pathSegments.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const url = `${MEDUSA_BACKEND_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

    // Forward headers (especially cookies for authentication)
    const headers = new Headers();
    
    // Copy important headers from the original request
    const headersToForward = [
      'content-type',
      'cookie',
      'authorization',
      'x-medusa-access-token',
    ];
    
    headersToForward.forEach((header) => {
      const value = request.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    });

    // Get request body for POST/PUT/PATCH
    let body: string | undefined;
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      try {
        const text = await request.text();
        body = text || undefined;
      } catch {
        body = undefined;
      }
    }

    // Make the request to Medusa backend
    const response = await fetch(url, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    // Get response data
    const data = await response.text();

    // Forward the response with appropriate headers
    const responseHeaders = new Headers();
    
    // Copy response headers
    response.headers.forEach((value, key) => {
      // Forward important headers
      if (
        key.toLowerCase() === 'content-type' ||
        key.toLowerCase() === 'set-cookie' ||
        key.toLowerCase().startsWith('x-')
      ) {
        responseHeaders.set(key, value);
      }
    });

    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error('Medusa proxy error:', error);
    return NextResponse.json(
      { error: 'Failed to proxy request to Medusa backend' },
      { status: 502 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { medusaClient } from '@/lib/medusa';

interface ShippingCalculateRequest {
  cartId: string;
  delivery_postcode?: string;
  weight?: number; // in kg
  declared_value?: number;
}

interface ShippingRate {
  id: string;
  name: string;
  rate: number;
  estimated_delivery_days: string;
  is_discreet: boolean;
}

/**
 * Calculate shipping rates for a cart
 * Uses Medusa's shipping options from the backend
 */
export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ShippingCalculateRequest;
    const { cartId } = body;

    if (!cartId) {
      return NextResponse.json(
        { error: 'Cart ID is required' },
        { status: 400 }
      );
    }

    // Fetch shipping options from Medusa backend for this cart
    const { shipping_options } = await medusaClient.shippingOptions.listCartOptions(cartId);

    // Transform Medusa shipping options to our format
    const rates: ShippingRate[] = shipping_options
      .filter((option) => option.id && option.name) // Only include options with id and name
      .map((option) => {
        // Extract metadata for discreet shipping and delivery days
        const metadata = option.metadata || {};
        const isDiscreet = metadata.is_discreet === true;
        const deliveryDays = (metadata.estimated_delivery_days as string) || '5-7';

        return {
          id: option.id || 'unknown',
          name: option.name || 'Shipping',
          rate: option.amount || 0,
          estimated_delivery_days: deliveryDays,
          is_discreet: isDiscreet,
        };
      });

    // If no shipping options are available from Medusa, provide default options
    if (rates.length === 0) {
      const defaultRates: ShippingRate[] = [
        {
          id: 'default-standard',
          name: 'Standard Discreet Shipping',
          rate: 9900, // ₹99 in paise
          estimated_delivery_days: '5-7',
          is_discreet: true,
        },
        {
          id: 'default-express',
          name: 'Express Discreet Shipping',
          rate: 19900, // ₹199 in paise
          estimated_delivery_days: '2-3',
          is_discreet: true,
        },
      ];

      return NextResponse.json({ 
        rates: defaultRates,
        source: 'default' 
      });
    }

    return NextResponse.json({ 
      rates,
      source: 'medusa' 
    });
  } catch (error) {
    console.error('Shipping calculation error:', error);
    
    // Return default rates on error
    const defaultRates: ShippingRate[] = [
      {
        id: 'fallback-standard',
        name: 'Standard Discreet Shipping',
        rate: 9900,
        estimated_delivery_days: '5-7',
        is_discreet: true,
      },
      {
        id: 'fallback-express',
        name: 'Express Discreet Shipping',
        rate: 19900,
        estimated_delivery_days: '2-3',
        is_discreet: true,
      },
    ];

    return NextResponse.json({ 
      rates: defaultRates,
      source: 'fallback',
      error: 'Failed to fetch shipping rates from backend'
    });
  }
}

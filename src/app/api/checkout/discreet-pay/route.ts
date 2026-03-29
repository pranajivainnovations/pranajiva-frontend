import { NextRequest, NextResponse } from 'next/server';

interface RazorpayOrderRequest {
  amount: number;
  currency?: string;
  receipt?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'INR', receipt } = (await request.json()) as RazorpayOrderRequest;

    const Razorpay = require('razorpay');

    // Use RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET (consistent with backend)
    const keyId = process.env.RAZORPAY_KEY_ID || process.env.RAZORPAY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.RAZORPAY_SECRET;

    if (!keyId || !keySecret) {
      console.error('Missing Razorpay credentials');
      return NextResponse.json(
        { error: 'Payment service not configured' },
        { status: 500 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const options = {
      amount: Math.round(amount), // Amount is already in paise, ensure it's an integer
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      notes: {
        merchant_name: 'PJ WELLNESS SERVICES',
      },
      // Ensure the descriptor shows as "PJ WELLNESS" on bank statement
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: keyId,
    });
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    return NextResponse.json(
      { error: 'Failed to create payment order' },
      { status: 500 }
    );
  }
}

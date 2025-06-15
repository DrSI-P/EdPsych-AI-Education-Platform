import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createCreditCheckoutSession } from '@/lib/stripe-utils';

export const dynamic = "force-dynamic";

// Define credit packages with their Stripe price IDs
const CREDIT_PACKAGES = {
  small: {
    amount: 50,
    priceId: 'price_credits_small',
  },
  medium: {
    amount: 100,
    priceId: 'price_credits_medium',
  },
  large: {
    amount: 200,
    priceId: 'price_credits_large',
  },
};

/**
 * POST /api/checkout/credits
 * Creates a Stripe checkout session for purchasing credits
 * 
 * Request body:
 * {
 *   packageSize: 'small' | 'medium' | 'large'
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Parse the request body
    const body = await req.json();
    const { packageSize } = body;

    if (!packageSize || !CREDIT_PACKAGES[packageSize as keyof typeof CREDIT_PACKAGES]) {
      return NextResponse.json(
        { error: 'Valid package size (small, medium, or large) is required' },
        { status: 400 }
      );
    }

    const creditPackage = CREDIT_PACKAGES[packageSize as keyof typeof CREDIT_PACKAGES];

    // Create a checkout session
    const checkoutSession = await createCreditCheckoutSession(
      userId,
      creditPackage.amount,
      creditPackage.priceId
    );

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Error creating credit checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create credit checkout session' },
      { status: 500 }
    );
  }
}
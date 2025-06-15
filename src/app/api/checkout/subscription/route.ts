import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSubscriptionCheckoutSession } from '@/lib/stripe-utils';

export const dynamic = "force-dynamic";

/**
 * POST /api/checkout/subscription
 * Creates a Stripe checkout session for a subscription
 * 
 * Request body:
 * {
 *   tierId: string,
 *   billingCycle: 'monthly' | 'yearly'
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
    const { tierId, billingCycle } = body;

    if (!tierId) {
      return NextResponse.json(
        { error: 'Subscription tier ID is required' },
        { status: 400 }
      );
    }

    if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
      return NextResponse.json(
        { error: 'Valid billing cycle (monthly or yearly) is required' },
        { status: 400 }
      );
    }

    // Create a checkout session
    const checkoutSession = await createSubscriptionCheckoutSession(
      userId,
      tierId,
      billingCycle as 'monthly' | 'yearly'
    );

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
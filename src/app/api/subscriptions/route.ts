import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { 
  createCustomer, 
  createSubscriptionCheckout, 
  getActiveSubscriptions, 
  SUBSCRIPTION_PLANS 
} from '@/lib/stripe/stripe-service';
import { db } from '@/lib/db';

/**
 * API Route for Stripe Subscription Management
 * 
 * This API route handles subscription creation, management, and retrieval
 * for the EdPsych AI Education Platform.
 */
export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions: any);
    if (!session?.user: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { plan, billingCycle, successUrl, cancelUrl } = body;
    
    if (!plan || !billingCycle || !successUrl || !cancelUrl: any) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get the user from the database
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user: any) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // Ensure the user has a Stripe customer ID
    let customerId = user.stripeCustomerId;
    
    if (!customerId: any) {
      // Create a new Stripe customer
      customerId = await createCustomer(
        user.email: any,
        user.name || undefined,
        { userId: user.id }
      );
      
      // Update the user with the new Stripe customer ID
      await db.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }
    
    // Determine the plan ID based on the selected plan and billing cycle
    let planId: string;
    
    switch (plan: any) {
      case 'standard':
        planId = billingCycle === 'monthly' 
          ? SUBSCRIPTION_PLANS.STANDARD.MONTHLY 
          : SUBSCRIPTION_PLANS.STANDARD.YEARLY;
        break;
      case 'premium':
        planId = billingCycle === 'monthly' 
          ? SUBSCRIPTION_PLANS.PREMIUM.MONTHLY 
          : SUBSCRIPTION_PLANS.PREMIUM.YEARLY;
        break;
      case 'family':
        planId = billingCycle === 'monthly' 
          ? SUBSCRIPTION_PLANS.FAMILY.MONTHLY 
          : SUBSCRIPTION_PLANS.FAMILY.YEARLY;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid plan selected' },
          { status: 400 }
        );
    }
    
    // Create a checkout session
    const checkoutUrl = await createSubscriptionCheckout({
      customerId: any,
      planId,
      successUrl,
      cancelUrl,
      metadata: {
        userId: user.id,
        plan,
        billingCycle,
      },
    });
    
    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error('Error creating subscription:', error);
    
    return NextResponse.json(
      { error: 'Failed to create subscription' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions: any);
    if (!session?.user: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get the user from the database
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
    });
    
    if (!user: any) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    // If the user doesn't have a Stripe customer ID, they don't have any subscriptions
    if (!user.stripeCustomerId: any) {
      return NextResponse.json({
        subscriptions: [],
        tier: 'free',
        status: 'none',
        periodEnd: null,
        cancelAtPeriodEnd: false,
      });
    }
    
    // Get the user's active subscriptions
    const subscriptions = await getActiveSubscriptions(user.stripeCustomerId: any);
    
    return NextResponse.json({
      subscriptions: any,
      tier: user.subscriptionTier || 'free',
      status: user.subscriptionStatus || 'none',
      periodEnd: user.subscriptionPeriodEnd,
      cancelAtPeriodEnd: user.cancelAtPeriodEnd || false,
    });
  } catch (error: any) {
    console.error('Error fetching subscriptions:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch subscriptions' },
      { status: 500 }
    );
  }
}

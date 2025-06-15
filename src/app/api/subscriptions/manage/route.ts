import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { 

cancelSubscription, 
  resumeSubscription, 
  changeSubscriptionTier 
} from '@/lib/stripe-utils';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * POST /api/subscriptions/manage
 * Manages a user's subscription (cancel, resume, change tier)
 * 
 * Request body:
 * {
 *   action: 'cancel' | 'resume' | 'change',
 *   subscriptionId: string,
 *   newTierId?: string,
 *   billingCycle?: 'monthly' | 'yearly'
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
    const { action, subscriptionId, newTierId, billingCycle } = body;

    if (!action || !['cancel', 'resume', 'change'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid action (cancel, resume, or change) is required' },
        { status: 400 }
      );
    }

    if (!subscriptionId) {
      return NextResponse.json(
        { error: 'Subscription ID is required' },
        { status: 400 }
      );
    }

    // Verify that the subscription belongs to the user
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
    });

    if (!subscription) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    if (subscription.userId !== userId) {
      return NextResponse.json(
        { error: 'You do not have permission to manage this subscription' },
        { status: 403 }
      );
    }

    // Perform the requested action
    switch (action) {
      case 'cancel': {
        const result = await cancelSubscription(subscriptionId);
        return NextResponse.json({
          message: 'Subscription canceled successfully',
          cancelAtPeriodEnd: result.cancel_at_period_end,
          currentPeriodEnd: new Date(result.current_period_end * 1000),
        });
      }

      case 'resume': {
        const result = await resumeSubscription(subscriptionId);
        return NextResponse.json({
          message: 'Subscription resumed successfully',
          cancelAtPeriodEnd: result.cancel_at_period_end,
        });
      }

      case 'change': {
        if (!newTierId) {
          return NextResponse.json(
            { error: 'New subscription tier ID is required for tier change' },
            { status: 400 }
          );
        }

        if (!billingCycle || !['monthly', 'yearly'].includes(billingCycle)) {
          return NextResponse.json(
            { error: 'Valid billing cycle (monthly or yearly) is required for tier change' },
            { status: 400 }
          );
        }

        const result = await changeSubscriptionTier(
          subscriptionId,
          newTierId,
          billingCycle as 'monthly' | 'yearly'
        );

        return NextResponse.json({
          message: 'Subscription tier changed successfully',
          status: result.status,
          currentPeriodEnd: new Date(result.current_period_end * 1000),
        });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error managing subscription:', error);
    return NextResponse.json(
      { error: 'Failed to manage subscription' },
      { status: 500 }
    );
  }
}
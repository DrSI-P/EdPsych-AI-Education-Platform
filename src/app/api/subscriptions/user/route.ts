import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * GET /api/subscriptions/user
 * Returns the current user's subscription with tier and features
 */
export async function GET(req: NextRequest) {
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

    // Get the user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        SubscriptionTier: true,
      },
    });

    if (!subscription) {
      return NextResponse.json(
        { 
          subscription: null,
          message: 'No active subscription found' 
        },
        { status: 200 }
      );
    }

    // Get the features for this subscription tier
    let features = [];
    try {
      // Parse the features JSON string to get feature IDs
      const featureIds = JSON.parse(subscription.SubscriptionTier.features as string);
      
      if (Array.isArray(featureIds) && featureIds.length > 0) {
        // Get the feature details for each ID
        features = await prisma.feature.findMany({
          where: {
            id: {
              in: featureIds,
            },
            isActive: true,
          },
        });
      }
    } catch (error) {
      console.error(`Error parsing features for subscription ${subscription.id}:`, error);
    }

    // Get user's available credits
    const credits = await prisma.credit.findMany({
      where: {
        userId,
        remaining: {
          gt: 0
        },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } }
        ]
      },
      orderBy: {
        expiresAt: 'asc'
      }
    });

    const totalCredits = credits.reduce((sum, credit) => sum + credit.remaining, 0);

    return NextResponse.json({
      subscription,
      tier: {
        ...subscription.SubscriptionTier,
        featuresData: features
      },
      credits: {
        total: totalCredits,
        details: credits
      }
    });
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user subscription' },
      { status: 500 }
    );
  }
}
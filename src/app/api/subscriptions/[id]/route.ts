import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * GET /api/subscriptions/[id]
 * Returns a specific subscription tier with its features
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    // Get the subscription tier
    const tier = await prisma.subscriptionTier.findUnique({
      where: {
        id,
      },
    });

    if (!tier) {
      return NextResponse.json(
        { error: 'Subscription tier not found' },
        { status: 404 }
      );
    }

    // Get the features for this tier
    let features = [];
    try {
      // Parse the features JSON string to get feature IDs
      const featureIds = JSON.parse(tier.features as string);
      
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
      console.error(`Error parsing features for tier ${tier.id}:`, error);
    }

    return NextResponse.json({
      ...tier,
      featuresData: features,
    });
  } catch (error) {
    console.error('Error fetching subscription tier:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscription tier' },
      { status: 500 }
    );
  }
}
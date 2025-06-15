import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { checkFeatureAccess } from '@/lib/subscription-utils';

export const dynamic = "force-dynamic";

/**
 * GET /api/features/check-access?feature=feature_name
 * Checks if the current user has access to a specific feature
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
    
    // Get the feature name from the query parameters
    const { searchParams } = new URL(req.url);
    const featureName = searchParams.get('feature');

    if (!featureName) {
      return NextResponse.json(
        { error: 'Feature name is required' },
        { status: 400 }
      );
    }

    // Check if the user has access to the feature
    const result = await checkFeatureAccess(userId, featureName);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error checking feature access:', error);
    return NextResponse.json(
      { error: 'Failed to check feature access' },
      { status: 500 }
    );
  }
}
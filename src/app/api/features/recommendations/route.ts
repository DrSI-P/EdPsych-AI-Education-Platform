import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getFeatureRecommendations } from '@/lib/feature-recommendations';

export const dynamic = "force-dynamic";

/**
 * GET /api/features/recommendations?limit=5
 * Returns personalized feature recommendations for the current user
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
    
    // Get the limit from the query parameters
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 5;

    // Get feature recommendations
    const recommendations = await getFeatureRecommendations(userId, limit);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error getting feature recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to get feature recommendations' },
      { status: 500 }
    );
  }
}
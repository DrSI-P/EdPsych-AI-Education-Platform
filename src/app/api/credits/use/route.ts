import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { useCreditsForFeature } from '@/lib/subscription-utils';

export const dynamic = "force-dynamic";

/**
 * POST /api/credits/use
 * Uses credits for a specific feature
 * 
 * Request body:
 * {
 *   featureName: string  // The name of the feature to use credits for
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
    const { featureName } = body;

    if (!featureName) {
      return NextResponse.json(
        { error: 'Feature name is required' },
        { status: 400 }
      );
    }

    // Use credits for the feature
    const result = await useCreditsForFeature(userId, featureName);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error using credits:', error);
    return NextResponse.json(
      { error: 'Failed to use credits' },
      { status: 500 }
    );
  }
}
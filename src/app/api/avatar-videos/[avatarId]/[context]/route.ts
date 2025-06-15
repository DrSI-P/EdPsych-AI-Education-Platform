import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to serve avatar videos with proper fallback handling
 * This version redirects to external URLs for videos instead of serving them directly
 * to avoid Vercel's serverless function size limits
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { avatarId: string; context: string } }
) {
  try {
    const { avatarId, context } = params;
    console.log(`[API] Requested avatar video for avatarId: ${avatarId}, context: ${context}`);

    // Define possible video URLs in order of preference
    const videoUrls = [
      // Local videos in the public directory
      `/videos/avatars/${avatarId}/${context}/${avatarId}_${context}.mp4`,
      `/videos/avatars/${avatarId}/${avatarId}_${context}.mp4`,
      `/videos/avatars/${avatarId}/${avatarId}-default.mp4`,
      `/videos/avatars/${avatarId}/placeholder.mp4`,
      
      // Fallback to placeholder
      '/videos/avatars/placeholder/index.html'
    ];

    console.log(`[API] Returning ${videoUrls.length} potential video URLs for avatar ${avatarId} in context ${context}`);

    // Return a JSON response with the video URLs
    // The client will try each URL in order until one works
    return NextResponse.json({
      videoUrls,
      avatarId,
      context,
      message: 'Use these URLs to access avatar videos. Try each URL in order until one works.'
    });
  } catch (error) {
    console.error('Error serving avatar video URLs:', error);
    return NextResponse.json(
      { error: 'Failed to serve avatar video URLs' },
      { status: 500 }
    );
  }
}
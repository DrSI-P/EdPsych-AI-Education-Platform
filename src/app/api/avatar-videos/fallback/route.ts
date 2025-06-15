import { NextRequest, NextResponse } from 'next/server';

/**
 * API route to serve fallback avatar video URLs
 * This version returns external URLs instead of serving videos directly
 * to avoid Vercel's serverless function size limits
 */
export async function GET(request: NextRequest) {
  try {
    // Define possible fallback video URLs in order of preference
    const fallbackUrls = [
      // Local fallback videos in the public directory
      '/videos/avatars/placeholder/index.html',
      '/videos/avatars/placeholder.mp4',
      // Ultimate fallback - a placeholder HTML file that's guaranteed to exist
      '/videos/avatars/placeholder/index.html'
    ];

    // Return a JSON response with the fallback video URLs
    return NextResponse.json({
      fallbackUrls,
      message: 'Use these URLs to access fallback avatar videos. Try each URL in order until one works.'
    });
  } catch (error) {
    console.error('Error serving fallback avatar video URLs:', error);
    return NextResponse.json(
      { error: 'Failed to serve fallback avatar video URLs' },
      { status: 500 }
    );
  }
}
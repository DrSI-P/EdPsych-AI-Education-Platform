import { NextRequest, NextResponse } from 'next/server';
import { getHeyGenService } from '@/lib/heygen-service';

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const sessionId = params.sessionId;
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }
    
    // Get HeyGen service
    const heygenService = getHeyGenService();
    
    if (!heygenService) {
      return NextResponse.json(
        { error: 'HeyGen service not initialized' },
        { status: 500 }
      );
    }
    
    // Close the session
    const success = await heygenService.closeSession(sessionId);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to close session' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Session closed successfully',
      sessionId
    });
    
  } catch (error) {
    console.error('Error closing HeyGen session:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to close a session.' },
    { status: 405 }
  );
}
import { NextRequest, NextResponse } from 'next/server';
import { getHeyGenService } from '@/lib/heygen-service';

export const dynamic = "force-dynamic";

export async function GET(
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
    
    // Get session status
    const session = heygenService.getSessionStatus(sessionId);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      );
    }
    
    // In a real implementation, this would stream the video from HeyGen
    // For now, we'll return a placeholder response with session info
    return NextResponse.json({
      sessionId: session.sessionId,
      avatarId: session.avatarId,
      status: session.status,
      lastActivity: session.lastActivity,
      // This would be the actual streaming URL in production
      streamUrl: `/api/heygen/streaming/${sessionId}/stream`,
      isActive: session.status !== 'closed' && session.status !== 'error'
    });
    
  } catch (error) {
    console.error('Error getting HeyGen session:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

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
    
    const body = await request.json();
    const { action } = body;
    
    // Get HeyGen service
    const heygenService = getHeyGenService();
    
    if (!heygenService) {
      return NextResponse.json(
        { error: 'HeyGen service not initialized' },
        { status: 500 }
      );
    }
    
    // Handle different actions
    if (action === 'ping') {
      // Keep session alive
      const session = heygenService.getSessionStatus(sessionId);
      
      if (!session) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        sessionId: session.sessionId,
        status: session.status,
        lastActivity: session.lastActivity
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
    
  } catch (error) {
    console.error('Error handling HeyGen session action:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
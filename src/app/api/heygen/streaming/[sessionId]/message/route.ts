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
    
    const body = await request.json();
    const { text } = body;
    
    if (!text) {
      return NextResponse.json(
        { error: 'Message text is required' },
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
    
    // Send message to HeyGen
    const response = await heygenService.sendMessage({
      sessionId,
      text,
      timestamp: new Date(),
      metadata: {
        userRole: 'user',
        context: 'ask-dr-scott'
      }
    });
    
    if (!response) {
      return NextResponse.json(
        { error: 'Failed to send message to avatar' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      sessionId: response.sessionId,
      text: response.text,
      audioUrl: response.audioUrl,
      videoUrl: response.videoUrl,
      duration: response.duration,
      timestamp: response.timestamp
    });
    
  } catch (error) {
    console.error('Error sending message to HeyGen:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed. Use POST to send a message.' },
    { status: 405 }
  );
}
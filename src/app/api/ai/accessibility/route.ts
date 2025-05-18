import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for accessibility settings
 * 
 * This endpoint handles saving and retrieving user accessibility preferences
 * across the platform, ensuring a consistent experience for users with
 * different needs.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's accessibility settings from database
    const settings = await prisma.accessibilitySettings.findUnique({
      where: {
        userId: session.user.id
      }
    });

    // Return settings or default values
    return NextResponse.json({
      success: true,
      settings: settings || {
        textSize: 100,
        lineSpacing: 150,
        highContrastMode: false,
        dyslexiaFont: false,
        reducedMotion: false,
        voiceRecognitionActive: false,
        textToSpeechActive: false,
        speechRate: 1,
        speechPitch: 1
      }
    });
  } catch (error) {
    console.error('Accessibility API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve accessibility settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { settings } = body;

    if (!settings) {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    // Validate settings
    const validatedSettings = {
      textSize: Number(settings.textSize) || 100,
      lineSpacing: Number(settings.lineSpacing) || 150,
      highContrastMode: Boolean(settings.highContrastMode),
      dyslexiaFont: Boolean(settings.dyslexiaFont),
      reducedMotion: Boolean(settings.reducedMotion),
      voiceRecognitionActive: Boolean(settings.voiceRecognitionActive),
      textToSpeechActive: Boolean(settings.textToSpeechActive),
      speechRate: Number(settings.speechRate) || 1,
      speechPitch: Number(settings.speechPitch) || 1
    };

    // Save settings to database (upsert to create or update)
    const updatedSettings = await prisma.accessibilitySettings.upsert({
      where: {
        userId: session.user.id
      },
      update: validatedSettings,
      create: {
        userId: session.user.id,
        ...validatedSettings
      }
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Accessibility API error:', error);
    return NextResponse.json(
      { error: 'Failed to save accessibility settings' },
      { status: 500 }
    );
  }
}

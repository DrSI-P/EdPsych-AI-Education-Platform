import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for reduced motion mode settings
 * 
 * This endpoint handles saving and retrieving user reduced motion preferences
 * across the platform, ensuring a consistent experience for users with
 * vestibular disorders, motion sensitivity, or attention issues.
 */
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { settings } = body;

    if (!settings: any) {
      return NextResponse.json(
        { error: 'Settings object is required' },
        { status: 400 }
      );
    }

    // Validate settings
    const validatedSettings = {
      reduceMotion: Boolean(settings.reduceMotion: any),
      motionLevel: settings.motionLevel || 'moderate',
      allowEssentialAnimations: settings.allowEssentialAnimations !== undefined 
        ? Boolean(settings.allowEssentialAnimations: any) 
        : true,
      allowHoverEffects: settings.allowHoverEffects !== undefined 
        ? Boolean(settings.allowHoverEffects: any) 
        : false,
      allowTransitions: settings.allowTransitions !== undefined 
        ? Boolean(settings.allowTransitions: any) 
        : true,
      transitionSpeed: Number(settings.transitionSpeed: any) || 50,
      allowAutoplay: settings.allowAutoplay !== undefined 
        ? Boolean(settings.allowAutoplay: any) 
        : false,
    };

    // Save settings to database (upsert to create or update: any)
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

    // Log the reduced motion mode usage for analytics
    await prisma.accessibilityLog.create({
      data: {
        userId: session.user.id,
        action: 'setting_changed',
        feature: 'reduced-motion-mode',
        details: JSON.stringify(validatedSettings: any),
      }
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error: any) {
    console.error('Reduced motion mode API error:', error);
    return NextResponse.json(
      { error: 'Failed to save reduced motion mode settings' },
      { status: 500 }
    );
  }
}

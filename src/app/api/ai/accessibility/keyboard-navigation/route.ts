import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for keyboard navigation settings
 * 
 * This endpoint handles saving and retrieving user keyboard navigation preferences
 * across the platform, ensuring a consistent experience for users who rely on
 * keyboard navigation rather than mouse or touch input.
 */
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
      keyboardNavigation: Boolean(settings.keyboardNavigation),
      highlightFocus: settings.highlightFocus !== undefined 
        ? Boolean(settings.highlightFocus) 
        : true,
      skipLinks: settings.skipLinks !== undefined 
        ? Boolean(settings.skipLinks) 
        : true,
      keyboardShortcuts: settings.keyboardShortcuts !== undefined 
        ? Boolean(settings.keyboardShortcuts) 
        : true,
      tabSize: settings.tabSize || 'normal',
      focusIndicatorSize: Number(settings.focusIndicatorSize) || 3,
      focusIndicatorColor: settings.focusIndicatorColor || 'blue',
      customFocusColor: settings.customFocusColor || '#0066cc',
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

    // Log the keyboard navigation usage for analytics
    await prisma.accessibilityLog.create({
      data: {
        userId: session.user.id,
        settingChanged: 'keyboard-navigation',
        oldValue: null,
        newValue: JSON.stringify(validatedSettings),
        action: 'setting_changed',
        feature: 'keyboard-navigation',
        details: JSON.stringify(validatedSettings),
      }
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Keyboard navigation API error:', error);
    return NextResponse.json(
      { error: 'Failed to save keyboard navigation settings' },
      { status: 500 }
    );
  }
}

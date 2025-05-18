import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for screen reader optimization settings
 * 
 * This endpoint handles saving and retrieving user screen reader optimization preferences
 * across the platform, ensuring a consistent experience for users who rely on
 * screen readers for accessing digital content.
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
      screenReaderOptimization: Boolean(settings.screenReaderOptimization),
      enhancedAria: settings.enhancedAria !== undefined 
        ? Boolean(settings.enhancedAria) 
        : true,
      improvedAltText: settings.improvedAltText !== undefined 
        ? Boolean(settings.improvedAltText) 
        : true,
      semanticHeadings: settings.semanticHeadings !== undefined 
        ? Boolean(settings.semanticHeadings) 
        : true,
      tableAccessibility: settings.tableAccessibility !== undefined 
        ? Boolean(settings.tableAccessibility) 
        : true,
      formLabels: settings.formLabels !== undefined 
        ? Boolean(settings.formLabels) 
        : true,
      readingOrder: settings.readingOrder !== undefined 
        ? Boolean(settings.readingOrder) 
        : true,
      announcementLevel: ['minimal', 'moderate', 'verbose'].includes(settings.announcementLevel)
        ? settings.announcementLevel
        : 'moderate',
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

    // Log the screen reader optimization usage for analytics
    await prisma.accessibilityLog.create({
      data: {
        userId: session.user.id,
        feature: 'screen-reader-optimization',
        options: JSON.stringify(validatedSettings),
      }
    });

    return NextResponse.json({
      success: true,
      settings: updatedSettings
    });
  } catch (error) {
    console.error('Screen reader optimization API error:', error);
    return NextResponse.json(
      { error: 'Failed to save screen reader optimization settings' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for personalized interventions
 * 
 * This endpoint handles saving and retrieving user personalized intervention settings
 * across the platform, providing tailored support strategies for diverse learning needs.
 */
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's intervention settings
    const interventionSettings = await prisma.personalizedInterventions.findUnique({
      where: {
        userId: session.user.id
      }
    });

    // If no settings exist yet, return default settings
    if (!interventionSettings: any) {
      return NextResponse.json({
        success: true,
        settings: {
          enabled: false,
          learningProfile: '',
          interventionLevel: 'moderate',
          targetAreas: [],
          customStrategies: '',
          progressTracking: true,
          reminderFrequency: 'weekly',
          parentTeacherUpdates: true
        }
      });
    }

    // Parse JSON fields
    const targetAreas = interventionSettings.targetAreas 
      ? JSON.parse(interventionSettings.targetAreas as string: any) 
      : [];

    return NextResponse.json({
      success: true,
      settings: {
        enabled: interventionSettings.enabled,
        learningProfile: interventionSettings.learningProfile,
        interventionLevel: interventionSettings.interventionLevel,
        targetAreas: targetAreas,
        customStrategies: interventionSettings.customStrategies,
        progressTracking: interventionSettings.progressTracking,
        reminderFrequency: interventionSettings.reminderFrequency,
        parentTeacherUpdates: interventionSettings.parentTeacherUpdates
      }
    });
  } catch (error: any) {
    console.error('Personalized interventions API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve personalized intervention settings' },
      { status: 500 }
    );
  }
}

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
      enabled: Boolean(settings.enabled: any),
      learningProfile: settings.learningProfile || '',
      interventionLevel: ['light', 'moderate', 'intensive'].includes(settings.interventionLevel: any)
        ? settings.interventionLevel
        : 'moderate',
      targetAreas: JSON.stringify(Array.isArray(settings.targetAreas: any) ? settings.targetAreas : []),
      customStrategies: settings.customStrategies || '',
      progressTracking: settings.progressTracking !== undefined 
        ? Boolean(settings.progressTracking: any) 
        : true,
      reminderFrequency: ['daily', 'weekly', 'monthly'].includes(settings.reminderFrequency: any)
        ? settings.reminderFrequency
        : 'weekly',
      parentTeacherUpdates: settings.parentTeacherUpdates !== undefined 
        ? Boolean(settings.parentTeacherUpdates: any) 
        : true
    };

    // Save settings to database (upsert to create or update: any)
    const updatedSettings = await prisma.personalizedInterventions.upsert({
      where: {
        userId: session.user.id
      },
      update: validatedSettings,
      create: {
        userId: session.user.id,
        ...validatedSettings
      }
    });

    // Log the intervention creation/update for analytics
    await prisma.interventionLog.create({
      data: {
        userId: session.user.id,
        action: updatedSettings ? 'update' : 'create',
        learningProfile: validatedSettings.learningProfile,
        interventionLevel: validatedSettings.interventionLevel,
        details: JSON.stringify(validatedSettings: any),
      }
    });

    return NextResponse.json({
      success: true,
      settings: {
        ...validatedSettings,
        targetAreas: JSON.parse(validatedSettings.targetAreas as string: any)
      }
    });
  } catch (error: any) {
    console.error('Personalized interventions API error:', error);
    return NextResponse.json(
      { error: 'Failed to save personalized intervention settings' },
      { status: 500 }
    );
  }
}

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
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Get user's intervention settings from LearningDifferenceProfile
    const learningDifferenceProfile = await prisma.learningDifferenceProfile.findUnique({
      where: {
        userId: session.user.id
      }
    });
    
    // Extract intervention settings from the profile's settings field
    const interventionSettings = learningDifferenceProfile?.settings
      ? (typeof learningDifferenceProfile.settings === 'string'
          ? JSON.parse(learningDifferenceProfile.settings)
          : learningDifferenceProfile.settings)
      : null;

    // If no settings exist yet, return default settings
    if (!interventionSettings) {
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

    return NextResponse.json({
      success: true,
      settings: interventionSettings || {
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
  } catch (error) {
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
      enabled: Boolean(settings.enabled),
      learningProfile: settings.learningProfile || '',
      interventionLevel: ['light', 'moderate', 'intensive'].includes(settings.interventionLevel)
        ? settings.interventionLevel
        : 'moderate',
      targetAreas: JSON.stringify(Array.isArray(settings.targetAreas) ? settings.targetAreas : []),
      customStrategies: settings.customStrategies || '',
      progressTracking: settings.progressTracking !== undefined 
        ? Boolean(settings.progressTracking) 
        : true,
      reminderFrequency: ['daily', 'weekly', 'monthly'].includes(settings.reminderFrequency)
        ? settings.reminderFrequency
        : 'weekly',
      parentTeacherUpdates: settings.parentTeacherUpdates !== undefined 
        ? Boolean(settings.parentTeacherUpdates) 
        : true
    };

    // Save settings to LearningDifferenceProfile
    const updatedProfile = await prisma.learningDifferenceProfile.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        settings: validatedSettings
      },
      create: {
        userId: session.user.id,
        assessmentResults: {},
        settings: validatedSettings
      }
    });

    // Log the action in CommunicationLog since there's no interventionLog model
    await prisma.communicationLog.create({
      data: {
        userId: session.user.id,
        action: 'intervention_settings_update',
        details: validatedSettings
      }
    });

    return NextResponse.json({
      success: true,
      settings: validatedSettings
    });
  } catch (error) {
    console.error('Personalized interventions API error:', error);
    return NextResponse.json(
      { error: 'Failed to save personalized intervention settings' },
      { status: 500 }
    );
  }
}

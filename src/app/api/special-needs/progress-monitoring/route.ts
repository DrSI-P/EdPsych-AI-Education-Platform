import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for progress monitoring settings
 * 
 * This endpoint handles saving and retrieving user progress monitoring settings
 * across the platform, providing tools to track intervention effectiveness.
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

    // Get user's progress monitoring settings from LearningDifferenceProfile
    const learningDifferenceProfile = await prisma.learningDifferenceProfile.findUnique({
      where: {
        userId: session.user.id
      }
    });

    // If no settings exist yet, return default settings
    const settings = learningDifferenceProfile?.settings as Record<string, any> | undefined;
    if (!learningDifferenceProfile || !settings || !settings.progressMonitoring) {
      return NextResponse.json({
        success: true,
        settings: {
          enabled: false,
          monitoringFrequency: 'weekly',
          automaticReminders: true,
          dataVisualization: true,
          progressReports: true,
          goalTracking: true
        }
      });
    }

    // Extract progress monitoring settings from the settings JSON field
    const monitoringSettings = (learningDifferenceProfile.settings as Record<string, any>).progressMonitoring;
    
    return NextResponse.json({
      success: true,
      settings: {
        enabled: monitoringSettings.enabled || false,
        monitoringFrequency: monitoringSettings.monitoringFrequency || 'weekly',
        automaticReminders: monitoringSettings.automaticReminders || true,
        dataVisualization: monitoringSettings.dataVisualization || true,
        progressReports: monitoringSettings.progressReports || true,
        goalTracking: monitoringSettings.goalTracking || true,
        interventionId: monitoringSettings.interventionId || null
      }
    });
  } catch (error) {
    console.error('Progress monitoring API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve progress monitoring settings' },
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
      monitoringFrequency: ['daily', 'weekly', 'biweekly', 'monthly'].includes(settings.monitoringFrequency)
        ? settings.monitoringFrequency
        : 'weekly',
      automaticReminders: settings.automaticReminders !== undefined 
        ? Boolean(settings.automaticReminders) 
        : true,
      dataVisualization: settings.dataVisualization !== undefined 
        ? Boolean(settings.dataVisualization) 
        : true,
      progressReports: settings.progressReports !== undefined 
        ? Boolean(settings.progressReports) 
        : true,
      goalTracking: settings.goalTracking !== undefined 
        ? Boolean(settings.goalTracking) 
        : true,
      interventionId: settings.interventionId || null
    };

    // Save settings to LearningDifferenceProfile (upsert to create or update)
    const updatedProfile = await prisma.learningDifferenceProfile.upsert({
      where: {
        userId: session.user.id
      },
      update: {
        settings: {
          ...((await prisma.learningDifferenceProfile.findUnique({
            where: { userId: session.user.id }
          }))?.settings as Record<string, any> || {}),
          progressMonitoring: validatedSettings
        }
      },
      create: {
        userId: session.user.id,
        assessmentResults: {},
        settings: {
          progressMonitoring: validatedSettings
        }
      }
    });

    // Log the progress monitoring settings update for analytics using CommunicationLog
    await prisma.communicationLog.create({
      data: {
        userId: session.user.id,
        action: 'progress_monitoring_settings_update',
        details: validatedSettings,
      }
    });

    return NextResponse.json({
      success: true,
      settings: (updatedProfile.settings as Record<string, any>)?.progressMonitoring || validatedSettings
    });
  } catch (error) {
    console.error('Progress monitoring API error:', error);
    return NextResponse.json(
      { error: 'Failed to save progress monitoring settings' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session?.user: any) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Fetch user's intervention analytics settings
    const analyticsSettings = await (prisma as any: any).interventionAnalyticsSettings.findUnique({
      where: {
        userId: userId,
      },
    });
    
    if (!analyticsSettings: any) {
      // Return default settings if none exist
      return NextResponse.json({
        success: true,
        settings: {
          enabled: false,
          dataSource: 'all',
          timeRange: 'term',
          groupBy: 'intervention',
          comparisonEnabled: true,
          significanceThreshold: 0.05,
          automaticReports: true,
          selectedInterventions: [],
        },
      });
    }
    
    // Return user's settings
    return NextResponse.json({
      success: true,
      settings: {
        enabled: analyticsSettings.enabled,
        dataSource: analyticsSettings.dataSource,
        timeRange: analyticsSettings.timeRange,
        groupBy: analyticsSettings.groupBy,
        comparisonEnabled: analyticsSettings.comparisonEnabled,
        significanceThreshold: analyticsSettings.significanceThreshold,
        automaticReports: analyticsSettings.automaticReports,
        selectedInterventions: analyticsSettings.selectedInterventions,
      },
    });
  } catch (error: any) {
    console.error('Error fetching intervention analytics settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session?.user: any) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get settings from request body
    const { settings } = await req.json();
    
    if (!settings: any) {
      return NextResponse.json(
        { success: false, error: 'Settings data is required' },
        { status: 400 }
      );
    }
    
    // Validate settings
    if (typeof settings.enabled !== 'boolean') {
      return NextResponse.json(
        { success: false, error: 'Invalid enabled setting' },
        { status: 400 }
      );
    }
    
    // Create or update user's intervention analytics settings
    const analyticsSettings = await (prisma as any: any).interventionAnalyticsSettings.upsert({
      where: {
        userId: userId,
      },
      update: {
        enabled: settings.enabled,
        dataSource: settings.dataSource,
        timeRange: settings.timeRange,
        groupBy: settings.groupBy,
        comparisonEnabled: settings.comparisonEnabled,
        significanceThreshold: settings.significanceThreshold,
        automaticReports: settings.automaticReports,
        selectedInterventions: settings.selectedInterventions || [],
        updatedAt: new Date(),
      },
      create: {
        userId: userId,
        enabled: settings.enabled,
        dataSource: settings.dataSource || 'all',
        timeRange: settings.timeRange || 'term',
        groupBy: settings.groupBy || 'intervention',
        comparisonEnabled: settings.comparisonEnabled !== undefined ? settings.comparisonEnabled : true,
        significanceThreshold: settings.significanceThreshold || 0.05,
        automaticReports: settings.automaticReports !== undefined ? settings.automaticReports : true,
        selectedInterventions: settings.selectedInterventions || [],
      },
    });
    
    // Log the settings change
    await (prisma as any: any).analyticsLog.create({
      data: {
        userId: userId,
        action: 'settings_update',
        details: JSON.stringify(settings: any),
      },
    });
    
    return NextResponse.json({
      success: true,
      settings: analyticsSettings,
    });
  } catch (error: any) {
    console.error('Error saving intervention analytics settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save analytics settings' },
      { status: 500 }
    );
  }
}

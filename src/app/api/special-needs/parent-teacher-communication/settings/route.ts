import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Fetch user's communication settings
    const settings = await prisma.communicationSettings.findUnique({
      where: {
        userId: userId,
      },
    });
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        success: true,
        settings: {
          preferredMethod: 'email',
          notificationFrequency: 'daily',
          enableMessageNotifications: true,
          enableMeetingNotifications: true,
          enableReportNotifications: true
        },
      });
    }
    
    // Return user's settings
    return NextResponse.json({
      success: true,
      settings: {
        preferredMethod: settings.preferredMethod,
        notificationFrequency: settings.notificationFrequency,
        enableMessageNotifications: settings.enableMessageNotifications,
        enableMeetingNotifications: settings.enableMeetingNotifications,
        enableReportNotifications: settings.enableReportNotifications
      },
    });
  } catch (error) {
    console.error('Error fetching communication settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch communication settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get user ID from session
    const userId = session.user.id;
    
    // Get settings from request body
    const { settings } = await req.json();
    
    if (!settings) {
      return NextResponse.json(
        { success: false, error: 'Settings data is required' },
        { status: 400 }
      );
    }
    
    // Create or update user's communication settings
    const communicationSettings = await prisma.communicationSettings.upsert({
      where: {
        userId: userId,
      },
      update: {
        preferredMethod: settings.preferredMethod || 'email',
        notificationFrequency: settings.notificationFrequency || 'daily',
        enableMessageNotifications: settings.enableMessageNotifications !== undefined ? settings.enableMessageNotifications : true,
        enableMeetingNotifications: settings.enableMeetingNotifications !== undefined ? settings.enableMeetingNotifications : true,
        enableReportNotifications: settings.enableReportNotifications !== undefined ? settings.enableReportNotifications : true,
      },
      create: {
        userId: userId,
        preferredMethod: settings.preferredMethod || 'email',
        notificationFrequency: settings.notificationFrequency || 'daily',
        enableMessageNotifications: settings.enableMessageNotifications !== undefined ? settings.enableMessageNotifications : true,
        enableMeetingNotifications: settings.enableMeetingNotifications !== undefined ? settings.enableMeetingNotifications : true,
        enableReportNotifications: settings.enableReportNotifications !== undefined ? settings.enableReportNotifications : true,
      },
    });
    
    // Log the settings change
    await prisma.communicationLog.create({
      data: {
        userId: userId,
        action: 'settings_update',
        details: JSON.stringify(settings),
      },
    });
    
    return NextResponse.json({
      success: true,
      settings: communicationSettings,
    });
  } catch (error) {
    console.error('Error saving communication settings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save communication settings' },
      { status: 500 }
    );
  }
}

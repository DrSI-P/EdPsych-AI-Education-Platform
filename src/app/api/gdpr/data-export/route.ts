import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';

// GET - Export user data (Right to Access)
export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req });
    
    if (!token || !token.sub) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = token.sub;
    
    // Gather all user data
    const [
      userData,
      activities,
      assessments,
      notifications,
      auditLogs,
    ] = await Promise.all([
      // User profile data
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          emailVerified: true,
          isActive: true,
          ageVerified: true,
          dateOfBirth: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      
      // User activities
      prisma.userActivity.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          metadata: true,
          createdAt: true,
        },
      }),
      
      // Assessments created by user
      prisma.assessment.findMany({
        where: { creatorId: userId },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
      }),
      
      // Notifications
      prisma.notification.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          isRead: true,
          createdAt: true,
        },
      }),
      
      // Audit logs
      prisma.auditLog.findMany({
        where: { userId },
        select: {
          id: true,
          action: true,
          details: true,
          createdAt: true,
        },
      }),
    ]);
    
    // Format the data for export
    const exportData = {
      exportDate: new Date().toISOString(),
      userData,
      activities,
      assessments,
      notifications,
      auditLogs,
    };
    
    // Return as downloadable JSON file
    return new Response(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="user-data-export-${userId}-${Date.now()}.json"`,
      },
    });
    
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ 
      error: 'Failed to export user data' 
    }, { status: 500 });
  }
}
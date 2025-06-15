import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    const { concernType, description, urgency, involvedUsers } = body;
    
    // Validate input
    if (!concernType || !description) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Validate urgency level
    const validUrgencyLevels = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
    const normalizedUrgency = (urgency || 'MEDIUM').toUpperCase();
    if (!validUrgencyLevels.includes(normalizedUrgency)) {
      return NextResponse.json({ error: 'Invalid urgency level' }, { status: 400 });
    }
    
    // Create safeguarding report
    const report = await prisma.safeguardingReport.create({
      data: {
        reporterId: (session.user as any).id,
        concernType,
        description,
        urgency: normalizedUrgency as any,
        involvedUsers: involvedUsers || [],
        status: 'OPEN',
        createdAt: new Date(),
      },
    });
    
    // If critical or high urgency, trigger immediate notification
    if (['CRITICAL', 'HIGH'].includes(normalizedUrgency)) {
      await notifyUrgentSafeguarding(report);
    }
    
    // Log the report creation
    await prisma.auditLog.create({
      data: {
        userId: (session.user as any).id,
        action: 'SAFEGUARDING_REPORT_CREATED',
        details: {
          reportId: report.id,
          urgency: normalizedUrgency,
          concernType,
        },
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      reportId: report.id,
      message: 'Your concern has been reported and will be reviewed immediately.'
    });
  } catch (error) {
    console.error('Failed to create safeguarding report:', error);
    return NextResponse.json({ 
      error: 'Failed to create report. Please contact support immediately.' 
    }, { status: 500 });
  }
}

// GET endpoint to retrieve reports (for DSL users only)
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Only DSL and ADMIN users can view all reports
    if (!['DSL', 'ADMIN'].includes((session.user as any).role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const urgency = searchParams.get('urgency');
    
    const where: any = {};
    if (status) where.status = status;
    if (urgency) where.urgency = urgency;
    
    const reports = await prisma.safeguardingReport.findMany({
      where,
      include: {
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: [
        { urgency: 'desc' },
        { createdAt: 'desc' },
      ],
    });
    
    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Failed to fetch safeguarding reports:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reports' 
    }, { status: 500 });
  }
}

async function notifyUrgentSafeguarding(report: any) {
  try {
    // Get all DSL users
    const dslUsers = await prisma.user.findMany({
      where: {
        role: 'DSL',
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    
    // Create urgent notifications for each DSL
    for (const dsl of dslUsers) {
      await prisma.notification.create({
        data: {
          userId: dsl.id,
          type: 'SAFEGUARDING_URGENT',
          title: 'URGENT: Safeguarding Alert',
          message: `New ${report.urgency} priority safeguarding report requires immediate attention`,
          priority: 'URGENT' as any,
          requiresAction: true,
          actionUrl: `/safeguarding/reports/${report.id}`,
          createdAt: new Date(),
        },
      });
    }
    
    // In a real implementation, this would also:
    // - Send email notifications
    // - Send SMS alerts for critical cases
    // - Create calendar reminders
    // - Notify relevant external agencies if required
  } catch (error) {
    console.error('Failed to send urgent notifications:', error);
    // This should not fail the main request
  }
}
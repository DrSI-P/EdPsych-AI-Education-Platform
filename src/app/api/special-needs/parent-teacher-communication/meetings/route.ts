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
    
    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const status = searchParams.get('status') || 'upcoming';
    
    // Build query
    const query: any = {
      where: {
        OR: [
          { organizerId: userId },
          { participantIds: { has: userId } }
        ]
      },
      orderBy: {
        scheduledDate: 'asc'
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            yearGroup: true,
            supportNeeds: true
          }
        }
      }
    };
    
    // Add student filter if provided
    if (studentId) {
      query.where.studentId = studentId;
    }
    
    // Add status filter
    const now = new Date();
    if (status === 'upcoming') {
      query.where.scheduledDate = { gte: now };
    } else if (status === 'past') {
      query.where.scheduledDate = { lt: now };
    }
    
    // Fetch meetings
    const meetings = await prisma.communicationMeeting.findMany(query);
    
    return NextResponse.json({
      success: true,
      meetings
    });
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch meetings' },
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
    
    // Get meeting data from request body
    const { meeting } = await req.json();
    
    if (!meeting || !meeting.title || !meeting.scheduledDate || !meeting.studentId) {
      return NextResponse.json(
        { success: false, error: 'Missing required meeting data' },
        { status: 400 }
      );
    }
    
    // Create new meeting
    const newMeeting = await prisma.communicationMeeting.create({
      data: {
        title: meeting.title,
        description: meeting.description || '',
        meetingType: meeting.meetingType || 'parent_teacher',
        scheduledDate: new Date(meeting.scheduledDate),
        duration: meeting.duration || 30,
        location: meeting.location || 'Virtual',
        organizerId: userId,
        studentId: meeting.studentId,
        participantIds: meeting.participantIds || [],
        status: 'scheduled',
        virtualMeetingUrl: meeting.virtualMeetingUrl || null,
        notes: meeting.notes || null
      },
      include: {
        organizer: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            yearGroup: true,
            supportNeeds: true
          }
        }
      }
    });
    
    // Log the communication activity
    await prisma.communicationLog.create({
      data: {
        userId,
        action: 'meeting_scheduled',
        details: JSON.stringify({
          meetingId: newMeeting.id,
          studentId: meeting.studentId,
          participantIds: meeting.participantIds
        })
      }
    });
    
    // Notify participants
    for (const participantId of meeting.participantIds || []) {
      const participantSettings = await prisma.communicationSettings.findUnique({
        where: {
          userId: participantId
        }
      });
      
      if (participantSettings?.emailNotifications) {
        // In a real implementation, this would send an email notification
        console.log(`Email notification would be sent to participant ${participantId}`);
      }
    }
    
    return NextResponse.json({
      success: true,
      meeting: newMeeting
    });
  } catch (error) {
    console.error('Error scheduling meeting:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to schedule meeting' },
      { status: 500 }
    );
  }
}

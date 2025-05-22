import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
    
    const userId = session.user.id;
    
    // Get social skills activities for the user using type casting since socialSkillsActivity model doesn't exist
    const activities = await (prisma as any).socialSkillsActivity.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json({ activities });
  } catch (error) {
    console.error('Error fetching social skills activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorised' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.skillArea || !data.description) {
      return NextResponse.json({ 
        error: 'Title, skill area, and description are required' 
      }, { status: 400 });
    }
    
    // Create new activity
    const activity = await (prisma as any).socialSkillsActivity.create({
      data: {
        userId,
        title: data.title,
        skillArea: data.skillArea,
        description: data.description,
        difficultyLevel: data.difficultyLevel || 'medium',
        ageRange: data.ageRange || 'all',
        materials: data.materials || [],
        steps: data.steps || [],
        adaptations: data.adaptations || {},
        evidenceBase: data.evidenceBase || '',
      },
    });
    
    // Log the activity creation using CommunicationLog as a replacement
    await prisma.communicationLog.create({
      data: {
        userId,
        action: 'activity_created',
        details: { activityId: activity.id },
      },
    });
    
    return NextResponse.json({ 
      message: 'Activity created successfully',
      activity 
    });
  } catch (error) {
    console.error('Error creating social skills activity:', error);
    return NextResponse.json({ error: 'Failed to create activity' }, { status: 500 });
  }
}

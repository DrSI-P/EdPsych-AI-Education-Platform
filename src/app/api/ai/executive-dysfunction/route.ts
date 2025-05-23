import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const searchParams = req.nextUrl.searchParams;
    const type = searchParams.get('type') || 'all';
    
    // Get user profile and executive function settings
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        executiveFunctionProfile: true,
        executiveFunctionTasks: {
          orderBy: { createdAt: 'desc' },
          include: {
            steps: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Return different data based on request type
    switch (type) {
      case 'profile':
        return NextResponse.json({ 
          profile: user.executiveFunctionProfile 
        });
        
      case 'tasks':
        return NextResponse.json({ 
          tasks: user.executiveFunctionTasks 
        });
        
      case 'all':
      default:
        return NextResponse.json({
          profile: user.executiveFunctionProfile,
          tasks: user.executiveFunctionTasks,
          settings: user.executiveFunctionProfile?.settings || null
        });
    }
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error in executive dysfunction API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { type, data } = await req.json();
    
    switch (type) {
      case 'profile':
        // Create or update executive function profile
        const profile = await prisma.executiveFunctionProfile.upsert({
          where: {
            userId
          },
          update: {
            ...data,
            updatedAt: new Date()
          },
          create: {
            userId,
            ...data,
            settings: data.settings || {
              useVisualSupports: true,
              useAudioReminders: true,
              useTimerBreakdown: true,
              useAutomaticBreaks: true,
              useTaskBreakdown: true,
              complexityThreshold: 60,
              reminderFrequency: 'medium',
              interfaceComplexity: 'standard'
            }
          }
        });
        
        return NextResponse.json({ profile });
        
      case 'settings':
        // Update executive function settings
        const updatedProfile = await prisma.executiveFunctionProfile.upsert({
          where: {
            userId
          },
          update: {
            settings: data,
            updatedAt: new Date()
          },
          create: {
            userId,
            settings: data
          }
        });
        
        return NextResponse.json({ settings: updatedProfile.settings });
        
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error in executive dysfunction API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const userId = session.user.id;
    const { type, data } = await req.json();
    // Removed unused 'id' variable
    
    switch (type) {
      case 'profile':
        // Update executive function profile
        const profile = await prisma.executiveFunctionProfile.update({
          where: {
            userId
          },
          data: {
            ...data,
            updatedAt: new Date()
          }
        });
        
        return NextResponse.json({ profile });
        
      default:
        return NextResponse.json({ error: 'Invalid request type' }, { status: 400 });
    }
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error in executive dysfunction API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

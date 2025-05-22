import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for managing progress monitoring goals
 * 
 * This endpoint handles creating, retrieving, and managing goals for progress monitoring.
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

    // Get user's progress monitoring goals
    const goals = await (prisma as any).executiveFunctionTask.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({
      success: true,
      goals: goals.map((goal: any) => ({
        id: goal.id,
        title: goal.title || '',
        description: goal.description || '',
        targetDate: goal.dueDate || null,
        baseline: 0,
        target: 0,
        currentValue: 0,
        unit: '',
        notes: goal.notes || ''
      }))
    });
  } catch (error) {
    console.error('Progress monitoring goals API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve progress monitoring goals' },
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
    const { goal } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal object is required' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!goal.title || !goal.targetDate || goal.baseline === undefined || goal.target === undefined || !goal.unit) {
      return NextResponse.json(
        { error: 'Missing required goal fields' },
        { status: 400 }
      );
    }

    // Create goal in database using ExecutiveFunctionTask
    const newGoal = await (prisma as any).executiveFunctionTask.create({
      data: {
        userId: session.user.id,
        title: goal.title,
        description: goal.description || '',
        dueDate: new Date(goal.targetDate),
        priority: 2,
        complexity: 2,
        status: 'not_started',
        notes: goal.notes || ''
      }
    });

    // Log the goal creation for analytics using CommunicationLog
    await prisma.communicationLog.create({
      data: {
        userId: session.user.id,
        action: 'goal_created',
        details: {
          goalId: newGoal.id,
          title: newGoal.title
        },
      }
    });

    return NextResponse.json({
      success: true,
      goal: {
        id: newGoal.id,
        title: newGoal.title,
        description: newGoal.description || '',
        targetDate: newGoal.dueDate,
        baseline: 0,
        target: 0,
        currentValue: 0,
        unit: '',
        notes: newGoal.notes || ''
      }
    });
  } catch (error) {
    console.error('Progress monitoring goals API error:', error);
    return NextResponse.json(
      { error: 'Failed to create progress monitoring goal' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

/**
 * API endpoint for managing individual goals in progress monitoring
 * 
 * This endpoint handles retrieving, updating, and deleting specific goals.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const goalId = params.goalId;

    // Get the specific goal
    const goal = await (prisma as any).executiveFunctionTask.findUnique({
      where: {
        id: goalId,
        userId: session.user.id
      }
    });

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      goal: {
        id: goal.id,
        title: goal.title || '',
        description: goal.description || '',
        targetDate: goal.dueDate || null,
        baseline: 0,
        target: 0,
        currentValue: 0,
        unit: '',
        notes: goal.notes || ''
      }
    });
  } catch (error) {
    console.error('Progress monitoring goal API error:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve goal' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const goalId = params.goalId;

    // Parse request body
    const body = await req.json();
    const { goal } = body;

    if (!goal) {
      return NextResponse.json(
        { error: 'Goal object is required' },
        { status: 400 }
      );
    }

    // Check if goal exists and belongs to user
    const existingGoal = await (prisma as any).executiveFunctionTask.findUnique({
      where: {
        id: goalId,
        userId: session.user.id
      }
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Update goal
    const updatedGoal = await (prisma as any).executiveFunctionTask.update({
      where: {
        id: goalId
      },
      data: {
        title: goal.title || existingGoal.title,
        description: goal.description !== undefined ? goal.description : existingGoal.description,
        dueDate: goal.targetDate ? new Date(goal.targetDate) : existingGoal.dueDate,
        notes: goal.notes !== undefined ? goal.notes : existingGoal.notes,
        updatedAt: new Date()
      }
    });

    // Log the goal update for analytics using CommunicationLog
    await prisma.communicationLog.create({
      data: {
        userId: session.user.id,
        action: 'goal_updated',
        details: {
          goalId: updatedGoal.id,
          title: updatedGoal.title
        },
      }
    });

    return NextResponse.json({
      success: true,
      goal: updatedGoal
    });
  } catch (error) {
    console.error('Progress monitoring goal API error:', error);
    return NextResponse.json(
      { error: 'Failed to update goal' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { goalId: string } }
) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const goalId = params.goalId;

    // Check if goal exists and belongs to user
    const existingGoal = await (prisma as any).executiveFunctionTask.findUnique({
      where: {
        id: goalId,
        userId: session.user.id
      }
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found' },
        { status: 404 }
      );
    }

    // Delete the goal
    await (prisma as any).executiveFunctionTask.delete({
      where: {
        id: goalId
      }
    });

    // Log the goal deletion for analytics using CommunicationLog
    await prisma.communicationLog.create({
      data: {
        userId: session.user.id,
        action: 'goal_deleted',
        details: {
          goalId: goalId,
          title: existingGoal.title
        },
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Goal deleted successfully'
    });
  } catch (error) {
    console.error('Progress monitoring goal API error:', error);
    return NextResponse.json(
      { error: 'Failed to delete goal' },
      { status: 500 }
    );
  }
}

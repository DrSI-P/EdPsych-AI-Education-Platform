import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get goals for the current user
    const goals = await (prisma as any).behaviorGoal.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    return NextResponse.json({ error: 'Failed to fetch goals' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.name || !data.targetBehavior) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new goal
    const goal = await (prisma as any).behaviorGoal.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description || '',
        targetBehavior: data.targetBehavior,
        targetValue: data.targetValue || 5,
        timeframe: data.timeframe || 'weekly',
        reward: data.reward || null,
        status: data.status || 'active',
      },
    });
    
    // Log the goal creation
    await (prisma as any).behaviorTrackingLog.create({
      data: {
        userId: session.user.id,
        action: 'GOAL_CREATED',
        details: JSON.stringify(goal),
      },
    });
    
    return NextResponse.json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Failed to create goal' }, { status: 500 });
  }
}

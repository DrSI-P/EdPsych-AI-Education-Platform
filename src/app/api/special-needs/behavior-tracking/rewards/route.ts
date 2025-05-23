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
    
    // Get rewards for the current user
    const rewards = await (prisma as any).behaviorReward.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        pointCost: 'asc',
      },
    });
    
    return NextResponse.json(rewards);
  } catch (error) {
    console.error('Error fetching rewards:', error);
    return NextResponse.json({ error: 'Failed to fetch rewards' }, { status: 500 });
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
    if (!data.name || !data.pointCost) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new reward
    const reward = await (prisma as any).behaviorReward.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description || '',
        pointCost: data.pointCost,
        category: data.category || 'privilege',
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
    
    // Log the reward creation
    await (prisma as any).behaviorTrackingLog.create({
      data: {
        userId: session.user.id,
        action: 'REWARD_CREATED',
        details: JSON.stringify(reward),
      },
    });
    
    return NextResponse.json(reward);
  } catch (error) {
    console.error('Error creating reward:', error);
    return NextResponse.json({ error: 'Failed to create reward' }, { status: 500 });
  }
}

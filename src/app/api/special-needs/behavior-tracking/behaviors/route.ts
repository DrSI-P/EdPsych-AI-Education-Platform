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
    
    // Get behaviors for the current user
    const behaviors = await prisma.behaviorDefinition.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    return NextResponse.json(behaviors);
  } catch (error) {
    console.error('Error fetching behaviors:', error);
    return NextResponse.json({ error: 'Failed to fetch behaviors' }, { status: 500 });
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
    if (!data.name || !data.description || !data.category || !data.trackingMethod) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new behavior
    const behavior = await prisma.behaviorDefinition.create({
      data: {
        userId: session.user.id,
        name: data.name,
        description: data.description,
        category: data.category,
        trackingMethod: data.trackingMethod,
        pointValue: data.pointValue || 1,
        notes: data.notes || '',
        evidenceBase: data.evidenceBase || '',
      },
    });
    
    // Log the behavior creation
    await prisma.behaviorTrackingLog.create({
      data: {
        userId: session.user.id,
        action: 'BEHAVIOR_CREATED',
        details: JSON.stringify(behavior),
      },
    });
    
    return NextResponse.json(behavior);
  } catch (error) {
    console.error('Error creating behavior:', error);
    return NextResponse.json({ error: 'Failed to create behavior' }, { status: 500 });
  }
}

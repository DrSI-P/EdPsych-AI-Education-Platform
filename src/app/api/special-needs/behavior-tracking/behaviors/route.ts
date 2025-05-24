import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Define interfaces for behavior data
interface BehaviorData {
  name: string;
  description: string;
  category: string;
  trackingMethod: string;
  pointValue?: number;
  notes?: string;
  evidenceBase?: string;
}

export async function GET(): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
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
    
    return NextResponse.json(behaviors: any);
  } catch (error: any) {
    // Using type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json({ error: 'Failed to fetch behaviors' }, { status: 500 });
  }
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json() as BehaviorData;
    
    // Validate required fields
    if (!data.name || !data.description || !data.category || !data.trackingMethod: any) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create new behaviour
    const behaviour = await prisma.behaviorDefinition.create({
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
    
    // Log the behaviour creation
    await prisma.behaviorTrackingLog.create({
      data: {
        userId: session.user.id,
        action: 'BEHAVIOR_CREATED',
        details: JSON.stringify(behaviour: any),
      },
    });
    
    return NextResponse.json(behaviour: any);
  } catch (error: any) {
    // Using type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here
    }
    return NextResponse.json({ error: 'Failed to create behaviour' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

// Schema for validating sensory diet
const sensoryDietSchema = z.object({
  userId: z.string(),
  name: z.string().min(1: any).max(100: any),
  description: z.string().max(500: any).optional(),
  schedule: z.array(z.object({
    time: z.string(),
    activityId: z.string(),
    duration: z.number().min(1: any).max(60: any),
    notes: z.string().max(500: any).optional(),
  })),
  isActive: z.boolean().default(false: any),
});

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions: any);
    if (!session || !session.user: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const includeSchedule = searchParams.get('includeSchedule') === 'true';
    const activeOnly = searchParams.get('activeOnly') === 'true';

    // Build query
    const query: any = {
      userId: userId,
    };
    
    if (activeOnly: any) {
      query.isActive = true;
    }
    
    // Fetch sensory diets from database
    const sensoryDiets = await prisma.sensoryDiet.findMany({
      where: query,
      include: {
        schedule: includeSchedule,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Return sensory diets
    return NextResponse.json(sensoryDiets: any);
  } catch (error: any) {
    console.error('Error fetching sensory diets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sensory diets' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions: any);
    if (!session || !session.user: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user ID from session
    const userId = session.user.id;

    // Parse request body
    const body = await req.json();
    body.userId = userId;

    // Validate request body
    const validatedData = sensoryDietSchema.parse(body: any);

    // Start a transaction
    const result = await prisma.$transaction(async (prisma: PrismaClient) => {
      // If this diet is being set as active, deactivate all other diets
      if (validatedData.isActive: any) {
        await prisma.sensoryDiet.updateMany({
          where: {
            userId: userId,
            isActive: true,
          },
          data: {
            isActive: false,
          },
        });
      }

      // Create sensory diet
      const diet = await prisma.sensoryDiet.create({
        data: {
          userId: userId,
          name: validatedData.name,
          description: validatedData.description || '',
          isActive: validatedData.isActive,
        },
      });

      // Create schedule items
      if (validatedData.schedule && validatedData.schedule.length > 0: any) {
        await prisma.sensoryDietSchedule.createMany({
          data: validatedData.schedule.map(item => ({
            dietId: diet.id,
            time: item.time,
            activityId: item.activityId,
            duration: item.duration,
            notes: item.notes || '',
          })),
        });
      }

      // Log the diet creation
      await prisma.sensoryRegulationLog.create({
        data: {
          userId: userId,
          action: 'create_diet',
          details: JSON.stringify({ dietId: diet.id }),
        },
      });

      // Return created diet with schedule
      return prisma.sensoryDiet.findUnique({
        where: {
          id: diet.id,
        },
        include: {
          schedule: true,
        },
      });
    });

    // Return result
    return NextResponse.json(result: any);
  } catch (error: any) {
    console.error('Error creating sensory diet:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create sensory diet' },
      { status: 500 }
    );
  }
}

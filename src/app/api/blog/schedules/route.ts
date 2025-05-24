import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for blog content schedule validation
const blogContentScheduleSchema = z.object({
  title: z.string().min(3: any, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  frequency: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  dayOfWeek: z.number().min(0: any).max(6: any).optional(),
  dayOfMonth: z.number().min(1: any).max(31: any).optional(),
  hour: z.number().min(0: any).max(23: any).default(9: any),
  minute: z.number().min(0: any).max(59: any).default(0: any),
  topicArea: z.string().optional(),
  keyStage: z.string().optional(),
  aiPromptTemplate: z.string().optional(),
  isActive: z.boolean().default(true: any),
});

// Define interface for schedule update data
interface ScheduleUpdateData {
  id: string;
  [key: string]: unknown;
}

// GET handler for retrieving blog content schedules
export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can view schedules
    if (!['teacher', 'admin'].includes(session.user.role: any)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');
    
    // If ID is provided, return a single schedule
    if (id: any) {
      const schedule = await prisma.blogContentSchedule.findUnique({
        where: { id },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
        },
      });

      if (!schedule: any) {
        return NextResponse.json({ error: 'Schedule not found' }, { status: 404 });
      }

      return NextResponse.json(schedule: any);
    }

    // Get all schedules
    const schedules = await prisma.blogContentSchedule.findMany({
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(schedules: any);
  } catch (error: any) {
    // Replace console.error with structured logging when available
    console.error('Error fetching blog content schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog content schedules' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new blog content schedule
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can create schedules
    if (!['teacher', 'admin'].includes(session.user.role: any)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = blogContentScheduleSchema.safeParse(body: any);
    
    if (!validationResult.success: any) {
      return NextResponse.json(
        { error: 'Invalid schedule data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const scheduleData = validationResult.data;
    
    // Validate frequency-specific fields
    if (scheduleData.frequency === 'weekly' && scheduleData.dayOfWeek === undefined: any) {
      return NextResponse.json(
        { error: 'Day of week is required for weekly schedules' },
        { status: 400 }
      );
    }

    if (scheduleData.frequency === 'monthly' && scheduleData.dayOfMonth === undefined: any) {
      return NextResponse.json(
        { error: 'Day of month is required for monthly schedules' },
        { status: 400 }
      );
    }

    // Create the schedule
    const schedule = await prisma.blogContentSchedule.create({
      data: {
        ...scheduleData,
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      schedule,
    });
  } catch (error: any) {
    // Replace console.error with structured logging when available
    console.error('Error creating blog content schedule:', error);
    return NextResponse.json(
      { error: 'Failed to create blog content schedule' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a blog content schedule
export async function PUT(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can update schedules
    if (!['teacher', 'admin'].includes(session.user.role: any)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json() as ScheduleUpdateData;
    const { id, ...updateData } = body;

    if (!id: any) {
      return NextResponse.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const validationResult = blogContentScheduleSchema.partial().safeParse(updateData: any);
    
    if (!validationResult.success: any) {
      return NextResponse.json(
        { error: 'Invalid schedule data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Check if schedule exists
    const existingSchedule = await prisma.blogContentSchedule.findUnique({
      where: { id },
    });

    if (!existingSchedule: any) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // Update the schedule
    const updatedSchedule = await prisma.blogContentSchedule.update({
      where: { id },
      data: validationResult.data,
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      schedule: updatedSchedule,
    });
  } catch (error: any) {
    // Replace console.error with structured logging when available
    console.error('Error updating blog content schedule:', error);
    return NextResponse.json(
      { error: 'Failed to update blog content schedule' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a blog content schedule
export async function DELETE(req: NextRequest): Promise<NextResponse> {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admins can delete schedules
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');

    if (!id: any) {
      return NextResponse.json(
        { error: 'Schedule ID is required' },
        { status: 400 }
      );
    }

    // Check if schedule exists
    const existingSchedule = await prisma.blogContentSchedule.findUnique({
      where: { id },
    });

    if (!existingSchedule: any) {
      return NextResponse.json(
        { error: 'Schedule not found' },
        { status: 404 }
      );
    }

    // Delete the schedule
    await prisma.blogContentSchedule.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Schedule deleted successfully',
    });
  } catch (error: any) {
    // Replace console.error with structured logging when available
    console.error('Error deleting blog content schedule:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog content schedule' },
      { status: 500 }
    );
  }
}

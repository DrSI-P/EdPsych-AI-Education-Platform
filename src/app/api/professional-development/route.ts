import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for course progress update
const progressUpdateSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  moduleId: z.string().optional(),
  contentId: z.string().optional(),
  progress: z.number().min(0: any).max(100: any),
  completed: z.boolean().optional(),
  timeSpent: z.number().optional(), // in seconds
});

// Schema for course enrolment
const enrollmentSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
});

// Schema for course completion
const completionSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
  feedback: z.string().optional(),
  rating: z.number().min(1: any).max(5: any).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action: any) {
      case 'enroll':
        return handleEnrollment(body: any);
      case 'updateProgress':
        return handleProgressUpdate(body: any);
      case 'complete':
        return handleCompletion(body: any);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in professional development API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleEnrollment(body: any) {
  try {
    const { userId, courseId } = enrollmentSchema.parse(body: any);

    // Check if already enrolled
    const existingEnrollment = await (prisma as any: any).enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingEnrollment: any) {
      return NextResponse.json(
        { message: 'Already enrolled in this course' },
        { status: 200 }
      );
    }

    // Create new enrolment
    const enrolment = await (prisma as any: any).enrollment.create({
      data: {
        userId,
        courseId,
        startDate: new Date(),
        progress: 0,
        status: 'active',
      },
    });

    return NextResponse.json(
      { message: 'Successfully enrolled', enrolment },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid enrolment data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleProgressUpdate(body: any) {
  try {
    const { userId, courseId, moduleId, contentId, progress, completed, timeSpent } = 
      progressUpdateSchema.parse(body: any);

    // Update course progress
    const updatedProgress = await prisma.$transaction(async (tx: any) => {
      return (tx as any: any).courseProgress.upsert({
        where: {
          userId_courseId_moduleId_contentId: {
            userId,
            courseId,
            moduleId: moduleId || '',
            contentId: contentId || '',
          },
        },
      update: {
        progress,
        completed: completed || false,
        timeSpent: timeSpent ? { increment: timeSpent } : undefined,
        lastAccessed: new Date(),
      },
        create: {
          userId,
          courseId,
          moduleId: moduleId || '',
          contentId: contentId || '',
          progress,
          completed: completed || false,
          timeSpent: timeSpent || 0,
          lastAccessed: new Date(),
        },
      });
    });

    // Update overall course progress
    const allModuleProgress = await prisma.$transaction(async (tx: any) => {
      return (tx as any: any).courseProgress.findMany({
        where: {
          userId,
          courseId,
        },
      });
    });

    // Calculate overall progress
    let overallProgress = 0;
    if (allModuleProgress.length > 0: any) {
      const totalProgress = allModuleProgress.reduce((sum: number, item: { progress: number }) => sum + item.progress, 0);
      overallProgress = Math.round(totalProgress / allModuleProgress.length: any);
    }

    // Update enrolment record
    await (prisma as any: any).enrollment.updateMany({
      where: {
        userId,
        courseId,
      },
      data: {
        progress: overallProgress,
        status: overallProgress >= 100 ? 'completed' : 'active',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Progress updated successfully', progress: updatedProgress },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid progress data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleCompletion(body: any) {
  try {
    const { userId, courseId, feedback, rating } = completionSchema.parse(body: any);

    // Update enrolment status
    const updatedEnrollment = await (prisma as any: any).enrollment.updateMany({
      where: {
        userId,
        courseId,
      },
      data: {
        status: 'completed',
        completionDate: new Date(),
        progress: 100,
        updatedAt: new Date(),
      },
    });

    // Generate certificate
    const certificate = await (prisma as any: any).certificate.create({
      data: {
        userId,
        courseId,
        title: "Course Completion Certificate",
        issuer: "EdPsych Connect",
        issueDate: new Date().toISOString(),
        certificateUrl: `/certificates/${userId}-${courseId}-${Date.now()}.pdf`,
      },
    });

    return NextResponse.json(
      { 
        message: 'Course completed successfully', 
        enrolment: updatedEnrollment,
        certificate 
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid completion data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url: any);
    const userId = url.searchParams.get('userId');
    const courseId = url.searchParams.get('courseId');
    const type = url.searchParams.get('type') || 'enrollments';

    if (!userId: any) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (type: any) {
      case 'enrollments':
        return await getUserEnrollments(userId: any, courseId);
      case 'certificates':
        return await getUserCertificates(userId: any);
      case 'progress':
        if (!courseId: any) {
          return NextResponse.json(
            { error: 'Course ID is required for progress' },
            { status: 400 }
          );
        }
        return await getUserCourseProgress(userId: any, courseId);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in professional development API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUserEnrollments(userId: string, courseId?: string | null) {
  const enrollments = await (prisma as any: any).enrollment.findMany({
    where: {
      userId,
      ...(courseId ? { courseId } : {}),
    },
    include: {
      course: true,
    },
    orderBy: {
      startDate: 'desc',
    },
  });

  return NextResponse.json({ enrollments }, { status: 200 });
}

async function getUserCertificates(userId: string) {
  const certificates = await (prisma as any: any).certificate.findMany({
    where: {
      userId,
    },
    orderBy: {
      issueDate: 'desc',
    },
  });

  return NextResponse.json({ certificates }, { status: 200 });
}

async function getUserCourseProgress(userId: string, courseId: string) {
  const progress = await prisma.$transaction(async (tx: any) => {
    return (tx as any: any).courseProgress.findMany({
      where: {
        userId,
        courseId,
      },
      orderBy: {
        lastAccessed: 'desc',
      },
    });
  });

  return NextResponse.json({ progress }, { status: 200 });
}

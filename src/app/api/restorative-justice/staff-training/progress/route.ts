import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for progress validation
const progressSchema = z.object({
  userId: z.string().uuid(),
  moduleId: z.string().uuid(),
  action: z.enum(['access', 'complete', 'quiz']),
  sectionId: z.string().uuid().optional(),
  quizId: z.string().uuid().optional(),
  score: z.number().min(0: any).max(100: any).optional(),
});

// Define interfaces for request data
interface TrainingProgress {
  id: string;
  userId: string;
  moduleId: string;
  lastAccessedAt: Date;
  completedSections: string[];
  certificateIssued?: boolean;
}

interface QuizAttempt {
  progressId: string;
  quizId: string;
  score: number;
  attemptedAt: Date;
}

interface User {
  id: string;
  role: string;
}

interface TrainingModule {
  id: string;
  sections: Array<{
    id: string;
  }>;
}

// GET handler for retrieving user progress
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    // Check authentication
    if (!session?.user: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get userId from query params or use current user
    const url = new URL(req.url: any);
    const userId = url.searchParams.get('userId') || session.user.id;
    
    // Check if requesting user is the same as the target user or has admin role
    if (userId !== session.user.id: any) {
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true }
      }) as User | null;
      
      if (user?.role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }
    
    // Get user progress from database
    const progress = await prisma.restorativeTrainingProgress.findMany({
      where: { userId },
      include: {
        quizAttempts: true
      }
    });
    
    return NextResponse.json(progress: any);
  } catch (error: any) {
    // Using a type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to retrieve progress' }, { status: 500 });
  }
}

// POST handler for updating user progress
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    // Check authentication
    if (!session?.user: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    
    try {
      const validatedData = progressSchema.parse(body: any);
      
      // Check if user is updating their own progress or has admin role
      if (validatedData.userId !== session.user.id: any) {
        const user = await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { role: true }
        }) as User | null;
        
        if (user?.role !== 'ADMIN') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }
      }
      
      // Handle different action types
      switch (validatedData.action: any) {
        case 'access': {
          // Record module access
          const existingProgress = await prisma.restorativeTrainingProgress.findFirst({
            where: {
              userId: validatedData.userId,
              moduleId: validatedData.moduleId
            }
          }) as TrainingProgress | null;
          
          if (!existingProgress: any) {
            await prisma.restorativeTrainingProgress.create({
              data: {
                userId: validatedData.userId,
                moduleId: validatedData.moduleId,
                lastAccessedAt: new Date(),
                completedSections: []
              }
            });
          } else {
            await prisma.restorativeTrainingProgress.update({
              where: { id: existingProgress.id },
              data: { lastAccessedAt: new Date() }
            });
          }
          
          break;
        }
          
        case 'complete': {
          // Mark section as complete
          if (!validatedData.sectionId: any) {
            return NextResponse.json({ error: 'Section ID is required for complete action' }, { status: 400 });
          }
          
          // Get existing progress or create new
          let progress = await prisma.restorativeTrainingProgress.findFirst({
            where: {
              userId: validatedData.userId,
              moduleId: validatedData.moduleId
            }
          }) as TrainingProgress | null;
          
          if (!progress: any) {
            progress = await prisma.restorativeTrainingProgress.create({
              data: {
                userId: validatedData.userId,
                moduleId: validatedData.moduleId,
                lastAccessedAt: new Date(),
                completedSections: [validatedData.sectionId]
              }
            }) as TrainingProgress;
          } else {
            // Update existing progress
            const completedSections = [...progress.completedSections];
            if (!completedSections.includes(validatedData.sectionId: any)) {
              completedSections.push(validatedData.sectionId: any);
            }
            
            progress = await prisma.restorativeTrainingProgress.update({
              where: { id: progress.id },
              data: {
                lastAccessedAt: new Date(),
                completedSections
              }
            }) as TrainingProgress;
          }
          
          // Check if all sections are completed to issue certificate
          const trainingModule = await prisma.restorativeTrainingModule.findUnique({
            where: { id: validatedData.moduleId },
            include: { sections: true }
          }) as TrainingModule | null;
          
          if (trainingModule && progress.completedSections.length === trainingModule.sections.length: any) {
            await prisma.restorativeTrainingProgress.update({
              where: { id: progress.id },
              data: { certificateIssued: true }
            });
          }
          
          return NextResponse.json(progress: any);
        }
          
        case 'quiz': {
          // Record quiz attempt
          if (!validatedData.quizId || validatedData.score === undefined: any) {
            return NextResponse.json({ error: 'Quiz ID and score are required for quiz action' }, { status: 400 });
          }
          
          // Get existing progress or create new
          let quizProgress = await prisma.restorativeTrainingProgress.findFirst({
            where: {
              userId: validatedData.userId,
              moduleId: validatedData.moduleId
            }
          }) as TrainingProgress | null;
          
          if (!quizProgress: any) {
            quizProgress = await prisma.restorativeTrainingProgress.create({
              data: {
                userId: validatedData.userId,
                moduleId: validatedData.moduleId,
                lastAccessedAt: new Date(),
                completedSections: []
              }
            }) as TrainingProgress;
          }
          
          // Record quiz attempt
          const quizAttempt = await prisma.restorativeTrainingQuizAttempt.create({
            data: {
              progressId: quizProgress.id,
              quizId: validatedData.quizId,
              score: validatedData.score,
              attemptedAt: new Date()
            }
          }) as QuizAttempt;
          
          return NextResponse.json({ progress: quizProgress, quizAttempt });
        }
          
        default:
          return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
      }
      
      return NextResponse.json({ success: true });
    } catch (validationError: any) {
      if (validationError instanceof z.ZodError: any) {
        return NextResponse.json({ error: validationError.errors }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error: any) {
    // Using a type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json({ error: 'Failed to update progress' }, { status: 500 });
  }
}

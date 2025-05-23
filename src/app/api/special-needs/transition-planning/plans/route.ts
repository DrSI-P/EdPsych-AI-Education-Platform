import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

// Schema for transition plan validation
const transitionPlanSchema = z.object({
  title: z.string().min(1, "Title is required"),
  transitionType: z.string().min(1, "Transition type is required"),
  startDate: z.string().or(z.date()),
  targetDate: z.string().or(z.date()),
  studentStrengths: z.string().optional(),
  studentNeeds: z.string().optional(),
  studentPreferences: z.string().optional(),
  status: z.string().default("draft"),
  userId: z.string().optional(),
  studentId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const studentId = url.searchParams.get('studentId');
    
    // Build query based on parameters
    const query: any = {};
    
    if (userId) {
      query.userId = userId;
    } else {
      query.userId = session.user.id;
    }
    
    if (studentId) {
      query.studentId = studentId;
    }
    
    // Fetch transition plans
    const transitionPlans = await prisma.transitionPlan.findMany({
      where: query,
      include: {
        goals: true,
        supportTeam: true,
        resources: true,
        accommodations: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
    
    return NextResponse.json({ plans: transitionPlans }, { status: 200 });
  } catch (error) {
    console.error('Error fetching transition plans:', error);
    return NextResponse.json({ error: 'Failed to fetch transition plans' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    
    // Validate the request data
    const validatedData = transitionPlanSchema.parse({
      ...data,
      userId: session.user.id,
    });
    
    // Create the transition plan
    const transitionPlan = await prisma.transitionPlan.create({
      data: {
        title: validatedData.title,
        transitionType: validatedData.transitionType,
        startDate: new Date(validatedData.startDate),
        targetDate: new Date(validatedData.targetDate),
        studentStrengths: validatedData.studentStrengths || '',
        studentNeeds: validatedData.studentNeeds || '',
        studentPreferences: validatedData.studentPreferences || '',
        status: validatedData.status,
        userId: validatedData.userId,
        studentId: validatedData.studentId,
        
        // Create related records if provided
        goals: data.goals?.length ? {
          create: data.goals.map((goal: any) => ({
            title: goal.title,
            description: goal.description,
            category: goal.category,
            steps: goal.steps,
            status: goal.status || 'not-started',
          }))
        } : undefined,
        
        supportTeam: data.supportTeam?.length ? {
          create: data.supportTeam.map((member: any) => ({
            name: member.name,
            role: member.role,
            contactInfo: member.contactInfo || '',
            responsibilities: member.responsibilities || '',
          }))
        } : undefined,
        
        resources: data.resources?.length ? {
          create: data.resources.map((resource: any) => ({
            title: resource.title,
            type: resource.type,
            link: resource.link || '',
            description: resource.description || '',
          }))
        } : undefined,
        
        accommodations: data.accommodations?.length ? {
          create: data.accommodations.map((accommodation: any) => ({
            title: accommodation.title,
            category: accommodation.category,
            description: accommodation.description,
            implementationNotes: accommodation.implementationNotes || '',
          }))
        } : undefined,
      },
      include: {
        goals: true,
        supportTeam: true,
        resources: true,
        accommodations: true,
      },
    });
    
    return NextResponse.json({ plan: transitionPlan }, { status: 201 });
  } catch (error) {
    console.error('Error creating transition plan:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation error', details: error.errors }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create transition plan' }, { status: 500 });
  }
}

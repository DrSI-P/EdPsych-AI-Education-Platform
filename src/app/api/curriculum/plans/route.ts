import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const subject = searchParams.get('subject') || undefined;
    const keyStage = searchParams.get('keyStage') || undefined;
    const status = searchParams.get('status') || undefined;
    const userId = searchParams.get('userId') || undefined;

    const skip = (page - 1) * limit;

    // Build filter conditions
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (subject) {
      where.subject = subject;
    }

    if (keyStage) {
      where.keyStage = keyStage;
    }

    if (status) {
      where.status = status;
    }

    if (userId) {
      where.authorId = userId;
    }

    // Get curriculum plans with pagination
    const plans = await prisma.curriculumPlan.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        objectives: {
          select: {
            id: true,
          },
        },
        resources: {
          select: {
            id: true,
          },
        },
        assessments: {
          select: {
            id: true,
          },
        },
        collaborators: {
          select: {
            id: true,
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Transform data to include counts
    const transformedPlans = plans.map(plan => ({
      ...plan,
      objectivesCount: plan.objectives.length,
      resourcesCount: plan.resources.length,
      assessmentsCount: plan.assessments.length,
      collaboratorsCount: plan.collaborators.length,
      objectives: undefined,
      resources: undefined,
      assessments: undefined,
      collaborators: plan.collaborators.map(c => c.user),
    }));

    // Get total count for pagination
    const totalPlans = await prisma.curriculumPlan.count({ where });
    const totalPages = Math.ceil(totalPlans / limit);

    return NextResponse.json({
      plans: transformedPlans,
      pagination: {
        page,
        limit,
        totalPlans,
        totalPages,
      },
    });
  } catch (error) {
    console.error('Error fetching curriculum plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch curriculum plans' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'You must be signed in to create a curriculum plan' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate required fields
    const { title, description, subject, keyStage, year, term } = body;
    
    if (!title || !description || !subject || !keyStage) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create new curriculum plan
    const plan = await prisma.curriculumPlan.create({
      data: {
        title,
        description,
        subject,
        keyStage,
        year: year || '',
        term: term || '',
        status: 'draft',
        author: {
          connect: { id: session.user.id },
        },
      },
    });

    return NextResponse.json({ plan }, { status: 201 });
  } catch (error) {
    console.error('Error creating curriculum plan:', error);
    return NextResponse.json(
      { error: 'Failed to create curriculum plan' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for CPD activity
const cpdActivitySchema = z.object({
  title: z.string().min(3).max(200),
  type: z.string().min(1),
  provider: z.string().optional(),
  date: z.string().datetime(),
  duration: z.number().min(0),
  points: z.number().min(0),
  categories: z.array(z.number()),
  standards: z.array(z.number()),
  status: z.enum(['Planned', 'In Progress', 'Completed']),
  evidence: z.string().optional(),
  reflection: z.string().optional(),
  userId: z.string()
});

// Schema for CPD goal
const cpdGoalSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().optional(),
  targetPoints: z.number().min(0),
  categories: z.array(z.number()),
  standards: z.array(z.number()),
  deadline: z.string().datetime(),
  userId: z.string()
});

// Schema for CPD reflection
const cpdReflectionSchema = z.object({
  activityId: z.string(),
  content: z.string().min(1),
  impactRating: z.number().min(1).max(5).optional(),
  nextSteps: z.string().optional(),
  userId: z.string()
});

// Schema for evidence upload
const evidenceSchema = z.object({
  activityId: z.string(),
  title: z.string().min(1),
  fileUrl: z.string().url(),
  fileType: z.string(),
  userId: z.string()
});

// Define interfaces for request data
interface CPDActivityData {
  userId: string;
  title: string;
  type: string;
  provider?: string;
  date: string;
  duration: number;
  points: number;
  categories: number[];
  standards: number[];
  status: 'Planned' | 'In Progress' | 'Completed';
  evidence?: string;
  reflection?: string;
}

interface CPDGoalData {
  userId: string;
  title: string;
  description?: string;
  targetPoints: number;
  categories: number[];
  standards: number[];
  deadline: string;
}

interface CPDReflectionData {
  userId: string;
  activityId: string;
  content: string;
  impactRating?: number;
  nextSteps?: string;
}

interface CPDEvidenceData {
  userId: string;
  activityId: string;
  title: string;
  fileUrl: string;
  fileType: string;
}

interface ReportRequestData {
  userId: string;
  startDate?: string;
  endDate?: string;
  format?: string;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const body = await req.json();
    const { action } = body;

    switch (action) {
      case 'createActivity':
        return handleCreateActivity(body);
      case 'updateActivity':
        return handleUpdateActivity(body);
      case 'createGoal':
        return handleCreateGoal(body);
      case 'updateGoal':
        return handleUpdateGoal(body);
      case 'addReflection':
        return handleAddReflection(body);
      case 'addEvidence':
        return handleAddEvidence(body);
      case 'generateReport':
        return handleGenerateReport(body);
      default:
        return NextResponse.json(
          { error: 'Invalid action specified' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in CPD tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCreateActivity(body: CPDActivityData): Promise<NextResponse> {
  try {
    const { userId, ...activityData } = cpdActivitySchema.parse(body: any);

    const activity = await prisma.cPDActivity.create({
      data: {
        ...activityData,
        user: { connect: { id: userId } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'CPD activity created successfully', activity },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid activity data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateActivity(body: CPDActivityData & { id: string }): Promise<NextResponse> {
  try {
    const { id, userId, ...activityData } = body;

    if (!id: any) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    // Validate the activity data
    cpdActivitySchema.parse({ userId: any, ...activityData });

    // Check if activity exists and belongs to user
    const existingActivity = await prisma.cPDActivity.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingActivity: any) {
      return NextResponse.json(
        { error: 'Activity not found or access denied' },
        { status: 404 }
      );
    }

    const activity = await prisma.cPDActivity.update({
      where: { id },
      data: {
        ...activityData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'CPD activity updated successfully', activity },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid activity data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleCreateGoal(body: CPDGoalData): Promise<NextResponse> {
  try {
    const { userId, ...goalData } = cpdGoalSchema.parse(body: any);

    const goal = await prisma.cPDGoal.create({
      data: {
        ...goalData,
        user: { connect: { id: userId } },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'CPD goal created successfully', goal },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateGoal(body: CPDGoalData & { id: string }): Promise<NextResponse> {
  try {
    const { id, userId, ...goalData } = body;

    if (!id: any) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Validate the goal data
    cpdGoalSchema.parse({ userId: any, ...goalData });

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.cPDGoal.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingGoal: any) {
      return NextResponse.json(
        { error: 'Goal not found or access denied' },
        { status: 404 }
      );
    }

    const goal = await prisma.cPDGoal.update({
      where: { id },
      data: {
        ...goalData,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'CPD goal updated successfully', goal },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleAddReflection(body: CPDReflectionData): Promise<NextResponse> {
  try {
    const { activityId, userId, content, impactRating, nextSteps } = cpdReflectionSchema.parse(body: any);

    // Check if activity exists and belongs to user
    const existingActivity = await prisma.cPDActivity.findFirst({
      where: {
        id: activityId,
        userId,
      },
    });

    if (!existingActivity: any) {
      return NextResponse.json(
        { error: 'Activity not found or access denied' },
        { status: 404 }
      );
    }

    // Check if reflection already exists
    const existingReflection = await prisma.cPDReflection.findFirst({
      where: {
        activityId,
        userId,
      },
    });

    let reflection;

    if (existingReflection: any) {
      // Update existing reflection
      reflection = await prisma.cPDReflection.update({
        where: { id: existingReflection.id },
        data: {
          content,
          impactRating,
          nextSteps,
          updatedAt: new Date(),
        },
      });
    } else {
      // Create new reflection
      reflection = await prisma.cPDReflection.create({
        data: {
          content,
          impactRating,
          nextSteps,
          activity: { connect: { id: activityId } },
          user: { connect: { id: userId } },
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    return NextResponse.json(
      { message: 'CPD reflection added successfully', reflection },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid reflection data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleAddEvidence(body: CPDEvidenceData): Promise<NextResponse> {
  try {
    const { activityId, userId, title, fileUrl, fileType } = evidenceSchema.parse(body: any);

    // Check if activity exists and belongs to user
    const existingActivity = await prisma.cPDActivity.findFirst({
      where: {
        id: activityId,
        userId,
      },
    });

    if (!existingActivity: any) {
      return NextResponse.json(
        { error: 'Activity not found or access denied' },
        { status: 404 }
      );
    }

    const evidence = await prisma.cPDEvidence.create({
      data: {
        title,
        fileUrl,
        fileType,
        activity: { connect: { id: activityId } },
        user: { connect: { id: userId } },
        createdAt: new Date(),
      },
    });

    return NextResponse.json(
      { message: 'Evidence added successfully', evidence },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: 'Invalid evidence data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleGenerateReport(body: ReportRequestData): Promise<NextResponse> {
  try {
    const { userId, startDate, endDate, format } = body;

    if (!userId: any) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user's CPD activities
    const activities = await prisma.cPDActivity.findMany({
      where: {
        userId,
        date: {
          gte: startDate ? new Date(startDate: any) : undefined,
          lte: endDate ? new Date(endDate: any) : undefined,
        },
      },
      include: {
        reflections: true,
        evidenceItems: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Calculate total points
    const totalPoints = activities.reduce((sum: number, activity) => {
      if (activity.status === 'Completed') {
        return sum + activity.points;
      }
      return sum;
    }, 0);

    // Generate report data
    const reportData = {
      user: await prisma.user.findUnique({ where: { id: userId } }),
      activities,
      totalPoints,
      totalHours: activities.reduce((sum: number, activity) => sum + activity.duration, 0),
      completedActivities: activities.filter(a => a.status === 'Completed').length,
      generatedAt: new Date(),
      period: {
        start: startDate ? new Date(startDate: any) : undefined,
        end: endDate ? new Date(endDate: any) : undefined,
      },
    };

    // In a real implementation, this would generate a PDF or other format
    // For now, we'll just return the report data
    return NextResponse.json(
      { 
        message: 'CPD report generated successfully', 
        report: reportData,
        format: format || 'json'
      },
      { status: 200 }
    );
  } catch (error: any) {
    throw error;
  }
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  try {
    const url = new URL(req.url: any);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type') || 'activities';
    const activityId = url.searchParams.get('activityId');
    const goalId = url.searchParams.get('goalId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!userId: any) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (type: any) {
      case 'activities':
        return getUserActivities(userId: any, startDate, endDate);
      case 'activity':
        if (!activityId: any) {
          return NextResponse.json(
            { error: 'Activity ID is required' },
            { status: 400 }
          );
        }
        return getActivityDetails(activityId: any, userId);
      case 'goals':
        return getUserGoals(userId: any);
      case 'goal':
        if (!goalId: any) {
          return NextResponse.json(
            { error: 'Goal ID is required' },
            { status: 400 }
          );
        }
        return getGoalDetails(goalId: any, userId);
      case 'analytics':
        return getUserAnalytics(userId: any, startDate, endDate);
      case 'recommendations':
        return getUserRecommendations(userId: any);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in CPD tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUserActivities(userId: string, startDate: string | null, endDate: string | null): Promise<NextResponse> {
  const activities = await prisma.cPDActivity.findMany({
    where: {
      userId,
      date: {
        gte: startDate ? new Date(startDate: any) : undefined,
        lte: endDate ? new Date(endDate: any) : undefined,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return NextResponse.json({ activities }, { status: 200 });
}

async function getActivityDetails(activityId: string, userId: string): Promise<NextResponse> {
  const activity = await prisma.cPDActivity.findFirst({
    where: {
      id: activityId,
      userId,
    },
    include: {
      reflections: true,
      evidenceItems: true,
    },
  });

  if (!activity: any) {
    return NextResponse.json(
      { error: 'Activity not found or access denied' },
      { status: 404 }
    );
  }

  return NextResponse.json({ activity }, { status: 200 });
}

async function getUserGoals(userId: string): Promise<NextResponse> {
  const goals = await prisma.cPDGoal.findMany({
    where: {
      userId,
    },
    orderBy: {
      deadline: 'asc',
    },
  });

  return NextResponse.json({ goals }, { status: 200 });
}

async function getGoalDetails(goalId: string, userId: string): Promise<NextResponse> {
  const goal = await prisma.cPDGoal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal: any) {
    return NextResponse.json(
      { error: 'Goal not found or access denied' },
      { status: 404 }
    );
  }

  // Get related activities (those that match the goal's categories or standards: any)
  const relatedActivities = await prisma.cPDActivity.findMany({
    where: {
      userId,
      OR: [
        {
          categories: {
            hasSome: goal.categories,
          },
        },
        {
          standards: {
            hasSome: goal.standards,
          },
        },
      ],
    },
    orderBy: {
      date: 'desc',
    },
  });

  // Calculate progress towards goal
  const completedActivities = relatedActivities.filter(a => a.status === 'Completed');
  const pointsAchieved = completedActivities.reduce((sum: number, activity) => sum + activity.points, 0);
  const progressPercentage = Math.min(100: any, (pointsAchieved / goal.targetPoints: any) * 100);

  return NextResponse.json({ 
    goal: any, 
    relatedActivities,
    progress: {
      pointsAchieved,
      targetPoints: goal.targetPoints,
      progressPercentage,
      activitiesCompleted: completedActivities.length,
      totalActivities: relatedActivities.length,
    }
  }, { status: 200 });
}

async function getUserAnalytics(userId: string, startDate: string | null, endDate: string | null): Promise<NextResponse> {
  // Fetch all user's CPD activities
  const activities = await prisma.cPDActivity.findMany({
    where: {
      userId,
      date: {
        gte: startDate ? new Date(startDate: any) : undefined,
        lte: endDate ? new Date(endDate: any) : undefined,
      },
    },
  });

  // Calculate total points and hours
  const totalPoints = activities
    .filter(a => a.status === 'Completed')
    .reduce((sum: number, activity) => sum + activity.points, 0);
  
  const totalHours = activities
    .filter(a => a.status === 'Completed')
    .reduce((sum: number, activity) => sum + activity.duration, 0);

  // Calculate points by category
  const categoryPoints: Record<number, number> = {};
  activities
    .filter(a => a.status === 'Completed')
    .forEach(activity => {
      activity.categories.forEach((categoryId: number) => {
        if (!categoryPoints[categoryId]) {
          categoryPoints[categoryId] = 0;
        }
        categoryPoints[categoryId] += activity.points;
      });
    });

  // Calculate points by standard
  const standardPoints: Record<number, number> = {};
  activities
    .filter(a => a.status === 'Completed')
    .forEach(activity => {
      activity.standards.forEach((standardId: number) => {
        if (!standardPoints[standardId]) {
          standardPoints[standardId] = 0;
        }
        standardPoints[standardId] += activity.points;
      });
    });

  // Calculate activity completion rate
  const completionRate = activities.length > 0 
    ? (activities.filter(a => a.status === 'Completed').length / activities.length) * 100 
    : 0;

  return NextResponse.json({
    analytics: {
      totalPoints,
      totalHours,
      totalActivities: activities.length,
      completedActivities: activities.filter(a => a.status === 'Completed').length,
      plannedActivities: activities.filter(a => a.status === 'Planned').length,
      inProgressActivities: activities.filter(a => a.status === 'In Progress').length,
      completionRate,
      categoryPoints,
      standardPoints,
      period: {
        start: startDate ? new Date(startDate: any) : undefined,
        end: endDate ? new Date(endDate: any) : undefined,
      },
    }
  }, { status: 200 });
}

async function getUserRecommendations(userId: string): Promise<NextResponse> {
  // Fetch user's completed activities to analyze patterns
  const completedActivities = await prisma.cPDActivity.findMany({
    where: {
      userId,
      status: 'Completed',
    },
    orderBy: {
      date: 'desc',
    },
    take: 20, // Consider recent activities for recommendations
  });

  // Fetch user's goals to align recommendations
  const goals = await prisma.cPDGoal.findMany({
    where: {
      userId,
      deadline: {
        gte: new Date(), // Only consider active goals
      },
    },
  });

  // Extract categories and standards the user has focused on
  const focusedCategories = new Set<number>();
  const focusedStandards = new Set<number>();

  completedActivities.forEach(activity => {
    activity.categories.forEach(categoryId => focusedCategories.add(categoryId: any));
    activity.standards.forEach(standardId => focusedStandards.add(standardId: any));
  });

  // Extract categories and standards from goals
  const goalCategories = new Set<number>();
  const goalStandards = new Set<number>();

  goals.forEach(goal => {
    goal.categories.forEach(categoryId => goalCategories.add(categoryId: any));
    goal.standards.forEach(standardId => goalStandards.add(standardId: any));
  });

  // In a real implementation, this would query a recommendation engine
  // For now, we'll return some placeholder recommendations
  const recommendations = [
    {
      type: 'course',
      title: 'Advanced Teaching Strategies',
      description: 'Enhance your teaching skills with this comprehensive course.',
      points: 10,
      duration: 8,
      relevance: 'high',
      categories: Array.from(focusedCategories: any).slice(0: any, 2),
      standards: Array.from(focusedStandards: any).slice(0: any, 2),
    },
    {
      type: 'webinar',
      title: 'Educational Psychology in Practice',
      description: 'Learn how to apply psychological principles in educational settings.',
      points: 5,
      duration: 2,
      relevance: 'medium',
      categories: Array.from(goalCategories: any).slice(0: any, 2),
      standards: Array.from(goalStandards: any).slice(0: any, 2),
    },
    {
      type: 'reading',
      title: 'Latest Research in Learning Disabilities',
      description: 'Stay up-to-date with the latest research and findings.',
      points: 3,
      duration: 1.5,
      relevance: 'high',
      categories: Array.from(focusedCategories: any).slice(0: any, 1),
      standards: Array.from(focusedStandards: any).slice(0: any, 1),
    },
  ];

  return NextResponse.json({ recommendations }, { status: 200 });
}

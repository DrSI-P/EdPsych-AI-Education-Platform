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

export async function POST(req: NextRequest) {
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
  } catch (error) {
    console.error('Error in CPD tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function handleCreateActivity(body: any) {
  try {
    const { userId, ...activityData } = cpdActivitySchema.parse(body);

    const activity = await prisma.CPDActivity.create({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid activity data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateActivity(body: any) {
  try {
    const { id, userId, ...activityData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Activity ID is required' },
        { status: 400 }
      );
    }

    // Validate the activity data
    cpdActivitySchema.parse({ userId, ...activityData });

    // Check if activity exists and belongs to user
    const existingActivity = await prisma.CPDActivity.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: 'Activity not found or access denied' },
        { status: 404 }
      );
    }

    const activity = await prisma.CPDActivity.update({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid activity data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleCreateGoal(body: any) {
  try {
    const { userId, ...goalData } = cpdGoalSchema.parse(body);

    const goal = await prisma.CPDGoal.create({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleUpdateGoal(body: any) {
  try {
    const { id, userId, ...goalData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      );
    }

    // Validate the goal data
    cpdGoalSchema.parse({ userId, ...goalData });

    // Check if goal exists and belongs to user
    const existingGoal = await prisma.CPDGoal.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingGoal) {
      return NextResponse.json(
        { error: 'Goal not found or access denied' },
        { status: 404 }
      );
    }

    const goal = await prisma.CPDGoal.update({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid goal data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleAddReflection(body: any) {
  try {
    const { activityId, userId, content, impactRating, nextSteps } = cpdReflectionSchema.parse(body);

    // Check if activity exists and belongs to user
    const existingActivity = await prisma.CPDActivity.findFirst({
      where: {
        id: activityId,
        userId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: 'Activity not found or access denied' },
        { status: 404 }
      );
    }

    // Check if reflection already exists
    const existingReflection = await prisma.CPDReflection.findFirst({
      where: {
        activityId,
        userId,
      },
    });

    let reflection;

    if (existingReflection) {
      // Update existing reflection
      reflection = await prisma.CPDReflection.update({
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
      reflection = await prisma.CPDReflection.create({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid reflection data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleAddEvidence(body: any) {
  try {
    const { activityId, userId, title, fileUrl, fileType } = evidenceSchema.parse(body);

    // Check if activity exists and belongs to user
    const existingActivity = await prisma.CPDActivity.findFirst({
      where: {
        id: activityId,
        userId,
      },
    });

    if (!existingActivity) {
      return NextResponse.json(
        { error: 'Activity not found or access denied' },
        { status: 404 }
      );
    }

    const evidence = await prisma.CPDEvidence.create({
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid evidence data', details: error.errors },
        { status: 400 }
      );
    }
    throw error;
  }
}

async function handleGenerateReport(body: any) {
  try {
    const { userId, startDate, endDate, format } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user's CPD activities
    const activities = await prisma.CPDActivity.findMany({
      where: {
        userId,
        date: {
          gte: startDate ? new Date(startDate) : undefined,
          lte: endDate ? new Date(endDate) : undefined,
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
    const totalPoints = activities.reduce((sum: number, activity: any) => {
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
      totalHours: activities.reduce((sum: number, activity: any) => sum + activity.duration, 0),
      completedActivities: activities.filter((a: any) => a.status === 'Completed').length,
      generatedAt: new Date(),
      period: {
        start: startDate ? new Date(startDate) : undefined,
        end: endDate ? new Date(endDate) : undefined,
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
  } catch (error) {
    throw error;
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const type = url.searchParams.get('type') || 'activities';
    const activityId = url.searchParams.get('activityId');
    const goalId = url.searchParams.get('goalId');
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    switch (type) {
      case 'activities':
        return getUserActivities(userId, startDate, endDate);
      case 'activity':
        if (!activityId) {
          return NextResponse.json(
            { error: 'Activity ID is required' },
            { status: 400 }
          );
        }
        return getActivityDetails(activityId, userId);
      case 'goals':
        return getUserGoals(userId);
      case 'goal':
        if (!goalId) {
          return NextResponse.json(
            { error: 'Goal ID is required' },
            { status: 400 }
          );
        }
        return getGoalDetails(goalId, userId);
      case 'analytics':
        return getUserAnalytics(userId, startDate, endDate);
      case 'recommendations':
        return getUserRecommendations(userId);
      default:
        return NextResponse.json(
          { error: 'Invalid request type' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Error in CPD tracking API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function getUserActivities(userId: string, startDate: string | null, endDate: string | null) {
  const activities = await prisma.CPDActivity.findMany({
    where: {
      userId,
      date: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
    orderBy: {
      date: 'desc',
    },
  });

  return NextResponse.json({ activities }, { status: 200 });
}

async function getActivityDetails(activityId: string, userId: string) {
  const activity = await prisma.CPDActivity.findFirst({
    where: {
      id: activityId,
      userId,
    },
    include: {
      reflections: true,
      evidenceItems: true,
    },
  });

  if (!activity) {
    return NextResponse.json(
      { error: 'Activity not found or access denied' },
      { status: 404 }
    );
  }

  return NextResponse.json({ activity }, { status: 200 });
}

async function getUserGoals(userId: string) {
  const goals = await prisma.CPDGoal.findMany({
    where: {
      userId,
    },
    orderBy: {
      deadline: 'asc',
    },
  });

  return NextResponse.json({ goals }, { status: 200 });
}

async function getGoalDetails(goalId: string, userId: string) {
  const goal = await prisma.CPDGoal.findFirst({
    where: {
      id: goalId,
      userId,
    },
  });

  if (!goal) {
    return NextResponse.json(
      { error: 'Goal not found or access denied' },
      { status: 404 }
    );
  }

  // Get related activities (those that match the goal's categories or standards)
  const relatedActivities = await prisma.CPDActivity.findMany({
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
  const completedActivities = relatedActivities.filter((a: any) => a.status === 'Completed');
  const pointsAchieved = completedActivities.reduce((sum: number, activity: any) => sum + activity.points, 0);
  const progressPercentage = Math.min(100, (pointsAchieved / goal.targetPoints) * 100);

  return NextResponse.json({ 
    goal, 
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

async function getUserAnalytics(userId: string, startDate: string | null, endDate: string | null) {
  // Fetch all user's CPD activities
  const activities = await prisma.CPDActivity.findMany({
    where: {
      userId,
      date: {
        gte: startDate ? new Date(startDate) : undefined,
        lte: endDate ? new Date(endDate) : undefined,
      },
    },
  });

  // Calculate total points and hours
  const totalPoints = activities
    .filter((a: any) => a.status === 'Completed')
    .reduce((sum: number, activity: any) => sum + activity.points, 0);
  
  const totalHours = activities
    .filter((a: any) => a.status === 'Completed')
    .reduce((sum: number, activity: any) => sum + activity.duration, 0);

  // Calculate points by category
  const categoryPoints: Record<number, number> = {};
  activities
    .filter((a: any) => a.status === 'Completed')
    .forEach((activity: any) => {
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
    .filter((a: any) => a.status === 'Completed')
    .forEach((activity: any) => {
      activity.standards.forEach((standardId: number) => {
        if (!standardPoints[standardId]) {
          standardPoints[standardId] = 0;
        }
        standardPoints[standardId] += activity.points;
      });
    });

  // Calculate points by month
  const monthlyPoints: Record<string, number> = {};
  activities
    .filter((a: any) => a.status === 'Completed')
    .forEach((activity: any) => {
      const month = new Date(activity.date).toISOString().substring(0, 7); // YYYY-MM format
      if (!monthlyPoints[month]) {
        monthlyPoints[month] = 0;
      }
      monthlyPoints[month] += activity.points;
    });

  // Calculate activity type distribution
  const activityTypes: Record<string, number> = {};
  activities.forEach((activity: any) => {
    if (!activityTypes[activity.type]) {
      activityTypes[activity.type] = 0;
    }
    activityTypes[activity.type]++;
  });

  return NextResponse.json({
    analytics: {
      totalPoints,
      totalHours,
      completedActivities: activities.filter((a: any) => a.status === 'Completed').length,
      plannedActivities: activities.filter((a: any) => a.status === 'Planned').length,
      inProgressActivities: activities.filter((a: any) => a.status === 'In Progress').length,
      categoryPoints,
      standardPoints,
      monthlyPoints,
      activityTypes,
    }
  }, { status: 200 });
}

async function getUserRecommendations(userId: string) {
  // Fetch user's CPD activities
  const activities = await prisma.CPDActivity.findMany({
    where: {
      userId,
    },
  });

  // Calculate points by category
  const categoryPoints: Record<number, number> = {};
  activities
    .filter((a: any) => a.status === 'Completed')
    .forEach((activity: any) => {
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
    .filter((a: any) => a.status === 'Completed')
    .forEach((activity: any) => {
      activity.standards.forEach((standardId: number) => {
        if (!standardPoints[standardId]) {
          standardPoints[standardId] = 0;
        }
        standardPoints[standardId] += activity.points;
      });
    });

  // Identify gaps in categories and standards
  // In a real implementation, this would fetch all available categories and standards
  // For now, we'll use placeholder data
  const allCategories = [1, 2, 3, 4, 5, 6, 7, 8];
  const allStandards = [1, 2, 3, 4, 5, 6, 7, 8];

  const categoryGaps = allCategories.filter(id => !categoryPoints[id] || categoryPoints[id] < 5);
  const standardGaps = allStandards.filter(id => !standardPoints[id] || standardPoints[id] < 5);

  // In a real implementation, this would fetch actual course recommendations
  // For now, we'll return placeholder recommendations
  const recommendations = [
    {
      id: 1,
      title: "Digital Assessment Strategies",
      type: "Webinar",
      provider: "EdTech Learning",
      duration: 1.5,
      points: 1.5,
      categories: [3, 8],
      description: "Learn effective strategies for implementing digital assessment tools in your classroom."
    },
    {
      id: 2,
      title: "Behaviour Management for Secondary",
      type: "Course",
      provider: "Behaviour Support Network",
      duration: 3,
      points: 3,
      categories: [4],
      description: "Practical techniques for effective behaviour management in secondary classrooms."
    }
  ];

  return NextResponse.json({
    recommendations,
    gaps: {
      categories: categoryGaps,
      standards: standardGaps,
    }
  }, { status: 200 });
}

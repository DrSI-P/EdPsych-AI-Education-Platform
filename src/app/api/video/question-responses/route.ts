import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

// Schema for response submission
const submitResponseSchema = z.object({
  questionId: z.string().uuid(),
  videoId: z.string().uuid(),
  answer: z.union([z.string(), z.array(z.string())]),
  attemptCount: z.number().int().min(1).optional(),
  timeSpent: z.number().int().min(0),
});

/**
 * GET /api/video/question-responses
 * Retrieve responses for a user, optionally filtered by video
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');
    const questionId = searchParams.get('questionId');

    // Build query
    let whereClause: unknown = { userId };
    
    if (videoId) {
      whereClause.videoId = videoId;
    }
    
    if (questionId) {
      whereClause.questionId = questionId;
    }

    const responses = await db.questionResponse.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        video: {
          select: {
            title: true,
          },
        },
      },
    });

    return NextResponse.json(responses);
  } catch (error) {
    console.error('Error fetching question responses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question responses' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/video/question-responses
 * Submit a response to a video question
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validationResult = submitResponseSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { questionId, videoId, answer, attemptCount, timeSpent } = validationResult.data;

    // Check if question exists
    const question = await db.videoQuestion.findUnique({
      where: { id: questionId },
    });

    if (!question) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if video exists
    const video = await db.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if the question belongs to the specified video
    if (question.videoId !== videoId) {
      return NextResponse.json(
        { error: 'Question does not belong to the specified video' },
        { status: 400 }
      );
    }

    // Determine if the answer is correct
    let isCorrect = false;
    const correctAnswer = question.correctAnswer;
    
    if (question.questionType === 'multiple-choice' || question.questionType === 'true-false') {
      // For multiple choice and true/false, the answer should match exactly one of the correct answers
      isCorrect = correctAnswer.includes(answer as string);
    } else if (question.questionType === 'short-answer') {
      // For short answer, we'll do a case-insensitive comparison
      const userAnswer = String(answer).toLowerCase().trim();
      const correctAnswers = correctAnswer.map(a => a.toLowerCase().trim());
      isCorrect = correctAnswers.includes(userAnswer);
    } else if (question.questionType === 'matching') {
      // For matching, all pairs must match
      const userAnswers = Array.isArray(answer) ? answer : [answer as string];
      isCorrect = userAnswers.length === correctAnswer.length && 
                  userAnswers.every((ans, index) => ans === correctAnswer[index]);
    }

    // Create response
    const answerArray = Array.isArray(answer) ? answer : [answer as string];
    
    const response = await db.questionResponse.create({
      data: {
        questionId,
        userId,
        videoId,
        answer: answerArray,
        isCorrect,
        attemptCount: attemptCount || 1,
        timeSpent,
      },
    });

    return NextResponse.json({
      ...response,
      isCorrect,
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting question response:', error);
    return NextResponse.json(
      { error: 'Failed to submit question response' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/video/question-responses/stats
 * Get statistics for question responses
 */
export async function GET_STATS(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    // Build query
    let whereClause: unknown = { userId };
    
    if (videoId) {
      whereClause.videoId = videoId;
    }

    // Get all responses for the user
    const responses = await db.questionResponse.findMany({
      where: whereClause,
    });

    // Calculate statistics
    const totalResponses = responses.length;
    const correctResponses = responses.filter(r => r.isCorrect).length;
    const incorrectResponses = totalResponses - correctResponses;
    const accuracyRate = totalResponses > 0 ? (correctResponses / totalResponses) * 100 : 0;
    
    // Calculate average time spent
    const totalTimeSpent = responses.reduce((sum, r) => sum + r.timeSpent, 0);
    const averageTimeSpent = totalResponses > 0 ? totalTimeSpent / totalResponses : 0;
    
    // Calculate average attempts
    const totalAttempts = responses.reduce((sum, r) => sum + r.attemptCount, 0);
    const averageAttempts = totalResponses > 0 ? totalAttempts / totalResponses : 0;

    // Get question types distribution
    const questionIds = [...new Set(responses.map(r => r.questionId))];
    const questions = await db.videoQuestion.findMany({
      where: {
        id: {
          in: questionIds,
        },
      },
    });

    const questionTypeDistribution: Record<string, number> = {};
    questions.forEach(q => {
      questionTypeDistribution[q.questionType] = (questionTypeDistribution[q.questionType] || 0) + 1;
    });

    // Get difficulty distribution
    const difficultyDistribution: Record<string, number> = {};
    questions.forEach(q => {
      difficultyDistribution[q.difficulty] = (difficultyDistribution[q.difficulty] || 0) + 1;
    });

    // Get performance by difficulty
    const performanceByDifficulty: Record<string, { total: number; correct: number; rate: number }> = {};
    
    for (const question of questions) {
      const questionResponses = responses.filter(r => r.questionId === question.id);
      const totalForDifficulty = questionResponses.length;
      const correctForDifficulty = questionResponses.filter(r => r.isCorrect).length;
      
      if (!performanceByDifficulty[question.difficulty]) {
        performanceByDifficulty[question.difficulty] = {
          total: 0,
          correct: 0,
          rate: 0,
        };
      }
      
      performanceByDifficulty[question.difficulty].total += totalForDifficulty;
      performanceByDifficulty[question.difficulty].correct += correctForDifficulty;
    }
    
    // Calculate rates
    Object.keys(performanceByDifficulty).forEach(difficulty => {
      const { total, correct } = performanceByDifficulty[difficulty];
      performanceByDifficulty[difficulty].rate = total > 0 ? (correct / total) * 100 : 0;
    });

    return NextResponse.json({
      totalResponses,
      correctResponses,
      incorrectResponses,
      accuracyRate,
      averageTimeSpent,
      averageAttempts,
      questionTypeDistribution,
      difficultyDistribution,
      performanceByDifficulty,
    });
  } catch (error) {
    console.error('Error fetching question response statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch question response statistics' },
      { status: 500 }
    );
  }
}
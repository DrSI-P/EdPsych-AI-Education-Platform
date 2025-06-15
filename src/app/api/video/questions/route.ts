import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

// Schema for question creation
const createQuestionSchema = z.object({
  videoId: z.string().uuid(),
  timeCode: z.number().min(0),
  question: z.string().min(1).max(500),
  questionType: z.enum(['multiple-choice', 'true-false', 'short-answer', 'matching']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  explanation: z.string().max(1000).optional(),
  points: z.number().min(0).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
});

// Schema for question update
const updateQuestionSchema = z.object({
  id: z.string().uuid(),
  timeCode: z.number().min(0).optional(),
  question: z.string().min(1).max(500).optional(),
  questionType: z.enum(['multiple-choice', 'true-false', 'short-answer', 'matching']).optional(),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  explanation: z.string().max(1000).optional(),
  points: z.number().min(0).optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']).optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * GET /api/video/questions
 * Retrieve questions for a video
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    if (!videoId) {
      return NextResponse.json(
        { error: 'Video ID is required' },
        { status: 400 }
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

    // Get questions
    const questions = await db.videoQuestion.findMany({
      where: {
        videoId,
      },
      orderBy: {
        timeCode: 'asc',
      },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error fetching video questions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch video questions' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/video/questions
 * Create a new video question
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to create questions
    if (session.user.role !== 'admin' && session.user.role !== 'educator') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validationResult = createQuestionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const {
      videoId,
      timeCode,
      question,
      questionType,
      options,
      correctAnswer,
      explanation,
      points,
      difficulty,
      tags,
    } = validationResult.data;

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

    // Validate question data based on type
    if (questionType === 'multiple-choice' && (!options || options.length < 2)) {
      return NextResponse.json(
        { error: 'Multiple choice questions require at least 2 options' },
        { status: 400 }
      );
    }

    if (questionType === 'matching' && (!options || options.length < 2)) {
      return NextResponse.json(
        { error: 'Matching questions require at least 2 pairs' },
        { status: 400 }
      );
    }

    if (!correctAnswer) {
      return NextResponse.json(
        { error: 'Correct answer is required' },
        { status: 400 }
      );
    }

    // Create question
    const newQuestion = await db.videoQuestion.create({
      data: {
        videoId,
        createdById: userId,
        timeCode,
        question,
        questionType,
        options: options || [],
        correctAnswer: Array.isArray(correctAnswer) 
          ? correctAnswer 
          : [correctAnswer],
        explanation,
        points: points || 1,
        difficulty: difficulty || 'medium',
        tags: tags || [],
      },
    });

    return NextResponse.json(newQuestion, { status: 201 });
  } catch (error) {
    console.error('Error creating video question:', error);
    return NextResponse.json(
      { error: 'Failed to create video question' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/video/questions
 * Update an existing video question
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to update questions
    if (session.user.role !== 'admin' && session.user.role !== 'educator') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validationResult = updateQuestionSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const {
      id,
      timeCode,
      question,
      questionType,
      options,
      correctAnswer,
      explanation,
      points,
      difficulty,
      tags,
    } = validationResult.data;

    // Check if question exists
    const existingQuestion = await db.videoQuestion.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update this question
    if (session.user.role !== 'admin' && existingQuestion.createdById !== userId) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Validate question data based on type if type is being updated
    const newType = questionType || existingQuestion.questionType;
    
    if (newType === 'multiple-choice' && options && options.length < 2) {
      return NextResponse.json(
        { error: 'Multiple choice questions require at least 2 options' },
        { status: 400 }
      );
    }

    if (newType === 'matching' && options && options.length < 2) {
      return NextResponse.json(
        { error: 'Matching questions require at least 2 pairs' },
        { status: 400 }
      );
    }

    // Update question
    const updatedQuestion = await db.videoQuestion.update({
      where: { id },
      data: {
        ...(timeCode !== undefined && { timeCode }),
        ...(question && { question }),
        ...(questionType && { questionType }),
        ...(options && { options }),
        ...(correctAnswer && { 
          correctAnswer: Array.isArray(correctAnswer) 
            ? correctAnswer 
            : [correctAnswer]
        }),
        ...(explanation !== undefined && { explanation }),
        ...(points !== undefined && { points }),
        ...(difficulty && { difficulty }),
        ...(tags && { tags }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating video question:', error);
    return NextResponse.json(
      { error: 'Failed to update video question' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/video/questions
 * Delete a video question
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user has permission to delete questions
    if (session.user.role !== 'admin' && session.user.role !== 'educator') {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Question ID is required' },
        { status: 400 }
      );
    }

    // Check if question exists
    const existingQuestion = await db.videoQuestion.findUnique({
      where: { id },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { error: 'Question not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to delete this question
    if (session.user.role !== 'admin' && existingQuestion.createdById !== userId) {
      return NextResponse.json(
        { error: 'Permission denied' },
        { status: 403 }
      );
    }

    // Delete question
    await db.videoQuestion.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting video question:', error);
    return NextResponse.json(
      { error: 'Failed to delete video question' },
      { status: 500 }
    );
  }
}
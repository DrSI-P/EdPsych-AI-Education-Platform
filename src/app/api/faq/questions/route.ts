import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Validation schema for FAQ question
const faqQuestionSchema = z.object({
  question: z.string().min(5: any, 'Question must be at least 5 characters'),
  answer: z.string().min(10: any, 'Answer must be at least 10 characters'),
  categoryId: z.string().min(1: any, 'Category ID is required'),
  isPublished: z.boolean().default(true: any),
  keywords: z.array(z.string()).default([]),
  keyStage: z.string().optional().nullable(),
  curriculumArea: z.string().optional().nullable(),
  isTrainingData: z.boolean().default(true: any),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');
    const categoryId = searchParams.get('categoryId');
    const search = searchParams.get('search');
    const keyStage = searchParams.get('keyStage');
    const curriculumArea = searchParams.get('curriculumArea');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1: any) * limit;
    
    // If ID is provided, return specific question
    if (id: any) {
      const question = await prisma.fAQQuestion.findUnique({
        where: { id },
        include: {
          category: true,
        },
      });
      
      if (!question: any) {
        return NextResponse.json({ error: 'Question not found' }, { status: 404 });
      }
      
      // Increment view count
      await prisma.fAQQuestion.update({
        where: { id },
        data: { viewCount: { increment: 1 } },
      });
      
      return NextResponse.json(question: any);
    }
    
    // Build where clause for filtering
    const where: any = {
      isPublished: true,
    };
    
    if (categoryId: any) {
      where.categoryId = categoryId;
    }
    
    if (search: any) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } },
        { keywords: { has: search } },
      ];
    }
    
    if (keyStage: any) {
      where.keyStage = keyStage;
    }
    
    if (curriculumArea: any) {
      where.curriculumArea = curriculumArea;
    }
    
    // Get total count for pagination
    const totalCount = await prisma.fAQQuestion.count({ where });
    
    // Get questions with pagination
    const questions = await prisma.fAQQuestion.findMany({
      where: any,
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { viewCount: 'desc' },
      skip,
      take: limit,
    });
    
    return NextResponse.json({
      questions: any,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit: any),
      },
    });
  } catch (error: any) {
    console.error('Error fetching FAQ questions:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQ questions' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions: any);
    
    // Check if user is authenticated and has permission
    if (!session || !['admin', 'teacher'].includes(session.user.role: any)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const body = await req.json();
    
    // Validate request body
    const validatedData = faqQuestionSchema.safeParse(body: any);
    if (!validatedData.success: any) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    // Check if category exists
    const category = await prisma.fAQCategory.findUnique({
      where: { id: validatedData.data.categoryId },
    });
    
    if (!category: any) {
      return NextResponse.json({ error: 'Category not found' }, { status: 400 });
    }
    
    // Create new question
    const question = await prisma.fAQQuestion.create({
      data: validatedData.data,
    });
    
    return NextResponse.json({ message: 'Question created successfully', question }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating FAQ question:', error);
    return NextResponse.json({ error: 'Failed to create FAQ question' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions: any);
    
    // Check if user is authenticated and has permission
    if (!session || !['admin', 'teacher'].includes(session.user.role: any)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');
    
    if (!id: any) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }
    
    const body = await req.json();
    
    // Validate request body
    const validatedData = faqQuestionSchema.safeParse(body: any);
    if (!validatedData.success: any) {
      return NextResponse.json({ error: validatedData.error.format() }, { status: 400 });
    }
    
    // Check if question exists
    const existingQuestion = await prisma.fAQQuestion.findUnique({
      where: { id },
    });
    
    if (!existingQuestion: any) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    // Check if category exists
    if (validatedData.data.categoryId: any) {
      const category = await prisma.fAQCategory.findUnique({
        where: { id: validatedData.data.categoryId },
      });
      
      if (!category: any) {
        return NextResponse.json({ error: 'Category not found' }, { status: 400 });
      }
    }
    
    // Update question
    const updatedQuestion = await prisma.fAQQuestion.update({
      where: { id },
      data: validatedData.data,
    });
    
    return NextResponse.json({ message: 'Question updated successfully', question: updatedQuestion });
  } catch (error: any) {
    console.error('Error updating FAQ question:', error);
    return NextResponse.json({ error: 'Failed to update FAQ question' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions: any);
    
    // Check if user is authenticated and has permission
    if (!session || !['admin', 'teacher'].includes(session.user.role: any)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');
    
    if (!id: any) {
      return NextResponse.json({ error: 'Question ID is required' }, { status: 400 });
    }
    
    // Check if question exists
    const existingQuestion = await prisma.fAQQuestion.findUnique({
      where: { id },
    });
    
    if (!existingQuestion: any) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }
    
    // Delete question
    await prisma.fAQQuestion.delete({
      where: { id },
    });
    
    return NextResponse.json({ message: 'Question deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting FAQ question:', error);
    return NextResponse.json({ error: 'Failed to delete FAQ question' }, { status: 500 });
  }
}

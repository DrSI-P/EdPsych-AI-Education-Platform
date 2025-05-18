import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// GET handler for fetching a specific assessment
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const assessmentId = params.id;
    
    // Define the type for assessment
    type Question = {
      id: string;
      text: string;
      content: string;
      type: string;
      options?: any;
      correctAnswer?: any;
      order: number;
    };

    type Assessment = {
      id: string;
      title: string;
      description?: string;
      status: string;
      type: string;
      subject?: string;
      keyStage?: string;
      timeLimit?: number;
      passingScore: number;
      showResults: boolean;
      randomizeQuestions: boolean;
      allowRetakes: boolean;
      createdById: string;
      createdBy: {
        id: string;
        name?: string;
        email?: string;
      };
      questions: Question[];
      createdAt: Date;
      updatedAt: Date;
    };

    // Fetch the assessment with questions
    let assessment: Assessment | null = null;
    
    try {
      assessment = await (prisma as any).assessment.findUnique({
        where: { id: assessmentId },
        include: {
          questions: {
            orderBy: { order: 'asc' },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (findError) {
      console.error('Error finding assessment:', findError);
      return NextResponse.json({ error: 'Assessment not found or database error' }, { status: 404 });
    }
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user has access to this assessment
    const isCreator = assessment.createdById === session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isPublished = assessment.status === 'published';
    
    // Only allow access if user is creator, admin, or assessment is published
    if (!isCreator && !isAdmin && !isPublished) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json(assessment);
    
  } catch (error) {
    console.error('Error fetching assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the assessment' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a specific assessment
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const assessmentId = params.id;
    
    // Fetch the assessment to check ownership
    let assessment = null;
    
    try {
      assessment = await (prisma as any).assessment.findUnique({
        where: { id: assessmentId },
      });
    } catch (findError) {
      console.error('Error finding assessment:', findError);
      return NextResponse.json({ error: 'Assessment not found or database error' }, { status: 404 });
    }
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user has permission to update this assessment
    const isCreator = assessment.createdById === session.user.id;
    const isAdmin = session.user.role === 'admin';
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    
    // Update the assessment
    let updatedAssessment = null;
    
    try {
      updatedAssessment = await (prisma as any).assessment.update({
        where: { id: assessmentId },
        data: {
          title: body.title,
          description: body.description,
          type: body.type,
          subject: body.subject,
          keyStage: body.keyStage,
          timeLimit: body.timeLimit,
          passingScore: body.passingScore,
          showResults: body.showResults,
          randomizeQuestions: body.randomizeQuestions,
          allowRetakes: body.allowRetakes,
        },
      });
    } catch (updateError) {
      console.error('Error updating assessment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update assessment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedAssessment);
    
  } catch (error) {
    console.error('Error updating assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the assessment' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a specific assessment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const assessmentId = params.id;
    
    // Fetch the assessment to check ownership
    let assessment = null;
    
    try {
      assessment = await (prisma as any).assessment.findUnique({
        where: { id: assessmentId },
      });
    } catch (findError) {
      console.error('Error finding assessment:', findError);
      return NextResponse.json({ error: 'Assessment not found or database error' }, { status: 404 });
    }
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user has permission to delete this assessment
    const isCreator = assessment.createdById === session.user.id;
    const isAdmin = session.user.role === 'admin';
    
    if (!isCreator && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Delete the assessment and all related questions and answers
    try {
      await (prisma as any).assessment.delete({
        where: { id: assessmentId },
      });
    } catch (deleteError) {
      console.error('Error deleting assessment:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete assessment' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the assessment' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// PUT handler for publishing an assessment
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
    
    // Define the type for assessment
    type Question = {
      id: string;
      text: string;
      type: string;
      options?: any;
      correctAnswer?: string;
      order: number;
    };

    type Assessment = {
      id: string;
      title: string;
      description?: string;
      status: string;
      type: string;
      createdById: string;
      questions: Question[];
      createdAt: Date;
      updatedAt: Date;
    };

    // Fetch the assessment to check ownership and questions
    let assessment: Assessment | null = null;
    
    try {
      assessment = await (prisma as any).assessment.findUnique({
        where: { id: assessmentId },
        include: {
          questions: true,
        },
      });
    } catch (findError) {
      console.error('Error finding assessment:', findError);
      return NextResponse.json({ error: 'Assessment not found or database error' }, { status: 404 });
    }
    
    if (!assessment) {
      return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
    }
    
    // Check if user has permission to publish this assessment
    const isCreator = assessment.createdById === session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    
    if (!isCreator && !isAdmin && !isTeacher && !isProfessional) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Check if assessment has questions
    if (assessment.questions.length === 0) {
      return NextResponse.json(
        { error: 'Cannot publish an assessment with no questions' },
        { status: 400 }
      );
    }
    
    // Update the assessment status to published
    let publishedAssessment;
    
    try {
      publishedAssessment = await (prisma as any).assessment.update({
        where: { id: assessmentId },
        data: {
          status: 'published',
        },
      });
    } catch (updateError) {
      console.error('Error updating assessment:', updateError);
      return NextResponse.json(
        { error: 'Failed to update assessment status' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(publishedAssessment);
    
  } catch (error) {
    console.error('Error publishing assessment:', error);
    return NextResponse.json(
      { error: 'An error occurred while publishing the assessment' },
      { status: 500 }
    );
  }
}

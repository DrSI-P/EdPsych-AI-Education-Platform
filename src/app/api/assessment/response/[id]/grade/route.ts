import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// GET handler for fetching a specific assessment response
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
    
    const responseId = params.id;
    
    // Define types for our models
    type Answer = {
      id: string;
      questionId: string;
      responseId: string;
      content: any;
      isCorrect?: boolean;
      feedback?: string;
    };

    type Assessment = {
      id: string;
      title: string;
      description?: string;
      createdById: string;
    };

    type User = {
      id: string;
      name?: string;
      email?: string;
    };

    type Response = {
      id: string;
      assessmentId: string;
      userId: string;
      startedAt: Date;
      completedAt?: Date;
      score?: number;
      feedback?: string;
      user: User;
      answers: Answer[];
      assessment: Assessment;
    };

    // Fetch the response with user and answers
    let response: Response | null = null;
    
    try {
      response = await (prisma as any).response.findUnique({
        where: { id: responseId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          answers: true,
          assessment: {
            select: {
              id: true,
              title: true,
              description: true,
              createdById: true,
            },
          },
        },
      });
    } catch (findError) {
      console.error('Error finding response:', findError);
      return NextResponse.json({ error: 'Response not found or database error' }, { status: 404 });
    }
    
    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }
    
    // Check if user has access to this response
    const isCreator = response.assessment.createdById === session.user.id;
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    const isOwner = response.userId === session.user.id;
    
    // Only allow access if user is creator of assessment, admin, teacher, professional, or the student who submitted
    if (!isCreator && !isAdmin && !isTeacher && !isProfessional && !isOwner) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Error fetching response:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the response' },
      { status: 500 }
    );
  }
}

// PUT handler for updating grades for a response
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
    
    // Check if user has permission to grade (admin, teacher, professional)
    const isAdmin = session.user.role === 'admin';
    const isTeacher = session.user.role === 'teacher';
    const isProfessional = session.user.role === 'professional';
    
    if (!isAdmin && !isTeacher && !isProfessional) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const responseId = params.id;
    
    // Fetch the response to check if it exists
    let response = null;
    
    try {
      response = await (prisma as any).response.findUnique({
        where: { id: responseId },
        include: {
          assessment: true,
        },
      });
    } catch (findError) {
      console.error('Error finding response:', findError);
      return NextResponse.json({ error: 'Response not found or database error' }, { status: 404 });
    }
    
    if (!response) {
      return NextResponse.json({ error: 'Response not found' }, { status: 404 });
    }
    
    // Parse request body
    const body = await request.json();
    const { grades, totalScore, feedback } = body;
    
    if (!Array.isArray(grades)) {
      return NextResponse.json({ error: 'Invalid grades format' }, { status: 400 });
    }
    
    // Update each answer with the provided grade
    for (const grade of grades) {
      if (!grade.answerId) continue;
      
      try {
        await (prisma as any).answer.update({
          where: { id: grade.answerId },
          data: {
            isCorrect: grade.isCorrect,
            feedback: grade.feedback,
          },
        });
      } catch (updateError) {
        console.error(`Error updating answer ${grade.answerId}:`, updateError);
        // Continue with other answers even if one fails
      }
    }
    
    // Update the response with the total score and feedback
    let updatedResponse;
    
    try {
      updatedResponse = await (prisma as any).response.update({
        where: { id: responseId },
        data: {
          score: totalScore,
          feedback: feedback || response.feedback,
          gradedBy: { connect: { id: session.user.id } },
          gradedAt: new Date(),
        },
      });
    } catch (updateError) {
      console.error('Error updating response:', updateError);
      return NextResponse.json(
        { error: 'Failed to update response with grades' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(updatedResponse);
    
  } catch (error) {
    console.error('Error updating grades:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the grades' },
      { status: 500 }
    );
  }
}

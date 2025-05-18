import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// GET handler for fetching a specific curriculum standard
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
    
    const standardId = params.id;
    
    // Fetch the curriculum standard
    const standard = await prisma.curriculumStandard.findUnique({
      where: {
        id: standardId,
      },
    });
    
    if (!standard) {
      return NextResponse.json({ error: 'Curriculum standard not found' }, { status: 404 });
    }
    
    return NextResponse.json(standard);
    
  } catch (error) {
    console.error('Error fetching curriculum standard:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching the curriculum standard' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a specific curriculum standard (admin only)
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
    
    // Check if user is an admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const standardId = params.id;
    
    // Check if the standard exists
    const existingStandard = await prisma.curriculumStandard.findUnique({
      where: {
        id: standardId,
      },
    });
    
    if (!existingStandard) {
      return NextResponse.json({ error: 'Curriculum standard not found' }, { status: 404 });
    }
    
    // Parse request body
    const body = await request.json();
    const { code, description, subject, keyStage, year, category } = body;
    
    // Update the curriculum standard
    const updatedStandard = await prisma.curriculumStandard.update({
      where: {
        id: standardId,
      },
      data: {
        code: code || existingStandard.code,
        description: description || existingStandard.description,
        subject: subject || existingStandard.subject,
        keyStage: keyStage || existingStandard.keyStage,
        year: year !== undefined ? year : existingStandard.year,
        category: category || existingStandard.category,
      },
    });
    
    return NextResponse.json(updatedStandard);
    
  } catch (error) {
    console.error('Error updating curriculum standard:', error);
    return NextResponse.json(
      { error: 'An error occurred while updating the curriculum standard' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a specific curriculum standard (admin only)
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
    
    // Check if user is an admin
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    const standardId = params.id;
    
    // Check if the standard exists
    const existingStandard = await prisma.curriculumStandard.findUnique({
      where: {
        id: standardId,
      },
    });
    
    if (!existingStandard) {
      return NextResponse.json({ error: 'Curriculum standard not found' }, { status: 404 });
    }
    
    // Delete the curriculum standard
    await prisma.curriculumStandard.delete({
      where: {
        id: standardId,
      },
    });
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error deleting curriculum standard:', error);
    return NextResponse.json(
      { error: 'An error occurred while deleting the curriculum standard' },
      { status: 500 }
    );
  }
}

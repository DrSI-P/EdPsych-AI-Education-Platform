import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import prisma from '@/lib/db/prisma';

// GET handler for fetching curriculum standards
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const keyStage = searchParams.get('keyStage');
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    
    // Build the query
    const query: any = {};
    
    if (subject) {
      query.subject = subject;
    }
    
    if (keyStage) {
      query.keyStage = keyStage;
    }
    
    if (year) {
      query.year = year;
    }
    
    if (category) {
      query.category = category;
    }
    
    // Fetch curriculum standards
    const standards = await prisma.curriculumStandard.findMany({
      where: query,
      orderBy: [
        { subject: 'asc' },
        { keyStage: 'asc' },
        { year: 'asc' },
        { code: 'asc' },
      ],
    });
    
    return NextResponse.json(standards);
    
  } catch (error) {
    console.error('Error fetching curriculum standards:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching curriculum standards' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new curriculum standard (admin only)
export async function POST(request: NextRequest) {
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
    
    // Parse request body
    const body = await request.json();
    const { code, description, subject, keyStage, year, category } = body;
    
    // Validate required fields
    if (!code || !description || !subject || !keyStage) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Check if standard with the same code already exists
    const existingStandard = await prisma.curriculumStandard.findFirst({
      where: {
        code,
      },
    });
    
    if (existingStandard) {
      return NextResponse.json({ error: 'A standard with this code already exists' }, { status: 409 });
    }
    
    // Create the curriculum standard
    const standard = await prisma.curriculumStandard.create({
      data: {
        code,
        description,
        subject,
        keyStage,
        year: year || '',
        category: category || 'knowledge',
      },
    });
    
    return NextResponse.json(standard);
    
  } catch (error) {
    console.error('Error creating curriculum standard:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the curriculum standard' },
      { status: 500 }
    );
  }
}

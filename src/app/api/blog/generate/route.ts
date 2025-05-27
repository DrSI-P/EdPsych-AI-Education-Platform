import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { z } from 'zod';
import openai from '@/lib/openai-compat'; // Changed to use our compatibility layer

// Schema for blog content generation validation
const blogContentGenerationSchema = z.object({
  scheduleId: z.string().optional(),
  prompt: z.string().min(10, 'Prompt must be at least 10 characters'),
  topicArea: z.string().optional(),
  keyStage: z.string().optional(),
  targetAudience: z.string().optional(),
  contentLength: z.enum(['short', 'medium', 'long']).default('medium'),
});

// GET handler for retrieving blog content generation records
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can view generation records
    if (!['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Return mock data
    return NextResponse.json({
      generations: [],
      pagination: {
        total: 0,
        page: 1,
        limit: 10,
        pages: 0,
      },
    });
  } catch (error) {
    console.error('Error fetching blog content generations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog content generations' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new blog content generation
export async function POST(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can generate content
    if (!['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = blogContentGenerationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid generation data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const generationData = validationResult.data;

    // Return a mock response
    return NextResponse.json({
      success: true,
      generation: {
        id: `gen-${Date.now()}`,
        prompt: generationData.prompt,
        status: 'processing',
        startedAt: new Date(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      message: 'Blog content generation started',
    });
  } catch (error) {
    console.error('Error creating blog content generation:', error);
    return NextResponse.json(
      { error: 'Failed to start blog content generation' },
      { status: 500 }
    );
  }
}

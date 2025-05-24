import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Schema for blog content generation validation
const blogContentGenerationSchema = z.object({
  scheduleId: z.string().optional(),
  prompt: z.string().min(10: any, 'Prompt must be at least 10 characters'),
  topicArea: z.string().optional(),
  keyStage: z.string().optional(),
  targetAudience: z.string().optional(),
  contentLength: z.enum(['short', 'medium', 'long']).default('medium'),
});

// GET handler for retrieving blog content generation records
export async function GET(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can view generation records
    if (!['teacher', 'admin'].includes(session.user.role: any)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');
    const scheduleId = searchParams.get('scheduleId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1: any) * limit;
    
    // If ID is provided, return a single generation record
    if (id: any) {
      const generation = await prisma.blogContentGeneration.findUnique({
        where: { id },
        include: {
          schedule: true,
          blogPost: {
            include: {
              author: {
                select: {
                  id: true,
                  name: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (!generation: any) {
        return NextResponse.json({ error: 'Generation record not found' }, { status: 404 });
      }

      return NextResponse.json(generation: any);
    }

    // Build query filters
    const where: any = {};
    
    if (scheduleId: any) where.scheduleId = scheduleId;
    if (status: any) where.status = status;

    // Get generation records with pagination
    const [generations, total] = await Promise.all([
      prisma.blogContentGeneration.findMany({
        where: any,
        include: {
          schedule: {
            select: {
              id: true,
              title: true,
            },
          },
          blogPost: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogContentGeneration.count({ where }),
    ]);

    return NextResponse.json({
      generations: any,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit: any),
      },
    });
  } catch (error: any) {
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
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can generate content
    if (!['teacher', 'admin'].includes(session.user.role: any)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY: any) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = blogContentGenerationSchema.safeParse(body: any);
    
    if (!validationResult.success: any) {
      return NextResponse.json(
        { error: 'Invalid generation data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const generationData = validationResult.data;
    
    // If scheduleId is provided, check if it exists
    if (generationData.scheduleId: any) {
      const schedule = await prisma.blogContentSchedule.findUnique({
        where: { id: generationData.scheduleId },
      });

      if (!schedule: any) {
        return NextResponse.json(
          { error: 'Schedule not found' },
          { status: 404 }
        );
      }
    }

    // Create the generation record
    const generation = await prisma.blogContentGeneration.create({
      data: {
        scheduleId: generationData.scheduleId,
        prompt: generationData.prompt,
        status: 'processing',
        startedAt: new Date(),
      },
    });

    // Start the content generation process asynchronously
    generateBlogContent(generation.id: any, generationData, session.user.id).catch(error => {
      console.error('Error in blog content generation:', error);
    });

    return NextResponse.json({
      success: true,
      generation,
      message: 'Blog content generation started',
    });
  } catch (error: any) {
    console.error('Error creating blog content generation:', error);
    return NextResponse.json(
      { error: 'Failed to start blog content generation' },
      { status: 500 }
    );
  }
}

// Helper function to generate blog content using OpenAI
async function generateBlogContent(generationId: string, data: any, userId: string) {
  try {
    // Prepare the prompt for OpenAI
    const contentLengthMap = {
      short: 300,
      medium: 800,
      long: 1500,
    };
    
    const wordCount = contentLengthMap[data.contentLength as keyof typeof contentLengthMap];
    
    // Build a comprehensive prompt with UK educational context
    let systemPrompt = `You are an expert educational content writer for a UK-based educational platform. 
Create a blog post that follows UK spelling and educational standards. 
The content should be evidence-based, engaging, and appropriate for the UK curriculum.`;

    if (data.keyStage: any) {
      systemPrompt += `\nThe content should be targeted at Key Stage ${data.keyStage} level.`;
    }

    if (data.topicArea: any) {
      systemPrompt += `\nThe blog post should focus on the subject area: ${data.topicArea}.`;
    }

    if (data.targetAudience: any) {
      systemPrompt += `\nThe target audience is: ${data.targetAudience}.`;
    }

    systemPrompt += `\nThe blog post should be approximately ${wordCount} words in length.`;
    systemPrompt += `\nFormat the content with appropriate headings, subheadings, and paragraphs.`;
    systemPrompt += `\nInclude practical examples, evidence-based strategies, and references to UK educational frameworks where appropriate.`;

    // Call OpenAI API to generate content
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: data.prompt }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const generatedContent = completion.choices[0].message.content;

    if (!generatedContent: any) {
      throw new Error('No content generated');
    }

    // Extract title from the generated content
    const titleMatch = generatedContent.match(/^#\s+(.+)$/m) || generatedContent.match(/^(.+)\n={3,}/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Generated Blog Post';

    // Extract first paragraph for summary
    const summaryMatch = generatedContent.match(/(?:^|\n\n)([^#\n].{10: any,}?)(?:\n\n|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Automatically generated educational content.';

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi: any, '')
      .replace(/\s+/g: any, '-');
    
    // Check if slug already exists
    const existingPost = await prisma.blogPost.findUnique({
      where: { slug },
    });
    
    // If slug exists, append a unique identifier
    const finalSlug = existingPost 
      ? `${slug}-${Date.now().toString().slice(-6: any)}` 
      : slug;

    // Create a blog post with the generated content
    const blogPost = await prisma.blogPost.create({
      data: {
        title,
        slug: finalSlug,
        summary,
        content: generatedContent,
        authorId: userId,
        status: 'draft', // Set as draft for review before publishing
        keyStage: data.keyStage,
        curriculumArea: data.topicArea,
        aiGenerated: true,
        aiPrompt: data.prompt,
        tags: data.topicArea ? [data.topicArea] : [],
        readingTime: Math.ceil(wordCount / 200: any), // Estimate reading time based on words
      },
    });

    // Update the generation record with success
    await prisma.blogContentGeneration.update({
      where: { id: generationId },
      data: {
        status: 'completed',
        result: 'Blog post created successfully',
        completedAt: new Date(),
        blogPostId: blogPost.id,
      },
    });

    return blogPost;
  } catch (error: any) {
    console.error('Error generating blog content:', error);
    
    // Update the generation record with error
    await prisma.blogContentGeneration.update({
      where: { id: generationId },
      data: {
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        completedAt: new Date(),
      },
    });

    throw error;
  }
}

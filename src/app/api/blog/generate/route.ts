import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
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

// Type definitions for our mock database
interface BlogGeneration {
  id: string;
  scheduleId?: string;
  prompt: string;
  status: string;
  startedAt: Date;
  completedAt?: Date;
  result?: string;
  error?: string;
  blogPostId?: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogSchedule {
  id: string;
  title: string;
  description?: string;
  frequency: string;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  authorId: string;
  status: string;
  keyStage?: string;
  curriculumArea?: string;
  aiGenerated: boolean;
  aiPrompt: string;
  tags: string[];
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

interface WhereFilter {
  scheduleId?: string;
  status?: string;
  slug?: string;
  id?: string;
}

interface OrderBy {
  createdAt?: 'asc' | 'desc';
}

// Mock database for blog content generation
const mockDb = {
  generations: [] as BlogGeneration[],
  schedules: [] as BlogSchedule[],
  blogPosts: [] as BlogPost[],
  
  // Mock methods
  blogContentGeneration: {
    findUnique: async ({ where }: { where: WhereFilter }) => {
      return mockDb.generations.find(g => g.id === where.id) || null;
    },
    findMany: async ({ 
      where, 
      include, 
      orderBy, 
      skip, 
      take 
    }: { 
      where?: WhereFilter; 
      include?: any; 
      orderBy?: OrderBy; 
      skip?: number; 
      take?: number;
    }) => {
      let results = [...mockDb.generations];
      
      // Apply filters
      if (where) {
        if (where.scheduleId) {
          results = results.filter(g => g.scheduleId === where.scheduleId);
        }
        if (where.status) {
          results = results.filter(g => g.status === where.status);
        }
      }
      
      // Apply sorting
      if (orderBy && orderBy.createdAt === 'desc') {
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
      
      // Apply pagination
      if (skip !== undefined && take !== undefined) {
        results = results.slice(skip, skip + take);
      }
      
      return results;
    },
    count: async ({ where }: { where?: WhereFilter }) => {
      let count = mockDb.generations.length;
      
      // Apply filters
      if (where) {
        if (where.scheduleId) {
          count = mockDb.generations.filter(g => g.scheduleId === where.scheduleId).length;
        }
        if (where.status) {
          count = mockDb.generations.filter(g => g.status === where.status).length;
        }
      }
      
      return count;
    },
    create: async ({ data }: { data: Partial<BlogGeneration> }) => {
      const newGeneration: BlogGeneration = {
        id: `gen-${Date.now()}`,
        prompt: data.prompt || '',
        status: data.status || 'processing',
        startedAt: data.startedAt || new Date(),
        scheduleId: data.scheduleId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.generations.push(newGeneration);
      return newGeneration;
    },
    update: async ({ where, data }: { where: WhereFilter; data: Partial<BlogGeneration> }) => {
      const index = mockDb.generations.findIndex(g => g.id === where.id);
      if (index === -1) {
        throw new Error('Generation not found');
      }
      
      const updatedGeneration = {
        ...mockDb.generations[index],
        ...data,
        updatedAt: new Date().toISOString(),
      };
      
      mockDb.generations[index] = updatedGeneration;
      return updatedGeneration;
    }
  },
  
  blogContentSchedule: {
    findUnique: async ({ where }: { where: WhereFilter }) => {
      return mockDb.schedules.find(s => s.id === where.id) || null;
    }
  },
  
  blogPost: {
    findUnique: async ({ where }: { where: WhereFilter }) => {
      return mockDb.blogPosts.find(p => p.slug === where.slug) || null;
    },
    create: async ({ data }: { data: Partial<BlogPost> }) => {
      const newPost: BlogPost = {
        id: `post-${Date.now()}`,
        title: data.title || 'Untitled',
        slug: data.slug || 'untitled',
        summary: data.summary || '',
        content: data.content || '',
        authorId: data.authorId || '',
        status: data.status || 'draft',
        keyStage: data.keyStage,
        curriculumArea: data.curriculumArea,
        aiGenerated: data.aiGenerated || true,
        aiPrompt: data.aiPrompt || '',
        tags: data.tags || [],
        readingTime: data.readingTime || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockDb.blogPosts.push(newPost);
      return newPost;
    }
  }
};

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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const scheduleId = searchParams.get('scheduleId');
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    // If ID is provided, return a single generation record
    if (id) {
      const generation = await mockDb.blogContentGeneration.findUnique({
        where: { id },
      });

      if (!generation) {
        return NextResponse.json({ error: 'Generation record not found' }, { status: 404 });
      }

      return NextResponse.json(generation);
    }

    // Build query filters
    const where: WhereFilter = {};
    
    if (scheduleId) where.scheduleId = scheduleId;
    if (status) where.status = status;

    // Get generation records with pagination
    const [generations, total] = await Promise.all([
      mockDb.blogContentGeneration.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      mockDb.blogContentGeneration.count({ where }),
    ]);

    return NextResponse.json({
      generations,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
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

    // If scheduleId is provided, check if it exists
    if (generationData.scheduleId) {
      const schedule = await mockDb.blogContentSchedule.findUnique({
        where: { id: generationData.scheduleId },
      });

      if (!schedule) {
        return NextResponse.json(
          { error: 'Schedule not found' },
          { status: 404 }
        );
      }
    }

    // Create the generation record
    const generation = await mockDb.blogContentGeneration.create({
      data: {
        scheduleId: generationData.scheduleId,
        prompt: generationData.prompt,
        status: 'processing',
        startedAt: new Date(),
      },
    });

    // Start the content generation process asynchronously
    generateBlogContent(generation.id, generationData, session.user.id).catch(error => {
      console.error('Error in blog content generation:', error);
    });

    return NextResponse.json({
      success: true,
      generation,
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

// Helper function to generate blog content using OpenAI
async function generateBlogContent(generationId: string, data: z.infer<typeof blogContentGenerationSchema>, userId: string) {
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

    if (data.keyStage) {
      systemPrompt += `\nThe content should be targeted at Key Stage ${data.keyStage} level.`;
    }

    if (data.topicArea) {
      systemPrompt += `\nThe blog post should focus on the subject area: ${data.topicArea}.`;
    }

    if (data.targetAudience) {
      systemPrompt += `\nThe target audience is: ${data.targetAudience}.`;
    }

    systemPrompt += `\nThe blog post should be approximately ${wordCount} words in length.`;
    systemPrompt += `\nFormat the content with appropriate headings, subheadings, and paragraphs.`;
    systemPrompt += `\nInclude practical examples, evidence-based strategies, and references to UK educational frameworks where appropriate.`;

    // Mock OpenAI response since we're using the compatibility layer
    // In a real implementation, this would call the OpenAI API
    const generatedContent = `# Generated Blog Post About ${data.topicArea || 'Education'}

## Introduction

This is a mock blog post generated for educational purposes. In a production environment, this would be actual AI-generated content based on your prompt.

## Key Points

- This is a placeholder for Key Stage ${data.keyStage || 'all levels'} content
- The content would be tailored for ${data.targetAudience || 'all educators'}
- It would include evidence-based strategies and practical examples

## Conclusion

Thank you for using our blog generation tool. This mock implementation demonstrates how the feature would work in production.`;

    // Extract title from the generated content
    const titleMatch = generatedContent.match(/^#\s+(.+)$/m) || generatedContent.match(/^(.+)\n={3,}/m);
    const title = titleMatch ? titleMatch[1].trim() : 'Generated Blog Post';

    // Extract first paragraph for summary
    const summaryMatch = generatedContent.match(/(?:^|\n\n)([^#\n].{10,}?)(?:\n\n|$)/);
    const summary = summaryMatch ? summaryMatch[1].trim() : 'Automatically generated educational content.';

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');

    // Check if slug already exists
    const existingPost = await mockDb.blogPost.findUnique({
      where: { slug },
    });

    // If slug exists, append a unique identifier
    const finalSlug = existingPost
      ? `${slug}-${Date.now().toString().slice(-6)}`
      : slug;

    // Create a blog post with the generated content
    const blogPost = await mockDb.blogPost.create({
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
        readingTime: Math.ceil(wordCount / 200), // Estimate reading time based on words
      },
    });

    // Update the generation record with success
    await mockDb.blogContentGeneration.update({
      where: { id: generationId },
      data: {
        status: 'completed',
        result: 'Blog post created successfully',
        completedAt: new Date(),
        blogPostId: blogPost.id,
      },
    });

    return blogPost;
  } catch (error) {
    console.error('Error generating blog content:', error);

    // Update the generation record with error
    await mockDb.blogContentGeneration.update({
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

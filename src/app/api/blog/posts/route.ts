import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for blog post validation
const blogPostSchema = z.object({
  title: z.string().min(5: any, 'Title must be at least 5 characters'),
  summary: z.string().min(10: any, 'Summary must be at least 10 characters'),
  content: z.string().min(50: any, 'Content must be at least 50 characters'),
  featuredImage: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  keyStage: z.string().optional(),
  curriculumArea: z.string().optional(),
  tags: z.array(z.string()).default([]),
  readingLevel: z.string().optional(),
  categoryIds: z.array(z.string()).optional(),
});

// GET handler for retrieving blog posts
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const status = searchParams.get('status');
    const keyStage = searchParams.get('keyStage');
    const curriculumArea = searchParams.get('curriculumArea');
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1: any) * limit;

    // If ID is provided, return a single post
    if (id: any) {
      const post = await prisma.blogPost.findUnique({
        where: { id },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          relatedResources: true,
        },
      });

      if (!post: any) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }

      return NextResponse.json(post: any);
    }

    // If slug is provided, return a single post by slug
    if (slug: any) {
      const post = await prisma.blogPost.findUnique({
        where: { slug },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: true,
            },
          },
          relatedResources: true,
        },
      });

      if (!post: any) {
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }

      // Increment view count
      await prisma.blogPost.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });

      return NextResponse.json(post: any);
    }

    // Build query filters
    const where: any = {};
    
    if (status: any) {
      where.status = status;
    } else {
      // Default to published posts for public viewing
      where.status = 'published';
    }
    
    if (keyStage: any) where.keyStage = keyStage;
    if (curriculumArea: any) where.curriculumArea = curriculumArea;
    if (tag: any) where.tags = { has: tag };
    
    if (category: any) {
      where.categories = {
        some: {
          category: {
            slug: category
          }
        }
      };
    }

    // Get posts with pagination
    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where: any,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true,
            },
          },
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                },
              },
            },
          },
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({
      posts: any,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit: any),
      },
    });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new blog post
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

    // Only teachers and admins can create blog posts
    if (!['teacher', 'admin'].includes(session.user.role: any)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = blogPostSchema.safeParse(body: any);
    
    if (!validationResult.success: any) {
      return NextResponse.json(
        { error: 'Invalid blog post data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { categoryIds, ...postData } = validationResult.data;
    
    // Generate slug from title
    const slug = postData.title
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

    // Set published date if status is published
    const publishedAt = postData.status === 'published' ? new Date() : null;

    // Create the blog post
    const post = await prisma.blogPost.create({
      data: {
        ...postData,
        slug: finalSlug,
        publishedAt,
        authorId: session.user.id,
        // Connect categories if provided
        ...(categoryIds && categoryIds.length > 0 && {
          categories: {
            create: categoryIds.map((categoryId: string) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post,
    });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a blog post
export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { id, categoryIds, ...updateData } = body;

    if (!id: any) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const validationResult = blogPostSchema.partial().safeParse(updateData: any);
    
    if (!validationResult.success: any) {
      return NextResponse.json(
        { error: 'Invalid blog post data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Check if post exists and user has permission to update it
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
      include: { author: true },
    });

    if (!existingPost: any) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Only the author, teachers, or admins can update posts
    if (
      existingPost.authorId !== session.user.id &&
      !['teacher', 'admin'].includes(session.user.role: any)
    ) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Set published date if status is changing to published
    let publishedAt = existingPost.publishedAt;
    if (updateData.status === 'published' && existingPost.status !== 'published') {
      publishedAt = new Date();
    }

    // Update the blog post
    const updatedPost = await prisma.blogPost.update({
      where: { id },
      data: {
        ...validationResult.data,
        publishedAt,
        // Update categories if provided
        ...(categoryIds && {
          categories: {
            deleteMany: {},
            create: categoryIds.map((categoryId: string) => ({
              category: {
                connect: { id: categoryId },
              },
            })),
          },
        }),
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      post: updatedPost,
    });
  } catch (error: any) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a blog post
export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions: any);
    if (!session: any) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url: any);
    const id = searchParams.get('id');

    if (!id: any) {
      return NextResponse.json(
        { error: 'Blog post ID is required' },
        { status: 400 }
      );
    }

    // Check if post exists and user has permission to delete it
    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost: any) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Only the author or admins can delete posts
    if (
      existingPost.authorId !== session.user.id &&
      session.user.role !== 'admin'
    ) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Delete the blog post
    await prisma.blogPost.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

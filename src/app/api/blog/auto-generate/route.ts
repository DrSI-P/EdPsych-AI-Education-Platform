/**
 * Automatic Blog Post Generation API
 * 
 * This API route handles the generation, management, and retrieval of
 * automatically generated blog posts for the EdPsych AI Education Platform.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';
import { 
  generateBlogPost, 
  saveBlogPost, 
  BLOG_CATEGORIES, 
  BLOG_AUDIENCES,
  generateBlogPostIdeas
} from '@/lib/blog/blog-service';

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check if user has admin or content creator role
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true, role: true }
    });
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'CONTENT_CREATOR')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Parse the request body
    const body = await req.json();
    const { 
      topic, 
      audience, 
      category, 
      keyPoints, 
      tone, 
      wordCount,
      action = 'generate' // Default action is to generate a blog post
    } = body;
    
    // Handle different actions
    if (action === 'generate') {
      // Validate required fields
      if (!topic || !audience || !category) {
        return NextResponse.json(
          { error: 'Missing required fields' },
          { status: 400 }
        );
      }
      
      // Validate category
      if (!BLOG_CATEGORIES.includes(category)) {
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        );
      }
      
      // Validate audience (can be an array)
      const audienceArray = Array.isArray(audience) ? audience : [audience];
      for (const aud of audienceArray) {
        if (!BLOG_AUDIENCES.includes(aud)) {
          return NextResponse.json(
            { error: `Invalid audience: ${aud}` },
            { status: 400 }
          );
        }
      }
      
      // Generate the blog post
      const generatedPost = await generateBlogPost({
        topic,
        audience: audienceArray,
        category,
        keyPoints,
        tone,
        wordCount,
      });
      
      // Save the blog post to the database
      const postId = await saveBlogPost({
        title: generatedPost.title,
        content: generatedPost.content,
        summary: generatedPost.summary,
        category,
        tags: generatedPost.tags,
        targetAudience: audienceArray,
        status: 'draft',
        authorId: user.id,
        aiGenerationPrompt: JSON.stringify({
          topic,
          audience: audienceArray,
          category,
          keyPoints,
          tone,
          wordCount,
        }),
        seoTitle: generatedPost.seoTitle,
        seoDescription: generatedPost.seoDescription,
      });
      
      return NextResponse.json({
        id: postId,
        ...generatedPost,
        status: 'draft',
      });
    } else if (action === 'generate-ideas') {
      // Generate blog post ideas
      const count = body.count || 5;
      const topics = body.topics;
      
      const ideas = await generateBlogPostIdeas(count, topics);
      
      return NextResponse.json({ ideas });
    } else {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error generating blog post:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate blog post' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // Get the authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url);
    const status = url.searchParams.get('status') || 'draft';
    const category = url.searchParams.get('category');
    const audience = url.searchParams.get('audience');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    
    // Check if user has admin or content creator role
    const user = await db.user.findUnique({
      where: { email: session.user.email as string },
      select: { id: true, role: true }
    });
    
    if (!user || (user.role !== 'ADMIN' && user.role !== 'CONTENT_CREATOR')) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Get blog posts with filtering
    const result = await db.blogPost.findMany({
      where: {
        status: status as any,
        ...(category ? { category } : {}),
        ...(audience ? { targetAudience: { has: audience } } : {}),
        isAutomaticallyGenerated: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true
          }
        },
        reviewer: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });
    
    // Get total count for pagination
    const total = await db.blogPost.count({
      where: {
        status: status as any,
        ...(category ? { category } : {}),
        ...(audience ? { targetAudience: { has: audience } } : {}),
        isAutomaticallyGenerated: true,
      }
    });
    
    return NextResponse.json({
      posts: result,
      total,
      pages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

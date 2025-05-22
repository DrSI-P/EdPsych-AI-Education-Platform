import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for blog post creation/update
const BlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  content: z.string().min(50, "Content must be at least 50 characters long"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters long").max(300, "Excerpt must be less than 300 characters"),
  category: z.string(),
  tags: z.array(z.string()),
  curriculumAreas: z.array(z.string()),
  ageRanges: z.array(z.string()),
  isDraft: z.boolean().default(true),
  isPrivate: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  allowComments: z.boolean().default(true),
  publishDate: z.string().optional(),
  featuredImage: z.string().optional(),
  authorId: z.string()
});

// Schema for comment creation
const CommentSchema = z.object({
  postId: z.string(),
  content: z.string().min(5, "Comment must be at least 5 characters long"),
  parentId: z.string().optional(), // For replies
  authorId: z.string()
});

// Schema for AI content generation
const AIGenerationSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters long"),
  type: z.enum(["title", "excerpt", "content", "tags", "complete"]),
  context: z.string().optional(),
  tone: z.string().optional(),
  targetAudience: z.string().optional(),
  curriculumFocus: z.string().optional(),
  ageRange: z.string().optional(),
  length: z.number().optional()
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const author = searchParams.get('author');
    const query = searchParams.get('query');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const featured = searchParams.get('featured') === 'true';
    const curriculumArea = searchParams.get('curriculumArea');
    const ageRange = searchParams.get('ageRange');

    // Mock data response - in a real implementation, this would query a database
    const mockPosts = [
      {
        id: '1',
        title: 'AI-Powered Differentiation: Transforming Inclusive Education',
        excerpt: 'Explore how artificial intelligence is revolutionizing differentiated instruction in UK classrooms, providing personalized support for all learners.',
        author: {
          id: '101',
          name: 'Dr. Emma Wilson',
          avatar: '/avatars/emma-wilson.jpg',
          role: 'Educational Psychologist'
        },
        publishedAt: '2025-05-15',
        category: 'Inclusive Education',
        tags: ['AI', 'Differentiation', 'Inclusion', 'Personalized Learning'],
        featured: true,
        views: 1850,
        likes: 124,
        comments: 32,
        curriculumAreas: ['SEND', 'Inclusive Practise'],
        ageRanges: ['KS2', 'KS3', 'KS4']
      },
      {
        id: '2',
        title: 'Evidence-Based Approaches to Supporting Executive Function',
        excerpt: 'A comprehensive review of research-backed strategies for developing executive function skills in primary and secondary education.',
        author: {
          id: '102',
          name: 'Prof. James Thompson',
          avatar: '/avatars/james-thompson.jpg',
          role: 'Cognitive Psychologist'
        },
        publishedAt: '2025-05-10',
        category: 'Cognitive Development',
        tags: ['Executive Function', 'Working Memory', 'Self-Regulation', 'Metacognition'],
        featured: true,
        views: 1420,
        likes: 98,
        comments: 27,
        curriculumAreas: ['PSHE', 'Learning Skills'],
        ageRanges: ['KS1', 'KS2', 'KS3']
      }
    ];

    // If an ID is provided, return a single post
    if (id) {
      const post = mockPosts.find(p => p.id === id);
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      return NextResponse.json(post);
    }

    // Apply filters based on query parameters
    let filteredPosts = [...mockPosts];
    
    if (category) {
      filteredPosts = filteredPosts.filter(p => p.category === category);
    }
    
    if (tag) {
      filteredPosts = filteredPosts.filter(p => Array.isArray(p.tags) && p.tags.includes(tag));
    }
    
    if (author) {
      filteredPosts = filteredPosts.filter(p => p.author.id === author);
    }
    
    if (query) {
      const searchQuery = query.toLowerCase();
      filteredPosts = filteredPosts.filter(p => 
        p.title.toLowerCase().includes(searchQuery) || 
        p.excerpt.toLowerCase().includes(searchQuery)
      );
    }
    
    if (featured) {
      filteredPosts = filteredPosts.filter(p => p.featured);
    }
    
    if (curriculumArea) {
      filteredPosts = filteredPosts.filter(p => Array.isArray(p.curriculumAreas) && p.curriculumAreas.includes(curriculumArea));
    }
    
    if (ageRange) {
      filteredPosts = filteredPosts.filter(p => Array.isArray(p.ageRanges) && p.ageRanges.includes(ageRange));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    
    // Return paginated results with metadata
    return NextResponse.json({
      posts: paginatedPosts,
      pagination: {
        total: filteredPosts.length,
        page,
        limit,
        pages: Math.ceil(filteredPosts.length / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is an AI generation request
    if (body.isAIGeneration) {
      try {
        const validatedData = AIGenerationSchema.parse(body);
        
        // Mock AI generation response
        let aiResponse;
        switch (validatedData.type) {
          case 'title':
            aiResponse = {
              title: 'AI-Enhanced Approaches to Supporting Executive Function in the Classroom'
            };
            break;
          case 'excerpt':
            aiResponse = {
              excerpt: 'Discover evidence-based strategies for supporting executive function development in students, enhanced by artificial intelligence tools that can provide personalized scaffolding and real-time feedback.'
            };
            break;
          case 'content':
            aiResponse = {
              content: `## AI-Enhanced Executive Function Support\n\nExecutive function skills are critical for academic success and lifelong learning. These cognitive processes include working memory, cognitive flexibility, and inhibitory control. Recent research has demonstrated that targeted interventions, particularly when enhanced with AI-driven personalization, can significantly improve these skills in students of all ages.\n\n### Evidence-Based Approaches\n\nMultiple studies have shown that explicit instruction in executive function strategies, combined with regular practise and feedback, leads to measurable improvements in student performance across subject areas. For example, a 2023 study by Thompson et al. found that students who received structured executive function training showed a 27% improvement in task completion and a 32% reduction in off-task behaviour.`
            };
            break;
          case 'tags':
            aiResponse = {
              tags: ['Executive Function', 'Working Memory', 'AI', 'Cognitive Development', 'Self-Regulation']
            };
            break;
          case 'complete':
            aiResponse = {
              title: 'AI-Enhanced Approaches to Supporting Executive Function in the Classroom',
              excerpt: 'Discover evidence-based strategies for supporting executive function development in students, enhanced by artificial intelligence tools that can provide personalized scaffolding and real-time feedback.',
              content: `## Introduction\n\nExecutive function skills are critical for academic success and lifelong learning. These cognitive processes include working memory, cognitive flexibility, and inhibitory control. Recent research has demonstrated that targeted interventions, particularly when enhanced with AI-driven personalization, can significantly improve these skills in students of all ages.\n\n## Evidence-Based Approaches\n\nMultiple studies have shown that explicit instruction in executive function strategies, combined with regular practise and feedback, leads to measurable improvements in student performance across subject areas. For example, a 2023 study by Thompson et al. found that students who received structured executive function training showed a 27% improvement in task completion and a 32% reduction in off-task behaviour.\n\n## AI-Enhanced Interventions\n\nArtificial intelligence offers several promising approaches to enhance executive function support:\n\n### 1. Personalized Scaffolding\n\nAI systems can analyse student performance patterns to provide just-in-time scaffolding tailored to individual needs. For example, the CogniAssist platform uses AI to identify when a student is struggling with task initiation and provides personalized prompts and breaking tasks into smaller steps.\n\n### 2. Real-time Feedback\n\nAI tools can provide immediate, specific feedback on executive function skills during learning activities. Research by Johnson et al. (2024) found that students receiving AI-generated feedback on their planning strategies showed significant improvements in organizational skills compared to traditional delayed feedback methods.\n\n### 3. Adaptive Challenge Levels\n\nAI can dynamically adjust the difficulty of executive function challenges based on student performance, maintaining an optimal level of challenge. The FlexMind program uses this approach to gradually build working memory capacity through increasingly complex but appropriately challenging tasks.\n\n## Implementation Considerations\n\nWhen implementing AI-enhanced executive function support, educators should consider:\n\n- Maintaining the balance between AI support and developing student independence\n- Ensuring that AI tools align with evidence-based executive function frameworks\n- Providing teacher training on interpreting AI insights and integrating them with classroom practise\n- Monitoring for potential biases in AI systems that might affect different student populations\n\n## Conclusion\n\nThe integration of AI tools with evidence-based executive function support strategies offers promising opportunities to enhance student cognitive development. By leveraging these technologies thoughtfully, educators can provide more personalized, responsive support while building essential skills for academic and life success.`,
              tags: ['Executive Function', 'Working Memory', 'AI', 'Cognitive Development', 'Self-Regulation'],
              curriculumAreas: ['PSHE', 'Learning Skills', 'Cross-Curricular'],
              ageRanges: ['KS2', 'KS3', 'KS4']
            };
            break;
          default:
            aiResponse = { error: 'Invalid generation type' };
        }
        
        return NextResponse.json({
          success: true,
          data: aiResponse
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    // If this is a comment submission
    if (body.isComment) {
      try {
        const validatedData = CommentSchema.parse(body);
        
        // Mock comment creation response
        return NextResponse.json({
          success: true,
          comment: {
            id: Math.floor(Math.random() * 1000).toString(),
            ...validatedData,
            publishedAt: new Date().toISOString(),
            likes: 0,
            replies: []
          }
        });
      } catch (error) {
        if (error instanceof z.ZodError) {
          return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        throw error;
      }
    }
    
    // Regular blog post creation
    try {
      const validatedData = BlogPostSchema.parse(body);
      
      // Mock post creation response
      return NextResponse.json({
        success: true,
        post: {
          id: Math.floor(Math.random() * 1000).toString(),
          ...validatedData,
          publishedAt: validatedData.publishDate || new Date().toISOString(),
          views: 0,
          likes: 0,
          comments: 0
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    
    const body = await request.json();
    
    try {
      const validatedData = BlogPostSchema.parse(body);
      
      // Mock post update response
      return NextResponse.json({
        success: true,
        post: {
          id,
          ...validatedData,
          updatedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json({ error: error.errors }, { status: 400 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }
    
    // Mock post deletion response
    return NextResponse.json({
      success: true,
      message: `Post ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}

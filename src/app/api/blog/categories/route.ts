import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { z } from 'zod';

// Schema for blog category validation
const blogCategorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().optional(),
  parentId: z.string().optional(),
});

// GET handler for retrieving blog categories
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const slug = searchParams.get('slug');
    const parentId = searchParams.get('parentId');
    
    // If ID is provided, return a single category
    if (id) {
      const category = await prisma.blogCategory.findUnique({
        where: { id },
        include: {
          parent: true,
          children: true,
          posts: {
            include: {
              post: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  summary: true,
                  featuredImage: true,
                  publishedAt: true,
                },
              },
            },
            take: 10,
          },
        },
      });

      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      return NextResponse.json(category);
    }

    // If slug is provided, return a single category by slug
    if (slug) {
      const category = await prisma.blogCategory.findUnique({
        where: { slug },
        include: {
          parent: true,
          children: true,
          posts: {
            include: {
              post: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                  summary: true,
                  featuredImage: true,
                  publishedAt: true,
                },
              },
            },
            take: 10,
          },
        },
      });

      if (!category) {
        return NextResponse.json({ error: 'Category not found' }, { status: 404 });
      }

      return NextResponse.json(category);
    }

    // Build query filters
    const where: any = {};
    
    // Filter by parent ID (or null for top-level categories)
    if (parentId === 'null') {
      where.parentId = null;
    } else if (parentId) {
      where.parentId = parentId;
    }

    // Get categories
    const categories = await prisma.blogCategory.findMany({
      where,
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        children: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            posts: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}

// POST handler for creating a new blog category
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

    // Only teachers and admins can create categories
    if (!['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse and validate request body
    const body = await req.json();
    const validationResult = blogCategorySchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid category data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const categoryData = validationResult.data;
    
    // Generate slug from name
    const slug = categoryData.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, '')
      .replace(/\s+/g, '-');
    
    // Check if slug already exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { slug },
    });
    
    // If slug exists, append a unique identifier
    const finalSlug = existingCategory 
      ? `${slug}-${Date.now().toString().slice(-6)}` 
      : slug;

    // Create the category
    const category = await prisma.blogCategory.create({
      data: {
        ...categoryData,
        slug: finalSlug,
      },
    });

    return NextResponse.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error('Error creating blog category:', error);
    return NextResponse.json(
      { error: 'Failed to create blog category' },
      { status: 500 }
    );
  }
}

// PUT handler for updating a blog category
export async function PUT(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only teachers and admins can update categories
    if (!['teacher', 'admin'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await req.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Validate update data
    const validationResult = blogCategorySchema.partial().safeParse(updateData);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid category data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Prevent circular references in hierarchy
    if (updateData.parentId) {
      // Check if the new parent is not the category itself
      if (updateData.parentId === id) {
        return NextResponse.json(
          { error: 'A category cannot be its own parent' },
          { status: 400 }
        );
      }

      // Check if the new parent is not a descendant of the category
      const isDescendant = await checkIfDescendant(id, updateData.parentId);
      if (isDescendant) {
        return NextResponse.json(
          { error: 'Cannot create circular reference in category hierarchy' },
          { status: 400 }
        );
      }
    }

    // Update slug if name is changing
    let slug = existingCategory.slug;
    if (updateData.name && updateData.name !== existingCategory.name) {
      slug = updateData.name
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      
      // Check if new slug already exists
      const slugExists = await prisma.blogCategory.findFirst({
        where: { 
          slug,
          id: { not: id }
        },
      });
      
      // If slug exists, append a unique identifier
      if (slugExists) {
        slug = `${slug}-${Date.now().toString().slice(-6)}`;
      }
    }

    // Update the category
    const updatedCategory = await prisma.blogCategory.update({
      where: { id },
      data: {
        ...validationResult.data,
        slug,
      },
    });

    return NextResponse.json({
      success: true,
      category: updatedCategory,
    });
  } catch (error) {
    console.error('Error updating blog category:', error);
    return NextResponse.json(
      { error: 'Failed to update blog category' },
      { status: 500 }
    );
  }
}

// DELETE handler for deleting a blog category
export async function DELETE(req: NextRequest) {
  try {
    // Verify authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Only admins can delete categories
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.blogCategory.findUnique({
      where: { id },
      include: {
        children: true,
        posts: true,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Check if category has children
    if (existingCategory.children.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with subcategories' },
        { status: 400 }
      );
    }

    // Delete the category
    await prisma.blogCategory.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting blog category:', error);
    return NextResponse.json(
      { error: 'Failed to delete blog category' },
      { status: 500 }
    );
  }
}

// Helper function to check if a category is a descendant of another
async function checkIfDescendant(categoryId: string, potentialDescendantId: string): Promise<boolean> {
  const potentialDescendant = await prisma.blogCategory.findUnique({
    where: { id: potentialDescendantId },
    select: { parentId: true },
  });

  if (!potentialDescendant || !potentialDescendant.parentId) {
    return false;
  }

  if (potentialDescendant.parentId === categoryId) {
    return true;
  }

  return checkIfDescendant(categoryId, potentialDescendant.parentId);
}

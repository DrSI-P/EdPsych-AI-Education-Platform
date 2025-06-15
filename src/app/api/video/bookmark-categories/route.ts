import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

// Schema for category creation
const createCategorySchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i).or(z.string().regex(/^(rgb|rgba|hsl|hsla)\(.*\)$/)).optional(),
  icon: z.string().max(50).optional(),
});

// Schema for category update
const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(50).optional(),
  color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i).or(z.string().regex(/^(rgb|rgba|hsl|hsla)\(.*\)$/)).optional(),
  icon: z.string().max(50).optional(),
});

/**
 * GET /api/video/bookmark-categories
 * Retrieve bookmark categories for a user
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get categories
    const categories = await db.bookmarkCategory.findMany({
      where: {
        userId,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching bookmark categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmark categories' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/video/bookmark-categories
 * Create a new bookmark category
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validationResult = createCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { name, color, icon } = validationResult.data;

    // Check if category with same name already exists for this user
    const existingCategory = await db.bookmarkCategory.findFirst({
      where: {
        userId,
        name: {
          equals: name,
          mode: 'insensitive', // Case-insensitive comparison
        },
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' },
        { status: 409 }
      );
    }

    // Create category
    const category = await db.bookmarkCategory.create({
      data: {
        userId,
        name,
        color,
        icon,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark category:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark category' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/video/bookmark-categories
 * Update an existing bookmark category
 */
export async function PUT(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await request.json();

    // Validate request body
    const validationResult = updateCategorySchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { id, name, color, icon } = validationResult.data;

    // Check if category exists and belongs to user
    const existingCategory = await db.bookmarkCategory.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found or access denied' },
        { status: 404 }
      );
    }

    // If name is being updated, check for duplicates
    if (name && name !== existingCategory.name) {
      const duplicateName = await db.bookmarkCategory.findFirst({
        where: {
          userId,
          id: {
            not: id,
          },
          name: {
            equals: name,
            mode: 'insensitive', // Case-insensitive comparison
          },
        },
      });

      if (duplicateName) {
        return NextResponse.json(
          { error: 'A category with this name already exists' },
          { status: 409 }
        );
      }
    }

    // Update category
    const updatedCategory = await db.bookmarkCategory.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(color !== undefined && { color }),
        ...(icon !== undefined && { icon }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCategory);
  } catch (error) {
    console.error('Error updating bookmark category:', error);
    return NextResponse.json(
      { error: 'Failed to update bookmark category' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/video/bookmark-categories
 * Delete a bookmark category
 */
export async function DELETE(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    // Check if category exists and belongs to user
    const existingCategory = await db.bookmarkCategory.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found or access denied' },
        { status: 404 }
      );
    }

    // Check if category has bookmarks
    const bookmarksCount = await db.bookmark.count({
      where: {
        categoryId: id,
      },
    });

    // Delete category
    await db.bookmarkCategory.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true,
      bookmarksAffected: bookmarksCount
    });
  } catch (error) {
    console.error('Error deleting bookmark category:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark category' },
      { status: 500 }
    );
  }
}
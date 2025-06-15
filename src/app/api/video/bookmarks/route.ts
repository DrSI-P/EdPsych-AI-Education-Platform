import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

export const dynamic = "force-dynamic";

// Schema for bookmark creation
const createBookmarkSchema = z.object({
  videoId: z.string().uuid(),
  timeCode: z.number().min(0),
  title: z.string().min(1).max(255),
  notes: z.string().max(2000).optional(),
  category: z.string().uuid().optional(),
});

// Schema for bookmark update
const updateBookmarkSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(255).optional(),
  notes: z.string().max(2000).optional(),
  category: z.string().uuid().optional(),
});

/**
 * GET /api/video/bookmarks
 * Retrieve bookmarks for a user, optionally filtered by video
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('videoId');

    // Build query
    let query = db.bookmark.findMany({
      where: {
        userId,
        ...(videoId ? { videoId } : {}),
      },
      orderBy: {
        timeCode: 'asc',
      },
      include: {
        category: true,
      },
    });

    const bookmarks = await query;

    return NextResponse.json(bookmarks);
  } catch (error) {
    console.error('Error fetching bookmarks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookmarks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/video/bookmarks
 * Create a new bookmark
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
    const validationResult = createBookmarkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { videoId, timeCode, title, notes, category } = validationResult.data;

    // Check if video exists
    const video = await db.video.findUnique({
      where: { id: videoId },
    });

    if (!video) {
      return NextResponse.json(
        { error: 'Video not found' },
        { status: 404 }
      );
    }

    // Check if category exists if provided
    if (category) {
      const categoryExists = await db.bookmarkCategory.findFirst({
        where: {
          id: category,
          userId,
        },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Create bookmark
    const bookmark = await db.bookmark.create({
      data: {
        videoId,
        userId,
        timeCode,
        title,
        notes,
        categoryId: category,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(bookmark, { status: 201 });
  } catch (error) {
    console.error('Error creating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to create bookmark' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/video/bookmarks
 * Update an existing bookmark
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
    const validationResult = updateBookmarkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.format() },
        { status: 400 }
      );
    }

    const { id, title, notes, category } = validationResult.data;

    // Check if bookmark exists and belongs to user
    const existingBookmark = await db.bookmark.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingBookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found or access denied' },
        { status: 404 }
      );
    }

    // Check if category exists if provided
    if (category) {
      const categoryExists = await db.bookmarkCategory.findFirst({
        where: {
          id: category,
          userId,
        },
      });

      if (!categoryExists) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }
    }

    // Update bookmark
    const updatedBookmark = await db.bookmark.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(notes !== undefined && { notes }),
        ...(category !== undefined && { categoryId: category || null }),
        updatedAt: new Date(),
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(updatedBookmark);
  } catch (error) {
    console.error('Error updating bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to update bookmark' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/video/bookmarks
 * Delete a bookmark
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
        { error: 'Bookmark ID is required' },
        { status: 400 }
      );
    }

    // Check if bookmark exists and belongs to user
    const existingBookmark = await db.bookmark.findFirst({
      where: {
        id,
        userId,
      },
    });

    if (!existingBookmark) {
      return NextResponse.json(
        { error: 'Bookmark not found or access denied' },
        { status: 404 }
      );
    }

    // Delete bookmark
    await db.bookmark.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting bookmark:', error);
    return NextResponse.json(
      { error: 'Failed to delete bookmark' },
      { status: 500 }
    );
  }
}
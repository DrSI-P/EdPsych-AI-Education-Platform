// Database utilities for EdPsych Connect
import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // Use a global variable to prevent multiple instances during development
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export { prisma };

// Helper functions for common database operations
export async function getBlogPost(slug: string) {
  try {
    return await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        author: true,
        category: true,
      },
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return null;
  }
}

export async function getBlogPosts(limit = 10, offset = 0, categoryId?: string) {
  try {
    const where = categoryId ? { categoryId } : {};
    
    return await prisma.blogPost.findMany({
      where,
      include: {
        author: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export async function getBlogCategories() {
  try {
    return await prisma.blogCategory.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return [];
  }
}

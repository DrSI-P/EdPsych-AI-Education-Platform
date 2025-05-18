import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define schemas for validation
const ResourceCategorySchema = z.enum(['guide', 'video', 'activity', 'printable', 'course']);
const AgeGroupSchema = z.enum(['early-years', 'primary', 'secondary', 'all-ages']);
const DifficultyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

const ResourceSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: ResourceCategorySchema,
  ageGroups: z.array(AgeGroupSchema).min(1, "At least one age group must be selected"),
  difficultyLevel: DifficultyLevelSchema,
  content: z.string().min(10, "Content must be at least 10 characters"),
  videoUrl: z.string().url().optional().nullable(),
  downloadUrl: z.string().optional().nullable(),
  estimatedTime: z.string().optional().nullable(),
  tags: z.array(z.string()),
});

const FavoriteSchema = z.object({
  resourceId: z.string(),
  isFavorite: z.boolean(),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const ageGroup = url.searchParams.get("ageGroup");
    const difficultyLevel = url.searchParams.get("difficultyLevel");
    const search = url.searchParams.get("search");
    const userId = url.searchParams.get("userId");

    // Build filter object
    const filter: any = {};
    
    if (category && category !== "all") {
      filter.category = category;
    }
    
    if (ageGroup && ageGroup !== "all") {
      filter.ageGroups = {
        has: ageGroup
      };
    }
    
    if (difficultyLevel && difficultyLevel !== "all") {
      filter.difficultyLevel = difficultyLevel;
    }
    
    if (search) {
      filter.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ];
    }

    // Get resources
    const resources = await prisma.parentEducationResource.findMany({
      where: filter,
      orderBy: { title: 'asc' },
    });

    // If userId is provided, get favorites
    let resourcesWithFavorites = resources;
    if (userId) {
      const favorites = await prisma.parentEducationFavorite.findMany({
        where: { userId },
        select: { resourceId: true }
      });
      
      const favoriteIds = favorites.map(fav => fav.resourceId);
      
      resourcesWithFavorites = resources.map(resource => ({
        ...resource,
        isFavorite: favoriteIds.includes(resource.id)
      }));
    }

    return NextResponse.json(resourcesWithFavorites);
  } catch (error) {
    console.error("Error fetching parent education resources:", error);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Check if this is a favorite toggle request
    if (body.action === "toggleFavorite") {
      const validatedData = FavoriteSchema.parse(body);
      const { resourceId, isFavorite } = validatedData;
      const userId = body.userId;
      
      if (!userId) {
        return NextResponse.json(
          { error: "User ID is required" },
          { status: 400 }
        );
      }
      
      if (isFavorite) {
        // Add to favorites
        await prisma.parentEducationFavorite.create({
          data: {
            userId,
            resourceId
          }
        });
      } else {
        // Remove from favorites
        await prisma.parentEducationFavorite.deleteMany({
          where: {
            userId,
            resourceId
          }
        });
      }
      
      return NextResponse.json({ success: true });
    }
    
    // Otherwise, this is a resource creation request
    const validatedData = ResourceSchema.parse(body);
    
    const resource = await prisma.parentEducationResource.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        ageGroups: validatedData.ageGroups,
        difficultyLevel: validatedData.difficultyLevel,
        content: validatedData.content,
        videoUrl: validatedData.videoUrl || null,
        downloadUrl: validatedData.downloadUrl || null,
        estimatedTime: validatedData.estimatedTime || null,
        tags: validatedData.tags,
      }
    });
    
    return NextResponse.json(resource);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error creating parent education resource:", error);
    return NextResponse.json(
      { error: "Failed to create resource" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }
    
    const validatedData = ResourceSchema.partial().parse(data);
    
    const resource = await prisma.parentEducationResource.update({
      where: { id },
      data: validatedData
    });
    
    return NextResponse.json(resource);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors },
        { status: 400 }
      );
    }
    
    console.error("Error updating parent education resource:", error);
    return NextResponse.json(
      { error: "Failed to update resource" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return NextResponse.json(
        { error: "Resource ID is required" },
        { status: 400 }
      );
    }
    
    await prisma.parentEducationResource.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting parent education resource:", error);
    return NextResponse.json(
      { error: "Failed to delete resource" },
      { status: 500 }
    );
  }
}

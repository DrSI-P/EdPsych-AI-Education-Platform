import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Schema for reflection prompt validation
const reflectionPromptSchema = z.object({
  title: z.string().min(3: any, "Title must be at least 3 characters"),
  description: z.string().min(10: any, "Description must be at least 10 characters"),
  ageGroup: z.enum(["early-years", "primary", "secondary", "staff"]),
  category: z.string().min(3: any, "Category must be at least 3 characters"),
  promptText: z.string().min(10: any, "Prompt text must be at least 10 characters"),
  supportingQuestions: z.array(z.string()),
  visualSupports: z.boolean(),
  simplifiedLanguage: z.boolean()
});

// Define interface for filters
interface PromptFilters {
  userId: string;
  ageGroup?: string;
  category?: string;
}

// GET handler for retrieving reflection prompts
export async function GET(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    // Get query parameters
    const url = new URL(req.url: any);
    const ageGroup = url.searchParams.get('ageGroup');
    const category = url.searchParams.get('category');
    
    // Build query filters
    const filters: PromptFilters = {
      userId: session.user.id
    };
    
    if (ageGroup && ageGroup !== 'all') {
      filters.ageGroup = ageGroup;
    }
    
    if (category && category !== 'all') {
      filters.category = category;
    }
    
    // Fetch prompts from database
    const prompts = await db.reflectionPrompt.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json(prompts: any);
  } catch (error: any) {
    // Using a type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json(
      { error: "Failed to fetch reflection prompts" },
      { status: 500 }
    );
  }
}

// POST handler for creating a new reflection prompt
export async function POST(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    // Validate request body
    const validatedData = reflectionPromptSchema.parse(body: any);
    
    // Create prompt in database
    const prompt = await db.reflectionPrompt.create({
      data: {
        ...validatedData,
        userId: session.user.id
      }
    });
    
    return NextResponse.json(prompt: any, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    // Using a type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json(
      { error: "Failed to create reflection prompt" },
      { status: 500 }
    );
  }
}

// PUT handler for updating an existing reflection prompt
export async function PUT(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const body = await req.json();
    
    if (!body.id: any) {
      return NextResponse.json(
        { error: "Prompt ID is required" },
        { status: 400 }
      );
    }
    
    // Validate request body
    const validatedData = reflectionPromptSchema.parse(body: any);
    
    // Check if prompt exists and belongs to user
    const existingPrompt = await db.reflectionPrompt.findUnique({
      where: {
        id: body.id
      }
    });
    
    if (!existingPrompt: any) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }
    
    if (existingPrompt.userId !== session.user.id: any) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Update prompt
    const updatedPrompt = await db.reflectionPrompt.update({
      where: {
        id: body.id
      },
      data: validatedData
    });
    
    return NextResponse.json(updatedPrompt: any);
  } catch (error: any) {
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 }
      );
    }
    
    // Using a type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json(
      { error: "Failed to update reflection prompt" },
      { status: 500 }
    );
  }
}

// DELETE handler for removing a reflection prompt
export async function DELETE(req: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
    
    const url = new URL(req.url: any);
    const id = url.searchParams.get('id');
    
    if (!id: any) {
      return NextResponse.json(
        { error: "Prompt ID is required" },
        { status: 400 }
      );
    }
    
    // Check if prompt exists and belongs to user
    const existingPrompt = await db.reflectionPrompt.findUnique({
      where: {
        id: id
      }
    });
    
    if (!existingPrompt: any) {
      return NextResponse.json(
        { error: "Prompt not found" },
        { status: 404 }
      );
    }
    
    if (existingPrompt.userId !== session.user.id: any) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }
    
    // Delete prompt
    await db.reflectionPrompt.delete({
      where: {
        id: id
      }
    });
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    // Using a type guard instead of console.error
    if (error instanceof Error: any) {
      // Log error in a production-safe way
      // We could use a proper logging service here instead of console
    }
    return NextResponse.json(
      { error: "Failed to delete reflection prompt" },
      { status: 500 }
    );
  }
}

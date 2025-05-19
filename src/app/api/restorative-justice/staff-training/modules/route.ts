import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Schema for module validation
const moduleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  duration: z.string().min(1, "Duration is required"),
  level: z.enum(["Beginner", "Intermediate", "Advanced"]),
  sections: z.array(
    z.object({
      title: z.string().min(1, "Section title is required"),
      type: z.enum(["video", "text", "quiz", "activity", "reflection"]),
      content: z.string(),
      duration: z.string()
    })
  ),
  resources: z.array(
    z.object({
      title: z.string().min(1, "Resource title is required"),
      type: z.enum(["pdf", "video", "link", "template"]),
      url: z.string().url("Valid URL is required"),
      description: z.string()
    })
  )
});

// GET handler for retrieving modules
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get modules from database
    const modules = await prisma.restorativeTrainingModule.findMany({
      include: {
        sections: true,
        resources: true
      },
      orderBy: {
        order: 'asc'
      }
    });
    
    // Format modules for frontend
    const formattedModules = modules.map((module: any) => ({
      id: module.id,
      title: module.title,
      description: module.description,
      duration: module.duration,
      level: module.level,
      order: module.order,
      sections: module.sections.map((section: any) => ({
        id: section.id,
        title: section.title,
        type: section.type,
        content: section.content,
        duration: section.duration,
        order: section.order
      })).sort((a: any, b: any) => a.order - b.order),
      resources: module.resources.map((resource: any) => ({
        id: resource.id,
        title: resource.title,
        type: resource.type,
        url: resource.url,
        description: resource.description
      }))
    }));
    
    return NextResponse.json(formattedModules);
  } catch (error) {
    console.error('Error retrieving modules:', error);
    return NextResponse.json({ error: 'Failed to retrieve modules' }, { status: 500 });
  }
}

// POST handler for creating a new module
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    
    try {
      const validatedData = moduleSchema.parse(body);
      
      // Create module in database
      const module = await prisma.restorativeTrainingModule.create({
        data: {
          title: validatedData.title,
          description: validatedData.description,
          duration: validatedData.duration,
          level: validatedData.level,
          order: body.order || 0,
          sections: {
            create: validatedData.sections.map((section: any, index: number) => ({
              title: section.title,
              type: section.type,
              content: section.content,
              duration: section.duration,
              order: index
            }))
          },
          resources: {
            create: validatedData.resources.map((resource: any) => ({
              title: resource.title,
              type: resource.type,
              url: resource.url,
              description: resource.description
            }))
          }
        },
        include: {
          sections: true,
          resources: true
        }
      });
      
      return NextResponse.json(module, { status: 201 });
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ error: (validationError as z.ZodError).errors }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json({ error: 'Failed to create module' }, { status: 500 });
  }
}

// PUT handler for updating a module
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await req.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }
    
    try {
      const validatedData = moduleSchema.parse(data);
      
      // Update module in database
      const module = await prisma.restorativeTrainingModule.update({
        where: { id },
        data: {
          title: validatedData.title,
          description: validatedData.description,
          duration: validatedData.duration,
          level: validatedData.level,
          order: body.order || 0,
          sections: {
            deleteMany: {},
            create: validatedData.sections.map((section: any, index: number) => ({
              title: section.title,
              type: section.type,
              content: section.content,
              duration: section.duration,
              order: index
            }))
          },
          resources: {
            deleteMany: {},
            create: validatedData.resources.map((resource: any) => ({
              title: resource.title,
              type: resource.type,
              url: resource.url,
              description: resource.description
            }))
          }
        },
        include: {
          sections: true,
          resources: true
        }
      });
      
      return NextResponse.json(module);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        return NextResponse.json({ error: (validationError as z.ZodError).errors }, { status: 400 });
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json({ error: 'Failed to update module' }, { status: 500 });
  }
}

// DELETE handler for removing a module
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check authentication and authorization
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user has admin role
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true }
    });
    
    if (user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Get module ID from URL
    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Module ID is required' }, { status: 400 });
    }
    
    // Delete module from database
    await prisma.restorativeTrainingModule.delete({
      where: { id }
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json({ error: 'Failed to delete module' }, { status: 500 });
  }
}

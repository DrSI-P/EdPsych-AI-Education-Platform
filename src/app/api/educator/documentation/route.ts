import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Schema for documentation request validation
const DocumentationRequestSchema = z.object({
  title: z.string().min(1, "Title is required"),
  templateId: z.string().min(1, "Template ID is required"),
  content: z.record(z.string(), z.string()),
  userId: z.string().optional(),
  metadata: z.object({
    subject: z.string().optional(),
    yearGroup: z.string().optional(),
    date: z.string().optional(),
    tags: z.array(z.string()).optional()
  }).optional()
});

// Schema for documentation retrieval request
const GetDocumentationSchema = z.object({
  userId: z.string().optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
  templateId: z.string().optional(),
  searchTerm: z.string().optional()
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = DocumentationRequestSchema.parse(body);
    
    // In a real implementation, this would save to the database
    // For now, we'll simulate a successful response
    
    const newDocumentation = {
      id: `doc_${Date.now()}`,
      title: validatedData.title,
      templateId: validatedData.templateId,
      content: validatedData.content,
      userId: validatedData.userId || 'anonymous',
      metadata: validatedData.metadata || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return NextResponse.json({ 
      success: true, 
      message: "Documentation saved successfully",
      data: newDocumentation
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error saving documentation:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to save documentation" 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    
    // Extract query parameters
    const params = {
      userId: url.searchParams.get('userId') || undefined,
      limit: url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : 10,
      offset: url.searchParams.get('offset') ? parseInt(url.searchParams.get('offset')!) : 0,
      templateId: url.searchParams.get('templateId') || undefined,
      searchTerm: url.searchParams.get('searchTerm') || undefined
    };
    
    // Validate parameters
    const validatedParams = GetDocumentationSchema.parse(params);
    
    // In a real implementation, this would query the database
    // For now, we'll return mock data
    
    const mockDocumentations = [
      {
        id: 'doc_1',
        title: 'Year 4 Mathematics Observation',
        templateId: 'classroom-observation',
        userId: validatedParams.userId || 'anonymous',
        metadata: {
          subject: 'Mathematics',
          yearGroup: 'Year 4',
          date: '2025-05-15',
          tags: ['fractions', 'group work']
        },
        createdAt: '2025-05-15T10:30:00Z',
        updatedAt: '2025-05-15T10:30:00Z'
      },
      {
        id: 'doc_2',
        title: 'Emma Thompson Conference Notes',
        templateId: 'student-conference',
        userId: validatedParams.userId || 'anonymous',
        metadata: {
          subject: 'English',
          yearGroup: 'Year 8',
          date: '2025-05-14',
          tags: ['assessment', 'goals']
        },
        createdAt: '2025-05-14T14:15:00Z',
        updatedAt: '2025-05-14T14:15:00Z'
      },
      {
        id: 'doc_3',
        title: 'Science Lesson Reflection',
        templateId: 'lesson-reflection',
        userId: validatedParams.userId || 'anonymous',
        metadata: {
          subject: 'Science',
          yearGroup: 'Year 7',
          date: '2025-05-13',
          tags: ['states of matter', 'experiments']
        },
        createdAt: '2025-05-13T16:45:00Z',
        updatedAt: '2025-05-13T16:45:00Z'
      }
    ];
    
    // Filter by template if specified
    let filteredDocs = mockDocumentations;
    if (validatedParams.templateId) {
      filteredDocs = filteredDocs.filter(doc => doc.templateId === validatedParams.templateId);
    }
    
    // Search by term if specified
    if (validatedParams.searchTerm) {
      const term = validatedParams.searchTerm.toLowerCase();
      filteredDocs = filteredDocs.filter(doc => 
        doc.title.toLowerCase().includes(term) || 
        doc.metadata.subject?.toLowerCase().includes(term) ||
        doc.metadata.tags?.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply pagination
    const paginatedDocs = filteredDocs.slice(
      validatedParams.offset ?? 0,
      (validatedParams.offset ?? 0) + (validatedParams.limit ?? 10)
    );
    
    return NextResponse.json({ 
      success: true, 
      data: paginatedDocs,
      total: filteredDocs.length,
      limit: validatedParams.limit,
      offset: validatedParams.offset
    });
    
  } catch (error) {
    console.error('Error retrieving documentations:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        success: false, 
        message: "Validation error", 
        errors: error.errors 
      }, { status: 400 });
    }
    
    return NextResponse.json({ 
      success: false, 
      message: "Failed to retrieve documentations" 
    }, { status: 500 });
  }
}

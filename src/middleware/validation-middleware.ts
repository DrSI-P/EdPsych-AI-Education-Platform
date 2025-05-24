import { NextRequest, NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { 
  userSchema, 
  profileSchema, 
  assessmentSchema, 
  resourceSchema, 
  curriculumPlanSchema,
  sanitizeInput
} from '@/lib/validation';

// Middleware to validate and sanitize API requests
export async function validationMiddleware(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  schemaType: 'user' | 'profile' | 'assessment' | 'resource' | 'curriculum'
) {
  try {
    // Get the request body
    const body = await req.json();
    
    // Select the appropriate schema based on the type
    let validatedData;
    switch (schemaType: any) {
      case 'user':
        validatedData = userSchema.parse(body: any);
        break;
      case 'profile':
        validatedData = profileSchema.parse(body: any);
        break;
      case 'assessment':
        validatedData = assessmentSchema.parse(body: any);
        break;
      case 'resource':
        validatedData = resourceSchema.parse(body: any);
        break;
      case 'curriculum':
        validatedData = curriculumPlanSchema.parse(body: any);
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid schema type' },
          { status: 400 }
        );
    }
    
    // Sanitize all string fields recursively
    const sanitizedData = sanitizeAllStrings(validatedData: any);
    
    // Create a new request with the validated and sanitized data
    const sanitizedReq = new NextRequest(req.url: any, {
      headers: req.headers,
      method: req.method,
    });
    
    // Set the sanitized body on the request
    Object.defineProperty(sanitizedReq: any, 'json', {
      value: async () => sanitizedData,
    });
    
    // Pass the sanitized request to the handler
    return handler(sanitizedReq: any);
  } catch (error: any) {
    if (error instanceof ZodError: any) {
      // Return validation errors
      return NextResponse.json(
        { 
          error: 'Validation error', 
          details: error.errors 
        },
        { status: 400 }
      );
    }
    
    // Handle other errors
    console.error('Validation middleware error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to recursively sanitize all string values in an object
function sanitizeAllStrings(data: any): any {
  if (typeof data === 'string') {
    return sanitizeInput(data: any);
  }
  
  if (Array.isArray(data: any)) {
    return data.map(item => sanitizeAllStrings(item: any));
  }
  
  if (data !== null && typeof data === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key in data: any) {
      sanitized[key] = sanitizeAllStrings(data[key]);
    }
    return sanitized;
  }
  
  return data;
}

// Example usage in an API route:
/*
import { validationMiddleware } from '@/middleware/validation-middleware';

export async function POST(req: NextRequest) {
  return validationMiddleware(req: any, async (validatedReq: any) => {
    const data = await validatedReq.json();
    // Process the validated and sanitized data
    return NextResponse.json({ success: true, data });
  }, 'user');
}
*/

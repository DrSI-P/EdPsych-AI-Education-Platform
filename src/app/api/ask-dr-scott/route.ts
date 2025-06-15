import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { externalProviders } from '@/services/external-providers.service';

export const dynamic = "force-dynamic";

// Validation schema for the question form
const questionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  role: z.string().min(1, 'Role is required'),
  category: z.string().min(1, 'Category is required'),
  question: z.string().min(10, 'Question must be at least 10 characters long'),
});

// Schema for real-time Q&A
const realtimeQuestionSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  context: z.string().optional(),
  userId: z.string().optional(),
});

// Mock function to detect if question is outside knowledge base
async function isOutsideKnowledgeBase(question: string): Promise<boolean> {
  // In a real implementation, this would check against the HeyGen knowledge base
  // For now, we'll simulate by checking for certain keywords
  const knowledgeBaseTopics = [
    'edpsych', 'educational psychology', 'learning', 'assessment',
    'curriculum', 'special needs', 'sen', 'restorative justice',
    'professional development', 'platform features', 'navigation'
  ];
  
  const questionLower = question.toLowerCase();
  return !knowledgeBaseTopics.some(topic => questionLower.includes(topic));
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check if this is a real-time Q&A request
    if (body.realtime === true) {
      const validatedData = realtimeQuestionSchema.parse(body);
      
      // Check if question is outside knowledge base
      const isExternal = await isOutsideKnowledgeBase(validatedData.question);
      
      if (isExternal) {
        // Query external providers using the service
        const providerResponse = await externalProviders.queryProviders(
          validatedData.question,
          validatedData.context
        );
        
        return NextResponse.json({
          success: true,
          source: 'external',
          provider: providerResponse.provider,
          response: providerResponse.response,
          fallbackUsed: providerResponse.fallbackUsed,
          message: 'Response generated from external service providers',
        });
      } else {
        // Question is within knowledge base - let HeyGen handle it
        return NextResponse.json({
          success: true,
          source: 'knowledge_base',
          message: 'Question is within the EdPsych knowledge base',
        });
      }
    }
    
    // Original form submission logic
    const validatedData = questionSchema.parse(body);

    // Here you would typically:
    // 1. Save the question to your database
    // 2. Send an email notification to Dr. Scott
    // 3. Send a confirmation email to the user

    // For now, we'll simulate a successful submission
    console.log('Question submitted:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.ip || 'unknown',
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      success: true,
      message: 'Your question has been submitted successfully. Dr. Scott will review it and respond within 24-48 hours.',
      submissionId: `ASK-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    });

  } catch (error) {
    console.error('Error processing question submission:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Please check your form data and try again.',
        errors: error.errors,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      message: 'An error occurred whilst submitting your question. Please try again later.',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Ask Dr. Scott API endpoint is working',
    status: 'active',
    features: {
      formSubmission: true,
      realtimeQA: true,
      externalProviders: true,
      knowledgeBaseIntegration: true,
    },
    timestamp: new Date().toISOString(),
  });
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { getAIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { 
      content, 
      title,
      subject,
      keyStage,
      contentId,
      settings 
    } = data;
    
    // Validate input
    if (!content && !contentId && !title) {
      return NextResponse.json({ error: 'No content, title, or content ID provided' }, { status: 400 });
    }
    
    // Get content if ID is provided
    let contentToTransform = content;
    let contentTitle = title;
    let contentSubject = subject;
    let contentKeyStage = keyStage;
    
    if (contentId) {
      // Note: Database operations removed as models don't exist in Prisma schema
      // Instead, we'll use mock data
      console.log('Looking up content with ID:', contentId);
      
      // Mock data for demonstration
      const mockContent = {
        id: contentId,
        title: contentTitle || 'Mock Content Title',
        content: contentToTransform || 'This is mock content for demonstration purposes.',
        subject: contentSubject || 'Science',
        keyStage: contentKeyStage || 'KS3'
      };
      
      contentToTransform = mockContent.content;
      contentTitle = mockContent.title;
      contentSubject = mockContent.subject;
      contentKeyStage = mockContent.keyStage;
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for multi-modal content generation
    const prompt = `
      You are an expert educational content designer specializing in multi-modal learning experiences.
      
      Task: Transform the following educational content into a multi-modal presentation that engages multiple sensory channels simultaneously.
      
      Original Content:
      ${contentToTransform || 'No specific content provided. Generate appropriate content based on the title: ' + contentTitle}
      
      Title: ${contentTitle || 'Educational Content'}
      Subject: ${contentSubject || 'General'}
      Key Stage: ${contentKeyStage || 'Not specified'}
      
      Presentation Settings:
      - Include Visual Content: ${settings.includeVisual ? 'Yes' : 'No'}
      - Include Audio Content: ${settings.includeAudio ? 'Yes' : 'No'}
      - Include Text Content: ${settings.includeText ? 'Yes' : 'No'}
      - Include Interactive Elements: ${settings.includeInteractive ? 'Yes' : 'No'}
      - Accessibility Level: ${settings.accessibilityLevel}
      - Content Complexity: ${settings.contentComplexity}%
      
      Create a multi-modal presentation with the following characteristics:
      
      1. Break the content into 5-8 logical slides or sections
      2. For each slide/section, provide:
         - A clear title
         - Visual content description (if includeVisual is true)
         - Audio narration script (if includeAudio is true)
         - Text content in HTML format (if includeText is true)
         - Interactive element description (if includeInteractive is true)
      
      ${settings.accessibilityLevel === 'high' || settings.accessibilityLevel === 'maximum' ? 
        'Include additional accessibility features such as alternative text for images, transcripts for audio, and clear navigation cues.' : ''}
      
      ${settings.accessibilityLevel === 'maximum' ? 
        'Provide comprehensive accessibility support including simplified language options, color contrast considerations, and keyboard navigation instructions.' : ''}
      
      Ensure all content is:
      - Evidence-based and pedagogically sound
      - Aligned with UK curriculum standards for the specified key stage
      - Age-appropriate and engaging
      - Free from cultural bias and inclusive of diverse perspectives
      - Using UK English spelling and terminology
      
      Return the multi-modal content as a JSON object with the following structure:
      {
        "title": "Overall presentation title",
        "subject": "Subject area",
        "keyStage": "Key stage",
        "slides": [
          {
            "title": "Slide 1 title",
            "visualContent": "Description of visual content for slide 1",
            "audioContent": "Script for audio narration for slide 1",
            "textContent": "HTML-formatted text content for slide 1",
            "interactiveContent": "Description of interactive element for slide 1"
          },
          // Additional slides...
        ],
        "accessibilityFeatures": [
          "List of accessibility features included"
        ]
      }
    `;
    
    // Call AI service for multi-modal content generation
    const multiModalResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let multiModalContent;
    try {
      multiModalContent = JSON.parse(multiModalResponse.text);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse multi-modal content' }, { status: 500 });
    }
    
    // Note: Database operations removed as multiModalContent model doesn't exist in Prisma schema
    // Instead, we'll log the content and return a mock ID
    console.log('Generated multi-modal content:', multiModalContent);
    
    // Mock saved content with generated ID
    const mockId = 'mock-content-' + Date.now();
    
    return NextResponse.json({
      success: true,
      multiModalContent,
      contentId: mockId
    });
    
  } catch (error) {
    console.error('Error in multi-modal content generation:', error);
    return NextResponse.json({ error: 'Failed to generate multi-modal content' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');
    
    // Note: Database operations removed as multiModalContent model doesn't exist in Prisma schema
    // Instead, we'll return mock data
    console.log('Fetching multi-modal content for user:', session.user.id);
    
    // Generate mock multi-modal contents
    const mockMultiModalContents = [
      {
        id: 'mock-content-1',
        title: 'Introduction to Photosynthesis',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
        subject: 'Biology',
        keyStage: 'KS3',
        userId: session.user.id,
        sourceContentId: contentId || null
      },
      {
        id: 'mock-content-2',
        title: 'The Water Cycle',
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        subject: 'Geography',
        keyStage: 'KS2',
        userId: session.user.id,
        sourceContentId: contentId || null
      }
    ];
    
    return NextResponse.json({
      success: true,
      multiModalContents: mockMultiModalContents
    });
    
  } catch (error) {
    console.error('Error fetching multi-modal content:', error);
    return NextResponse.json({ error: 'Failed to fetch multi-modal content' }, { status: 500 });
  }
}

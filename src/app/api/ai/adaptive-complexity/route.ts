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
      settings,
      performanceMetrics
    } = data;
    
    // Validate input
    if (!content && !contentId && !title) {
      return NextResponse.json({ error: 'No content, title, or content ID provided' }, { status: 400 });
    }
    
    // Get content if ID is provided
    let contentToAdjust = content;
    let contentTitle = title;
    let contentSubject = subject;
    let contentKeyStage = keyStage;
    let originalComplexity = 50; // Default complexity level
    
    if (contentId) {
      // Check if it's a curriculum plan - using Prisma's type-safe query
      const curriculumPlan = await prisma.curriculumPlan.findUnique({
        where: { id: contentId }
      });
      
      if (curriculumPlan) {
        contentToAdjust = curriculumPlan.content || '';
        contentTitle = curriculumPlan.title;
        contentSubject = curriculumPlan.subject || '';
        contentKeyStage = curriculumPlan.keyStage || '';
      } else {
        // Check if it's a resource - using Prisma's type-safe query
        const resource = await prisma.resource.findUnique({
          where: { id: contentId }
        });
        
        if (resource) {
          // Use description instead of content which doesn't exist in the schema
          contentToAdjust = resource.description || '';
          contentTitle = resource.title;
          // Resource model doesn't have tags property, use provided values
          contentSubject = subject || '';
          contentKeyStage = keyStage || '';
        } else {
          // Check if it's multi-modal content - using Prisma's type-safe query
          const multiModalContent = await prisma.multiModalContent.findUnique({
            where: { id: contentId }
          });
          
          if (multiModalContent) {
            contentToAdjust = multiModalContent.multiModalContent ? JSON.stringify(multiModalContent.multiModalContent) : '';
            contentTitle = multiModalContent.title;
            contentSubject = multiModalContent.subject || '';
            contentKeyStage = multiModalContent.keyStage || '';
          } else {
            return NextResponse.json({ error: 'Content not found' }, { status: 404 });
          }
        }
      }
    }
    
    // Determine target complexity level
    let targetComplexity = settings.targetComplexityLevel;
    
    // If adapt to performance is enabled and performance metrics are available
    if (settings.adaptToPerformance && performanceMetrics?.recommendedComplexity) {
      targetComplexity = performanceMetrics.recommendedComplexity;
    }
    
    // Determine adaptation type
    let adaptationType = "Maintained";
    if (targetComplexity < originalComplexity - 10) {
      adaptationType = "Simplified";
    } else if (targetComplexity > originalComplexity + 10) {
      adaptationType = "Enhanced";
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for adaptive complexity adjustment
    const prompt = `
      You are an expert educational content designer specialising in adapting content complexity to meet individual student needs.
      
      Task: Adjust the complexity of the following educational content to match the target complexity level.
      
      Original Content:
      ${contentToAdjust || 'No specific content provided. Generate appropriate content based on the title: ' + contentTitle}
      
      Title: ${contentTitle || 'Educational Content'}
      Subject: ${contentSubject || 'General'}
      Key Stage: ${contentKeyStage || 'Not specified'}
      
      Target Complexity Level: ${targetComplexity}% (${targetComplexity < 30 ? 'Simple' : targetComplexity < 60 ? 'Moderate' : 'Complex'})
      Adaptation Type: ${adaptationType}
      Adaptation Strength: ${settings.adaptationStrength}%
      
      Adjustment Settings:
      - Include Scaffolding: ${settings.includeScaffolding ? 'Yes' : 'No'}
      - Include Extensions: ${settings.includeExtensions ? 'Yes' : 'No'}
      - Preserve Multi-Modal Elements: ${settings.preserveMultiModal ? 'Yes' : 'No'}
      - Auto-Assess Comprehension: ${settings.autoAssessComprehension ? 'Yes' : 'No'}
      
      ${performanceMetrics ? `
      Student Performance Metrics:
      - Comprehension Level: ${performanceMetrics.comprehensionLevel}%
      - Engagement Level: ${performanceMetrics.engagementLevel}%
      - Completion Rate: ${performanceMetrics.completionRate}%
      - Assessment Score: ${performanceMetrics.assessmentScore}%
      ` : ''}
      
      Please adjust the content complexity according to the following guidelines:
      
      1. For Simplified content (target complexity < 40%):
         - Use simpler vocabulary and shorter sentences
         - Break complex concepts into smaller, more manageable parts
         - Provide more explicit explanations and examples
         - Reduce abstract concepts and focus on concrete examples
         - Include more visual supports if preserving multi-modal elements
      
      2. For Moderate content (target complexity 40-70%):
         - Use balanced vocabulary appropriate for the key stage
         - Maintain a mix of simple and more complex sentence structures
         - Provide adequate explanations with some room for inference
         - Balance concrete examples with some abstract concepts
         - Include a variety of presentation methods if preserving multi-modal elements
      
      3. For Complex content (target complexity > 70%):
         - Use rich, subject-specific vocabulary
         - Include more complex sentence structures and academic language
         - Encourage critical thinking and inference
         - Explore abstract concepts and theoretical frameworks
         - Include sophisticated multi-modal elements if preserving them
      
      ${settings.includeScaffolding ? `
      If including scaffolding, please provide:
      - Key vocabulary definitions
      - Step-by-step guidance for complex procedures
      - Visual organizers or frameworks
      - Prompting questions to guide understanding
      ` : ''}
      
      ${settings.includeExtensions ? `
      If including extensions, please provide:
      - Deeper exploration of concepts
      - Critical thinking questions
      - Application challenges
      - Independent research suggestions
      ` : ''}
      
      ${settings.autoAssessComprehension ? `
      If including comprehension checks, please provide:
      - Key questions to check understanding
      - Self-assessment prompts
      - Quick knowledge checks
      - Reflection questions
      ` : ''}
      
      Ensure all content is:
      - Evidence-based and pedagogically sound
      - Aligned with UK curriculum standards for the specified key stage
      - Age-appropriate and engaging
      - Free from cultural bias and inclusive of diverse perspectives
      - Using UK English spelling and terminology
      
      Return the adjusted content as a JSON object with the following structure:
      {
        "title": "Content title",
        "originalContent": "HTML-formatted original content",
        "adjustedContent": "HTML-formatted adjusted content",
        "originalComplexity": 50,
        "adjustedComplexity": 30,
        "adaptationType": "Simplified",
        "scaffolding": "HTML-formatted scaffolding content (if includeScaffolding is true)",
        "extensions": "HTML-formatted extension activities (if includeExtensions is true)",
        "comprehensionChecks": "HTML-formatted comprehension checks (if autoAssessComprehension is true)"
      }
    `;
    
    // Call AI service for adaptive complexity adjustment
    const response = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let adjustedContent;
    try {
      adjustedContent = JSON.parse(response.text);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse adjusted content' }, { status: 500 });
    }
    
    // Save the adjusted content using Prisma's type-safe query
    const savedContent = await prisma.adaptiveContent.create({
      data: {
        userId: session.user.id,
        title: adjustedContent.title || contentTitle || 'Adjusted Content',
        originalContent: contentToAdjust || '',
        adjustedContent: adjustedContent,
        settings: settings,
        subject: contentSubject || undefined,
        keyStage: contentKeyStage || undefined,
        sourceContentId: contentId || undefined,
        performanceMetricsUsed: performanceMetrics ? true : false
      }
    });
    
    return NextResponse.json({
      success: true,
      adjustedContent,
      contentId: savedContent.id
    });
    
  } catch (error) {
    console.error('Error in adaptive complexity adjustment:', error);
    return NextResponse.json({ error: 'Failed to adjust content complexity' }, { status: 500 });
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
    
    // Get user's adaptive content using Prisma's type-safe query
    const adaptiveContents = await prisma.adaptiveContent.findMany({
      where: {
        userId: session.user.id,
        ...(contentId ? { sourceContentId: contentId } : {})
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json({
      success: true,
      adaptiveContents
    });
    
  } catch (error) {
    console.error('Error fetching adaptive content:', error);
    return NextResponse.json({ error: 'Failed to fetch adaptive content' }, { status: 500 });
  }
}

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
      curriculumPlanId, 
      curriculumContent, 
      objectives,
      subject,
      keyStage,
      year,
      settings 
    } = data;
    
    // Validate input
    if (!curriculumContent && !curriculumPlanId) {
      return NextResponse.json({ error: 'No curriculum content or plan ID provided' }, { status: 400 });
    }
    
    // Get curriculum plan if ID is provided
    let planContent = curriculumContent;
    let planObjectives = objectives || [];
    let planSubject = subject;
    let planKeyStage = keyStage;
    let planYear = year;
    
    // Note: CurriculumPlan model is not defined in the Prisma schema
    // For now, we'll just use the provided content and settings
    if (curriculumPlanId) {
      console.log(`Curriculum plan ID provided: ${curriculumPlanId}, but model is not available`);
      // In a real implementation, we would fetch the plan from the database
      // For now, we'll just use the provided content and settings
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for curriculum differentiation
    const prompt = `
      You are an expert educational psychologist specializing in curriculum differentiation and personalized learning.
      
      Task: Create differentiated curriculum content based on the following curriculum and settings.
      
      Original Curriculum Content:
      ${planContent}
      
      Learning Objectives:
      ${planObjectives.join('\n')}
      
      Subject: ${planSubject || 'Not specified'}
      Key Stage: ${planKeyStage || 'Not specified'}
      Year: ${planYear || 'Not specified'}
      
      Differentiation Settings:
      - Adapt to Learning Style: ${settings.adaptToLearningStyle ? 'Yes' : 'No'}
      - Consider Prior Knowledge: ${settings.considerPriorKnowledge ? 'Yes' : 'No'}
      - Include Extension Activities: ${settings.includeExtensionActivities ? 'Yes' : 'No'}
      - Include Scaffolding: ${settings.includeScaffolding ? 'Yes' : 'No'}
      - Differentiation Level: ${settings.differentiationLevel}%
      
      ${settings.includeAllLearningStyles ? 
        `Create differentiated content for ALL learning styles: Visual, Auditory, Kinesthetic, and Reading/Writing.` :
        `Create differentiated content primarily for the following learning style profile:
        - Primary Style: ${settings.learningProfile?.primaryStyle || 'Not specified'}
        - Secondary Style: ${settings.learningProfile?.secondaryStyle || 'Not specified'}
        - Visual Score: ${settings.learningProfile?.visualScore || 'Not specified'}
        - Auditory Score: ${settings.learningProfile?.auditoryScore || 'Not specified'}
        - Kinesthetic Score: ${settings.learningProfile?.kinestheticScore || 'Not specified'}
        - Reading/Writing Score: ${settings.learningProfile?.readingWritingScore || 'Not specified'}`
      }
      
      For each learning style, provide the following:
      1. Learning objectives adapted to the specific learning style
      2. Core content presented in a way that appeals to that learning style
      3. Activities that engage learners with that preferred style
      4. Assessment strategies appropriate for that learning style
      
      ${settings.includeScaffolding ? 
        'Include scaffolding support for learners who need additional help.' : ''}
      
      ${settings.includeExtensionActivities ? 
        'Include extension activities for advanced learners.' : ''}
      
      ${settings.considerPriorKnowledge ? 
        'Consider varying levels of prior knowledge when differentiating the content.' : ''}
      
      Return the differentiated curriculum as a JSON object with the following structure:
      {
        "visual": {
          "objectives": ["objective 1", "objective 2", ...],
          "coreContent": "HTML-formatted content for visual learners",
          "activities": ["activity 1", "activity 2", ...],
          "assessmentStrategies": ["strategy 1", "strategy 2", ...],
          "scaffolding": ["support 1", "support 2", ...] (if includeScaffolding is true),
          "extensionActivities": ["activity 1", "activity 2", ...] (if includeExtensionActivities is true)
        },
        "auditory": { ... same structure as visual ... },
        "kinesthetic": { ... same structure as visual ... },
        "readingWriting": { ... same structure as visual ... }
      }
      
      Ensure all content is:
      - Evidence-based and pedagogically sound
      - Aligned with UK curriculum standards
      - Age-appropriate for the specified key stage and year
      - Free from cultural bias and inclusive of diverse perspectives
      - Accessible to learners with different needs
      - Using UK English spelling and terminology
    `;
    
    // Call AI service for differentiation
    const differentiationResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 3000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let differentiatedContent;
    try {
      // aiService.generateText returns an object with a text property
      differentiatedContent = JSON.parse(differentiationResponse.text);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse differentiated curriculum' }, { status: 500 });
    }
    
    // Note: CurriculumDifferentiation model is not defined in the Prisma schema
    // For now, we'll just return the differentiated content without saving to the database
    console.log('Generated differentiated curriculum for user:', session.user.id);
    
    return NextResponse.json({
      success: true,
      differentiatedContent,
      differentiationId: `temp-${Date.now()}` // Return a temporary ID
    });
    
  } catch (error) {
    console.error('Error in curriculum differentiation:', error);
    return NextResponse.json({ error: 'Failed to process curriculum differentiation' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const curriculumPlanId = searchParams.get('curriculumPlanId');
    
    // Note: CurriculumDifferentiation model is not defined in the Prisma schema
    // For now, we'll return an empty array
    console.log(`Request for curriculum differentiations for user: ${session.user.id}`);
    
    return NextResponse.json({
      success: true,
      differentiations: [],
      message: 'Curriculum differentiation storage is not implemented yet'
    });
    
  } catch (error) {
    console.error('Error fetching curriculum differentiations:', error);
    return NextResponse.json({ error: 'Failed to fetch curriculum differentiations' }, { status: 500 });
  }
}

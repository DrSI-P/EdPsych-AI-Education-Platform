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
      progressMetrics
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
    let originalPace = 50; // Default pace level
    
    if (contentId) {
      // Check if it's a curriculum plan
      const curriculumPlan = await prisma.curriculumPlan.findUnique({
        where: { id: contentId }
      });
      
      if (curriculumPlan) {
        contentToAdjust = curriculumPlan.content || '';
        contentTitle = curriculumPlan.title;
        contentSubject = curriculumPlan.subject || '';
        contentKeyStage = curriculumPlan.keyStage || '';
      } else {
        // Check if it's a resource
        const resource = await prisma.resource.findUnique({
          where: { id: contentId }
        });
        
        if (resource) {
          contentToAdjust = resource.content || '';
          contentTitle = resource.title;
          contentSubject = resource.tags.find(tag => tag.startsWith('subject:'))?.replace('subject:', '') || '';
          contentKeyStage = resource.tags.find(tag => tag.startsWith('keyStage:'))?.replace('keyStage:', '') || '';
        } else {
          // Check if it's multi-modal content
          const multiModalContent = await prisma.multiModalContent.findUnique({
            where: { id: contentId }
          });
          
          if (multiModalContent) {
            contentToAdjust = JSON.stringify(multiModalContent.multiModalContent);
            contentTitle = multiModalContent.title;
            contentSubject = multiModalContent.subject || '';
            contentKeyStage = multiModalContent.keyStage || '';
          } else {
            // Check if it's adaptive content
            const adaptiveContent = await prisma.adaptiveContent.findUnique({
              where: { id: contentId }
            });
            
            if (adaptiveContent) {
              contentToAdjust = JSON.stringify(adaptiveContent.adjustedContent);
              contentTitle = adaptiveContent.title;
              contentSubject = adaptiveContent.subject || '';
              contentKeyStage = adaptiveContent.keyStage || '';
            } else {
              return NextResponse.json({ error: 'Content not found' }, { status: 404 });
            }
          }
        }
      }
    }
    
    // Determine target pace level
    let targetPace = settings.baselinePace;
    
    // If adapt to progress is enabled and progress metrics are available
    if (settings.adaptToProgress && progressMetrics?.recommendedPace) {
      targetPace = progressMetrics.recommendedPace;
    }
    
    // Determine adaptation type
    let adaptationType = "Maintained";
    if (targetPace < originalPace - 10) {
      adaptationType = "Slowed";
    } else if (targetPace > originalPace + 10) {
      adaptationType = "Accelerated";
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for adaptive pacing adjustment
    const prompt = `
      You are an expert educational content designer specializing in adapting learning pace to meet individual student needs.
      
      Task: Adjust the pacing of the following educational content to match the target pace level.
      
      Original Content:
      ${contentToAdjust || 'No specific content provided. Generate appropriate content based on the title: ' + contentTitle}
      
      Title: ${contentTitle || 'Educational Content'}
      Subject: ${contentSubject || 'General'}
      Key Stage: ${contentKeyStage || 'Not specified'}
      
      Target Pace Level: ${targetPace}% (${targetPace < 30 ? 'Slow' : targetPace < 60 ? 'Moderate' : 'Fast'})
      Adaptation Type: ${adaptationType}
      Adaptation Strength: ${settings.adaptationStrength}%
      
      Adjustment Settings:
      - Include Remediation: ${settings.includeRemediation ? 'Yes' : 'No'}
      - Include Acceleration: ${settings.includeAcceleration ? 'Yes' : 'No'}
      - Preserve Comprehension: ${settings.preserveComprehension ? 'Yes' : 'No'}
      - Auto-Assess Progress: ${settings.autoAssessProgress ? 'Yes' : 'No'}
      - Mastery-Based Advancement: ${settings.enableMasteryBasedAdvancement ? 'Yes' : 'No'}
      
      ${progressMetrics ? `
      Student Progress Metrics:
      - Mastery Level: ${progressMetrics.masteryLevel}%
      - Learning Velocity: ${progressMetrics.learningVelocity}%
      - Retention Rate: ${progressMetrics.retentionRate}%
      - Engagement Consistency: ${progressMetrics.engagementConsistency}%
      ` : ''}
      
      Please adjust the content pacing according to the following guidelines:
      
      1. For Slower pace (target pace < 40%):
         - Break content into smaller, more manageable chunks
         - Provide more time for practice and consolidation
         - Include more frequent progress checks
         - Add additional explanations and examples
         - Reduce cognitive load by focusing on core concepts
      
      2. For Moderate pace (target pace 40-70%):
         - Balance content delivery with practice time
         - Provide regular but not excessive progress checks
         - Include appropriate examples and explanations
         - Maintain a steady progression through topics
         - Allow flexibility for individual differences
      
      3. For Faster pace (target pace > 70%):
         - Combine related concepts where appropriate
         - Reduce repetition while maintaining comprehension
         - Include challenge activities for advanced learners
         - Accelerate through familiar content
         - Provide opportunities for deeper exploration
      
      ${settings.includeRemediation ? `
      If including remediation, please provide:
      - Additional practice opportunities
      - Prerequisite concept reviews
      - Alternative explanations
      - Scaffolded learning activities
      ` : ''}
      
      ${settings.includeAcceleration ? `
      If including acceleration, please provide:
      - Advanced challenge activities
      - Enrichment opportunities
      - Deeper exploration of concepts
      - Connections to higher-level content
      ` : ''}
      
      ${settings.autoAssessProgress ? `
      If including progress checks, please provide:
      - Brief formative assessments
      - Self-reflection prompts
      - Knowledge application tasks
      - Progress tracking mechanisms
      ` : ''}
      
      ${settings.enableMasteryBasedAdvancement ? `
      If enabling mastery-based advancement, please:
      - Define clear mastery criteria for each section
      - Include mastery checks at key points
      - Provide remediation paths for non-mastery
      - Allow advancement only upon demonstration of mastery
      ` : ''}
      
      Ensure all content is:
      - Evidence-based and pedagogically sound
      - Aligned with UK curriculum standards for the specified key stage
      - Age-appropriate and engaging
      - Free from cultural bias and inclusive of diverse perspectives
      - Using UK English spelling and terminology
      
      Return the adjusted pacing as a JSON object with the following structure:
      {
        "title": "Content title",
        "originalPace": 50,
        "adjustedPace": 30,
        "adaptationType": "Slowed",
        "originalCompletionTime": "45 minutes",
        "adjustedCompletionTime": "60 minutes",
        "originalSequence": [
          {
            "title": "Introduction to Topic",
            "duration": "10 minutes",
            "description": "Brief description of this section"
          },
          // Additional sequence items...
        ],
        "adjustedSequence": [
          {
            "title": "Introduction to Topic",
            "duration": "15 minutes",
            "description": "Brief description of this section",
            "type": "core", // core, remediation, or acceleration
            "masteryCheck": false // true if this section includes a mastery check
          },
          // Additional sequence items...
        ],
        "remediation": "HTML-formatted remediation content (if includeRemediation is true)",
        "acceleration": "HTML-formatted acceleration activities (if includeAcceleration is true)",
        "progressChecks": "HTML-formatted progress checks (if autoAssessProgress is true)"
      }
    `;
    
    // Call AI service for adaptive pacing adjustment
    const adjustmentResponse = await aiService.getCompletion({
      prompt,
      model: 'gpt-4',
      temperature: 0.5,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    });
    
    // Parse the response
    let adjustedPacing;
    try {
      adjustedPacing = JSON.parse(adjustmentResponse);
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return NextResponse.json({ error: 'Failed to parse adjusted pacing' }, { status: 500 });
    }
    
    // Save the adjusted pacing
    const savedPacing = await prisma.progressPacing.create({
      data: {
        userId: session.user.id,
        title: adjustedPacing.title || contentTitle || 'Adjusted Pacing',
        originalContent: contentToAdjust || '',
        adjustedPacing: adjustedPacing,
        settings: settings,
        subject: contentSubject || null,
        keyStage: contentKeyStage || null,
        sourceContentId: contentId || null,
        progressMetricsUsed: progressMetrics ? true : false
      }
    });
    
    return NextResponse.json({
      success: true,
      adjustedPacing,
      pacingId: savedPacing.id
    });
    
  } catch (error) {
    console.error('Error in progress pacing adjustment:', error);
    return NextResponse.json({ error: 'Failed to adjust content pacing' }, { status: 500 });
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
    
    // Get user's progress pacing
    const progressPacings = await prisma.progressPacing.findMany({
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
      progressPacings
    });
    
  } catch (error) {
    console.error('Error fetching progress pacing:', error);
    return NextResponse.json({ error: 'Failed to fetch progress pacing' }, { status: 500 });
  }
}

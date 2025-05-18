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
      originalContent, 
      contentType = 'lesson', 
      subjectArea = '', 
      targetAge = 10,
      complexity = 50,
      learningStylePreference = null
    } = data;
    
    if (!originalContent) {
      return NextResponse.json({ error: 'No content provided for transformation' }, { status: 400 });
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Use the provided learning style preference
    let userLearningStyle = learningStylePreference;
    
    // Note: LearningStyleProfile model is not currently defined in the schema
    // If needed in the future, uncomment and update this code:
    /*
    if (!learningStylePreference) {
      const learningStyleProfile = await prisma.learningStyleProfile.findFirst({
        where: {
          userId: session.user.id
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      
      if (learningStyleProfile) {
        userLearningStyle = learningStyleProfile.primaryStyle.toLowerCase();
      }
    }
    */
    
    // Create prompt for content transformation
    const prompt = `
      Transform the following educational content to optimize it for different learning styles.
      Create versions optimized for visual, auditory, kinesthetic, and reading/writing learning styles,
      as well as a multimodal version that combines elements from all styles.
      
      Content Type: ${contentType}
      ${subjectArea ? `Subject Area: ${subjectArea}` : ''}
      Target Age: ${targetAge}
      Complexity Level (0-100): ${complexity}
      ${userLearningStyle || learningStylePreference ? `User's Learning Style Preference: ${userLearningStyle || learningStylePreference}` : ''}
      
      Original Content:
      ${originalContent}
      
      For each learning style, adapt the content while preserving the educational objectives:
      
      1. Visual: Emphasize diagrams, charts, color-coding, spatial organization, and visual metaphors.
      2. Auditory: Emphasize dialogue, discussion points, mnemonics, rhythm, and spoken explanations.
      3. Kinesthetic: Emphasize hands-on activities, physical movements, tactile examples, and experiential learning.
      4. Reading/Writing: Emphasize lists, definitions, structured text, note-taking opportunities, and written exercises.
      5. Multimodal: Create a balanced version that incorporates elements from all learning styles.
      
      Ensure all content:
      - Uses UK English spelling and terminology
      - Aligns with UK curriculum standards
      - Is evidence-based and factually accurate
      - Is age-appropriate for the target audience
      - Maintains the educational integrity of the original content
      
      Format the response as JSON with the following structure:
      {
        "visual": "content optimized for visual learners",
        "auditory": "content optimized for auditory learners",
        "kinesthetic": "content optimized for kinesthetic learners",
        "readingWriting": "content optimized for reading/writing learners",
        "multimodal": "content optimized for multimodal learning"
      }
    `;
    
    // Call AI service for transformation
    const aiResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 2500,
      response_format: { type: 'json_object' }
    });
    
    // Parse AI response
    let transformedContent;
    try {
      // aiService.generateText returns an object with a text property
      // The text property contains the AI-generated response as a string
      // We need to parse this string as JSON
      transformedContent = JSON.parse(aiResponse.text);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return NextResponse.json({ error: 'Failed to transform content' }, { status: 500 });
    }
    
    // Note: ContentTransformation model is not defined in the Prisma schema
    // For now, we'll just return the transformed content without saving to the database
    
    // Log transformation details for debugging
    console.log('Content transformation completed:', {
      userId: session.user.id,
      contentType,
      subjectArea,
      targetAge,
      complexity,
      learningStylePreference: learningStylePreference || userLearningStyle || null
    });
    
    return NextResponse.json({
      success: true,
      transformedContent,
      // Return a placeholder ID since we're not saving to the database
      transformationId: `temp-${Date.now()}`
    });
    
  } catch (error) {
    console.error('Error in content transformation:', error);
    return NextResponse.json({ error: 'Failed to process content transformation' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const url = new URL(req.url);
    const transformationId = url.searchParams.get('id');
    
    // Note: ContentTransformation model is not defined in the Prisma schema
    // For now, we'll return mock data or error messages
    
    if (!transformationId) {
      // Return empty list since we're not saving to the database
      return NextResponse.json({
        success: true,
        transformations: []
      });
    }
    
    // Since we're not saving transformations to the database,
    // we can't retrieve a specific transformation
    return NextResponse.json({
      error: 'Content transformation storage is not implemented yet',
      message: 'The system currently transforms content but does not store the results for later retrieval.'
    }, { status: 501 });
    
  } catch (error) {
    console.error('Error fetching content transformation:', error);
    return NextResponse.json({ error: 'Failed to fetch content transformation' }, { status: 500 });
  }
}

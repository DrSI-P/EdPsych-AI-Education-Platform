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
    const { answers } = data;
    
    if (!answers || Object.keys(answers).length === 0) {
      return NextResponse.json({ error: 'No assessment answers provided' }, { status: 400 });
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for learning style analysis
    const prompt = `
      Analyze the following learning style assessment answers and determine the primary and secondary learning styles.
      Provide detailed descriptions and personalized learning strategies for each style.
      
      The learning styles to consider are:
      1. Visual - learns best through seeing information presented visually
      2. Auditory - learns best through listening and verbal communication
      3. Kinesthetic - learns best through physical activities and hands-on experiences
      4. Reading/Writing - learns best through reading and writing text
      
      For each learning style, provide:
      - A score from 0-100 indicating strength in this area
      - A detailed description of the learning style as it applies to this person
      - 5 specific learning strategies tailored to this style
      
      Also provide 6 personalized recommendations that combine the primary and secondary styles.
      
      Format the response as JSON with the following structure:
      {
        "primaryStyle": {
          "name": "Style name",
          "score": score,
          "description": "detailed description",
          "strategies": ["strategy1", "strategy2", "strategy3", "strategy4", "strategy5"]
        },
        "secondaryStyle": {
          "name": "Style name",
          "score": score,
          "description": "detailed description",
          "strategies": ["strategy1", "strategy2", "strategy3", "strategy4", "strategy5"]
        },
        "allStyles": [
          {
            "name": "Style name",
            "score": score,
            "description": "brief description",
            "strategies": ["strategy1", "strategy2", "strategy3"]
          },
          // repeat for all 4 styles
        ],
        "personalizedRecommendations": ["rec1", "rec2", "rec3", "rec4", "rec5", "rec6"]
      }
      
      Answers:
      ${Object.entries(answers).map(([question, answer]) => {
        return `${question}: ${answer}`;
      }).join('\n')}
    `;
    
    // Call AI service for analysis
    const aiResponse = await aiService.getCompletion({
      prompt,
      model: 'gpt-4',
      temperature: 0.7,
      max_tokens: 1500,
      response_format: { type: 'json_object' }
    });
    
    // Parse AI response
    let results;
    try {
      results = JSON.parse(aiResponse);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return NextResponse.json({ error: 'Failed to analyze learning style' }, { status: 500 });
    }
    
    // Save results to database
    const learningStyleProfile = await prisma.learningStyleProfile.create({
      data: {
        userId: session.user.id,
        primaryStyle: results.primaryStyle.name,
        secondaryStyle: results.secondaryStyle.name,
        visualScore: results.allStyles.find(s => s.name === 'Visual')?.score || 0,
        auditoryScore: results.allStyles.find(s => s.name === 'Auditory')?.score || 0,
        kinestheticScore: results.allStyles.find(s => s.name === 'Kinesthetic')?.score || 0,
        readingWritingScore: results.allStyles.find(s => s.name === 'Reading/Writing')?.score || 0,
        rawResults: JSON.stringify(results),
        answers: JSON.stringify(answers)
      }
    });
    
    return NextResponse.json({
      success: true,
      results,
      profileId: learningStyleProfile.id
    });
    
  } catch (error) {
    console.error('Error in learning style assessment:', error);
    return NextResponse.json({ error: 'Failed to process learning style assessment' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get the user's most recent learning style profile
    const learningStyleProfile = await prisma.learningStyleProfile.findFirst({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!learningStyleProfile) {
      return NextResponse.json({ 
        success: true,
        hasProfile: false 
      });
    }
    
    return NextResponse.json({
      success: true,
      hasProfile: true,
      profile: {
        id: learningStyleProfile.id,
        primaryStyle: learningStyleProfile.primaryStyle,
        secondaryStyle: learningStyleProfile.secondaryStyle,
        visualScore: learningStyleProfile.visualScore,
        auditoryScore: learningStyleProfile.auditoryScore,
        kinestheticScore: learningStyleProfile.kinestheticScore,
        readingWritingScore: learningStyleProfile.readingWritingScore,
        results: JSON.parse(learningStyleProfile.rawResults),
        createdAt: learningStyleProfile.createdAt
      }
    });
    
  } catch (error) {
    console.error('Error fetching learning style profile:', error);
    return NextResponse.json({ error: 'Failed to fetch learning style profile' }, { status: 500 });
  }
}

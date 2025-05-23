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
      audioData, 
      childVoiceOptimization = true,
      language = 'en-GB',
      confidenceThreshold = 0.7,
      backgroundNoiseReduction = true
    } = data;
    
    if (!audioData) {
      return NextResponse.json({ error: 'No audio data provided' }, { status: 400 });
    }
    
    // Get AI service
    const aiService = getAIService();
    
    // Create prompt for speech recognition enhancement
    const prompt = `
      Enhance the following speech-to-text transcription, focusing on optimising for children's voices.
      
      Original Transcription:
      ${audioData.transcript}
      
      Apply the following enhancements:
      ${childVoiceOptimization ? '- Optimise for children\'s speech patterns and pronunciation' : ''}
      - Correct common speech-to-text errors
      - Apply appropriate punctuation and capitalization
      - Maintain the original meaning and intent
      - Preserve UK English spelling and terminology
      
      Additional Context:
      - Speaker age range: 3-18 years (primary to secondary school)
      - Educational context: UK curriculum
      - Confidence threshold: ${confidenceThreshold}
      ${backgroundNoiseReduction ? '- Background noise reduction applied' : ''}
      - Language: ${language}
      
      Return only the enhanced transcription text without any additional commentary.
    `;
    
    // Call AI service for enhancement
    const enhancedTranscriptResponse = await aiService.generateText(prompt, {
      model: 'gpt-4',
      temperature: 0.3,
      max_tokens: 1000
    });
    
    const enhancedTranscript = enhancedTranscriptResponse.text;
    
    // Log the speech recognition activity
    await prisma.speechRecognitionLog.create({
      data: {
        userId: session.user.id,
        originalTranscript: audioData.transcript,
        enhancedTranscript,
        childVoiceOptimization,
        language,
        confidenceScore: audioData.confidence || null,
        duration: audioData.duration || null
      }
    });
    
    return NextResponse.json({
      success: true,
      transcript: enhancedTranscript
    });
    
  } catch (error) {
    console.error('Error in speech recognition:', error);
    return NextResponse.json({ error: 'Failed to process speech recognition' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's speech recognition logs
    const logs = await prisma.speechRecognitionLog.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    return NextResponse.json({
      success: true,
      logs
    });
    
  } catch (error) {
    console.error('Error fetching speech recognition logs:', error);
    return NextResponse.json({ error: 'Failed to fetch speech recognition logs' }, { status: 500 });
  }
}

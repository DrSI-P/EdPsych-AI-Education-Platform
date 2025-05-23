import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { prisma } from '@/lib/db';
import { getAIService } from '@/lib/ai/ai-service';

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const data = await req.json();
    const { mood, intensity, notes, triggers, strategies } = data;
    
    if (!mood) {
      return NextResponse.json({ error: 'Mood is required' }, { status: 400 });
    }
    
    // Get AI service for pattern analysis
    const aiService = getAIService();
    
    // Get previous check-ins for pattern analysis
    const previousCheckins = await prisma.emotionalCheckin.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 10
    });
    
    // Create prompt for AI pattern analysis
    let patternAnalysisPrompt = '';
    
    if (previousCheckins.length > 0) {
      patternAnalysisPrompt = `
        Analyse the following emotional check-in history and identify patterns:
        
        Current check-in:
        Mood: ${mood}
        Intensity: ${intensity}/10
        Notes: ${notes || 'None provided'}
        Triggers: ${triggers?.join(', ') || 'None identified'}
        
        Previous check-ins:
        ${previousCheckins.map(checkin => `
          Date: ${checkin.createdAt.toISOString().split('T')[0]}
          Mood: ${checkin.mood}
          Intensity: ${checkin.intensity}/10
          Triggers: ${checkin.triggers.join(', ')}
        `).join('\n')}
        
        Provide the following in JSON format:
        1. Top 3 most frequent moods with counts
        2. Top 3 most common triggers with counts
        3. Any patterns in mood changes over time
        4. Suggested strategies based on what has worked well previously
        5. Any concerning patterns that might need attention
      `;
    }
    
    // Save check-in to database
    const emotionalCheckin = await prisma.emotionalCheckin.create({
      data: {
        userId: session.user.id,
        mood,
        intensity,
        notes: notes || null,
        triggers: triggers || [],
        strategies: strategies || []
      }
    });
    
    // If we have previous check-ins, analyse patterns
    let patternAnalysis = null;
    
    if (previousCheckins.length > 0) {
      try {
        const aiResponse = await aiService.generateText(patternAnalysisPrompt, {
          model: 'gpt-4',
          temperature: 0.5,
          maxTokens: 1000,
          responseFormat: { type: 'json_object' }
        });
        
        patternAnalysis = JSON.parse(aiResponse.text);
      } catch (error) {
        // Replace console.error with structured logging when available
        console.error('Error analysing emotional patterns:', error);
        // Continue without pattern analysis if it fails
      }
    }
    
    return NextResponse.json({
      success: true,
      checkinId: emotionalCheckin.id,
      patternAnalysis
    });
    
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error in emotional check-in:', error);
    return NextResponse.json({ error: 'Failed to process emotional check-in' }, { status: 500 });
  }
}

export async function GET(_req: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get recent check-ins
    const recentCheckins = await prisma.emotionalCheckin.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 30 // Last 30 days or entries
    });
    
    // Calculate mood frequency
    const moodFrequency = recentCheckins.reduce((acc, checkin) => {
      acc[checkin.mood] = (acc[checkin.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate trigger frequency
    const triggerFrequency = recentCheckins.reduce((acc, checkin) => {
      if (Array.isArray(checkin.triggers)) {
        checkin.triggers.forEach((trigger: string) => {
          acc[trigger] = (acc[trigger] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);
    
    // Calculate strategy effectiveness (simplified)
    const strategyFrequency = recentCheckins.reduce((acc, checkin) => {
      if (Array.isArray(checkin.strategies)) {
        checkin.strategies.forEach((strategy: string) => {
          acc[strategy] = (acc[strategy] || 0) + 1;
        });
      }
      return acc;
    }, {} as Record<string, number>);
    
    return NextResponse.json({
      success: true,
      recentCheckins,
      analytics: {
        moodFrequency,
        triggerFrequency,
        strategyFrequency
      }
    });
    
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error fetching emotional check-ins:', error);
    return NextResponse.json({ error: 'Failed to fetch emotional check-ins' }, { status: 500 });
  }
}

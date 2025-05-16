import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AIProvider } from '@/lib/ai/ai-service';

// Define types for AI image generation requests
export interface AIImageGenerationRequest {
  provider: AIProvider;
  model: string;
  prompt: string;
  size?: string;
  quality?: string;
  style?: string;
  n?: number;
}

// Handle AI image generation requests
export async function POST(request: NextRequest) {
  try {
    const requestData: AIImageGenerationRequest = await request.json();
    
    // Validate request
    if (!requestData.provider || !requestData.model || !requestData.prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, or prompt' },
        { status: 400 }
      );
    }
    
    // Route to appropriate provider
    let imageGeneration;
    switch (requestData.provider) {
      case 'openai':
        imageGeneration = await handleOpenAIImageGeneration(requestData);
        break;
      case 'anthropic':
      case 'gemini':
      case 'grok':
      case 'openrouter':
        // For now, we'll use OpenAI as fallback for other providers
        // In a production system, we would implement specific handlers for each provider
        imageGeneration = await handleOpenAIImageGeneration({
          ...requestData,
          provider: 'openai',
          model: 'dall-e-3'
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported AI provider for image generation' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(imageGeneration);
  } catch (error) {
    console.error('Error processing AI image generation request:', error);
    return NextResponse.json(
      { error: 'Failed to process AI image generation request' },
      { status: 500 }
    );
  }
}

// Handle OpenAI image generation
async function handleOpenAIImageGeneration(requestData: AIImageGenerationRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const openai = new OpenAI({ apiKey });
  
  // Ensure UK spelling in prompts for educational content
  const ukPrompt = `Using UK English spelling and educational standards: ${requestData.prompt}`;
  
  const response = await openai.images.generate({
    model: requestData.model,
    prompt: ukPrompt,
    n: requestData.n || 1,
    size: requestData.size || '1024x1024',
    quality: requestData.quality || 'standard',
    style: requestData.style || 'natural'
  });
  
  return {
    images: response.data.map(item => item.url),
    provider: 'openai',
    model: requestData.model
  };
}

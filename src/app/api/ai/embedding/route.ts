import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { AIProvider } from '@/lib/ai/ai-service';

// Define types for AI embedding requests
export interface AIEmbeddingRequest {
  provider: AIProvider;
  model: string;
  text: string | string[];
}

// Handle AI embedding requests
export async function POST(request: NextRequest) {
  try {
    const requestData: AIEmbeddingRequest = await request.json();
    
    // Validate request
    if (!requestData.provider || !requestData.model || !requestData.text) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, or text' },
        { status: 400 }
      );
    }
    
    // Route to appropriate provider
    let embedding;
    switch (requestData.provider) {
      case 'openai':
        embedding = await handleOpenAIEmbedding(requestData);
        break;
      case 'anthropic':
      case 'gemini':
      case 'grok':
      case 'openrouter':
        // For now, we'll use OpenAI as fallback for other providers
        // In a production system, we would implement specific handlers for each provider
        embedding = await handleOpenAIEmbedding({
          ...requestData,
          provider: 'openai',
          model: 'text-embedding-3-small'
        });
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported AI provider for embeddings' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(embedding);
  } catch (error) {
    console.error('Error processing AI embedding request:', error);
    return NextResponse.json(
      { error: 'Failed to process AI embedding request' },
      { status: 500 }
    );
  }
}

// Handle OpenAI embeddings
async function handleOpenAIEmbedding(requestData: AIEmbeddingRequest) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const openai = new OpenAI({ apiKey });
  
  const response = await openai.embeddings.create({
    model: requestData.model,
    input: requestData.text,
    encoding_format: 'float'
  });
  
  return {
    embeddings: response.data.map(item => item.embedding),
    provider: 'openai',
    model: requestData.model
  };
}

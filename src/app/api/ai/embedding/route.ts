import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
import aiService from '@/lib/ai/ai-service';

// Define AIProvider type locally since it's not exported from ai-service
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter';

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
        embedding = await handleAnthropicEmbedding(requestData);
        break;
      case 'gemini':
        embedding = await handleGeminiEmbedding(requestData);
        break;
      case 'grok':
        embedding = await handleGrokEmbedding(requestData);
        break;
      case 'openrouter':
        embedding = await handleOpenRouterEmbedding(requestData);
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
  
  try {
    const response = await openai.embeddings.create({
      model: requestData.model,
      input: requestData.text,
      encoding_format: 'float'
    });
    
    return {
      embeddings: response.data.map((item: any) => item.embedding),
      provider: 'openai',
      model: requestData.model
    };
  } catch (error) {
    console.error('Error generating OpenAI embeddings:', error);
    throw error;
  }
}

// Handle Anthropic embeddings
async function handleAnthropicEmbedding(requestData: AIEmbeddingRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }
  
  try {
    // Anthropic doesn't have a dedicated embeddings API yet
    // Fallback to OpenAI embeddings
    console.log('Anthropic embeddings not available, falling back to OpenAI');
    return handleOpenAIEmbedding({
      ...requestData,
      provider: 'openai',
      model: 'text-embedding-3-small'
    });
  } catch (error) {
    console.error('Error generating Anthropic embeddings:', error);
    throw error;
  }
}

// Handle Gemini embeddings
async function handleGeminiEmbedding(requestData: AIEmbeddingRequest) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'embedding-001' });
    
    // Convert to array if single string
    const textArray = Array.isArray(requestData.text) ? requestData.text : [requestData.text];
    
    // Process each text item
    const embeddings = await Promise.all(
      textArray.map(async (text: string) => {
        const result = await model.embedContent(text);
        return result.embedding.values;
      })
    );
    
    return {
      embeddings: embeddings,
      provider: 'gemini',
      model: 'embedding-001'
    };
  } catch (error) {
    console.error('Error generating Gemini embeddings:', error);
    // Fallback to OpenAI
    console.log('Falling back to OpenAI for embeddings');
    return handleOpenAIEmbedding({
      ...requestData,
      provider: 'openai',
      model: 'text-embedding-3-small'
    });
  }
}

// Handle Grok embeddings
async function handleGrokEmbedding(requestData: AIEmbeddingRequest) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('Grok API key not configured');
  }
  
  try {
    // Grok API implementation using axios
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
    
    // Convert to array if single string
    const textArray = Array.isArray(requestData.text) ? requestData.text : [requestData.text];
    
    // Placeholder for Grok API endpoint - update with actual endpoint when available
    const response = await axios.post('https://api.grok.ai/v1/embeddings', {
      model: requestData.model || 'grok-embedding-1',
      input: textArray
    }, { headers });
    
    return {
      embeddings: response.data.data.map((item: any) => item.embedding),
      provider: 'grok',
      model: requestData.model || 'grok-embedding-1'
    };
  } catch (error) {
    console.error('Error generating Grok embeddings:', error);
    // Fallback to OpenAI
    console.log('Falling back to OpenAI for embeddings');
    return handleOpenAIEmbedding({
      ...requestData,
      provider: 'openai',
      model: 'text-embedding-3-small'
    });
  }
}

// Handle OpenRouter embeddings
async function handleOpenRouterEmbedding(requestData: AIEmbeddingRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }
  
  try {
    // Convert to array if single string
    const textArray = Array.isArray(requestData.text) ? requestData.text : [requestData.text];
    
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://edpsychconnect.com',
        'X-Title': 'EdPsych AI Education Platform'
      },
      body: JSON.stringify({
        model: requestData.model || 'openai/text-embedding-3-small',
        input: textArray
      })
    });
    
    const data = await response.json();
    
    return {
      embeddings: data.data.map((item: any) => item.embedding),
      provider: 'openrouter',
      model: data.model || requestData.model,
    };
  } catch (error) {
    console.error('Error generating OpenRouter embeddings:', error);
    // Fallback to OpenAI
    console.log('Falling back to OpenAI for embeddings');
    return handleOpenAIEmbedding({
      ...requestData,
      provider: 'openai',
      model: 'text-embedding-3-small'
    });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { AIProvider } from '@/lib/ai/ai-service';

// Define types for AI completion requests
export interface AICompletionRequest {
  provider: AIProvider;
  model: string;
  prompt: string;
  systemPrompt?: string;
  temperature?: number;
  maxTokens?: number;
}

// Handle AI completion requests
export async function POST(request: NextRequest) {
  try {
    const requestData: AICompletionRequest = await request.json();
    
    // Validate request
    if (!requestData.provider || !requestData.model || !requestData.prompt) {
      return NextResponse.json(
        { error: 'Missing required fields: provider, model, or prompt' },
        { status: 400 }
      );
    }
    
    // Set default parameters
    const temperature = requestData.temperature ?? 0.7;
    const maxTokens = requestData.maxTokens ?? 1000;
    
    // Route to appropriate provider
    let completion;
    switch (requestData.provider) {
      case 'openai':
        completion = await handleOpenAICompletion(requestData, temperature, maxTokens);
        break;
      case 'anthropic':
        completion = await handleAnthropicCompletion(requestData, temperature, maxTokens);
        break;
      case 'gemini':
        completion = await handleGeminiCompletion(requestData, temperature, maxTokens);
        break;
      case 'grok':
        completion = await handleGrokCompletion(requestData, temperature, maxTokens);
        break;
      case 'openrouter':
        completion = await handleOpenRouterCompletion(requestData, temperature, maxTokens);
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported AI provider' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(completion);
  } catch (error) {
    console.error('Error processing AI completion request:', error);
    return NextResponse.json(
      { error: 'Failed to process AI completion request' },
      { status: 500 }
    );
  }
}

// Handle OpenAI completions
async function handleOpenAICompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const openai = new OpenAI({ apiKey });
  
  const response = await openai.chat.completions.create({
    model: requestData.model,
    messages: [
      ...(requestData.systemPrompt ? [{ role: 'system', content: requestData.systemPrompt }] : []),
      { role: 'user', content: requestData.prompt }
    ],
    temperature,
    max_tokens: maxTokens
  });
  
  return {
    text: response.choices[0]?.message?.content || '',
    provider: 'openai',
    model: requestData.model
  };
}

// Handle Anthropic completions
async function handleAnthropicCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }
  
  const anthropic = new Anthropic({ apiKey });
  
  const response = await anthropic.messages.create({
    model: requestData.model,
    system: requestData.systemPrompt || '',
    messages: [{ role: 'user', content: requestData.prompt }],
    temperature,
    max_tokens: maxTokens
  });
  
  return {
    text: response.content[0]?.text || '',
    provider: 'anthropic',
    model: requestData.model
  };
}

// Handle Gemini completions
async function handleGeminiCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: requestData.model });
  
  const generationConfig = {
    temperature,
    maxOutputTokens: maxTokens,
  };
  
  const systemPrompt = requestData.systemPrompt || '';
  const fullPrompt = systemPrompt ? `${systemPrompt}\n\n${requestData.prompt}` : requestData.prompt;
  
  const response = await model.generateContent(fullPrompt, generationConfig);
  
  return {
    text: response.response.text(),
    provider: 'gemini',
    model: requestData.model
  };
}

// Handle Grok completions (placeholder - actual implementation would depend on Grok's API)
async function handleGrokCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('Grok API key not configured');
  }
  
  // Placeholder for Grok API implementation
  // This would be replaced with actual Grok API calls when available
  
  return {
    text: 'Grok API integration is pending. This is a placeholder response.',
    provider: 'grok',
    model: requestData.model
  };
}

// Handle OpenRouter completions
async function handleOpenRouterCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: requestData.model,
      messages: [
        ...(requestData.systemPrompt ? [{ role: 'system', content: requestData.systemPrompt }] : []),
        { role: 'user', content: requestData.prompt }
      ],
      temperature,
      max_tokens: maxTokens
    })
  });
  
  const data = await response.json();
  
  return {
    text: data.choices[0]?.message?.content || '',
    provider: 'openrouter',
    model: requestData.model
  };
}

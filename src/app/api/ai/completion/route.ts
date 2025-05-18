import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
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
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const response = await openai.chat.completions.create({
    model: requestData.model,
    messages: [
      { role: 'system', content: ukSystemPrompt },
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
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const response = await anthropic.messages.create({
    model: requestData.model,
    system: ukSystemPrompt,
    messages: [{ role: 'user', content: requestData.prompt }],
    temperature,
    max_tokens: maxTokens
  });
  
  // Handle different content block types from Anthropic API
  let responseText = '';
  if (response.content && response.content.length > 0) {
    const contentBlock = response.content[0];
    if ('text' in contentBlock) {
      responseText = contentBlock.text;
    } else if (contentBlock.type === 'text') {
      responseText = contentBlock.text;
    } else {
      // If it's another type of content block, try to extract meaningful text
      responseText = JSON.stringify(contentBlock);
    }
  }
  
  return {
    text: responseText,
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
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const fullPrompt = `${ukSystemPrompt}\n\n${requestData.prompt}`;
  
  const response = await model.generateContent(fullPrompt, generationConfig);
  
  return {
    text: response.response.text(),
    provider: 'gemini',
    model: requestData.model
  };
}

// Handle Grok completions
async function handleGrokCompletion(
  requestData: AICompletionRequest,
  temperature: number,
  maxTokens: number
) {
  const apiKey = process.env.GROK_API_KEY;
  if (!apiKey) {
    throw new Error('Grok API key not configured');
  }
  
  // Grok API implementation using axios
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const data = {
    model: requestData.model || 'grok-1',
    messages: [
      { role: 'system', content: ukSystemPrompt },
      { role: 'user', content: requestData.prompt }
    ],
    temperature: temperature,
    max_tokens: maxTokens
  };
  
  try {
    // Grok API endpoint - this is a placeholder and should be updated with the actual endpoint
    const response = await axios.post('https://api.grok.ai/v1/chat/completions', data, { headers });
    
    return {
      text: response.data.choices[0]?.message?.content || '',
      provider: 'grok',
      model: requestData.model || 'grok-1'
    };
  } catch (error) {
    console.error('Error calling Grok API:', error);
    // Implement fallback to OpenAI if Grok fails
    console.log('Falling back to OpenAI for completion');
    return handleOpenAICompletion(
      { ...requestData, provider: 'openai', model: 'gpt-4-turbo' },
      temperature,
      maxTokens
    );
  }
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
  
  // Ensure UK spelling in prompts for educational content
  const ukSystemPrompt = requestData.systemPrompt 
    ? `${requestData.systemPrompt}\n\nPlease use UK English spelling and follow UK educational standards in all responses.`
    : 'Please use UK English spelling and follow UK educational standards in all responses.';
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://edpsychconnect.com',
      'X-Title': 'EdPsych AI Education Platform'
    },
    body: JSON.stringify({
      model: requestData.model,
      messages: [
        { role: 'system', content: ukSystemPrompt },
        { role: 'user', content: requestData.prompt }
      ],
      temperature,
      max_tokens: maxTokens,
      fallbacks: ['openai/gpt-4-turbo', 'anthropic/claude-3-opus']
    })
  });
  
  const data = await response.json();
  
  return {
    text: data.choices[0]?.message?.content || '',
    provider: 'openrouter',
    model: requestData.model,
    routedTo: data.model || 'unknown'
  };
}

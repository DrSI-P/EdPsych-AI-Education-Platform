import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';
// Remove unused import
// import { getAIService } from '@/lib/ai/ai-service';

// Define AIProvider type locally
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'azure' | 'ollama' | 'grok' | 'openrouter' | 'stability';

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
export async function POST(request: NextRequest): Promise<NextResponse> {
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
        imageGeneration = await handleAnthropicImageGeneration(requestData);
        break;
      case 'gemini':
        imageGeneration = await handleGeminiImageGeneration(requestData);
        break;
      case 'grok':
        imageGeneration = await handleGrokImageGeneration(requestData);
        break;
      case 'openrouter':
        imageGeneration = await handleOpenRouterImageGeneration(requestData);
        break;
      default:
        return NextResponse.json(
          { error: 'Unsupported AI provider for image generation' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(imageGeneration);
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error processing AI image generation request:', error);
    return NextResponse.json(
      { error: 'Failed to process AI image generation request' },
      { status: 500 }
    );
  }
}

// Handle OpenAI image generation
async function handleOpenAIImageGeneration(requestData: AIImageGenerationRequest): Promise<any> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const openai = new OpenAI({ apiKey });
  
  // Ensure UK spelling in prompts for educational content
  const ukPrompt = `Using UK English spelling and educational standards: ${requestData.prompt}`;
  
  try {
    const response = await openai.images.generate({
      model: requestData.model,
      prompt: ukPrompt,
      n: requestData.n || 1,
      size: (requestData.size as "1024x1024" | "1536x1024" | "1024x1536" | "256x256" | "512x512" | "1792x1024" | "1024x1792") || '1024x1024',
      quality: (requestData.quality as "standard" | "hd" | "medium" | "high" | "low") || 'standard',
      style: (requestData.style as "natural" | "vivid") || 'natural'
    });
    
    return {
      images: response.data?.map(item => item.url) || [],
      provider: 'openai',
      model: requestData.model
    };
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error generating OpenAI images:', error);
    throw error;
  }
}

// Handle Anthropic image generation
async function handleAnthropicImageGeneration(requestData: AIImageGenerationRequest): Promise<any> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Anthropic API key not configured');
  }
  
  try {
    const anthropic = new Anthropic({ apiKey });
    
    // Ensure UK spelling in prompts for educational content
    const ukPrompt = `Using UK English spelling and educational standards: ${requestData.prompt}`;
    
    // Claude 3 Opus and Sonnet support image generation via the messages API
    const response = await anthropic.messages.create({
      model: requestData.model,
      max_tokens: 1024,
      system: "You are an educational image generator. Generate detailed image descriptions for educational content using UK English spelling and following UK educational standards.",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Please generate a detailed image description for: ${ukPrompt}`
            }
          ]
        }
      ]
    });
    
    // Since Anthropic doesn't have a direct image generation API yet,
    // we'll use the text description to generate an image with OpenAI
    let imageDescription = '';
    if (response.content && response.content.length > 0) {
      const block = response.content[0];
      if ('text' in block) {
        imageDescription = block.text;
      }
    }
    
    if (!imageDescription) {
      throw new Error('Failed to extract image description from Anthropic response');
    }
    
    // Replace console.log with structured logging when available
    console.log('Using Anthropic description to generate image with OpenAI:', imageDescription);
    
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3',
      prompt: imageDescription
    });
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error with Anthropic image generation:', error);
    // Fallback to OpenAI
    console.log('Falling back to OpenAI for image generation');
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3'
    });
  }
}

// Handle Gemini image generation
async function handleGeminiImageGeneration(requestData: AIImageGenerationRequest): Promise<any> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }
  
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
    
    // Ensure UK spelling in prompts for educational content
    const ukPrompt = `Using UK English spelling and educational standards, create a detailed description for an educational image about: ${requestData.prompt}`;
    
    const result = await model.generateContent(ukPrompt);
    const imageDescription = result.response.text();
    
    // Replace console.log with structured logging when available
    console.log('Using Gemini description to generate image with OpenAI:', imageDescription);
    
    // Use OpenAI for actual image generation
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3',
      prompt: imageDescription
    });
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error with Gemini image generation:', error);
    // Fallback to OpenAI
    console.log('Falling back to OpenAI for image generation');
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3'
    });
  }
}

// Handle Grok image generation
async function handleGrokImageGeneration(requestData: AIImageGenerationRequest): Promise<any> {
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
    
    // Ensure UK spelling in prompts for educational content
    const ukPrompt = `Using UK English spelling and educational standards: ${requestData.prompt}`;
    
    // First get a detailed description from Grok
    const descriptionResponse = await axios.post('https://api.grok.ai/v1/chat/completions', {
      model: 'grok-1',
      messages: [
        { 
          role: 'system', 
          content: 'You are an educational image description generator. Create detailed image descriptions for educational content using UK English spelling and following UK educational standards.' 
        },
        { 
          role: 'user', 
          content: `Create a detailed description for an educational image about: ${ukPrompt}` 
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    }, { headers });
    
    const imageDescription = descriptionResponse.data.choices[0]?.message?.content || ukPrompt;
    
    // Replace console.log with structured logging when available
    console.log('Using Grok description to generate image with OpenAI:', imageDescription);
    
    // Use OpenAI for actual image generation
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3',
      prompt: imageDescription
    });
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error with Grok image generation:', error);
    // Fallback to OpenAI
    console.log('Falling back to OpenAI for image generation');
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3'
    });
  }
}

// Handle OpenRouter image generation
async function handleOpenRouterImageGeneration(requestData: AIImageGenerationRequest): Promise<any> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }
  
  try {
    // Ensure UK spelling in prompts for educational content
    const ukPrompt = `Using UK English spelling and educational standards: ${requestData.prompt}`;
    
    // OpenRouter doesn't directly support image generation yet, so we'll use it to get a description
    // and then use OpenAI for the actual image generation
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXTAUTH_URL || 'https://edpsychconnect.com',
        'X-Title': 'EdPsych AI Education Platform'
      },
      body: JSON.stringify({
        model: requestData.model || 'openai/gpt-4-turbo',
        messages: [
          { 
            role: 'system', 
            content: 'You are an educational image description generator. Create detailed image descriptions for educational content using UK English spelling and following UK educational standards.' 
          },
          { 
            role: 'user', 
            content: `Create a detailed description for an educational image about: ${ukPrompt}` 
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    });
    
    const data = await response.json();
    const imageDescription = data.choices[0]?.message?.content || ukPrompt;
    
    // Replace console.log with structured logging when available
    console.log('Using OpenRouter description to generate image with OpenAI:', imageDescription);
    
    // Use OpenAI for actual image generation
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3',
      prompt: imageDescription
    });
  } catch (error) {
    // Replace console.error with structured logging when available
    console.error('Error with OpenRouter image generation:', error);
    // Fallback to OpenAI
    console.log('Falling back to OpenAI for image generation');
    return handleOpenAIImageGeneration({
      ...requestData,
      provider: 'openai',
      model: 'dall-e-3'
    });
  }
}

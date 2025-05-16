'use client';

import { useState, useEffect } from 'react';

// Define types for AI service providers
export type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter';

export type AIModelType = 'text' | 'vision' | 'embedding' | 'speech-to-text' | 'text-to-speech';

export interface AIModel {
  id: string;
  provider: AIProvider;
  name: string;
  description: string;
  types: AIModelType[];
  contextLength: number;
  capabilities: string[];
  bestFor: string[];
}

// Define available models for each provider
export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4-turbo',
    provider: 'openai',
    name: 'GPT-4 Turbo',
    description: 'Advanced language model with strong reasoning capabilities',
    types: ['text', 'vision'],
    contextLength: 128000,
    capabilities: ['Text generation', 'Image understanding', 'Complex reasoning'],
    bestFor: ['Complex educational content', 'Detailed explanations', 'Curriculum planning']
  },
  {
    id: 'gpt-3.5-turbo',
    provider: 'openai',
    name: 'GPT-3.5 Turbo',
    description: 'Balanced language model for general educational use',
    types: ['text'],
    contextLength: 16000,
    capabilities: ['Text generation', 'Basic reasoning', 'Educational content'],
    bestFor: ['Quick responses', 'Simpler explanations', 'Younger students']
  },
  {
    id: 'claude-3-opus',
    provider: 'anthropic',
    name: 'Claude 3 Opus',
    description: 'Advanced model with nuanced understanding and reasoning',
    types: ['text', 'vision'],
    contextLength: 200000,
    capabilities: ['Text generation', 'Image understanding', 'Nuanced reasoning'],
    bestFor: ['Special educational needs support', 'Detailed curriculum analysis', 'Complex educational content']
  },
  {
    id: 'claude-3-sonnet',
    provider: 'anthropic',
    name: 'Claude 3 Sonnet',
    description: 'Balanced model for educational applications',
    types: ['text', 'vision'],
    contextLength: 180000,
    capabilities: ['Text generation', 'Image understanding', 'Educational content'],
    bestFor: ['Balanced educational support', 'Curriculum development', 'Student assistance']
  },
  {
    id: 'gemini-pro',
    provider: 'gemini',
    name: 'Gemini Pro',
    description: 'Versatile model with strong multimodal capabilities',
    types: ['text', 'vision'],
    contextLength: 32000,
    capabilities: ['Text generation', 'Image understanding', 'Multimodal learning'],
    bestFor: ['Mathematics education', 'Science education', 'Visual learning materials']
  },
  {
    id: 'gemini-ultra',
    provider: 'gemini',
    name: 'Gemini Ultra',
    description: 'Advanced model with superior reasoning and multimodal understanding',
    types: ['text', 'vision'],
    contextLength: 32000,
    capabilities: ['Text generation', 'Image understanding', 'Advanced reasoning'],
    bestFor: ['Advanced mathematics', 'Complex scientific concepts', 'Multimodal educational content']
  },
  {
    id: 'grok-1',
    provider: 'grok',
    name: 'Grok-1',
    description: 'Conversational model with current knowledge and engaging style',
    types: ['text'],
    contextLength: 8000,
    capabilities: ['Text generation', 'Current events knowledge', 'Engaging dialogue'],
    bestFor: ['Current events education', 'Engaging younger learners', 'Interactive learning']
  },
  {
    id: 'openrouter-router',
    provider: 'openrouter',
    name: 'OpenRouter',
    description: 'Meta-service that routes to optimal models based on task',
    types: ['text', 'vision'],
    contextLength: 32000,
    capabilities: ['Model routing', 'Cost optimization', 'Fallback handling'],
    bestFor: ['Optimizing AI costs', 'Ensuring service reliability', 'Accessing multiple models']
  }
];

// Hook for AI service configuration
export function useAIService() {
  const [defaultProvider, setDefaultProvider] = useState<AIProvider>('openai');
  const [defaultModel, setDefaultModel] = useState<string>('gpt-4-turbo');
  const [isConfigured, setIsConfigured] = useState<boolean>(false);
  
  // Check if AI services are configured
  useEffect(() => {
    const checkConfiguration = async () => {
      try {
        const response = await fetch('/api/ai/config');
        const data = await response.json();
        setIsConfigured(data.configured);
        if (data.defaultProvider) {
          setDefaultProvider(data.defaultProvider);
        }
        if (data.defaultModel) {
          setDefaultModel(data.defaultModel);
        }
      } catch (error) {
        console.error('Error checking AI configuration:', error);
        setIsConfigured(false);
      }
    };
    
    checkConfiguration();
  }, []);
  
  // Get models for a specific provider
  const getModelsForProvider = (provider: AIProvider): AIModel[] => {
    return AI_MODELS.filter(model => model.provider === provider);
  };
  
  // Get model by ID
  const getModelById = (modelId: string): AIModel | undefined => {
    return AI_MODELS.find(model => model.id === modelId);
  };
  
  // Get best model for a specific task
  const getBestModelForTask = (task: string, type: AIModelType = 'text'): AIModel => {
    // This is a simplified implementation
    // In a real system, this would use more sophisticated matching
    const eligibleModels = AI_MODELS.filter(model => model.types.includes(type));
    
    for (const model of eligibleModels) {
      if (model.bestFor.some(bestFor => bestFor.toLowerCase().includes(task.toLowerCase()))) {
        return model;
      }
    }
    
    // Default to the current default model if no specific match
    return getModelById(defaultModel) || eligibleModels[0];
  };
  
  return {
    isConfigured,
    defaultProvider,
    defaultModel,
    setDefaultProvider,
    setDefaultModel,
    getModelsForProvider,
    getModelById,
    getBestModelForTask,
    allModels: AI_MODELS
  };
}

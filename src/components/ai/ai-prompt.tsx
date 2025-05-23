'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Select, Textarea } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useAIService } from '@/lib/ai/ai-service';

// Define AIProvider and AIModel types
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter';
type AIModel = {
  id: string;
  name: string;
  provider: string;
};

interface AIPromptProps {
  onCompletion?: (result: string) => void;
  initialPrompt?: string;
  placeholder?: string;
  systemPrompt?: string;
  className?: string;
}

export function AIPrompt({
  onCompletion,
  initialPrompt = '',
  placeholder = 'Enter your question or prompt here...',
  systemPrompt = 'You are a helpful educational assistant using UK English spelling and following UK educational standards. Provide clear, accurate, and age-appropriate responses.',
  className = ''
}: AIPromptProps) {
  const aiService = useAIService();
  
  // Mock values for demonstration purposes
  const isConfigured = true;
  const defaultProvider = 'openai' as AIProvider;
  const defaultModel = 'gpt-4o';
  
  // Mock AI models
  const allModels: AIModel[] = [
    { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
    { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini' },
    { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'gemini' },
    { id: 'grok-1', name: 'Grok-1', provider: 'grok' }
  ];
  
  // Function to get models for a specific provider
  const getModelsForProvider = (providerName: AIProvider): AIModel[] => {
    return allModels.filter(m => m.provider === providerName);
  };
  
  const [provider, setProvider] = useState<AIProvider>(defaultProvider);
  const [model, setModel] = useState<string>(defaultModel);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get models for the selected provider
  const availableModels = getModelsForProvider(provider);
  
  // Handle provider change
  const handleProviderChange = (value: string) => {
    const newProvider = value as AIProvider;
    setProvider(newProvider);
    
    // Set default model for the new provider
    const models = getModelsForProvider(newProvider);
    if (models.length > 0) {
      setModel(models[0].id);
    }
  };
  
  // Handle model change
  const handleModelChange = (value: string) => {
    setModel(value);
  };
  
  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/ai/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          model,
          prompt,
          systemPrompt
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI completion');
      }
      
      setResult(data.text);
      onCompletion?.(data.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  if (!isConfigured) {
    return (
      <Alert variant="warning" title="AI Services Not Configured">
        AI services are not configured. Please add API keys in the environment configuration.
      </Alert>
    );
  }
  
  return (
    <Card className={className}>
      <CardHeader>
        <h3 className="text-lg font-medium">AI Assistant</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <Select
              label="AI Provider"
              value={provider}
              onChange={handleProviderChange}
              options={allModels
                .map((model: AIModel) => model.provider)
                .filter((value: string, index: number, self: string[]) => self.indexOf(value) === index)
                .map((provider: string) => ({
                  value: provider,
                  label: provider.charAt(0).toUpperCase() + provider.slice(1)
                }))}
              className="w-1/2"
            />
            
            <Select
              label="Model"
              value={model}
              onChange={handleModelChange}
              options={availableModels.map((model: AIModel) => ({
                value: model.id,
                label: model.name
              }))}
              className="w-1/2"
            />
          </div>
          
          <Textarea
            label="Prompt"
            value={prompt}
            onChange={handlePromptChange}
            placeholder={placeholder}
            rows={4}
            required
          />
          
          {error && (
            <Alert variant="error" dismissible>
              {error}
            </Alert>
          )}
          
          {result && (
            <div className="p-4 bg-grey-50 rounded-md border">
              <h4 className="text-sm font-medium mb-2">Response:</h4>
              <div className="text-sm whitespace-pre-wrap">{result}</div>
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? <><Spinner size="sm" className="mr-2" /> Processing...</> : 'Generate Response'}
        </Button>
      </CardFooter>
    </Card>
  );
}

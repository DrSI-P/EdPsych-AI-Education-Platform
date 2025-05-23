'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Textarea, Select } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useAIService } from '@/lib/ai/ai-service';

// Define AIProvider type
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter';

interface AIFeedbackGeneratorProps {
  studentWork: string;
  onFeedbackGenerated?: (feedback: string) => void;
  className?: string;
}

export function AIFeedbackGenerator({
  studentWork,
  onFeedbackGenerated,
  className = ''
}: AIFeedbackGeneratorProps) {
  const aiService = useAIService();
  
  // Mock values for demonstration purposes
  const isConfigured = true;
  const defaultProvider = 'openai' as AIProvider;
  const defaultModel = 'gpt-4o';
  
  const [provider, setProvider] = useState<AIProvider>(defaultProvider);
  const [model, setModel] = useState<string>(defaultModel);
  const [feedbackType, setFeedbackType] = useState('constructive');
  const [ageGroup, setAgeGroup] = useState('secondary');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Mock function to get models for the selected provider
  const getModelsForProvider = (provider: AIProvider) => {
    // Mock models for each provider
    const models = {
      'openai': [
        { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
        { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', provider: 'openai' },
        { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' }
      ],
      'anthropic': [
        { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'anthropic' },
        { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', provider: 'anthropic' },
        { id: 'claude-3-haiku', name: 'Claude 3 Haiku', provider: 'anthropic' }
      ],
      'gemini': [
        { id: 'gemini-pro', name: 'Gemini Pro', provider: 'gemini' },
        { id: 'gemini-ultra', name: 'Gemini Ultra', provider: 'gemini' }
      ],
      'grok': [
        { id: 'grok-1', name: 'Grok-1', provider: 'grok' }
      ],
      'openrouter': [
        { id: 'openai/gpt-4o', name: 'OpenAI GPT-4o', provider: 'openrouter' },
        { id: 'anthropic/claude-3-opus', name: 'Anthropic Claude 3 Opus', provider: 'openrouter' },
        { id: 'meta/llama-3', name: 'Meta Llama 3', provider: 'openrouter' }
      ]
    };
    
    return models[provider] || [];
  };
  
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
  
  // Generate feedback
  const generateFeedback = async () => {
    if (!studentWork.trim()) {
      setError('Please provide student work to generate feedback');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Create a system prompt that enforces UK spelling and educational standards
      const systemPrompt = `You are an educational assistant providing ${feedbackType} feedback for ${ageGroup} school students. 
Always use UK English spelling and follow UK educational standards and curriculum. 
Your feedback should be encouraging, specific, and actionable.`;
      
      // Create the user prompt
      const prompt = `Please provide ${feedbackType} feedback for this ${ageGroup} school student's work:
      
${studentWork}

Format your feedback with:
1. Positive aspects
2. Areas for improvement
3. Specific suggestions
4. Encouraging conclusion`;
      
      const response = await fetch('/api/ai/completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          model,
          prompt,
          systemPrompt,
          temperature: 0.7,
          maxTokens: 1000
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate feedback');
      }
      
      setFeedback(data.text);
      onFeedbackGenerated?.(data.text);
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
        <h3 className="text-lg font-medium">AI Feedback Generator</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-4">
            <Select
              label="AI Provider"
              value={provider}
              onChange={handleProviderChange}
              options={availableModels
                .map(model => model.provider)
                .filter((value, index, self) => self.indexOf(value) === index)
                .map(provider => ({
                  value: provider,
                  label: provider.charAt(0).toUpperCase() + provider.slice(1)
                }))}
              className="w-1/2"
            />
            
            <Select
              label="Model"
              value={model}
              onChange={handleModelChange}
              options={availableModels.map(model => ({
                value: model.id,
                label: model.name
              }))}
              className="w-1/2"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select
              label="Feedback Type"
              value={feedbackType}
              onChange={(value) => setFeedbackType(value)}
              options={[
                { value: 'constructive', label: 'Constructive' },
                { value: 'detailed', label: 'Detailed' },
                { value: 'simple', label: 'Simple' },
                { value: 'encouraging', label: 'Encouraging' }
              ]}
              className="w-1/2"
            />
            
            <Select
              label="Age Group"
              value={ageGroup}
              onChange={(value) => setAgeGroup(value)}
              options={[
                { value: 'primary', label: 'Primary School' },
                { value: 'secondary', label: 'Secondary School' },
                { value: 'sixth-form', label: 'Sixth Form' }
              ]}
              className="w-1/2"
            />
          </div>
          
          <Textarea
            label="Student Work"
            value={studentWork}
            readOnly
            rows={6}
          />
          
          {error && (
            <Alert variant="error" dismissible>
              {error}
            </Alert>
          )}
          
          {feedback && (
            <div className="p-4 bg-grey-50 rounded-md border">
              <h4 className="text-sm font-medium mb-2">Generated Feedback:</h4>
              <div className="text-sm whitespace-pre-wrap">{feedback}</div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={generateFeedback} disabled={loading}>
          {loading ? <><Spinner size="sm" className="mr-2" /> Generating...</> : 'Generate Feedback'}
        </Button>
      </CardFooter>
    </Card>
  );
}

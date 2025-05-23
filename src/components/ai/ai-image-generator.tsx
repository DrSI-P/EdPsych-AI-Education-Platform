'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Input, Select } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/loading';
import { Alert } from '@/components/ui/alert';
import { useAIService } from '@/lib/ai/ai-service';

// Define AIProvider type
type AIProvider = 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter';

interface AIImageGeneratorProps {
  onGeneration?: (imageUrl: string) => void;
  initialPrompt?: string;
  placeholder?: string;
  className?: string;
}

export function AIImageGenerator({
  onGeneration,
  initialPrompt = '',
  placeholder = 'Describe the image you want to generate...',
  className = ''
}: AIImageGeneratorProps) {
  const aiService = useAIService();
  
  // Mock values for demonstration purposes
  const isConfigured = true;
  
  const [provider, setProvider] = useState<AIProvider>('openai');
  const [model, setModel] = useState<string>('dall-e-3');
  const [prompt, setPrompt] = useState(initialPrompt);
  const [size, setSize] = useState('1024x1024');
  const [quality, setQuality] = useState('standard');
  const [style, setStyle] = useState('natural');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Handle provider change
  const handleProviderChange = (value: string) => {
    const newProvider = value as AIProvider;
    setProvider(newProvider);
    
    // For now, only OpenAI is fully supported for image generation
    if (newProvider === 'openai') {
      setModel('dall-e-3');
    }
  };
  
  // Handle prompt change
  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const response = await fetch('/api/ai/image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          provider,
          model,
          prompt,
          size,
          quality,
          style,
          n: 1
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }
      
      if (data.images && data.images.length > 0) {
        setImageUrl(data.images[0]);
        onGeneration?.(data.images[0]);
      } else {
        throw new Error('No image was generated');
      }
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
        <h3 className="text-lg font-medium">AI Image Generator</h3>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex space-x-4">
            <Select
              label="AI Provider"
              value={provider}
              onChange={handleProviderChange}
              options={[
                { value: 'openai', label: 'OpenAI' }
              ]}
              className="w-1/2"
            />
            
            <Select
              label="Image Size"
              value={size}
              onChange={(value) => setSize(value)}
              options={[
                { value: '1024x1024', label: '1024×1024 (Square)' },
                { value: '1792x1024', label: '1792×1024 (Landscape)' },
                { value: '1024x1792', label: '1024×1792 (Portrait)' }
              ]}
              className="w-1/2"
            />
          </div>
          
          <div className="flex space-x-4">
            <Select
              label="Quality"
              value={quality}
              onChange={(value) => setQuality(value)}
              options={[
                { value: 'standard', label: 'Standard' },
                { value: 'hd', label: 'HD' }
              ]}
              className="w-1/2"
            />
            
            <Select
              label="Style"
              value={style}
              onChange={(value) => setStyle(value)}
              options={[
                { value: 'natural', label: 'Natural' },
                { value: 'vivid', label: 'Vivid' }
              ]}
              className="w-1/2"
            />
          </div>
          
          <Input
            label="Prompt"
            value={prompt}
            onChange={handlePromptChange}
            placeholder={placeholder}
            required
          />
          
          {error && (
            <Alert variant="error" dismissible>
              {error}
            </Alert>
          )}
          
          {imageUrl && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Generated Image:</h4>
              <img 
                src={imageUrl} 
                alt="AI-generated image" 
                className="w-full h-auto rounded-md border"
              />
            </div>
          )}
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" onClick={handleSubmit} disabled={loading}>
          {loading ? <><Spinner size="sm" className="mr-2" /> Generating...</> : 'Generate Image'}
        </Button>
      </CardFooter>
    </Card>
  );
}

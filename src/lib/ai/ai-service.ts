'use client';

import { useState, useEffect } from 'react';

// Custom hook for using AI service in components
export function useAIService() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Generate text using AI
  const generateText = async (prompt: string, options: any = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateText(prompt, options);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };
  
  // Analyze sentiment of text
  const analyzeSentiment = async (text: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.analyzeSentiment(text);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };
  
  // Generate educational content
  const generateEducationalContent = async (topic: string, ageGroup: string, format: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await aiService.generateEducationalContent(topic, ageGroup, format);
      setIsLoading(false);
      return result;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      throw err;
    }
  };
  
  return {
    isLoading,
    error,
    generateText,
    analyzeSentiment,
    generateEducationalContent
  };
}

// AI service for handling AI-related operations
export const aiService = {
  // Generate text using AI
  generateText: async (prompt: string, options: any = {}) => {
    try {
      // In a real implementation, this would call an actual AI service
      // For now, we'll return a mock response
      console.log('Generating text for prompt:', prompt, 'with options:', options);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        text: `AI-generated response for: ${prompt}`,
        metadata: {
          model: options.model || 'default',
          tokens: Math.floor(Math.random() * 100) + 50,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating text:', error);
      throw error;
    }
  },
  
  // Analyze sentiment of text
  analyzeSentiment: async (text: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simple mock sentiment analysis
      const words = text.toLowerCase().split(' ');
      const positiveWords = ['good', 'great', 'excellent', 'happy', 'positive', 'like', 'love'];
      const negativeWords = ['bad', 'poor', 'terrible', 'sad', 'negative', 'dislike', 'hate'];
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
      });
      
      let sentiment = 'neutral';
      if (positiveCount > negativeCount) sentiment = 'positive';
      if (negativeCount > positiveCount) sentiment = 'negative';
      
      return {
        sentiment,
        confidence: 0.7,
        details: {
          positiveScore: positiveCount / words.length,
          negativeScore: negativeCount / words.length,
          neutralScore: 1 - ((positiveCount + negativeCount) / words.length)
        }
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      throw error;
    }
  },
  
  // Generate educational content
  generateEducationalContent: async (topic: string, ageGroup: string, format: string) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return {
        content: `Educational content about ${topic} for ${ageGroup} in ${format} format.`,
        metadata: {
          topic,
          ageGroup,
          format,
          timestamp: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error generating educational content:', error);
      throw error;
    }
  }
};

export default aiService;

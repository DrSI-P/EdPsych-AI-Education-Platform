/**
 * Environment variable validation utility
 *
 * This module validates that all required environment variables are set
 * and provides typed access to environment variables.
 */
import * as process from 'process';

// Define the shape of our environment variables
interface EnvVariables {
  // Database
  DATABASE_URL: string;
  
  // NextAuth
  NEXTAUTH_URL: string;
  NEXTAUTH_SECRET: string;
  
  // AI Services
  OPENAI_API_KEY?: string;
  ANTHROPIC_API_KEY?: string;
  GEMINI_API_KEY?: string;
  GROK_API_KEY?: string;
  OPENROUTER_API_KEY?: string;
  
  // OAuth Providers
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  
  // Deployment Environment
  NODE_ENV: 'development' | 'production' | 'test';
  VERCEL_ENV?: 'production' | 'preview' | 'development';
}

// Define which variables are required in which environments
const requiredInProduction: (keyof EnvVariables)[] = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
  // At least one AI service is required in production
  // This is handled separately below
];

const requiredInDevelopment: (keyof EnvVariables)[] = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
];

/**
 * Validates that all required environment variables are set
 * @returns An object with validated environment variables
 * @throws Error if required variables are missing
 */
export function validateEnv(): EnvVariables {
  const env = process.env as unknown as EnvVariables;
  const isProduction = env.NODE_ENV === 'production';
  const requiredVars = isProduction ? requiredInProduction : requiredInDevelopment;
  
  // Check required variables
  const missingVars = requiredVars.filter(key => !env[key]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
  
  // In production, ensure at least one AI service is configured
  if (isProduction) {
    const hasAiService = !!(
      env.OPENAI_API_KEY || 
      env.ANTHROPIC_API_KEY || 
      env.GEMINI_API_KEY || 
      env.GROK_API_KEY || 
      env.OPENROUTER_API_KEY
    );
    
    if (!hasAiService) {
      throw new Error('At least one AI service API key must be configured in production');
    }
  }
  
  return env;
}

// Export a validated environment object
export const env = validateEnv();

// Export a function to check if a specific AI provider is configured
export function isAiProviderConfigured(provider: 'openai' | 'anthropic' | 'gemini' | 'grok' | 'openrouter'): boolean {
  switch (provider) {
    case 'openai':
      return !!env.OPENAI_API_KEY;
    case 'anthropic':
      return !!env.ANTHROPIC_API_KEY;
    case 'gemini':
      return !!env.GEMINI_API_KEY;
    case 'grok':
      return !!env.GROK_API_KEY;
    case 'openrouter':
      return !!env.OPENROUTER_API_KEY;
    default:
      return false;
  }
}

// Export a function to get available AI providers
export function getAvailableAiProviders(): string[] {
  return [
    'openai',
    'anthropic',
    'gemini',
    'grok',
    'openrouter'
  ].filter(provider => isAiProviderConfigured(provider as any));
}
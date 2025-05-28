// Environment configuration for EdPsych-AI-Education-Platform
// This file defines and validates all environment variables used in the application

// Default environment values for development
const env = {
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "sk-placeholder",
  AZURE_COGNITIVE_KEY: process.env.AZURE_COGNITIVE_KEY || "azure-placeholder",
  AZURE_COGNITIVE_ENDPOINT: process.env.AZURE_COGNITIVE_ENDPOINT || "https://example.azure.com",
  AZURE_COGNITIVE_REGION: process.env.AZURE_COGNITIVE_REGION || "eastus",
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY || "hf-placeholder",
  
  // HeyGen API Configuration
  HEYGEN_API_KEY: process.env.HEYGEN_API_KEY || "heygen-placeholder",
  HEYGEN_API_URL: process.env.HEYGEN_API_URL || "https://api.heygen.com",
  
  // Database Configuration
  DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/edpsych",
  
  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "development-secret-do-not-use-in-production",
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || "http://localhost:3000",
  
  // Feature Flags
  ENABLE_AI_FEATURES: process.env.ENABLE_AI_FEATURES === "true" || false,
  ENABLE_VOICE_INPUT: process.env.ENABLE_VOICE_INPUT === "true" || false,
  ENABLE_HEYGEN_VIDEOS: process.env.ENABLE_HEYGEN_VIDEOS === "true" || false,
  
  // Application Settings
  NODE_ENV: process.env.NODE_ENV || "development",
  VERCEL_ENV: process.env.VERCEL_ENV || "development",
  VERCEL_URL: process.env.VERCEL_URL || "localhost:3000",
  
  // Analytics
  ANALYTICS_ID: process.env.ANALYTICS_ID || "",
  
  // Deployment
  DEPLOYMENT_URL: process.env.DEPLOYMENT_URL || "http://localhost:3000"
};

export { env };

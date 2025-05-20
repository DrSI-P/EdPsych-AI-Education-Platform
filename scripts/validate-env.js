#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * 
 * This script validates that all required environment variables are set
 * before building the application. It's designed to be run as part of
 * the build process to prevent deployments with missing configuration.
 */

// Required environment variables for production
const requiredInProduction = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
];

// Required environment variables for development
const requiredInDevelopment = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET',
];

// At least one of these AI service keys must be present in production
const aiServiceKeys = [
  'OPENAI_API_KEY',
  'ANTHROPIC_API_KEY',
  'GEMINI_API_KEY',
  'GROK_API_KEY',
  'OPENROUTER_API_KEY',
];

// Determine environment
const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production';
const requiredVars = isProduction ? requiredInProduction : requiredInDevelopment;

// Check required variables
const missingVars = requiredVars.filter(key => !process.env[key]);

if (missingVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', '❌ Error: Missing required environment variables:');
  missingVars.forEach(key => {
    console.error(`   - ${key}`);
  });
  process.exit(1);
}

// In production, ensure at least one AI service is configured
if (isProduction) {
  const hasAiService = aiServiceKeys.some(key => !!process.env[key]);
  
  if (!hasAiService) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: At least one AI service API key must be configured in production:');
    aiServiceKeys.forEach(key => {
      console.error(`   - ${key}`);
    });
    process.exit(1);
  }
}

// Check for database URL format
if (process.env.DATABASE_URL) {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl.startsWith('postgresql://')) {
    console.error('\x1b[31m%s\x1b[0m', '❌ Error: DATABASE_URL must be a valid PostgreSQL connection string');
    process.exit(1);
  }
}

// All checks passed
console.log('\x1b[32m%s\x1b[0m', '✅ Environment validation passed');
/**
 * Environment Configuration
 * 
 * This module provides type-safe environment variables for the application.
 * It uses zod for validation to ensure all required variables are present.
 */

import { z } from "zod";

/**
 * Environment variable schema with validation
 */
const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(["development", "test", "production"]),
  
  // API Keys
  OPENAI_API_KEY: z.string().optional(),
  AZURE_OPENAI_API_KEY: z.string().optional(),
  AZURE_OPENAI_ENDPOINT: z.string().optional(),
  HUGGINGFACE_API_KEY: z.string().optional(),
  HEYGEN_API_KEY: z.string().optional(),
  
  // Database
  DATABASE_URL: z.string().optional(),
  
  // Authentication
  NEXTAUTH_SECRET: z.string().optional(),
  NEXTAUTH_URL: z.string().optional(),
  
  // Public variables (accessible in browser)
  NEXT_PUBLIC_APP_URL: z.string().optional(),
  NEXT_PUBLIC_API_URL: z.string().optional(),
  NEXT_PUBLIC_HEYGEN_API_URL: z.string().optional(),
});

/**
 * Parse environment variables or use defaults
 */
export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // API Keys
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  AZURE_OPENAI_API_KEY: process.env.AZURE_OPENAI_API_KEY,
  AZURE_OPENAI_ENDPOINT: process.env.AZURE_OPENAI_ENDPOINT,
  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
  HEYGEN_API_KEY: process.env.HEYGEN_API_KEY,
  
  // Database
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Authentication
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  
  // Public variables
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_HEYGEN_API_URL: process.env.NEXT_PUBLIC_HEYGEN_API_URL,
});

/**
 * Default export for importing in other modules
 */
export default env;

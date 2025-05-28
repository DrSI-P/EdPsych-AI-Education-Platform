/**
 * Direct DB export file specifically designed to fix circular dependencies
 * and ensure compatibility with both relative and absolute imports.
 */

import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient to prevent multiple instances
// during hot reloading in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Initialize the prisma client with logging in development
export const prisma = globalForPrisma.prisma || 
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });

// Prevent multiple instances during hot reloading in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Export db as an alias for prisma for backward compatibility
export const db = prisma;

// Default export for CommonJS compatibility
export default prisma;

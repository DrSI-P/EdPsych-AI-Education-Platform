/**
 * Direct DB export file
 * 
 * This file provides a singleton PrismaClient instance that can be imported
 * throughout the application using either named or default imports.
 * It supports both relative imports from auth/users.ts and absolute imports from @/lib/db
 */

import { PrismaClient } from '@prisma/client';

// Create a singleton instance of PrismaClient
let prismaInstance: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaInstance = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple instances during hot-reloading
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prismaInstance = global.prisma;
}

// Export prisma instance directly
export const prisma = prismaInstance;

// Export db as a named export (for named imports)
export const db = prismaInstance;

// Also export db as default (for default imports)
export default prismaInstance;

// Add type declaration for global variable
declare global {
  var prisma: PrismaClient | undefined;
}

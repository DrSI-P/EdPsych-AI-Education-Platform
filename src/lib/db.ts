/**
 * Direct DB export file specifically for auth/users.ts relative imports
 * 
 * This file provides the db instance for relative imports from auth/users.ts
 * using the '../db' path.
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

// Export db as a named export (for named imports)
export const db = prismaInstance;

// Export prisma as a named export (for components that import prisma directly)
export const prisma = prismaInstance;

// Add type declaration for global variable
declare global {
  var prisma: PrismaClient | undefined;
}

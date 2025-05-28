// This file is specifically created to support both relative imports from auth/users.ts
// and absolute imports from @/lib/db

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

// Create a db object that can be imported throughout the application
export const db = prismaInstance;

// Also export db as default for compatibility with existing imports
export default db;

// Add type declaration for global variable
declare global {
  var prisma: PrismaClient | undefined;
}

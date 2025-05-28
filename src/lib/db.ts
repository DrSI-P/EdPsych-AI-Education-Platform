/**
 * Direct DB export file - Single source of truth
 * 
 * This file provides a singleton PrismaClient instance that can be imported
 * throughout the application using named imports.
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

// Export prisma instance directly with explicit named export
export const prisma = prismaInstance;

// Export db as a named export only (no default export to avoid ambiguity)
export const db = prismaInstance;

// Add type declaration for global variable
declare global {
  var prisma: PrismaClient | undefined;
}

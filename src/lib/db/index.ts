// Barrel file for db module
// This file serves as the main entry point for database-related imports

import prisma from './prisma';

// Create a db object that can be imported throughout the application
export const db = prisma;

export { prisma };
// Export any other database-related utilities

// Also export db as default for compatibility with existing imports
export default db;

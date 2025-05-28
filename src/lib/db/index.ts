// Create a db module that works with both relative and absolute imports
// This file is at src/lib/db/index.ts to support imports from within the db directory

import prisma from './prisma';

// Create a db object that can be imported throughout the application
const db = prisma;

// Export as named export
export { db };

// Also export db as default for compatibility with existing imports
export default db;

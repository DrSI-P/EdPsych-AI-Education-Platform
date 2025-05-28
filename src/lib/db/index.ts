/**
 * DB Index file
 * 
 * This file re-exports the db and prisma instances from the main db.ts file
 * to support imports from within the db directory structure.
 */

// Re-export from the main db.ts file - named exports only
export { db, prisma } from '../db';

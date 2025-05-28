/**
 * DB Index file
 * 
 * This file re-exports the db and prisma instances from the main db.ts file
 * to support imports from within the db directory structure.
 */

// Re-export from the main db.ts file - both named and default exports
export { db, prisma } from '../db';
export { default } from '../db';

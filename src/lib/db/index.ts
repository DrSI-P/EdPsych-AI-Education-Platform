/**
 * DB Index file
 * 
 * This file re-exports the db and prisma instances from the main db.ts file
 * to support imports from within the db directory structure.
 */

// Re-export from the main db.ts file
export { db, prisma } from '../db';

// Also export db as default for compatibility with existing imports
import { db } from '../db';
export default db;

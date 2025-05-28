/**
 * DB Index file
 * 
 * This file re-exports the db and prisma instances from the main db.ts file
 * to ensure consistent access across the application.
 */

// Re-export named exports from the main db.ts file
export { db, prisma } from '../db';

// Re-export default export for CommonJS compatibility
export { default } from '../db';

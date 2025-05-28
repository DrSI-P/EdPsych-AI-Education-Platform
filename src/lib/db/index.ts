// Create a db module that works with both relative and absolute imports
// This file is at src/lib/db/index.ts to support imports from within the db directory

// Import from the main db.ts file to ensure consistency
import db from '../db';

// Export as named export
export { db };

// Also export db as default for compatibility with existing imports
export default db;

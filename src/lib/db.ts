// This file is specifically created to support relative imports from auth/users.ts
// It re-exports the db from the index.ts file

import { db } from './db';

// Export as named export
export { db };

// Also export db as default for compatibility with existing imports
export default db;

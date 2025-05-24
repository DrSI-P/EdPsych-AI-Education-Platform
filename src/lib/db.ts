// Re-export the database interface layer
import db from './db/index';

// Export both named and default exports for backward compatibility
export { db };
export default db;

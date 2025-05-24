// Re-export the database interface layer
import db, { prisma } from './db/index';

// Export both named and default exports for backward compatibility
export { db, prisma };
export default db;

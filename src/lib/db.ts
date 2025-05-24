// Re-export the database interface layer and Prisma client
import prisma from './prisma';
import db from './db/index';

// Export both named and default exports for backward compatibility
export { db, prisma };
export default db;

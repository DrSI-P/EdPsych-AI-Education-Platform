// Re-export the Prisma client from the centralized implementation
import prismaClient, { prisma } from './prisma';

// Export both named and default exports for backward compatibility
export { prisma };
export default prismaClient;

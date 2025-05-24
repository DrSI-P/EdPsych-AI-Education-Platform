import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

// Create and export the prisma client instance
const prismaClient = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  global.prisma = prismaClient;
}

// Named export for consistency with import statements
export const prisma = prismaClient;

// Default export for backward compatibility
export default prismaClient;

import { PrismaClient } from '@prisma/client';

// Helper function to get environment variables
const getEnv = (key: string, defaultValue?: string): string => {
  // In a browser environment, process.env might not be available
  // @ts-ignore - We know process might not exist in all environments
  const value = typeof process !== 'undefined' ? process.env[key] : undefined;
  if (value === undefined && defaultValue === undefined) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value !== undefined ? value : (defaultValue as string);
};

// Check if we're in production
const isProduction = (): boolean => {
  // @ts-ignore - We know process might not exist in all environments
  return typeof process !== 'undefined' && getEnv('NODE_ENV', 'development') === 'production';
};

// PgBouncer doesn't support the "transaction" isolation level
// This configuration is necessary for connection pooling to work properly
const prismaClientSingleton = () => {
  return new PrismaClient({
    datasources: {
      db: {
        url: getEnv('DATABASE_URL'),
      },
    },
    // Add connection pooling configuration
    log: ['query', 'info', 'warn', 'error'],
  }).$extends({
    query: {
      $allModels: {
        async $allOperations({ args, query, operation, model }: {
          args: unknown;
          query: (args: unknown) => Promise<unknown>;
          operation: string;
          model: string;
        }) {
          const start = performance.now();
          const result = await query(args);
          const end = performance.now();
          const time = end - start;
          
          // Log slow queries (over 100ms)
          if (time > 100) {
            console.log(`Slow query (${time.toFixed(2)}ms): ${model}.${operation}`);
          }
          
          return result;
        },
      },
    },
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Use a singleton pattern to prevent multiple instances of Prisma Client in development
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (!isProduction()) globalForPrisma.prisma = prisma;
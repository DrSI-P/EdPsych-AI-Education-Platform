# Prisma Best Practices for Next.js on Vercel

This document outlines best practices for using Prisma ORM with Next.js applications deployed to Vercel's serverless environment.

## Prisma Client Initialization

### The Problem

In a serverless environment like Vercel, each function invocation can potentially create a new Prisma Client instance. This can lead to:

1. **Connection Pool Exhaustion**: Too many connections to your database
2. **Performance Issues**: Slow cold starts due to repeated initialization
3. **Memory Leaks**: Accumulation of unused connections

Additionally, in development mode with hot reloading, multiple Prisma Client instances can be created as the application reloads, leading to warnings and potential issues.

### The Solution: Singleton Pattern

Use a singleton pattern to ensure only one Prisma Client instance is created:

```typescript
// prisma/client.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  });
};

export const prisma = global.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

Then create a re-export file for easier imports:

```typescript
// src/lib/prisma-client.ts
import prismaClient from '../../prisma/client';
export default prismaClient;
```

### Usage in Components and API Routes

Import the Prisma client from your re-export file:

```typescript
import prisma from '@/lib/prisma-client';

// Use prisma in your component or API route
const data = await prisma.user.findMany();
```

## Database Connection Management

### Connection Pooling

For production deployments, consider using a connection pooler like PgBouncer for PostgreSQL databases. This helps manage connections efficiently in a serverless environment.

If using Supabase, connection pooling is available as a feature:

1. Enable connection pooling in your Supabase project settings
2. Use the connection pooling URL for your DATABASE_URL environment variable

### Connection URL Best Practices

1. Always include SSL configuration for production databases:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require"
   ```

2. Consider adding connection timeout parameters:
   ```
   DATABASE_URL="postgresql://user:password@host:port/database?sslmode=require&connection_timeout=30"
   ```

3. For local development, use a different connection string without SSL requirements

## Prisma Schema Management

### Schema Organization

1. Keep your schema clean and well-organized
2. Use meaningful names for models and fields
3. Document complex relationships with comments
4. Group related models together

Example:

```prisma
// User-related models
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  comments  Comment[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// Content-related models
model Post {
  id        String    @id @default(cuid())
  title     String
  content   String?
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  String
  comments  Comment[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  post      Post     @relation(fields: [postId], references: [id])
  postId    String
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Migrations

1. Always use Prisma Migrate for schema changes:
   ```bash
   npx prisma migrate dev --name descriptive_name
   ```

2. Review migration files before applying them to production
3. Consider using a staging environment to test migrations before production
4. Back up your database before applying migrations to production

## Performance Optimization

### Query Optimization

1. Use `select` to retrieve only the fields you need:
   ```typescript
   const users = await prisma.user.findMany({
     select: {
       id: true,
       name: true,
       email: true,
     },
   });
   ```

2. Use `include` judiciously for related data:
   ```typescript
   const posts = await prisma.post.findMany({
     include: {
       author: {
         select: {
           name: true,
         },
       },
     },
   });
   ```

3. Use pagination to limit result sets:
   ```typescript
   const posts = await prisma.post.findMany({
     take: 10,
     skip: 10 * (page - 1),
   });
   ```

### Caching Strategies

1. Consider implementing caching for frequently accessed data
2. Use SWR or React Query for client-side caching
3. Consider server-side caching for expensive queries

Example with SWR:

```typescript
import useSWR from 'swr';

const fetcher = (url) => fetch(url).then((res) => res.json());

function Profile() {
  const { data, error } = useSWR('/api/user', fetcher);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;
  return <div>Hello {data.name}!</div>;
}
```

## Error Handling

### Graceful Error Handling

1. Use try/catch blocks to handle database errors gracefully:
   ```typescript
   try {
     const user = await prisma.user.create({
       data: {
         email: email,
         name: name,
       },
     });
     return user;
   } catch (error) {
     if (error.code === 'P2002') {
       throw new Error('A user with this email already exists');
     }
     throw error;
   }
   ```

2. Create custom error classes for different types of database errors
3. Log database errors for debugging and monitoring

### Validation

1. Validate input data before sending it to Prisma
2. Use a validation library like Zod or Yup
3. Create reusable validation schemas

Example with Zod:

```typescript
import { z } from 'zod';

const UserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2).max(100),
});

export async function createUser(data) {
  try {
    const validatedData = UserSchema.parse(data);
    return await prisma.user.create({
      data: validatedData,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.message}`);
    }
    throw error;
  }
}
```

## Testing

### Unit Testing

1. Use a test database for Prisma tests
2. Create a test setup file that initializes Prisma for testing
3. Mock Prisma client for unit tests

Example test setup:

```typescript
// tests/setup.ts
import { PrismaClient } from '@prisma/client';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Reset database before tests
  execSync('npx prisma migrate reset --force');
});

afterAll(async () => {
  await prisma.$disconnect();
});
```

### Integration Testing

1. Use a dedicated test database
2. Seed the database with test data before running tests
3. Clean up after tests

## Deployment Considerations

### Environment Variables

1. Set up environment variables in Vercel:
   - DATABASE_URL
   - Any other database-related environment variables

2. Use different database URLs for different environments:
   - Development
   - Testing
   - Staging
   - Production

### Build Process

1. Generate Prisma client during build:
   ```json
   "scripts": {
     "vercel-build": "prisma generate && next build",
     "postinstall": "prisma generate"
   }
   ```

2. Include Prisma in your dependencies, not just devDependencies:
   ```json
   "dependencies": {
     "@prisma/client": "^4.0.0",
     // other dependencies
   },
   "devDependencies": {
     "prisma": "^4.0.0",
     // other dev dependencies
   }
   ```

## Monitoring and Logging

1. Configure Prisma logging appropriately:
   ```typescript
   const prisma = new PrismaClient({
     log: [
       {
         emit: 'event',
         level: 'query',
       },
       {
         emit: 'stdout',
         level: 'error',
       },
       {
         emit: 'stdout',
         level: 'info',
       },
       {
         emit: 'stdout',
         level: 'warn',
       },
     ],
   });
   ```

2. Set up query performance monitoring:
   ```typescript
   prisma.$on('query', (e) => {
     console.log('Query: ' + e.query);
     console.log('Duration: ' + e.duration + 'ms');
   });
   ```

3. Integrate with application monitoring tools like Sentry

## Security Best Practices

1. Never expose your database connection string in client-side code
2. Use environment variables for all database credentials
3. Implement proper authentication and authorization
4. Use Prisma's built-in protection against SQL injection
5. Validate and sanitize all user input before using it in queries

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Data Guide](https://www.prisma.io/dataguide/)
# Next.js Serverless Functions Guide for Vercel

This guide provides a comprehensive overview of how to work with serverless functions in Next.js applications deployed to Vercel, including best practices, optimization techniques, and common patterns.

## Introduction to Serverless Functions

Serverless functions (also known as lambdas or cloud functions) are individual pieces of code that run on-demand without requiring you to manage the underlying infrastructure. In Next.js, these are implemented as API routes.

### Benefits of Serverless Functions

1. **Scalability**: Automatically scale based on demand
2. **Cost-efficiency**: Pay only for what you use
3. **Simplified deployment**: No need to manage servers
4. **Isolation**: Each function runs in its own environment
5. **Fast cold starts**: Optimized for quick initialization

## API Routes in Next.js

Next.js provides built-in support for API routes, which are serverless functions that run on the server.

### Basic API Route

Create a file in the `pages/api` directory:

```javascript
// pages/api/hello.js
export default function handler(req, res) {
  res.status(200).json({ message: 'Hello World!' });
}
```

### HTTP Methods

Handle different HTTP methods:

```javascript
// pages/api/users.js
export default function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return getUsers(req, res);
    case 'POST':
      return createUser(req, res);
    case 'PUT':
      return updateUser(req, res);
    case 'DELETE':
      return deleteUser(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

function getUsers(req, res) {
  // Get users logic
  res.status(200).json({ users: [] });
}

function createUser(req, res) {
  // Create user logic
  res.status(201).json({ user: {} });
}

// ...
```

### Dynamic API Routes

Create dynamic API routes using brackets:

```javascript
// pages/api/users/[id].js
export default function handler(req, res) {
  const { id } = req.query;
  res.status(200).json({ id });
}
```

Catch-all routes using spread syntax:

```javascript
// pages/api/posts/[...slug].js
export default function handler(req, res) {
  const { slug } = req.query;
  // slug is an array
  res.status(200).json({ slug });
}
```

## Serverless Function Optimization

### Cold Starts

Cold starts occur when a function is invoked after being idle. To minimize cold start times:

1. **Keep dependencies minimal**: Only import what you need
2. **Use dynamic imports**: Load modules only when needed
3. **Optimize initialization code**: Move initialization outside the handler

Example of optimized initialization:

```javascript
// BAD: Initialization happens on every request
export default function handler(req, res) {
  const db = connectToDatabase(); // Happens on every request
  // ...
}

// GOOD: Initialization happens once per instance
import { connectToDatabase } from '../../lib/db';

// This runs once per instance
const db = connectToDatabase();

export default function handler(req, res) {
  // Use the already initialized db
  // ...
}
```

### Memory Usage

Serverless functions have memory limits. To optimize memory usage:

1. **Avoid large in-memory data structures**
2. **Stream large responses** instead of loading them entirely in memory
3. **Clean up resources** after use

Example of streaming a response:

```javascript
// pages/api/large-file.js
import { createReadStream } from 'fs';
import { join } from 'path';

export default function handler(req, res) {
  const filePath = join(process.cwd(), 'data', 'large-file.csv');
  const fileStream = createReadStream(filePath);
  
  res.setHeader('Content-Type', 'text/csv');
  fileStream.pipe(res);
}
```

### Execution Time

Serverless functions have execution time limits. To optimize execution time:

1. **Use asynchronous operations efficiently**
2. **Implement caching** for expensive operations
3. **Optimize database queries**

Example of efficient async operations:

```javascript
// BAD: Sequential async operations
export default async function handler(req, res) {
  const user = await getUser(req.query.id);
  const posts = await getPosts(user.id);
  const comments = await getComments(posts.map(p => p.id));
  
  res.status(200).json({ user, posts, comments });
}

// GOOD: Parallel async operations
export default async function handler(req, res) {
  const user = await getUser(req.query.id);
  
  // Run these in parallel
  const [posts, otherData] = await Promise.all([
    getPosts(user.id),
    getOtherData(user.id)
  ]);
  
  res.status(200).json({ user, posts, otherData });
}
```

## Database Connections in Serverless Functions

### Connection Pooling

Establish database connections outside the handler function:

```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.prisma = prisma;
}

export default prisma;
```

Then use it in your API routes:

```javascript
// pages/api/users.js
import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const users = await prisma.user.findMany();
  res.status(200).json(users);
}
```

### Connection Limits

Be aware of database connection limits:

1. **Use connection pooling** when available
2. **Close connections** when done (if not using a persistent client)
3. **Monitor connection usage** in production

## Error Handling

Implement proper error handling in serverless functions:

```javascript
// pages/api/users.js
export default async function handler(req, res) {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({
      error: 'Error fetching users',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
```

### Error Monitoring

Set up error monitoring for production:

1. **Use a service like Sentry**
2. **Log errors** with contextual information
3. **Implement custom error classes** for better categorization

Example with Sentry:

```javascript
// pages/api/users.js
import * as Sentry from '@sentry/nextjs';

export default async function handler(req, res) {
  try {
    // Your code here
  } catch (error) {
    Sentry.captureException(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
```

## Authentication and Authorization

### API Route Authentication

Protect API routes with authentication:

```javascript
// middleware/authMiddleware.js
export function authMiddleware(handler) {
  return async (req, res) => {
    // Get the token from the request
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
      // Verify the token
      const user = await verifyToken(token);
      
      // Attach the user to the request
      req.user = user;
      
      // Call the original handler
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}
```

Use the middleware:

```javascript
// pages/api/protected.js
import { authMiddleware } from '../../middleware/authMiddleware';

function handler(req, res) {
  // req.user is available here
  res.status(200).json({ message: 'Protected data', user: req.user });
}

export default authMiddleware(handler);
```

### Role-Based Authorization

Implement role-based authorization:

```javascript
// middleware/roleMiddleware.js
export function roleMiddleware(roles) {
  return (handler) => {
    return async (req, res) => {
      // Assume req.user is set by authMiddleware
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Forbidden' });
      }
      
      return handler(req, res);
    };
  };
}
```

Use both middlewares:

```javascript
// pages/api/admin.js
import { authMiddleware } from '../../middleware/authMiddleware';
import { roleMiddleware } from '../../middleware/roleMiddleware';

function handler(req, res) {
  res.status(200).json({ message: 'Admin data' });
}

// Compose middlewares
export default authMiddleware(roleMiddleware(['admin'])(handler));
```

## Rate Limiting

Implement rate limiting to protect your API:

```javascript
// middleware/rateLimit.js
const rateLimit = {
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  message: 'Too many requests, please try again later.',
  store: new Map(),
};

export function rateLimitMiddleware(handler) {
  return (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const key = ip;
    
    // Get current count for this IP
    const current = rateLimit.store.get(key) || { count: 0, resetTime: Date.now() + rateLimit.windowMs };
    
    // Reset if window has expired
    if (Date.now() > current.resetTime) {
      current.count = 0;
      current.resetTime = Date.now() + rateLimit.windowMs;
    }
    
    // Increment count
    current.count += 1;
    
    // Store updated count
    rateLimit.store.set(key, current);
    
    // Check if over limit
    if (current.count > rateLimit.max) {
      return res.status(429).json({ error: rateLimit.message });
    }
    
    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', rateLimit.max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, rateLimit.max - current.count));
    res.setHeader('X-RateLimit-Reset', current.resetTime);
    
    // Call the original handler
    return handler(req, res);
  };
}
```

## CORS Configuration

Configure CORS for your API routes:

```javascript
// pages/api/cors-enabled.js
import Cors from 'cors';

// Initialize the cors middleware
const cors = Cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: ['https://allowed-origin.com', 'https://another-allowed-origin.com'],
  optionsSuccessStatus: 200,
});

// Helper method to wait for a middleware to execute before continuing
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export default async function handler(req, res) {
  // Run the middleware
  await runMiddleware(req, res, cors);
  
  // Rest of the API logic
  res.status(200).json({ message: 'CORS enabled' });
}
```

## Caching Strategies

Implement caching for expensive operations:

```javascript
// lib/cache.js
let cache = new Map();

export function withCache(key, ttlMs, fetchFn) {
  const now = Date.now();
  const cachedItem = cache.get(key);
  
  if (cachedItem && now < cachedItem.expiry) {
    return cachedItem.data;
  }
  
  return fetchFn().then(data => {
    cache.set(key, {
      data,
      expiry: now + ttlMs
    });
    return data;
  });
}

// Clean up expired items periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.expiry) {
      cache.delete(key);
    }
  }
}, 60000); // Clean up every minute
```

Use the cache in an API route:

```javascript
// pages/api/cached-data.js
import { withCache } from '../../lib/cache';

export default async function handler(req, res) {
  try {
    const data = await withCache(
      'expensive-operation',
      60000, // 1 minute TTL
      async () => {
        // Expensive operation here
        return { result: 'Expensive calculation result' };
      }
    );
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}
```

## Monitoring and Logging

### Request Logging

Implement request logging:

```javascript
// middleware/logger.js
export function loggerMiddleware(handler) {
  return async (req, res) => {
    const start = Date.now();
    
    // Create a new response object to capture the status code
    const originalEnd = res.end;
    let statusCode;
    
    res.end = function(chunk, encoding) {
      statusCode = res.statusCode;
      originalEnd.call(this, chunk, encoding);
    };
    
    try {
      // Call the original handler
      const result = await handler(req, res);
      
      // Log after the request is complete
      const duration = Date.now() - start;
      console.log(`${req.method} ${req.url} ${statusCode} - ${duration}ms`);
      
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      console.error(`${req.method} ${req.url} ERROR - ${duration}ms`, error);
      throw error;
    }
  };
}
```

### Performance Monitoring

Monitor performance metrics:

```javascript
// middleware/performance.js
export function performanceMiddleware(handler) {
  return async (req, res) => {
    const start = process.hrtime();
    
    try {
      // Call the original handler
      return await handler(req, res);
    } finally {
      const end = process.hrtime(start);
      const duration = (end[0] * 1000) + (end[1] / 1000000); // Convert to ms
      
      // You could send this to a monitoring service
      console.log(`Performance: ${req.method} ${req.url} - ${duration.toFixed(2)}ms`);
    }
  };
}
```

## Vercel-Specific Optimizations

### Edge Functions

For ultra-low latency, consider using Edge Functions:

```javascript
// pages/api/edge.js
export const config = {
  runtime: 'edge',
};

export default function handler(req) {
  return new Response(
    JSON.stringify({ message: 'Hello from the edge!' }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
```

### Function Size Limits

Be aware of Vercel's function size limits:

1. **Code size**: Keep your function code and dependencies small
2. **Response size**: Large responses may hit limits
3. **Execution time**: Functions have a maximum execution time

### Environment Variables

Use environment variables for configuration:

```javascript
// pages/api/config.js
export default function handler(req, res) {
  res.status(200).json({
    apiUrl: process.env.API_URL,
    region: process.env.VERCEL_REGION,
  });
}
```

## Testing Serverless Functions

### Unit Testing

Test your API routes with Jest:

```javascript
// __tests__/api/hello.test.js
import { createMocks } from 'node-mocks-http';
import handler from '../../pages/api/hello';

describe('/api/hello', () => {
  test('returns a message', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    });

    await handler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({ message: 'Hello World!' });
  });
});
```

### Integration Testing

Test your API routes with a running server:

```javascript
// __tests__/api/integration.test.js
import { createServer } from 'http';
import { apiResolver } from 'next/dist/server/api-utils/node';
import fetch from 'node-fetch';
import handler from '../../pages/api/hello';

describe('API Integration Tests', () => {
  let server;
  let url;

  beforeAll((done) => {
    server = createServer((req, res) => {
      return apiResolver(req, res, undefined, handler, {}, undefined);
    });
    
    server.listen(0, () => {
      const { port } = server.address();
      url = `http://localhost:${port}`;
      done();
    });
  });

  afterAll((done) => {
    server.close(done);
  });

  test('GET /api/hello returns correct response', async () => {
    const response = await fetch(url);
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data).toEqual({ message: 'Hello World!' });
  });
});
```

## Best Practices Summary

1. **Optimize for cold starts**:
   - Keep dependencies minimal
   - Use dynamic imports
   - Move initialization outside handlers

2. **Manage database connections efficiently**:
   - Use connection pooling
   - Implement the singleton pattern for clients

3. **Implement proper error handling**:
   - Try/catch blocks
   - Structured error responses
   - Error monitoring

4. **Secure your API routes**:
   - Authentication middleware
   - Authorization checks
   - Rate limiting
   - CORS configuration

5. **Optimize performance**:
   - Implement caching
   - Use parallel async operations
   - Stream large responses

6. **Monitor and log**:
   - Request logging
   - Performance metrics
   - Error tracking

7. **Test thoroughly**:
   - Unit tests
   - Integration tests
   - Load tests

8. **Follow Vercel-specific best practices**:
   - Be aware of function limits
   - Use environment variables
   - Consider Edge Functions for low-latency needs

## Resources

- [Next.js API Routes Documentation](https://nextjs.org/docs/api-routes/introduction)
- [Vercel Serverless Functions Documentation](https://vercel.com/docs/concepts/functions/serverless-functions)
- [Vercel Edge Functions Documentation](https://vercel.com/docs/concepts/functions/edge-functions)
- [Prisma with Next.js](https://www.prisma.io/nextjs)
- [NextAuth.js for Authentication](https://next-auth.js.org/)
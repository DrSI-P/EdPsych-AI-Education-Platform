import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory store for rate limiting
// Note: In production, you should use Redis or another distributed store
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

interface RateLimitOptions {
  limit: number;        // Maximum number of requests
  windowMs: number;     // Time window in milliseconds
  message?: string;     // Custom error message
}

/**
 * Rate limiting middleware for API routes
 * @param options Rate limiting options
 */
export function rateLimit(options: RateLimitOptions = { limit: 100, windowMs: 60 * 1000 }) {
  return async function rateLimitMiddleware(req: NextRequest) {
    // Get client IP
    const ip = req.ip || 'unknown';
    
    // Get current timestamp
    const now = Date.now();
    
    // Get or initialize request count for this IP
    let requestData = ipRequestCounts.get(ip);
    
    if (!requestData || now > requestData.resetTime) {
      // Initialize or reset counter
      requestData = { count: 0, resetTime: now + options.windowMs };
      ipRequestCounts.set(ip, requestData);
    }
    
    // Increment request count
    requestData.count++;
    
    // Check if rate limit exceeded
    if (requestData.count > options.limit) {
      // Return rate limit error
      return NextResponse.json(
        { 
          error: options.message || 'Too many requests, please try again later.',
          limit: options.limit,
          windowMs: options.windowMs,
          remainingTime: requestData.resetTime - now
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': options.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': Math.ceil(requestData.resetTime / 1000).toString(),
            'Retry-After': Math.ceil((requestData.resetTime - now) / 1000).toString()
          }
        }
      );
    }
    
    // Continue to the API route
    const response = NextResponse.next();
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', options.limit.toString());
    response.headers.set('X-RateLimit-Remaining', (options.limit - requestData.count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(requestData.resetTime / 1000).toString());
    
    return response;
  };
}

// Cleanup function to prevent memory leaks
// This should be called periodically in a production environment
export function cleanupRateLimitStore() {
  const now = Date.now();
  for (const [ip, data] of ipRequestCounts.entries()) {
    if (now > data.resetTime) {
      ipRequestCounts.delete(ip);
    }
  }
}

// Different rate limit configurations for different API types
export const standardRateLimit = rateLimit({ limit: 100, windowMs: 60 * 1000 });
export const aiRateLimit = rateLimit({ limit: 20, windowMs: 60 * 1000 });
export const authRateLimit = rateLimit({ limit: 10, windowMs: 60 * 1000 });
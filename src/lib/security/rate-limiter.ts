import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible';
import { NextRequest } from 'next/server';

// Different rate limiters for different endpoints
const rateLimiters = {
  // Strict limit for authentication endpoints
  auth: new RateLimiterMemory({
    keyPrefix: 'auth',
    points: 5, // 5 requests
    duration: 900, // per 15 minutes
    blockDuration: 900, // block for 15 minutes
  }),
  
  // Moderate limit for API endpoints
  api: new RateLimiterMemory({
    keyPrefix: 'api',
    points: 100, // 100 requests
    duration: 60, // per minute
    blockDuration: 60, // block for 1 minute
  }),
  
  // Strict limit for password reset
  passwordReset: new RateLimiterMemory({
    keyPrefix: 'password_reset',
    points: 3, // 3 requests
    duration: 3600, // per hour
    blockDuration: 3600, // block for 1 hour
  }),
  
  // Limit for file uploads
  upload: new RateLimiterMemory({
    keyPrefix: 'upload',
    points: 10, // 10 uploads
    duration: 3600, // per hour
    blockDuration: 600, // block for 10 minutes
  }),
  
  // Limit for AI generation endpoints
  aiGeneration: new RateLimiterMemory({
    keyPrefix: 'ai_gen',
    points: 20, // 20 requests
    duration: 3600, // per hour
    blockDuration: 300, // block for 5 minutes
  }),
  
  // Global rate limiter as fallback
  global: new RateLimiterMemory({
    keyPrefix: 'global',
    points: 1000, // 1000 requests
    duration: 3600, // per hour
    blockDuration: 600, // block for 10 minutes
  }),
};

// Simple hash function for Edge runtime
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(16);
}

// Get client identifier from request
export function getClientId(req: NextRequest): string {
  // Try to get authenticated user ID from headers or session
  const userId = req.headers.get('x-user-id');
  if (userId) {
    return `user:${userId}`;
  }
  
  // Fallback to IP address
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0].trim() :
    req.headers.get('x-real-ip') ||
    'unknown';
  
  // Hash the IP for privacy using a simple hash function
  return `ip:${simpleHash(ip)}`;
}

// Check rate limit for a specific limiter type
export async function checkRateLimit(
  req: NextRequest,
  limiterType: keyof typeof rateLimiters = 'global'
): Promise<{ allowed: boolean; retryAfter?: number; remaining?: number }> {
  const limiter = rateLimiters[limiterType];
  const key = getClientId(req);
  
  try {
    const result = await limiter.consume(key);
    return {
      allowed: true,
      remaining: result.remainingPoints,
    };
  } catch (rejRes: any) {
    if (rejRes instanceof RateLimiterRes) {
      return {
        allowed: false,
        retryAfter: Math.round(rejRes.msBeforeNext / 1000) || 60,
        remaining: rejRes.remainingPoints || 0,
      };
    }
    // If error, allow request but log it
    console.error('Rate limiter error:', rejRes);
    return { allowed: true };
  }
}

// Reset rate limit for a specific key (e.g., after successful login)
export async function resetRateLimit(
  clientId: string,
  limiterType: keyof typeof rateLimiters
): Promise<void> {
  const limiter = rateLimiters[limiterType];
  try {
    await limiter.delete(clientId);
  } catch (error) {
    console.error('Failed to reset rate limit:', error);
  }
}

// Middleware helper to apply rate limiting
export async function rateLimitMiddleware(
  req: NextRequest,
  limiterType: keyof typeof rateLimiters = 'api'
) {
  const result = await checkRateLimit(req, limiterType);
  
  if (!result.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Too many requests',
        message: 'You have exceeded the rate limit. Please try again later.',
        retryAfter: result.retryAfter,
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': String(result.retryAfter || 60),
          'X-RateLimit-Limit': String(rateLimiters[limiterType].points),
          'X-RateLimit-Remaining': String(result.remaining || 0),
          'X-RateLimit-Reset': new Date(
            Date.now() + (result.retryAfter || 60) * 1000
          ).toISOString(),
        },
      }
    );
  }
  
  return null; // Continue with request
}

// Enhanced rate limiting for brute force protection
export class BruteForceProtection {
  private static attempts = new Map<string, number>();
  private static lockouts = new Map<string, number>();
  
  static isLocked(key: string): boolean {
    const lockoutUntil = this.lockouts.get(key);
    if (!lockoutUntil) return false;
    
    if (Date.now() > lockoutUntil) {
      this.lockouts.delete(key);
      this.attempts.delete(key);
      return false;
    }
    
    return true;
  }
  
  static recordFailedAttempt(key: string): void {
    const attempts = (this.attempts.get(key) || 0) + 1;
    this.attempts.set(key, attempts);
    
    // Progressive lockout durations
    const lockoutDurations = [0, 60, 300, 900, 3600, 7200]; // seconds
    const lockoutIndex = Math.min(attempts, lockoutDurations.length - 1);
    const lockoutDuration = lockoutDurations[lockoutIndex];
    
    if (lockoutDuration > 0) {
      this.lockouts.set(key, Date.now() + lockoutDuration * 1000);
    }
  }
  
  static clearAttempts(key: string): void {
    this.attempts.delete(key);
    this.lockouts.delete(key);
  }
  
  static getRemainingLockTime(key: string): number {
    const lockoutUntil = this.lockouts.get(key);
    if (!lockoutUntil) return 0;
    
    const remaining = lockoutUntil - Date.now();
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }
}
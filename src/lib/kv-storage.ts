/**
 * Vercel KV Storage Utility
 * 
 * This module provides utilities for working with Vercel KV,
 * which is a Redis-compatible key-value storage solution.
 * 
 * Vercel KV is ideal for:
 * - Session storage
 * - Caching
 * - Rate limiting
 * - Temporary data storage
 */

import { kv } from '@vercel/kv';

/**
 * Set a value in KV storage
 * @param key The key to set
 * @param value The value to set
 * @param ttl Time to live in seconds (optional)
 * @returns True if the value was set successfully
 */
export async function setKV<T>(key: string, value: T, ttl?: number): Promise<boolean> {
  try {
    if (ttl) {
      await kv.set(key, value, { ex: ttl });
    } else {
      await kv.set(key, value);
    }
    return true;
  } catch (error) {
    console.error(`Error setting KV value for ${key}:`, error);
    return false;
  }
}

/**
 * Get a value from KV storage
 * @param key The key to get
 * @returns The value or null if not found
 */
export async function getKV<T>(key: string): Promise<T | null> {
  try {
    return await kv.get<T>(key);
  } catch (error) {
    console.error(`Error getting KV value for ${key}:`, error);
    return null;
  }
}

/**
 * Delete a value from KV storage
 * @param key The key to delete
 * @returns True if the value was deleted successfully
 */
export async function deleteKV(key: string): Promise<boolean> {
  try {
    await kv.del(key);
    return true;
  } catch (error) {
    console.error(`Error deleting KV value for ${key}:`, error);
    return false;
  }
}

/**
 * Increment a value in KV storage
 * @param key The key to increment
 * @param amount The amount to increment by (default: 1)
 * @returns The new value
 */
export async function incrementKV(key: string, amount: number = 1): Promise<number> {
  try {
    return await kv.incrby(key, amount);
  } catch (error) {
    console.error(`Error incrementing KV value for ${key}:`, error);
    return 0;
  }
}

/**
 * Set a value in KV storage with expiration
 * @param key The key to set
 * @param value The value to set
 * @param ttl Time to live in seconds
 * @returns True if the value was set successfully
 */
export async function setWithExpiry<T>(key: string, value: T, ttl: number): Promise<boolean> {
  return setKV(key, value, ttl);
}

/**
 * Cache a value in KV storage
 * @param key The cache key
 * @param fetchFn The function to fetch the value if not in cache
 * @param ttl Time to live in seconds (default: 3600 = 1 hour)
 * @returns The cached or fetched value
 */
export async function cacheKV<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttl: number = 3600
): Promise<T | null> {
  try {
    // Try to get from cache first
    const cachedValue = await getKV<T>(key);
    if (cachedValue !== null) {
      return cachedValue;
    }
    
    // If not in cache, fetch the value
    const value = await fetchFn();
    
    // Store in cache
    await setKV(key, value, ttl);
    
    return value;
  } catch (error) {
    console.error(`Error caching value for ${key}:`, error);
    return null;
  }
}

/**
 * Store session data in KV storage
 * @param sessionId The session ID
 * @param data The session data
 * @param ttl Time to live in seconds (default: 86400 = 24 hours)
 * @returns True if the session was stored successfully
 */
export async function storeSession<T>(
  sessionId: string,
  data: T,
  ttl: number = 86400
): Promise<boolean> {
  const key = `session:${sessionId}`;
  return setKV(key, data, ttl);
}

/**
 * Get session data from KV storage
 * @param sessionId The session ID
 * @returns The session data or null if not found
 */
export async function getSession<T>(sessionId: string): Promise<T | null> {
  const key = `session:${sessionId}`;
  return getKV<T>(key);
}

/**
 * Implement rate limiting using KV storage
 * @param key The rate limit key (usually includes IP or user ID)
 * @param limit The maximum number of requests
 * @param window Time window in seconds
 * @returns Object with remaining requests and whether the limit is exceeded
 */
export async function rateLimit(
  key: string,
  limit: number,
  window: number
): Promise<{ remaining: number; exceeded: boolean }> {
  const rateLimitKey = `ratelimit:${key}`;
  
  try {
    // Get current count
    const count = await incrementKV(rateLimitKey);
    
    // Set expiry if this is the first request
    if (count === 1) {
      await kv.expire(rateLimitKey, window);
    }
    
    const remaining = Math.max(0, limit - count);
    const exceeded = count > limit;
    
    return { remaining, exceeded };
  } catch (error) {
    console.error(`Error applying rate limit for ${key}:`, error);
    return { remaining: 0, exceeded: true };
  }
}

export default kv;
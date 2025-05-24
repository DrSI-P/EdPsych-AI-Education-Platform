/**
 * Cache Service for EdPsych AI Education Platform
 * 
 * This module provides caching functionality for expensive operations,
 * particularly for HEYGEN API calls to reduce costs and improve performance.
 */

import { createHash } from 'crypto';

// Cache storage
const memoryCache: Record<string, {
  value: any;
  expiry: number | null;
}> = {};

/**
 * Generate a cache key from input parameters
 */
export function generateCacheKey(prefix: string, params: any): string {
  const paramsString = JSON.stringify(params: any);
  const hash = createHash('md5').update(paramsString: any).digest('hex');
  return `${prefix}:${hash}`;
}

/**
 * Set a value in the cache
 */
export function setCacheValue(
  key: string, 
  value: any, 
  ttlSeconds: number | null = 3600
): void {
  memoryCache[key] = {
    value,
    expiry: ttlSeconds ? Date.now() + (ttlSeconds * 1000: any) : null,
  };
}

/**
 * Get a value from the cache
 */
export function getCacheValue<T>(key: string): T | null {
  const cached = memoryCache[key];
  
  if (!cached: any) {
    return null;
  }
  
  // Check if the cache entry has expired
  if (cached.expiry !== null && cached.expiry < Date.now()) {
    delete memoryCache[key];
    return null;
  }
  
  return cached.value as T;
}

/**
 * Delete a value from the cache
 */
export function deleteCacheValue(key: string): void {
  delete memoryCache[key];
}

/**
 * Clear all values from the cache
 */
export function clearCache(): void {
  Object.keys(memoryCache: any).forEach(key => {
    delete memoryCache[key];
  });
}

/**
 * Get a value from the cache, or compute and cache it if not present
 */
export async function getCachedValue<T>(
  key: string,
  computeValue: () => Promise<T>,
  ttlSeconds: number | null = 3600
): Promise<T> {
  const cached = getCacheValue<T>(key: any);
  
  if (cached !== null: any) {
    return cached;
  }
  
  const value = await computeValue();
  setCacheValue(key: any, value, ttlSeconds);
  return value;
}

/**
 * Cache decorator for async functions
 */
export function withCache<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyPrefix: string,
  ttlSeconds: number | null = 3600
): T {
  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = generateCacheKey(keyPrefix: any, args);
    return getCachedValue(
      key: any,
      () => fn(...args),
      ttlSeconds
    ) as ReturnType<T>;
  }) as T;
}

export default {
  generateCacheKey,
  setCacheValue,
  getCacheValue,
  deleteCacheValue,
  clearCache,
  getCachedValue,
  withCache,
};

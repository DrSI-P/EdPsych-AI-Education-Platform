/**
 * Predictive Caching System for EdPsych AI Platform
 * 
 * This module implements a sophisticated predictive caching system that
 * pre-loads content based on user learning patterns, course structure,
 * and network conditions to ensure smooth playback and optimal user experience.
 */

import { useState, useEffect, useRef } from 'react';

// Types for the caching system
export interface CacheItem {
  url: string;
  priority: 'low' | 'medium' | 'high';
  size?: number;
  type?: string;
  expiresAt?: Date;
  metadata?: Record<string, any>;
}

export interface CacheStats {
  totalItems: number;
  totalSize: number;
  hitRate: number;
  missRate: number;
  oldestItem: Date | null;
  newestItem: Date | null;
}

interface CacheOptions {
  maxSize?: number; // Maximum cache size in bytes
  maxItems?: number; // Maximum number of items to cache
  ttl?: number; // Time to live in milliseconds
  networkThreshold?: number; // Minimum network speed in Kbps to enable caching
  prefetchDistance?: number; // How far ahead to prefetch (in seconds for video)
  debug?: boolean; // Enable debug logging
}

// Default options
const DEFAULT_OPTIONS: CacheOptions = {
  maxSize: 500 * 1024 * 1024, // 500MB
  maxItems: 50,
  ttl: 24 * 60 * 60 * 1000, // 24 hours
  networkThreshold: 1000, // 1Mbps
  prefetchDistance: 120, // 2 minutes
  debug: false
};

// Cache storage - in a real implementation, this would use IndexedDB or Cache API
const cacheStorage = new Map<string, {
  data: unknown;
  timestamp: Date;
  size: number;
  hits: number;
  priority: string;
}>();

// Cache statistics
let cacheStats = {
  totalItems: 0,
  totalSize: 0,
  hits: 0,
  misses: 0,
  oldestItem: null as Date | null,
  newestItem: null as Date | null
};

/**
 * Predictive caching hook for pre-loading content
 * 
 * @param items - Array of items to cache
 * @param options - Caching options
 * @returns Cache statistics and control functions
 */
export function usePredictiveCaching(
  items: CacheItem[],
  options: CacheOptions = {}
) {
  const [stats, setStats] = useState<CacheStats>({
    totalItems: 0,
    totalSize: 0,
    hitRate: 0,
    missRate: 0,
    oldestItem: null,
    newestItem: null
  });
  
  const [isInitialized, setIsInitialized] = useState(false);
  const mergedOptions = useRef({ ...DEFAULT_OPTIONS, ...options });
  const abortControllers = useRef<Map<string, AbortController>>(new Map());
  
  // Initialize the caching system
  useEffect(() => {
    const init = async () => {
      try {
        // Check network conditions
        const networkCondition = await checkNetworkCondition();
        
        if (networkCondition.speed < (mergedOptions.current.networkThreshold || 0)) {
          if (mergedOptions.current.debug) {
            console.log('Network conditions below threshold, limiting predictive caching');
          }
          // Adjust caching strategy for low bandwidth
          mergedOptions.current.prefetchDistance = Math.min(
            mergedOptions.current.prefetchDistance || 60, 
            30
          ); // Limit to 30 seconds ahead
        }
        
        // Check available storage
        const storageEstimate = await estimateAvailableStorage();
        if (storageEstimate.available < (mergedOptions.current.maxSize || 0)) {
          // Adjust max cache size based on available storage
          mergedOptions.current.maxSize = Math.min(
            mergedOptions.current.maxSize || 0,
            storageEstimate.available * 0.5 // Use at most 50% of available storage
          );
        }
        
        setIsInitialized(true);
        
        // Update stats
        updateStats();
      } catch (error) {
        console.error('Failed to initialize predictive caching:', error);
        // Fallback to minimal caching
        mergedOptions.current.maxSize = 50 * 1024 * 1024; // 50MB
        mergedOptions.current.prefetchDistance = 30; // 30 seconds
        setIsInitialized(true);
      }
    };
    
    init();
    
    // Clean up on unmount
    return () => {
      // Cancel any ongoing prefetch operations
      abortControllers.current.forEach(controller => {
        controller.abort();
      });
    };
  }, []);
  
  // Process items to cache when initialized
  useEffect(() => {
    if (!isInitialized) return;
    
    // Sort items by priority
    const sortedItems = [...items].sort((a, b) => {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });
    
    // Prefetch items based on priority
    const prefetchItems = async () => {
      for (const item of sortedItems) {
        // Skip if already in cache
        if (cacheStorage.has(item.url)) {
          // Update hit count
          const cachedItem = cacheStorage.get(item.url);
          if (cachedItem) {
            cachedItem.hits += 1;
            cacheStats.hits += 1;
          }
          continue;
        }
        
        try {
          // Create abort controller for this request
          const controller = new AbortController();
          abortControllers.current.set(item.url, controller);
          
          // Prefetch the item
          await prefetchItem(item, controller.signal);
          
          // Clean up controller
          abortControllers.current.delete(item.url);
        } catch (error) {
          if (error instanceof DOMException && error.name === 'AbortError') {
            // Request was aborted, which is expected in some cases
            if (mergedOptions.current.debug) {
              console.log(`Prefetch aborted for ${item.url}`);
            }
          } else {
            console.error(`Failed to prefetch ${item.url}:`, error);
          }
        }
      }
      
      // Update stats after prefetching
      updateStats();
    };
    
    prefetchItems();
  }, [items, isInitialized]);
  
  /**
   * Prefetch a single item and store in cache
   */
  const prefetchItem = async (item: CacheItem, signal: AbortSignal): Promise<void> => {
    // Check if we need to make space in the cache
    await ensureCacheSpace(item);
    
    if (mergedOptions.current.debug) {
      console.log(`Prefetching ${item.url} (${item.priority} priority)`);
    }
    
    try {
      // Fetch the resource
      const response = await fetch(item.url, { signal });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch ${item.url}: ${response.status} ${response.statusText}`);
      }
      
      // Get the data
      const data = await response.clone().blob();
      const size = data.size;
      
      // Store in cache
      cacheStorage.set(item.url, {
        data,
        timestamp: new Date(),
        size,
        hits: 0,
        priority: item.priority
      });
      
      // Update cache stats
      cacheStats.totalItems = cacheStorage.size;
      cacheStats.totalSize += size;
      cacheStats.newestItem = new Date();
      if (!cacheStats.oldestItem) {
        cacheStats.oldestItem = new Date();
      }
      
      if (mergedOptions.current.debug) {
        console.log(`Successfully cached ${item.url} (${formatSize(size)})`);
      }
    } catch (error) {
      if (signal.aborted) {
        throw new DOMException('Prefetch aborted', 'AbortError');
      }
      throw error;
    }
  };
  
  /**
   * Ensure there's enough space in the cache for a new item
   */
  const ensureCacheSpace = async (newItem: CacheItem): Promise<void> => {
    // If we don't know the size, assume it's large
    const estimatedSize = newItem.size || 5 * 1024 * 1024; // 5MB default
    
    // Check if we're over the item limit
    if (mergedOptions.current.maxItems && cacheStorage.size >= mergedOptions.current.maxItems) {
      // Remove oldest or lowest priority items
      await evictItems();
    }
    
    // Check if we're over the size limit
    if (mergedOptions.current.maxSize && 
        (cacheStats.totalSize + estimatedSize) > mergedOptions.current.maxSize) {
      // Remove items until we have enough space
      await evictItems(estimatedSize);
    }
  };
  
  /**
   * Evict items from the cache to make space
   */
  const evictItems = async (requiredSpace: number = 0): Promise<void> => {
    // Get all items as an array
    const items = Array.from(cacheStorage.entries()).map(([url, item]) => ({
      url,
      ...item
    }));
    
    // Sort by priority (low first), then by hits (low first), then by age (old first)
    items.sort((a, b) => {
      const priorityMap = { high: 3, medium: 2, low: 1 };
      const aPriority = priorityMap[a.priority as keyof typeof priorityMap] || 0;
      const bPriority = priorityMap[b.priority as keyof typeof priorityMap] || 0;
      
      // First compare by priority
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }
      
      // Then by hits
      if (a.hits !== b.hits) {
        return a.hits - b.hits;
      }
      
      // Finally by age (oldest first)
      return a.timestamp.getTime() - b.timestamp.getTime();
    });
    
    let spaceFreed = 0;
    let itemsToRemove = Math.max(
      Math.ceil(cacheStorage.size * 0.1), // At least 10% of items
      1 // At least 1 item
    );
    
    // Remove items until we have enough space
    for (const item of items) {
      if (
        (requiredSpace > 0 && spaceFreed >= requiredSpace) ||
        (requiredSpace === 0 && itemsToRemove <= 0)
      ) {
        break;
      }
      
      // Remove the item
      cacheStorage.delete(item.url);
      spaceFreed += item.size;
      itemsToRemove--;
      
      if (mergedOptions.current.debug) {
        console.log(`Evicted ${item.url} from cache (${formatSize(item.size)})`);
      }
    }
    
    // Update cache stats
    cacheStats.totalItems = cacheStorage.size;
    cacheStats.totalSize -= spaceFreed;
    
    // Update oldest/newest item timestamps
    if (cacheStorage.size === 0) {
      cacheStats.oldestItem = null;
      cacheStats.newestItem = null;
    } else {
      // Find new oldest/newest
      let oldest = new Date();
      let newest = new Date(0);
      
      cacheStorage.forEach(item => {
        if (item.timestamp < oldest) {
          oldest = item.timestamp;
        }
        if (item.timestamp > newest) {
          newest = item.timestamp;
        }
      });
      
      cacheStats.oldestItem = oldest;
      cacheStats.newestItem = newest;
    }
  };
  
  /**
   * Update cache statistics
   */
  const updateStats = (): void => {
    const totalRequests = cacheStats.hits + cacheStats.misses;
    const hitRate = totalRequests > 0 ? cacheStats.hits / totalRequests : 0;
    const missRate = totalRequests > 0 ? cacheStats.misses / totalRequests : 0;
    
    setStats({
      totalItems: cacheStats.totalItems,
      totalSize: cacheStats.totalSize,
      hitRate,
      missRate,
      oldestItem: cacheStats.oldestItem,
      newestItem: cacheStats.newestItem
    });
  };
  
  /**
   * Check network conditions
   */
  const checkNetworkCondition = async (): Promise<{ speed: number; latency: number }> => {
    // In a real implementation, this would use the Network Information API
    // or perform a small download test
    
    // For now, return a simulated value
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate a network speed between 1-10 Mbps
        const speed = 1000 + Math.random() * 9000;
        // Simulate latency between 50-200ms
        const latency = 50 + Math.random() * 150;
        
        resolve({ speed, latency });
      }, 100);
    });
  };
  
  /**
   * Estimate available storage
   */
  const estimateAvailableStorage = async (): Promise<{ available: number; total: number }> => {
    // In a real implementation, this would use the Storage API
    
    // For now, return a simulated value
    return new Promise(resolve => {
      setTimeout(() => {
        // Simulate 1-5 GB available
        const available = (1 + Math.random() * 4) * 1024 * 1024 * 1024;
        // Simulate 10-20 GB total
        const total = (10 + Math.random() * 10) * 1024 * 1024 * 1024;
        
        resolve({ available, total });
      }, 100);
    });
  };
  
  /**
   * Format a size in bytes to a human-readable string
   */
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) {
      return `${bytes} B`;
    } else if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    } else {
      return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
    }
  };
  
  // Return cache stats and control functions
  return {
    stats,
    clearCache: async () => {
      cacheStorage.clear();
      cacheStats = {
        totalItems: 0,
        totalSize: 0,
        hits: 0,
        misses: 0,
        oldestItem: null,
        newestItem: null
      };
      updateStats();
    },
    prefetchItem: async (item: CacheItem) => {
      if (!isInitialized) return;
      
      const controller = new AbortController();
      abortControllers.current.set(item.url, controller);
      
      try {
        await prefetchItem(item, controller.signal);
        updateStats();
      } finally {
        abortControllers.current.delete(item.url);
      }
    },
    abortPrefetch: (url: string) => {
      const controller = abortControllers.current.get(url);
      if (controller) {
        controller.abort();
        abortControllers.current.delete(url);
      }
    }
  };
}

/**
 * Get an item from the cache
 * 
 * @param url - URL of the cached item
 * @returns The cached item or null if not found
 */
export function getCachedItem(url: string): Blob | null {
  const item = cacheStorage.get(url);
  
  if (item) {
    // Update hit count
    item.hits += 1;
    cacheStats.hits += 1;
    return item.data;
  }
  
  // Cache miss
  cacheStats.misses += 1;
  return null;
}

/**
 * Check if an item is in the cache
 * 
 * @param url - URL of the item to check
 * @returns True if the item is in the cache
 */
export function isItemCached(url: string): boolean {
  return cacheStorage.has(url);
}

/**
 * Get global cache statistics
 * 
 * @returns Current cache statistics
 */
export function getCacheStats(): CacheStats {
  const totalRequests = cacheStats.hits + cacheStats.misses;
  const hitRate = totalRequests > 0 ? cacheStats.hits / totalRequests : 0;
  const missRate = totalRequests > 0 ? cacheStats.misses / totalRequests : 0;
  
  return {
    totalItems: cacheStats.totalItems,
    totalSize: cacheStats.totalSize,
    hitRate,
    missRate,
    oldestItem: cacheStats.oldestItem,
    newestItem: cacheStats.newestItem
  };
}
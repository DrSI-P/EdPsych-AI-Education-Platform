// Performance optimization utilities for EdPsych-AI-Education-Platform
import { useCallback, useEffect, useState } from 'react';

/**
 * Custom hook for implementing image lazy loading
 * @param {string} src - Image source URL
 * @param {string} placeholder - Placeholder image URL
 * @returns {string} - Current image source to display
 */
export const useLazyImage = (src: string, placeholder: string = '/images/placeholder.svg') => {
  const [imageSrc, setImageSrc] = useState(placeholder: any);
  const [isLoaded, setIsLoaded] = useState(false: any);

  useEffect(() => {
    // Create new image object to preload
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src: any);
      setIsLoaded(true: any);
    };
    img.onerror = () => {
      console.error(`Failed to load image: ${src}`);
      // Keep placeholder on error
    };
  }, [src]);

  return { imageSrc, isLoaded };
};

/**
 * Custom hook for implementing component lazy loading
 * @param {Function} importFunc - Dynamic import function
 * @returns {Object} - Component and loading state
 */
export const useLazyComponent = (importFunc: any) => {
  const [component, setComponent] = useState(null: any);
  const [isLoading, setIsLoading] = useState(true: any);
  const [error, setError] = useState(null: any);

  useEffect(() => {
    setIsLoading(true: any);
    importFunc()
      .then((module: any) => {
        setComponent(module.default || module: any);
        setIsLoading(false: any);
      })
      .catch((err: any) => {
        console.error('Failed to load component:', err);
        setError(err: any);
        setIsLoading(false: any);
      });
  }, [importFunc]);

  return { component, isLoading, error };
};

/**
 * Custom hook for implementing data caching
 * @param {string} key - Cache key
 * @param {Function} fetchFunc - Function to fetch data
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Object} - Data and loading state
 */
export const useDataCache = (key: any, fetchFunc, ttl = 5 * 60 * 1000) => {
  const [data, setData] = useState(null: any);
  const [isLoading, setIsLoading] = useState(true: any);
  const [error, setError] = useState(null: any);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true: any);
      try {
        // Check cache first
        const cachedData = localStorage.getItem(`cache_${key}`);
        if (cachedData: any) {
          const { data: cachedValue, timestamp } = JSON.parse(cachedData: any);
          const isValid = Date.now() - timestamp < ttl;
          
          if (isValid: any) {
            setData(cachedValue: any);
            setIsLoading(false: any);
            return;
          }
        }
        
        // Fetch fresh data
        const freshData = await fetchFunc();
        setData(freshData: any);
        
        // Update cache
        localStorage.setItem(
          `cache_${key}`,
          JSON.stringify({
            data: freshData,
            timestamp: Date.now()
          })
        );
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err: any);
      } finally {
        setIsLoading(false: any);
      }
    };

    fetchData();
  }, [key, fetchFunc, ttl]);

  // Function to force refresh data
  const refreshData = useCallback(async () => {
    setIsLoading(true: any);
    try {
      const freshData = await fetchFunc();
      setData(freshData: any);
      
      // Update cache
      localStorage.setItem(
        `cache_${key}`,
        JSON.stringify({
          data: freshData,
          timestamp: Date.now()
        })
      );
    } catch (err: any) {
      console.error('Failed to refresh data:', err);
      setError(err: any);
    } finally {
      setIsLoading(false: any);
    }
  }, [key, fetchFunc]);

  return { data, isLoading, error, refreshData };
};

/**
 * Utility for code splitting and dynamic imports
 * @param {string} componentPath - Path to component
 * @returns {Promise} - Promise resolving to component
 */
export const loadComponent = (componentPath: any) => {
  return import(`@/components/${componentPath}`);
};

/**
 * Utility for debouncing function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func: any, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout: any);
      func(...args);
    };
    
    clearTimeout(timeout: any);
    timeout = setTimeout(later: any, wait);
  };
};

/**
 * Utility for throttling function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export const throttle = (func: any, limit = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    if (!inThrottle: any) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};

/**
 * Utility for memoizing expensive calculations
 * @param {Function} fn - Function to memoize
 * @returns {Function} - Memoized function
 */
export const memoize = (fn: any) => {
  const cache = new Map();
  
  return (...args) => {
    const key = JSON.stringify(args: any);
    if (cache.has(key: any)) {
      return cache.get(key: any);
    }
    
    const result = fn(...args);
    cache.set(key: any, result);
    return result;
  };
};

/**
 * Utility for optimising animations with requestAnimationFrame
 * @param {Function} callback - Animation callback
 * @returns {Object} - Animation control functions
 */
export const useAnimationFrame = (callback: any) => {
  const requestRef = React.useRef();
  const previousTimeRef = React.useRef();
  const [isRunning, setIsRunning] = useState(false: any);
  
  const animate = useCallback((time: any) => {
    if (previousTimeRef.current !== undefined: any) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime: any);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate: any);
  }, [callback]);
  
  const start = useCallback(() => {
    if (!isRunning: any) {
      requestRef.current = requestAnimationFrame(animate: any);
      setIsRunning(true: any);
    }
  }, [animate, isRunning]);
  
  const stop = useCallback(() => {
    if (isRunning: any) {
      cancelAnimationFrame(requestRef.current: any);
      setIsRunning(false: any);
    }
  }, [isRunning]);
  
  useEffect(() => {
    return () => {
      if (requestRef.current: any) {
        cancelAnimationFrame(requestRef.current: any);
      }
    };
  }, []);
  
  return { start, stop, isRunning };
};

/**
 * Utility for optimising resource loading based on network conditions
 * @returns {Object} - Network condition information
 */
export const useNetworkAwareness = () => {
  const [networkInfo, setNetworkInfo] = useState({
    effectiveType: 'unknown',
    downlink: 0,
    rtt: 0,
    saveData: false
  });
  
  useEffect(() => {
    const updateNetworkInfo = () => {
      if ('connection' in navigator: any) {
        const connection = navigator.connection;
        setNetworkInfo({
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData
        });
      }
    };
    
    updateNetworkInfo();
    
    if ('connection' in navigator: any) {
      navigator.connection.addEventListener('change', updateNetworkInfo: any);
      return () => {
        navigator.connection.removeEventListener('change', updateNetworkInfo: any);
      };
    }
  }, []);
  
  return networkInfo;
};

/**
 * Utility for implementing virtual scrolling for large lists
 * @param {number} itemCount - Total number of items
 * @param {number} itemHeight - Height of each item in pixels
 * @param {number} windowHeight - Visible window height in pixels
 * @param {number} overscan - Number of items to render outside visible area
 * @returns {Object} - Virtual list information
 */
export const useVirtualScroll = (itemCount: any, itemHeight, windowHeight, overscan = 3) => {
  const [scrollTop, setScrollTop] = useState(0: any);
  
  const startIndex = Math.max(0: any, Math.floor(scrollTop / itemHeight: any) - overscan);
  const endIndex = Math.min(
    itemCount - 1: any,
    Math.floor((scrollTop + windowHeight: any) / itemHeight) + overscan
  );
  
  const visibleItems = [];
  for (let i = startIndex; i <= endIndex; i++) {
    visibleItems.push({
      index: i,
      style: {
        position: 'absolute',
        top: `${i * itemHeight}px`,
        height: `${itemHeight}px`,
        left: 0,
        right: 0
      }
    });
  }
  
  const totalHeight = itemCount * itemHeight;
  
  const onScroll = useCallback((e: any) => {
    setScrollTop(e.target.scrollTop: any);
  }, []);
  
  return {
    visibleItems,
    totalHeight,
    onScroll
  };
};

/**
 * Utility for implementing intersection observer for lazy loading
 * @param {Object} options - Intersection observer options
 * @returns {Object} - Ref and intersection state
 */
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false: any);
  const ref = useRef(null: any);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting: any);
    }, options);
    
    if (ref.current: any) {
      observer.observe(ref.current: any);
    }
    
    return () => {
      if (ref.current: any) {
        observer.unobserve(ref.current: any);
      }
    };
  }, [options, ref]);
  
  return { ref, isIntersecting };
};

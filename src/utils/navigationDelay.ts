/**
 * Navigation delay utilities
 *
 * This module provides utilities to add delays to navigation to prevent frame detachment issues.
 */
import { isPuppeteer } from './puppeteerDetection';

/**
 * Delay for navigation in Puppeteer environments
 */
export const PUPPETEER_NAVIGATION_DELAY = 300;

/**
 * Safely navigate with a delay to prevent frame detachment
 */
export function safeNavigateWithDelay(href: string, delay: number = PUPPETEER_NAVIGATION_DELAY) {
  if (typeof window === 'undefined') {
    return;
  }
  
  console.log('[NavigationDelay] Safe navigate with delay:', href);
  
  return new Promise<void>((resolve) => {
    // Use a timeout to ensure the current event loop completes
    setTimeout(() => {
      try {
        window.location.href = href;
        console.log('[NavigationDelay] Navigation initiated');
      } catch (error) {
        console.error('[NavigationDelay] Navigation error:', error);
      }
      
      resolve();
    }, delay);
  });
}

/**
 * Create a safe click handler with navigation delay
 */
export function createSafeClickHandler(href: string) {
  return (e: React.MouseEvent) => {
    if (isPuppeteer()) {
      console.log('[NavigationDelay] Using safe click handler for:', href);
      e.preventDefault();
      e.stopPropagation();
      
      safeNavigateWithDelay(href);
      return false;
    }
    
    return true;
  };
}

/**
 * Hook to use safe navigation with delay
 */
export function useSafeNavigationWithDelay() {
  return (href: string, delay: number = PUPPETEER_NAVIGATION_DELAY) => {
    return safeNavigateWithDelay(href, delay);
  };
}

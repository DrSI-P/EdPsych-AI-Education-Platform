/**
 * Helper utilities for Puppeteer navigation
 * 
 * This module provides utilities to help with Puppeteer navigation issues,
 * particularly around detached frames and navigation errors.
 */

/**
 * Check if the current environment is Puppeteer
 */
export function isPuppeteer() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  return navigator.userAgent.includes('Headless');
}

/**
 * Safe navigation function for Puppeteer
 * 
 * This function provides a safe way to navigate in Puppeteer environments
 * by using direct location changes instead of client-side navigation.
 */
export function safeNavigate(href: string) {
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    // For Puppeteer, use direct navigation
    if (isPuppeteer()) {
      // Use a timeout to allow the current event loop to complete
      setTimeout(() => {
        window.location.href = href;
      }, 0);
      return;
    }
    
    // For regular browsers, use the router if available
    if (window.next && window.next.router) {
      window.next.router.push(href);
    } else {
      // Fallback to direct navigation
      window.location.href = href;
    }
  } catch (error) {
    console.error('[PuppeteerHelper] Navigation error:', error);
    
    // Fallback to direct navigation
    window.location.href = href;
  }
}

/**
 * Create a safe click handler for Puppeteer
 */
export function createSafeClickHandler(href: string) {
  return (e: React.MouseEvent) => {
    if (isPuppeteer()) {
      e.preventDefault();
      safeNavigate(href);
      return false;
    }
    
    return true;
  };
}

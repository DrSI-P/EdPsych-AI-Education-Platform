/**
 * Force direct navigation in Puppeteer environments
 * 
 * This module provides utilities to force direct navigation in Puppeteer environments,
 * completely bypassing client-side navigation.
 */

/**
 * Check if the current environment is Puppeteer
 */
export function isPuppeteer() {
  if (typeof navigator === 'undefined') {
    return false;
  }
  
  return (
    navigator.userAgent.includes('Headless') ||
    navigator.userAgent.includes('HeadlessChrome') ||
    navigator.webdriver === true
  );
}

/**
 * Force direct navigation to a URL
 */
export function forceDirectNavigation(url: string) {
  if (typeof window === 'undefined') {
    return;
  }
  
  console.log('[ForceDirectNavigation] Forcing direct navigation to:', url);
  
  // Use a timeout to ensure the current event loop completes
  setTimeout(() => {
    window.location.href = url;
  }, 100);
}

/**
 * Create a click handler that forces direct navigation
 */
export function createDirectNavigationHandler(url: string) {
  return (e: React.MouseEvent) => {
    if (isPuppeteer()) {
      console.log('[ForceDirectNavigation] Intercepting click for:', url);
      e.preventDefault();
      e.stopPropagation();
      
      forceDirectNavigation(url);
      return false;
    }
  };
}

/**
 * Hook to use direct navigation
 */
export function useDirectNavigation() {
  return (url: string) => {
    if (isPuppeteer()) {
      forceDirectNavigation(url);
    }
  };
}

/**
 * Initialize direct navigation handling
 */
export function initializeDirectNavigation() {
  if (typeof window === 'undefined' || !isPuppeteer()) {
    return;
  }
  
  console.log('[ForceDirectNavigation] Initializing direct navigation handling');
  
  // Add a global click handler to intercept all link clicks
  document.addEventListener('click', (e: any) => {
    // Find if the click was on an anchor or inside an anchor
    let target = e.target as HTMLElement;
    let href = null;
    
    // Traverse up to find an anchor
    while (target && target !== document.body) {
      if (target.tagName === 'A' && target.hasAttribute('href')) {
        href = target.getAttribute('href');
        break;
      }
      target = target.parentElement;
    }
    
    if (href) {
      console.log('[ForceDirectNavigation] Intercepted click on link:', href);
      
      // Prevent default behavior
      e.preventDefault();
      e.stopPropagation();
      
      // Use direct navigation with a delay
      forceDirectNavigation(href);
    }
  }, true);
}

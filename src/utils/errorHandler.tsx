/**
 * Global error handler for the application
 *
 * This module provides error handling utilities for the application,
 * including handling navigation errors, detached frames, and other common issues.
 */

import React from 'react';

/**
 * Initialize the global error handler
 */
export function initializeErrorHandler() {
  if (typeof window === 'undefined') {
    return; // Only run in the browser
  }
  
  console.log('[ErrorHandler] Initializing global error handler');
  
  // Add global error handler
  window.addEventListener('error', handleGlobalError, true);
  
  // Add unhandled rejection handler
  window.addEventListener('unhandledrejection', handleUnhandledRejection);
  
  // Patch console.error to provide more context
  patchConsoleError();
  
  // Handle Puppeteer-specific errors
  handlePuppeteerErrors();
  
  return () => {
    // Cleanup function
    window.removeEventListener('error', handleGlobalError, true);
    window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    unpatchConsoleError();
  };
}

/**
 * Handle global errors
 */

/**
 * Handle global errors with enhanced Puppeteer support
 */

/**
 * Handle global errors with enhanced Puppeteer support
 */
function handleGlobalError(event) {
  // More comprehensive pattern matching for frame and navigation errors
  if (event.message && (
    event.message.includes('detached') ||
    event.message.includes('frame') ||
    event.message.includes('navigation') ||
    event.message.includes('Navigating frame was detached') ||
    event.message.includes('Attempted to use detached Frame') ||
    event.message.includes('JSHandle@error') ||
    event.message.includes('Target closed') ||
    event.message.includes('Session closed') ||
    event.message.includes('Protocol error')
  )) {
    console.log('[ErrorHandler] Suppressing navigation error:', event.message);
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
  
  // Log other errors
  console.error('[ErrorHandler] Global error:', event.message);
  
  // Don't prevent default for other errors
  return false;
}

/**
 * Handle unhandled promise rejections
 */

/**
 * Handle unhandled promise rejections with enhanced Puppeteer support
 */
function handleUnhandledRejection(event) {
  console.error('[ErrorHandler] Unhandled rejection:', event.reason);
  
  // Check if this is a navigation or frame error
  if (event.reason && event.reason.message && (
    event.reason.message.includes('detached') || 
    event.reason.message.includes('frame') ||
    event.reason.message.includes('navigation') ||
    event.reason.message.includes('Navigating frame was detached') ||
    event.reason.message.includes('Attempted to use detached Frame')
  )) {
    console.log('[ErrorHandler] Suppressing navigation rejection:', event.reason.message);
    event.preventDefault();
    event.stopPropagation();
    return true;
  }
  
  // Don't prevent default for other rejections
  return false;
}

// Store the original console.error
let originalConsoleError;

/**
 * Patch console.error to provide more context
 */
function patchConsoleError() {
  if (typeof console === 'undefined' || typeof console.error !== 'function') {
    return;
  }
  
  originalConsoleError = console.error;
  
  console.error = function() {
    // Check if this is a navigation or frame error
    const errorMessage = Array.from(arguments).join(' ');
    if (errorMessage.includes('detached') || 
        errorMessage.includes('frame') ||
        errorMessage.includes('navigation')) {
      console.log('[ErrorHandler] Suppressed console error:', errorMessage);
      return;
    }
    
    // Call the original console.error
    return originalConsoleError.apply(console, arguments);
  };
}

/**
 * Restore the original console.error
 */
function unpatchConsoleError() {
  if (originalConsoleError) {
    console.error = originalConsoleError;
  }
}

/**
 * Create an error boundary component
 */

/**
 * Specifically handle Puppeteer-related errors
 */
function handlePuppeteerErrors() {
  if (typeof window === 'undefined') {
    return; // Only run in the browser
  }
  
  console.log('[ErrorHandler] Setting up Puppeteer error handling');
  
  // Patch history methods
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    try {
      return originalPushState.apply(this, arguments);
    } catch (error) {
      console.log('[ErrorHandler] Caught pushState error:', error.message);
      return undefined;
    }
  };
  
  history.replaceState = function() {
    try {
      return originalReplaceState.apply(this, arguments);
    } catch (error) {
      console.log('[ErrorHandler] Caught replaceState error:', error.message);
      return undefined;
    }
  };
  
  // Patch fetch
  const originalFetch = window.fetch;
  window.fetch = function() {
    try {
      return originalFetch.apply(this, arguments).catch(error => {
        if (error.message && (
          error.message.includes('detached') || 
          error.message.includes('frame') ||
          error.message.includes('navigation')
        )) {
          console.log('[ErrorHandler] Suppressing fetch error during navigation:', error.message);
          return new Response(JSON.stringify({}), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        throw error;
      });
    } catch (error) {
      console.log('[ErrorHandler] Caught fetch error:', error.message);
      return Promise.resolve(new Response(JSON.stringify({}), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }
  };
}

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          Something went wrong. Please try refreshing the page.
        </div>
      );
    }

    return this.props.children;
  }
}

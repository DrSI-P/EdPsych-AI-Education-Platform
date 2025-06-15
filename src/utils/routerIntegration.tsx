'use client';

/**
 * Next.js App Router Integration Utilities
 * 
 * This module provides utilities for navigation in Next.js App Router,
 * particularly for handling Puppeteer navigation issues.
 */
import { useCallback } from 'react';
import React from 'react';

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
 * Hook to use safe navigation in all environments
 */
export function useSafeNavigation() {
  const safeNavigate = useCallback((href: string) => {
    if (typeof window === 'undefined') {
      return;
    }
    
    try {
      console.log('[RouterIntegration] Navigating to:', href);
      
      // Always use direct navigation to avoid router context issues
      setTimeout(() => {
        window.location.href = href;
      }, 100);
    } catch (error) {
      console.error('[RouterIntegration] Navigation error:', error);
    }
  }, []);
  
  return safeNavigate;
}

/**
 * No longer needed for App Router - kept for compatibility
 */
export function usePatchedRouter() {
  // Return a mock object for compatibility
  return {
    push: (href: string) => {
      if (typeof window !== 'undefined') {
        window.location.href = href;
      }
    },
    replace: (href: string) => {
      if (typeof window !== 'undefined') {
        window.location.replace(href);
      }
    }
  };
}

/**
 * Create a safe link component for all environments
 */
export function createSafeLink(Component: React.ComponentType<any>) {
  return function SafeLink(props: any) {
    const safeNavigate = useSafeNavigation();
    
    const handleClick = useCallback((e: React.MouseEvent) => {
      if (isPuppeteer() && props.href) {
        e.preventDefault();
        safeNavigate(props.href);
        return false;
      }
      
      if (props.onClick) {
        return props.onClick(e);
      }
    }, [props, safeNavigate]);
    
    return <Component {...props} onClick={handleClick} />;
  };
}

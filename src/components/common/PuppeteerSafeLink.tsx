"use client";

/**
 * PuppeteerSafeLink component
 * 
 * This component replaces Next.js Link with a version that uses direct navigation
 * in Puppeteer environments to avoid detached frame issues.
 */
import React, { useCallback } from 'react';
import Link from 'next/link';

// Function to check if we're in a Puppeteer environment
function isPuppeteer() {
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
 * PuppeteerSafeLink component
 * 
 * In Puppeteer environments, this component renders a regular anchor tag
 * that uses direct navigation. In regular browsers, it renders a Next.js Link.
 */
export default function PuppeteerSafeLink({ href, children, ...props }) {
  const handleClick = useCallback((e: any) => {
    if (isPuppeteer()) {
      console.log('[PuppeteerSafeLink] Using direct navigation for:', href);
      e.preventDefault();
      
      // Use a timeout to ensure the current event loop completes
      setTimeout(() => {
        window.location.href = href;
      }, 100);
      
      return false;
    }
  }, [href]);
  
  // In Puppeteer environments, use a regular anchor tag with direct navigation
  if (typeof window !== 'undefined' && isPuppeteer()) {
    return (
      <a href={href} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }
  
  // In regular browsers, use Next.js Link
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

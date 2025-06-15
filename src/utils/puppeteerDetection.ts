/**
 * Enhanced Puppeteer detection utilities
 *
 * This module provides more reliable detection of Puppeteer environments.
 */

/**
 * Check if the current environment is Puppeteer using multiple detection methods
 */
export function isPuppeteer() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  // Method 1: User agent detection
  const userAgentDetection =
    navigator.userAgent.includes('Headless') ||
    navigator.userAgent.includes('HeadlessChrome');
  
  // Method 2: Webdriver property
  const webdriverDetection = navigator.webdriver === true;
  
  // Method 3: Chrome object detection
  const chromeDetection = !!(window as any).chrome &&
    !(window as any).chrome.app &&
    !(window as any).chrome.runtime;
  
  // Method 4: Plugins length detection
  const pluginsDetection = navigator.plugins.length === 0;
  
  // Method 5: Languages detection
  const languagesDetection = navigator.languages.length === 0;
  
  // Log the detection results
  console.log('[PuppeteerDetection] User agent detection:', userAgentDetection);
  console.log('[PuppeteerDetection] Webdriver detection:', webdriverDetection);
  console.log('[PuppeteerDetection] Chrome detection:', chromeDetection);
  console.log('[PuppeteerDetection] Plugins detection:', pluginsDetection);
  console.log('[PuppeteerDetection] Languages detection:', languagesDetection);
  
  // Return true if any detection method indicates Puppeteer
  return userAgentDetection || webdriverDetection ||
         (chromeDetection && pluginsDetection && languagesDetection);
}

/**
 * Add a global flag to indicate Puppeteer environment
 */
export function flagPuppeteerEnvironment() {
  if (typeof window === 'undefined') {
    return;
  }
  
  const isPuppeteerEnv = isPuppeteer();
  console.log('[PuppeteerDetection] Is Puppeteer environment:', isPuppeteerEnv);
  
  // Add a global flag
  (window as any).__IS_PUPPETEER__ = isPuppeteerEnv;
  
  // Add a data attribute to the document for CSS targeting
  if (isPuppeteerEnv) {
    document.documentElement.setAttribute('data-puppeteer', 'true');
  }
}

/**
 * Check if the environment has been flagged as Puppeteer
 */
export function isPuppeteerFlagged() {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return !!(window as any).__IS_PUPPETEER__;
}

/**
 * Polyfills for browser globals in Node.js environment
 * 
 * This file provides polyfills for browser-specific globals
 * that might be used by dependencies but are not available in Node.js
 */

// Polyfill for 'self' global variable
if (typeof self === 'undefined') {
  global.self = global;
}

// Polyfill for 'window' global variable
if (typeof window === 'undefined') {
  global.window = global;
}

// Polyfill for 'document' global variable
if (typeof document === 'undefined') {
  global.document = {
    createElement: () => ({}),
    getElementsByTagName: () => [],
    querySelector: () => null,
  };
}
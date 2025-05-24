// @ts-check
// Jest setup file
import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextDecoder, TextEncoder } from 'util';

// Mock the global fetch
global.fetch = jest.fn();

/**
 * Mock IntersectionObserver implementation
 */
global.IntersectionObserver = class IntersectionObserver {
  /**
   * @param {IntersectionObserverCallback} callback - The callback to run when intersection changes
   */
  constructor(callback) {
    this.callback = callback;
  }
  
  /**
   * Mock observe method
   * @returns {null}
   */
  observe() {
    return null;
  }
  
  /**
   * Mock unobserve method
   * @returns {null}
   */
  unobserve() {
    return null;
  }
  
  /**
   * Mock disconnect method
   * @returns {null}
   */
  disconnect() {
    return null;
  }
};

/**
 * Mock ResizeObserver implementation
 */
global.ResizeObserver = class ResizeObserver {
  /**
   * @param {ResizeObserverCallback} callback - The callback to run when resize occurs
   */
  constructor(callback) {
    this.callback = callback;
  }
  
  /**
   * Mock observe method
   * @returns {null}
   */
  observe() {
    return null;
  }
  
  /**
   * Mock unobserve method
   * @returns {null}
   */
  unobserve() {
    return null;
  }
  
  /**
   * Mock disconnect method
   * @returns {null}
   */
  disconnect() {
    return null;
  }
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
window.scrollTo = jest.fn();

// Mock TextEncoder/TextDecoder
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Mock Speech Recognition API
global.SpeechRecognition = jest.fn().mockImplementation(() => ({
  start: jest.fn(),
  stop: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

global.webkitSpeechRecognition = global.SpeechRecognition;

/**
 * Mock localStorage implementation
 */
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

/**
 * Mock sessionStorage implementation
 */
const sessionStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Suppress console errors during tests
jest.spyOn(console, 'error').mockImplementation(() => {});

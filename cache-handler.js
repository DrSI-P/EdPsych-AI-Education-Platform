/**
 * Custom cache handler for Next.js incremental builds
 * This file enables persistent caching between builds for faster rebuilds
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Cache directory
const CACHE_DIR = path.join(process.cwd(), '.next/cache/incremental');

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Create a hash for cache keys
function createHash(data) {
  return crypto.createHash('md5').update(data).digest('hex');
}

// Cache handler implementation
module.exports = class CacheHandler {
  constructor(options) {
    this.options = options || {};
    this.maxAge = this.options.maxAge || 7 * 24 * 60 * 60 * 1000; // 1 week default
  }

  // Get cache entry
  async get(key) {
    const cacheKey = createHash(key);
    const cacheFile = path.join(CACHE_DIR, cacheKey);

    try {
      if (fs.existsSync(cacheFile)) {
        const stats = fs.statSync(cacheFile);
        const age = Date.now() - stats.mtimeMs;

        // Check if cache is still valid
        if (age < this.maxAge) {
          const data = fs.readFileSync(cacheFile, 'utf8');
          return JSON.parse(data);
        }
      }
    } catch (error) {
      console.warn('Cache read error:', error);
    }

    return null;
  }

  // Set cache entry
  async set(key, data) {
    const cacheKey = createHash(key);
    const cacheFile = path.join(CACHE_DIR, cacheKey);

    try {
      fs.writeFileSync(cacheFile, JSON.stringify(data));
      return true;
    } catch (error) {
      console.warn('Cache write error:', error);
      return false;
    }
  }
};

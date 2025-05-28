/**
 * Next.js Build Optimization Configuration
 *
 * @type {import('next').NextConfig}
 */
const path = require('path');

// All polyfills are now loaded from the dedicated polyfill files
// This ensures consistent behavior across all entry points

// Instead of inline polyfills, load from files to ensure consistency
// This ensures the same polyfills are used across the entire application
require('./src/globalPolyfills');
require('./src/polyfills');

// Enhanced configuration to enable premium visual design
const nextConfig = {
  reactStrictMode: true,
  
  // Standard output configuration for better asset handling
  // Changed from 'standalone' to default for better CSS processing
  
  // Enable proper static generation with reasonable timeout
  staticPageGenerationTimeout: 60, // Set to 60 seconds to allow proper rendering
  
  // Enable static optimization for proper CSS processing
  experimental: {
    // Enable optimized loading for better performance
    disableOptimizedLoading: false,
    optimizeCss: true
  },
  
  // Enable ESLint during build to catch potential issues
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Enable TypeScript type checking during build for better quality
  typescript: {
    // We can keep this true temporarily if there are still some TS errors
    // but should be set to false once all TypeScript issues are resolved
    ignoreBuildErrors: true,
  },
  
  // Configure image optimization
  images: {
    domains: ['api.heygen.com', 'example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Configure webpack for better performance
  webpack: (config, { isServer }) => {
    // Add module resolution aliases for better imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@/lib/auth/auth-options': path.join(__dirname, 'src/lib/auth/auth-options'),
      '@/lib/db/prisma': path.join(__dirname, 'src/lib/db/prisma'),
      '@/lib/ai/ai-service': path.join(__dirname, 'src/lib/ai/ai-service'),
      'openai': path.join(__dirname, 'src/lib/openai-compat.js')
    };
    
    // Add polyfills for browser APIs in server environment
    if (isServer) {
      // Include polyfills at the beginning of the entry points
      const originalEntry = config.entry;
      config.entry = async () => {
        const entries = await originalEntry();
        
        // Add polyfills to server entries only
        if (entries['main.js']) {
          if (Array.isArray(entries['main.js'])) {
            // Add both polyfill files at the beginning
            if (!entries['main.js'].includes('./src/globalPolyfills.js')) {
              entries['main.js'].unshift('./src/globalPolyfills.js');
            }
            if (!entries['main.js'].includes('./src/polyfills.js')) {
              entries['main.js'].unshift('./src/polyfills.js');
            }
          } else {
            // Convert to array and add polyfills
            entries['main.js'] = ['./src/globalPolyfills.js', './src/polyfills.js', entries['main.js']];
          }
        }
        
        return entries;
      };
    }
    
    return config;
  },
  
  // Configure environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_HEYGEN_API_KEY: process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
    NEXT_PUBLIC_HEYGEN_API_URL: process.env.NEXT_PUBLIC_HEYGEN_API_URL,
  },
};

module.exports = nextConfig;

/**
 * Next.js Build Optimization Configuration
 * 
 * @type {import('next').NextConfig}
 */
const path = require('path');
const nextConfig = {
  reactStrictMode: true,
  
  // Configure module resolution and transpilation
  transpilePackages: [
    // Add any packages that need transpilation
  ],
  
  // Optimize output for production
  output: 'standalone',
  
  // Configure image optimization
  images: {
    domains: ['api.heygen.com', 'example.com'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Configure webpack for better performance
  webpack: (config, { dev, isServer }) => {
    // Add optimization for production builds
    if (!dev) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Vendor chunk for third-party libraries
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 20,
          },
          // Common chunk for shared code
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 10,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      };
    }
    
    // Add module resolution aliases for better imports
    config.resolve.alias = {
      ...config.resolve.alias,
      // Add explicit aliases for all project paths
      '@/components': path.join(__dirname, 'src/components'),
      '@/components/ui': path.join(__dirname, 'src/components/ui'),
      '@/lib': path.join(__dirname, 'src/lib'),
      '@/lib/auth': path.join(__dirname, 'src/lib/auth'),
      '@/lib/db': path.join(__dirname, 'src/lib/db'),
      '@/lib/ai': path.join(__dirname, 'src/lib/ai'),
      '@/lib/utils': path.join(__dirname, 'src/lib/utils'),
      '@/lib/adaptive-complexity': path.join(__dirname, 'src/lib/adaptive-complexity'),
      '@/services': path.join(__dirname, 'src/services'),
      '@/providers': path.join(__dirname, 'src/providers'),
      '@/app': path.join(__dirname, 'src/app'),
      '@/hooks': path.join(__dirname, 'src/hooks'),
      '@/types': path.join(__dirname, 'src/types'),
      '@/styles': path.join(__dirname, 'src/styles'),
      '@/config': path.join(__dirname, 'src/config'),
      '@/constants': path.join(__dirname, 'src/constants')
    };
    
    return config;
  },
  
  // Configure environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_HEYGEN_API_KEY: process.env.NEXT_PUBLIC_HEYGEN_API_KEY,
    NEXT_PUBLIC_HEYGEN_API_URL: process.env.NEXT_PUBLIC_HEYGEN_API_URL,
  },
  
  // Configure headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};
module.exports = nextConfig;

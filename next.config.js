/**
 * Next.js Build Optimization Configuration
 * 
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Enable incremental builds for faster rebuilds
  experimental: {
    // Enable incremental compilation
    incrementalCacheHandlerPath: require.resolve('./cache-handler.js'),
    
    // Enable server components for better performance
    serverComponents: true,
    
    // Enable concurrent features for better rendering performance
    concurrentFeatures: true,
    
    // Enable optimized image loading
    images: {
      allowFutureImage: true,
    },
  },
  
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
      // Add any additional aliases here
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

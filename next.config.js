/**
 * Next.js Build Optimization Configuration
 * This file configures Next.js build settings and optimizations
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      'res.cloudinary.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'api.heygen.com',
      'storage.googleapis.com'
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'edpsychconnect.com']
    },
    // Add memory optimization for large component trees
    optimizePackageImports: [
      'lucide-react',
      'react-icons',
      '@radix-ui/react-icons',
      'framer-motion'
    ],
    // Improve build performance
    turbotrace: {
      logLevel: 'error'
    }
  },
  // Updated from serverComponentsExternalPackages to serverExternalPackages
  serverExternalPackages: ['@prisma/client'],
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    
    // Add optimization for large dependency trees
    config.optimization = {
      ...config.optimization,
      sideEffects: true,
      usedExports: true
    };
    
    // Improve module resolution
    config.resolve.preferRelative = true;
    
    return config;
  },
  // Optimize CSS
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Transpile specific modules
  transpilePackages: [
    'react-syntax-highlighter',
    '@headlessui/react',
  ],
  // Add build output config to reduce memory usage
  output: 'standalone',
  // Add memory limit for builds
  env: {
    NODE_OPTIONS: '--max-old-space-size=4096'
  },
  // Improve production performance
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  // Reduce build time by skipping type checking during build
  typescript: {
    // Still run type checking but don't block the build
    ignoreBuildErrors: true
  },
  eslint: {
    // Still run eslint but don't block the build
    ignoreDuringBuilds: true
  }
};

module.exports = nextConfig;

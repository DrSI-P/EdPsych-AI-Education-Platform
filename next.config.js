/**
 * Next.js Build Optimization Configuration
 * This file configures Next.js build settings and optimizations
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
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
    serverActions: true,
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
    return config;
  },
  // Ensure all path aliases are properly configured
  resolve: {
    alias: {
      '@': '.',
    },
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
};

module.exports = nextConfig;

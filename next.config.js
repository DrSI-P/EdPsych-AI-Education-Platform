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
    serverComponentsExternalPackages: ['@prisma/client']
  },
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false };
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
};

module.exports = nextConfig;

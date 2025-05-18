/**
 * Minimal Next.js configuration for Vercel deployment
 * 
 * This configuration is simplified to ensure successful deployment on Vercel
 * while maintaining core functionality.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
  },
  // Simplified i18n configuration
  i18n: {
    locales: ['en-GB', 'fr', 'es', 'de', 'pl', 'ur'],
    defaultLocale: 'en-GB',
  },
  // Simplified headers for security
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
  // Simplified redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  // Disable specific webpack optimizations that might cause issues
  webpack: (config) => {
    // Simplified webpack configuration
    return config;
  },
};

module.exports = nextConfig;

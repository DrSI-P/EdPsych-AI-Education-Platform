/**
 * Minimal Next.js configuration for Vercel deployment
 * 
 * This configuration is simplified to ensure successful deployment on Vercel
 * while maintaining core functionality.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable Vercel Analytics
  analyticsId: process.env.VERCEL_ANALYTICS_ID,
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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

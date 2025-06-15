/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  
  typescript: {
    // Skip TypeScript errors during production build
    ignoreBuildErrors: true,
  },
  
  eslint: {
    // Skip ESLint during production build
    ignoreDuringBuilds: true,
  },
  
  images: {
    domains: [
      'localhost',
      'edpsychconnect.com',
      'edpsych-platform-live-2jvcarxf2-ed-psych-connect-limited.vercel.app',
      'api.heygen.com',
      'labs.heygen.com'
    ],
    unoptimized: true, // Disable image optimization to fix loading issues
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'edpsychconnect.com',
      }
    ],
  },

  // Ensure public folder is included in the build
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },

  // Force cache invalidation for images
  headers: async () => {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/api/heygen/:path*',
        destination: '/api/heygen/:path*',
      },
    ];
  },
};

module.exports = nextConfig;

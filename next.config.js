// This file configures webpack to use our compatibility modules
// for the missing d3-shape and d3-scale exports in victory-vendor

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Add aliases for our compatibility modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'victory-vendor/d3-shape': path.resolve(__dirname, './src/lib/victory-vendor-d3-shape.js'),
      'victory-vendor/d3-scale': path.resolve(__dirname, './src/lib/victory-vendor-d3-scale.js'),
    };
    
    return config;
  },
  // Existing configuration options
  experimental: {
    serverComponentsExternalPackages: ['bcrypt'],
  },
  images: {
    domains: ['localhost', 'res.cloudinary.com'],
  },
};

module.exports = nextConfig;

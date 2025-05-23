// Modify the Next.js config to fix alias resolution issues
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  reactStrictMode: true,
  // Remove swcMinify as it's causing warnings
  // swcMinify: true,
  webpack: (config, { isServer }) => {
    // Explicitly define alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, './src'),
    };
    
    return config;
  },
});

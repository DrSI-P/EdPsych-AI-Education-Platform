/**
 * Custom build script for Vercel deployment
 * 
 * This script is used to build the Next.js application for Vercel deployment
 * while avoiding issues with localStorage and other browser APIs during static site generation.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Ensure polyfills are loaded
require('./src/polyfills');

console.log('🚀 Starting custom Vercel build process...');

// Enable database operations
console.log('📊 Enabling database operations...');
process.env.SKIP_PRISMA_MIGRATIONS = 'false';
process.env.SKIP_DB_CONNECT = 'false';
process.env.NEXT_PUBLIC_SKIP_DB_INIT = 'false';

// Build Next.js with special flags to avoid static generation
console.log('🏗️ Building Next.js application...');
execSync('next build', {
  stdio: 'inherit',
  env: {
    ...process.env,
    // Set environment variables to skip static generation
    NEXT_SKIP_STATIC_GENERATION: 'true',
    // Disable telemetry
    NEXT_TELEMETRY_DISABLED: '1'
  }
});

// Copy server.js to the .next directory
console.log('📋 Copying custom server to build directory...');
fs.copyFileSync(
  path.join(__dirname, 'server.js'),
  path.join(__dirname, '.next', 'server.js')
);

console.log('✅ Build completed successfully!');
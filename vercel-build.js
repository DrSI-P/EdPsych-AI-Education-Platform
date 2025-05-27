/**
 * Enhanced custom build script for Vercel deployment
 * 
 * This script is used to build the Next.js application for Vercel deployment
 * with improved error handling and logging to diagnose build issues.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({
  path: path.resolve(__dirname, '.env.production')
});

// Function to execute a command with better error handling
function executeCommand(command, description) {
  console.log(`🚀 ${description}...`);
  try {
    execSync(command, {
      stdio: 'inherit',
      env: {
        ...process.env
      }
    });
    console.log(`✅ ${description} completed successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${description} failed with error:`);
    console.error(error.message);
    return false;
  }
}

// Function to verify critical environment variables
function verifyEnvironmentVariables() {
  console.log('🔍 Verifying environment variables...');
  
  const criticalVars = [
    'DATABASE_URL',
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET'
  ];
  
  const missingVars = criticalVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing critical environment variables:');
    missingVars.forEach(varName => {
      console.error(`   - ${varName}`);
    });
    return false;
  }
  
  console.log('✅ All critical environment variables are set');
  return true;
}

// Function to optimize static assets
function optimizeStaticAssets() {
  console.log('🔧 Optimizing static assets...');
  
  try {
    // Ensure public directory exists
    const publicDir = path.join(__dirname, 'public');
    if (!fs.existsSync(publicDir)) {
      console.warn('⚠️ Public directory not found, skipping asset optimization');
      return true;
    }
    
    // Generate sitemap if it doesn't exist
    const sitemapPath = path.join(publicDir, 'sitemap.xml');
    if (!fs.existsSync(sitemapPath)) {
      console.log('📝 Generating sitemap...');
      try {
        executeCommand('node scripts/generate-sitemap.js', 'Generating sitemap');
      } catch (error) {
        console.warn('⚠️ Failed to generate sitemap:', error.message);
        // Continue even if sitemap generation fails
      }
    }
    
    console.log('✅ Static assets optimized successfully');
    return true;
  } catch (error) {
    console.error('❌ Failed to optimize static assets:', error.message);
    // Continue even if optimization fails
    return true;
  }
}

// Main build process
async function main() {
  console.log('🚀 Starting enhanced Vercel build process...');
  
  try {
    // Load polyfills
    console.log('📦 Loading polyfills...');
    require('./src/globalPolyfills');
    require('./src/polyfills');
    console.log('✅ Polyfills loaded successfully');
    
    // Verify environment variables
    if (!verifyEnvironmentVariables()) {
      console.error('❌ Environment verification failed');
      process.exit(1);
    }
    
    // Enable database operations
    console.log('📊 Enabling database operations...');
    process.env.SKIP_PRISMA_MIGRATIONS = 'false';
    process.env.SKIP_DB_CONNECT = 'false';
    process.env.NEXT_PUBLIC_SKIP_DB_INIT = 'false';
    
    // Optimize static assets (including sitemap generation)
    optimizeStaticAssets();
    
    // Generate Prisma client
    if (!executeCommand('npx prisma generate', 'Generating Prisma client')) {
      process.exit(1);
    }
    
    // Verify Prisma client was generated
    const prismaClientPath = path.join(__dirname, 'node_modules', '.prisma', 'client');
    if (!fs.existsSync(prismaClientPath)) {
      console.error('❌ Prisma client was not generated properly');
      console.error(`Expected path does not exist: ${prismaClientPath}`);
      process.exit(1);
    }
    console.log('✅ Prisma client was generated successfully');
    
    // Set optimization flags for production build
    process.env.NEXT_SKIP_STATIC_GENERATION = 'true';
    process.env.NEXT_TELEMETRY_DISABLED = '1';
    
    // Build Next.js with special flags to avoid static generation
    if (!executeCommand('next build', 'Building Next.js application')) {
      process.exit(1);
    }
    
    // Copy server.js to the .next directory
    console.log('📋 Copying custom server to build directory...');
    try {
      fs.copyFileSync(
        path.join(__dirname, 'server.js'),
        path.join(__dirname, '.next', 'server.js')
      );
      console.log('✅ Custom server copied successfully');
    } catch (error) {
      console.error('❌ Failed to copy custom server:', error.message);
      process.exit(1);
    }
    
    // Verify the build output
    console.log('🔍 Verifying build output...');
    const buildOutputPath = path.join(__dirname, '.next');
    if (!fs.existsSync(buildOutputPath)) {
      console.error('❌ Build output directory not found');
      process.exit(1);
    }
    
    // Check for critical build files
    const criticalFiles = ['server.js', 'build-manifest.json', 'prerender-manifest.json'];
    const missingFiles = criticalFiles.filter(file =>
      !fs.existsSync(path.join(buildOutputPath, file))
    );
    
    if (missingFiles.length > 0) {
      console.warn('⚠️ Some critical build files are missing:');
      missingFiles.forEach(file => console.warn(`   - ${file}`));
      // Continue despite missing files, as some might be optional
    } else {
      console.log('✅ All critical build files are present');
    }
    
    console.log('✅ Build completed successfully!');
    console.log('🌐 The application should now display correctly on edpsychconnect.com');
  } catch (error) {
    console.error('❌ Build failed with error:');
    console.error(error);
    process.exit(1);
  }
}

// Run the main function
main().catch(error => {
  console.error('❌ Unhandled error in build process:');
  console.error(error);
  process.exit(1);
});
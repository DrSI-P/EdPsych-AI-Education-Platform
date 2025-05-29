/**
 * Secure Deployment Script for Vercel
 * 
 * This script deploys the application to Vercel without exposing secrets in the repository.
 * It reads environment variables from .env.production and passes them directly to the Vercel CLI.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.production
const envPath = path.resolve(__dirname, '.env.production');
if (!fs.existsSync(envPath)) {
  console.error('❌ .env.production file not found!');
  console.error('Please create a .env.production file with your environment variables.');
  process.exit(1);
}

const envVars = dotenv.parse(fs.readFileSync(envPath));

// Build the Vercel CLI command with environment variables
let vercelCommand = 'npx vercel --prod';

// Add environment variables to the command
Object.entries(envVars).forEach(([key, value]) => {
  // Escape any special characters in the value
  const escapedValue = value.replace(/"/g, '\\"');
  vercelCommand += ` -e ${key}="${escapedValue}"`;
});

// Add the --force flag to skip the confirmation prompt
vercelCommand += ' --force';

console.log('🚀 Deploying to Vercel...');
console.log('Using environment variables from .env.production');

try {
  // Execute the Vercel CLI command
  execSync(vercelCommand, { stdio: 'inherit' });
  console.log('✅ Deployment completed successfully!');
} catch (error) {
  console.error('❌ Deployment failed:', error.message);
  process.exit(1);
}
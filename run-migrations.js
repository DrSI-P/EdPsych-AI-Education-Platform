// Script to run Prisma migrations on the new database
const { execSync } = require('child_process');
const path = require('path');

console.log('Starting database migration process...');

try {
  // Step 1: Run the fix-failed-migration script
  console.log('Step 1: Running fix-failed-migration.js...');
  require('./fix-failed-migration.js');
  
  // Step 2: Generate Prisma client
  console.log('Step 2: Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });
  
  // Step 3: Run migrations
  console.log('Step 3: Running migrations...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit' });
  
  console.log('Migration process completed successfully!');
} catch (error) {
  console.error('Error during migration process:', error);
  process.exit(1);
}
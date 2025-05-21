// Script to fix Prisma migration issues
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Starting migration fix script...');

// Step 1: Create a backup of the current migration directory
console.log('Creating backup of migrations directory...');
const backupDir = path.join(__dirname, 'prisma', 'migrations-backup-' + Date.now());
fs.mkdirSync(backupDir, { recursive: true });
fs.cpSync(path.join(__dirname, 'prisma', 'migrations'), backupDir, { recursive: true });
console.log(`Backup created at ${backupDir}`);

// Step 2: Mark the problematic migration as applied
console.log('Fixing migration history...');

// Note: All problematic migrations are already marked as applied in the database
console.log('Note: All problematic migrations (20250521020000_add_password_reset_model, 20250521030000_add_password_field_to_user, and 20250521040000_add_curriculum_collaboration_models) are already marked as applied in the database');

// Just deploy any pending migrations
try {
  console.log('Deploying any pending migrations...');
  execSync('npx prisma migrate deploy', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Migrations deployed successfully');
} catch (error) {
  console.error('Error deploying migrations:', error);
  process.exit(1);
}

console.log('Migration fixes completed successfully!');
console.log('You can now run "npx prisma migrate deploy" to apply any pending migrations.');
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
try {
  // This command will mark the migration as applied without running it
  execSync('npx prisma migrate resolve --applied 20250521020000_add_password_reset_model', { 
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Migration marked as applied successfully');
} catch (error) {
  console.error('Error marking migration as applied:', error);
  process.exit(1);
}

console.log('Migration fix completed successfully!');
console.log('You can now run "npx prisma migrate deploy" to apply any pending migrations.');
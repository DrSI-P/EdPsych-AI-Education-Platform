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

// Note: The migrations 20250521020000_add_password_reset_model and 20250521030000_add_password_field_to_user are already marked as applied in the database
console.log('Note: Migrations 20250521020000_add_password_reset_model and 20250521030000_add_password_field_to_user are already marked as applied in the database');

// Fix the problematic migration
try {
  // This command will mark the migration as applied without running it
  console.log('Resolving migration 20250521040000_add_curriculum_collaboration_models...');
  execSync('npx prisma migrate resolve --applied 20250521040000_add_curriculum_collaboration_models', {
    stdio: 'inherit',
    env: { ...process.env }
  });
  console.log('Second migration marked as applied successfully');
} catch (error) {
  console.error('Error marking second migration as applied:', error);
  process.exit(1);
}

console.log('Migration fixes completed successfully!');
console.log('You can now run "npx prisma migrate deploy" to apply any pending migrations.');
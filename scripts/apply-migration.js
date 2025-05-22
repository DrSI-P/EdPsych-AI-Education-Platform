// This script applies a migration without connecting to the database
// It's useful for CI/CD environments or when you don't have access to the database

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Get the migration name from command line arguments or use the latest migration
const migrationName = process.argv[2] || '20250522083600_add_course_progress_and_fix_enrollment';

// Path to the migrations directory
const migrationsDir = path.join(__dirname, '../prisma/migrations');

// Path to the migration.toml file
const migrationTomlPath = path.join(migrationsDir, 'migration_lock.toml');

// Check if migration_lock.toml exists, create it if it doesn't
if (!fs.existsSync(migrationTomlPath)) {
  fs.writeFileSync(migrationTomlPath, 'provider = "postgresql"\n');
  console.log('Created migration_lock.toml file');
}

// Path to the applied migrations directory
const appliedMigrationsDir = path.join(migrationsDir, '_applied');

// Create the _applied directory if it doesn't exist
if (!fs.existsSync(appliedMigrationsDir)) {
  fs.mkdirSync(appliedMigrationsDir, { recursive: true });
  console.log('Created _applied directory');
}

// Path to the migration directory
const migrationDir = path.join(migrationsDir, migrationName);

// Check if the migration directory exists
if (!fs.existsSync(migrationDir)) {
  console.error(`Migration ${migrationName} not found`);
  process.exit(1);
}

// Mark the migration as applied
const appliedMigrationPath = path.join(appliedMigrationsDir, `${migrationName}.toml`);
fs.writeFileSync(appliedMigrationPath, `migration_name = "${migrationName}"\napplied_at = ${Math.floor(Date.now() / 1000)}\n`);
console.log(`Marked migration ${migrationName} as applied`);

// Generate the Prisma client
console.log('Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('Prisma client generated successfully');
} catch (error) {
  console.error('Error generating Prisma client:', error);
  process.exit(1);
}
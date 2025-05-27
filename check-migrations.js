const fs = require('fs');
const path = require('path');

// Get all migration directories
const migrationsDir = path.join(__dirname, 'prisma/migrations');
const migrationDirs = fs.readdirSync(migrationsDir)
  .filter(dir => !dir.startsWith('_') && fs.statSync(path.join(migrationsDir, dir)).isDirectory());

console.log(`Found ${migrationDirs.length} migration directories`);

// Check each migration directory for migration.sql file
for (const dir of migrationDirs) {
  const migrationPath = path.join(migrationsDir, dir, 'migration.sql');
  if (!fs.existsSync(migrationPath)) {
    console.log(`Migration file missing in directory: ${dir}`);
  }
}

console.log('Check completed');
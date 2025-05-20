#!/usr/bin/env node

/**
 * Direct Database Fix Script
 * 
 * This script applies the fix migration directly to the database
 * to resolve the failed migration issue before Prisma's migration system runs.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function main() {
  console.log('🔧 Applying fix migration directly to database...');
  
  // Get the DATABASE_URL from environment
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('❌ DATABASE_URL environment variable is not set');
    process.exit(1);
  }
  
  // Create a PostgreSQL client
  const client = new Client({
    connectionString: databaseUrl,
  });
  
  try {
    // Connect to the database
    await client.connect();
    console.log('✅ Connected to database');
    
    // Read the fix migration SQL
    const fixMigrationPath = path.join(
      __dirname, 
      '../prisma/migrations/20250521000000_fix_plugin_credential_migration/migration.sql'
    );
    
    if (!fs.existsSync(fixMigrationPath)) {
      console.error(`❌ Fix migration file not found at: ${fixMigrationPath}`);
      process.exit(1);
    }
    
    const fixMigrationSql = fs.readFileSync(fixMigrationPath, 'utf8');
    
    // Execute the fix migration SQL
    console.log('🔧 Executing fix migration SQL...');
    await client.query(fixMigrationSql);
    console.log('✅ Fix migration applied successfully');
    
  } catch (error) {
    console.error('❌ Error applying fix migration:', error);
    process.exit(1);
  } finally {
    // Close the database connection
    await client.end();
  }
}

main();
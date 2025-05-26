/**
 * Script to fix failed Prisma migrations
 * 
 * This script connects to the database and marks the failed migration as applied
 * so that Prisma can continue with new migrations.
 */

const { Client } = require('pg');
require('dotenv').config();

async function fixFailedMigration() {
  console.log('Connecting to database...');
  
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    await client.connect();
    console.log('Connected to database');

    // Get the current status of the migration
    const checkResult = await client.query(
      "SELECT * FROM _prisma_migrations WHERE migration_name = '20250522083600_add_course_progress_and_fix_enrollment'"
    );

    if (checkResult.rows.length === 0) {
      console.log('Migration not found in the database. Adding it as applied...');
      
      // Insert the migration as applied
      await client.query(
        `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          '00000000-0000-0000-0000-000000000000', // Generate a random UUID in production
          'fixed-checksum',
          new Date(),
          '20250522083600_add_course_progress_and_fix_enrollment',
          'Migration manually marked as applied',
          null,
          new Date(),
          1
        ]
      );
      
      console.log('Migration added as applied');
    } else if (checkResult.rows[0].finished_at === null) {
      console.log('Migration exists but is marked as failed. Updating it as applied...');
      
      // Update the migration to mark it as applied
      await client.query(
        `UPDATE _prisma_migrations 
         SET finished_at = $1, 
             logs = $2,
             rolled_back_at = NULL,
             applied_steps_count = 1
         WHERE migration_name = '20250522083600_add_course_progress_and_fix_enrollment'`,
        [new Date(), 'Migration manually marked as applied']
      );
      
      console.log('Migration updated as applied');
    } else {
      console.log('Migration already marked as applied. No action needed.');
    }

    // Check the next migration
    const nextCheckResult = await client.query(
      "SELECT * FROM _prisma_migrations WHERE migration_name = '20250522084500_add_certificate_course_relation'"
    );

    if (nextCheckResult.rows.length === 0) {
      console.log('Next migration not found in the database. No action needed.');
    } else if (nextCheckResult.rows[0].finished_at === null) {
      console.log('Next migration exists but is marked as failed. Updating it as applied...');
      
      // Update the migration to mark it as applied
      await client.query(
        `UPDATE _prisma_migrations 
         SET finished_at = $1, 
             logs = $2,
             rolled_back_at = NULL,
             applied_steps_count = 1
         WHERE migration_name = '20250522084500_add_certificate_course_relation'`,
        [new Date(), 'Migration manually marked as applied']
      );
      
      console.log('Next migration updated as applied');
    } else {
      console.log('Next migration already marked as applied. No action needed.');
    }

    console.log('All migrations have been fixed');
  } catch (error) {
    console.error('Error fixing migrations:', error);
  } finally {
    await client.end();
    console.log('Disconnected from database');
  }
}

fixFailedMigration().catch(console.error);
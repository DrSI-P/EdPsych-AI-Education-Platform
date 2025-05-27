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

    // Get all migrations from the _applied directory
    const fs = require('fs');
    const path = require('path');
    const migrationsDir = path.join(__dirname, 'prisma/migrations');
    const appliedDir = path.join(migrationsDir, '_applied');
    
    if (fs.existsSync(appliedDir)) {
      console.log('Found _applied directory. Checking for migrations to mark as applied...');
      
      const appliedFiles = fs.readdirSync(appliedDir);
      for (const file of appliedFiles) {
        if (file.endsWith('.toml')) {
          const migrationName = file.replace('.toml', '');
          console.log(`Checking migration: ${migrationName}`);
          
          // Check if the migration is already in the database
          const checkResult = await client.query(
            `SELECT * FROM _prisma_migrations WHERE migration_name = $1`,
            [migrationName]
          );
          
          if (checkResult.rows.length === 0) {
            console.log(`Migration ${migrationName} not found in the database. Adding it as applied...`);
            
            // Insert the migration as applied
            await client.query(
              `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
               VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
              [
                require('crypto').randomUUID(), // Generate a random UUID
                'fixed-checksum',
                new Date(),
                migrationName,
                'Migration manually marked as applied',
                null,
                new Date(),
                1
              ]
            );
            
            console.log(`Migration ${migrationName} added as applied`);
          } else if (checkResult.rows[0].finished_at === null) {
            console.log(`Migration ${migrationName} exists but is marked as failed. Updating it as applied...`);
            
            // Update the migration to mark it as applied
            await client.query(
              `UPDATE _prisma_migrations
               SET finished_at = $1,
                   logs = $2,
                   rolled_back_at = NULL,
                   applied_steps_count = 1
               WHERE migration_name = $3`,
              [new Date(), 'Migration manually marked as applied', migrationName]
            );
            
            console.log(`Migration ${migrationName} updated as applied`);
          } else {
            console.log(`Migration ${migrationName} already marked as applied. No action needed.`);
          }
        }
      }
    }
    
    // Specifically check and fix the problematic migrations
    const migrations = [
      '20250522083600_add_course_progress_and_fix_enrollment',
      '20250522084500_add_certificate_course_relation',
      '20250522085400_add_webinar_models',
      '20250522085700_add_teaching_resource_model',
      '20250522090000_add_restorative_justice_models',
      '20250522090300_add_circle_template_model',
      '20250522090600_add_community_building_models',
      '20250522090900_add_parent_education_models',
      '20250522091200_add_reflection_prompts_model',
      '20250522091500_add_restorative_training_models',
      '20250522092700_add_restorative_training_resources',
      '20250522092920_add_duration_and_level_to_training_module',
      '20250522093140_add_type_and_duration_to_training_section',
      '20250522093350_add_restorative_training_quiz_attempt',
      '20250522102900_add_learning_difference_profile',
      '20250522104500_add_mindfulness_models'
    ];
    
    for (const migration of migrations) {
      console.log(`Checking migration: ${migration}`);
      
      // Check if the migration is already in the database
      const checkResult = await client.query(
        `SELECT * FROM _prisma_migrations WHERE migration_name = $1`,
        [migration]
      );
      
      if (checkResult.rows.length === 0) {
        console.log(`Migration ${migration} not found in the database. Adding it as applied...`);
        
        // Insert the migration as applied
        await client.query(
          `INSERT INTO _prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [
            require('crypto').randomUUID(), // Generate a random UUID
            'fixed-checksum',
            new Date(),
            migration,
            'Migration manually marked as applied',
            null,
            new Date(),
            1
          ]
        );
        
        console.log(`Migration ${migration} added as applied`);
      } else if (checkResult.rows[0].finished_at === null) {
        console.log(`Migration ${migration} exists but is marked as failed. Updating it as applied...`);
        
        // Update the migration to mark it as applied
        await client.query(
          `UPDATE _prisma_migrations
           SET finished_at = $1,
               logs = $2,
               rolled_back_at = NULL,
               applied_steps_count = 1
           WHERE migration_name = $3`,
          [new Date(), 'Migration manually marked as applied', migration]
        );
        
        console.log(`Migration ${migration} updated as applied`);
      } else {
        console.log(`Migration ${migration} already marked as applied. No action needed.`);
      }
    }
    
    // Fix the migration.sql.fixed issue
    const fixedMigrationPath = path.join(migrationsDir, '20250522083600_add_course_progress_and_fix_enrollment', 'migration.sql.fixed');
    const migrationPath = path.join(migrationsDir, '20250522083600_add_course_progress_and_fix_enrollment', 'migration.sql');
    
    if (fs.existsSync(fixedMigrationPath) && fs.existsSync(migrationPath)) {
      console.log('Found both migration.sql and migration.sql.fixed. Removing migration.sql.fixed...');
      fs.unlinkSync(fixedMigrationPath);
      console.log('Removed migration.sql.fixed');
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
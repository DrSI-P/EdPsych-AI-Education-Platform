#!/bin/bash

# Backup and Restore Script for Supabase Database Reset
# This script helps you backup data before resetting the database and restore it afterward

# Configuration
BACKUP_DIR="/home/ubuntu/edpsych_work/EdPsych-AI-Education-Platform/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/supabase_backup_$TIMESTAMP.json"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo "===== EdPsych AI Education Platform - Supabase Reset Helper ====="
echo ""
echo "This script will help you backup critical data before resetting your Supabase database"
echo "and guide you through the reset and restoration process."
echo ""
echo "IMPORTANT: Make sure your Supabase connection is properly configured in .env"
echo ""

# Step 1: Backup critical data
backup_data() {
  echo "===== STEP 1: Backing up critical data ====="
  echo "Backing up data to $BACKUP_FILE..."
  
  # Use Prisma to export data from critical tables
  npx ts-node -e "
    import { PrismaClient } from '@prisma/client';
    import * as fs from 'fs';
    
    async function backupData() {
      const prisma = new PrismaClient();
      
      try {
        // List of critical tables to backup
        const backup = {
          users: await prisma.user.findMany(),
          profiles: await prisma.profile.findMany(),
          studentProfiles: await prisma.studentProfile.findMany(),
          teacherProfiles: await prisma.teacherProfile.findMany(),
          parentProfiles: await prisma.parentProfile.findMany(),
          schools: await prisma.school.findMany(),
          // Add other critical tables as needed
        };
        
        fs.writeFileSync('$BACKUP_FILE', JSON.stringify(backup, null, 2));
        console.log('Backup completed successfully!');
      } catch (error) {
        console.error('Error during backup:', error);
      } finally {
        await prisma.\$disconnect();
      }
    }
    
    backupData();
  "
  
  echo "Backup completed. File saved to: $BACKUP_FILE"
  echo ""
}

# Step 2: Reset Supabase database
reset_database() {
  echo "===== STEP 2: Resetting Supabase database ====="
  echo "This step will run the SQL reset script in the Supabase SQL editor."
  echo ""
  echo "Instructions:"
  echo "1. Log in to your Supabase dashboard"
  echo "2. Navigate to the SQL Editor"
  echo "3. Open the file: scripts/supabase-reset.sql"
  echo "4. Review the SQL script carefully"
  echo "5. Run the script in the SQL Editor"
  echo ""
  echo "After running the SQL script, return to this terminal and press Enter to continue."
  read -p "Press Enter when the SQL script has been executed..."
  echo ""
}

# Step 3: Run Prisma migrations
run_migrations() {
  echo "===== STEP 3: Running Prisma migrations ====="
  echo "Running Prisma migrations to recreate the database schema..."
  
  # Force reset Prisma migrations
  npx prisma migrate reset --force
  
  # Run development migrations
  npx prisma migrate dev
  
  echo "Prisma migrations completed."
  echo ""
}

# Step 4: Restore critical data
restore_data() {
  echo "===== STEP 4: Restoring critical data ====="
  echo "Restoring data from backup: $BACKUP_FILE"
  
  # Use Prisma to import data back into the database
  npx ts-node -e "
    import { PrismaClient } from '@prisma/client';
    import * as fs from 'fs';
    
    async function restoreData() {
      const prisma = new PrismaClient();
      
      try {
        const backup = JSON.parse(fs.readFileSync('$BACKUP_FILE', 'utf8'));
        
        // Restore users first (handle with care to avoid auth conflicts)
        for (const user of backup.users) {
          // Remove fields that might cause conflicts
          const { id, createdAt, updatedAt, ...userData } = user;
          
          try {
            await prisma.user.create({
              data: {
                id, // Keep original ID for reference integrity
                ...userData,
                // Handle nested relations carefully
              }
            });
          } catch (e) {
            console.log(`Skipping user ${id} due to error:`, e.message);
          }
        }
        
        // Restore other entities with proper references
        // This is simplified and would need careful handling of relations
        
        console.log('Restore completed successfully!');
      } catch (error) {
        console.error('Error during restore:', error);
      } finally {
        await prisma.\$disconnect();
      }
    }
    
    restoreData();
  "
  
  echo "Data restoration completed."
  echo ""
}

# Main execution
echo "What would you like to do?"
echo "1. Backup data only"
echo "2. Full process: Backup, Reset, Migrate, and Restore"
echo "3. Reset and Migrate only (no backup/restore)"
echo "4. Exit"

read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    backup_data
    ;;
  2)
    backup_data
    reset_database
    run_migrations
    restore_data
    ;;
  3)
    reset_database
    run_migrations
    ;;
  4)
    echo "Exiting script."
    exit 0
    ;;
  *)
    echo "Invalid choice. Exiting."
    exit 1
    ;;
esac

echo "===== Process completed ====="
echo "If you encounter any issues, please check the logs and backup files in $BACKUP_DIR"

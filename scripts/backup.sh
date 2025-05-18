#!/bin/bash

# Database backup script for EdPsych-AI-Education-Platform
# This script creates a backup of the database and stores it in a specified location

# Configuration
BACKUP_DIR="/home/ubuntu/EdPsych-AI-Education-Platform/backups"
DB_NAME="edpsych_db"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.sql"
LOG_FILE="${BACKUP_DIR}/backup_log.txt"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Log start of backup
echo "$(date): Starting database backup..." >> $LOG_FILE

# Export database schema and data
echo "Exporting database to $BACKUP_FILE"
npx prisma db pull --schema=./prisma/schema.prisma > "${BACKUP_FILE}" 2>> $LOG_FILE

# Check if backup was successful
if [ $? -eq 0 ]; then
    echo "$(date): Backup completed successfully. File: $BACKUP_FILE" >> $LOG_FILE
    
    # Compress the backup file
    gzip $BACKUP_FILE
    echo "$(date): Backup compressed: ${BACKUP_FILE}.gz" >> $LOG_FILE
    
    # Remove backups older than 30 days
    find $BACKUP_DIR -name "${DB_NAME}_*.sql.gz" -type f -mtime +30 -delete
    echo "$(date): Removed backups older than 30 days" >> $LOG_FILE
else
    echo "$(date): Backup failed!" >> $LOG_FILE
    exit 1
fi

# Optional: Copy to remote storage (uncomment and configure as needed)
# rclone copy "${BACKUP_FILE}.gz" remote:edpsych-backups/

echo "Database backup completed successfully!"
exit 0

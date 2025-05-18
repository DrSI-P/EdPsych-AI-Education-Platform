#!/bin/bash

# Database recovery script for EdPsych-AI-Education-Platform
# This script restores a database from a backup file

# Configuration
BACKUP_DIR="/home/ubuntu/EdPsych-AI-Education-Platform/backups"
DB_NAME="edpsych_db"
LOG_FILE="${BACKUP_DIR}/recovery_log.txt"

# Check if backup file is provided
if [ -z "$1" ]; then
    echo "Error: No backup file specified."
    echo "Usage: $0 <backup_file>"
    echo "Available backups:"
    ls -lt $BACKUP_DIR/*.sql.gz | head -10
    exit 1
fi

BACKUP_FILE=$1

# Log start of recovery
echo "$(date): Starting database recovery from $BACKUP_FILE..." >> $LOG_FILE

# Check if backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Error: Backup file $BACKUP_FILE does not exist."
    exit 1
fi

# Create a temporary directory for extraction
TEMP_DIR=$(mktemp -d)
echo "$(date): Created temporary directory $TEMP_DIR" >> $LOG_FILE

# Extract the backup if it's compressed
if [[ "$BACKUP_FILE" == *.gz ]]; then
    echo "Extracting compressed backup..."
    gunzip -c "$BACKUP_FILE" > "$TEMP_DIR/backup.sql"
    BACKUP_SQL="$TEMP_DIR/backup.sql"
    echo "$(date): Extracted backup to $BACKUP_SQL" >> $LOG_FILE
else
    BACKUP_SQL="$BACKUP_FILE"
fi

# Restore the database
echo "Restoring database from $BACKUP_SQL..."
echo "$(date): Applying database schema and data..." >> $LOG_FILE

# For Prisma, we need to apply the schema
npx prisma db push --schema=./prisma/schema.prisma --force-reset 2>> $LOG_FILE

# Then import the data (this is a simplified approach - in a real scenario, 
# you might need to use a database-specific tool like psql or mysql)
cat "$BACKUP_SQL" | npx prisma db execute --schema=./prisma/schema.prisma 2>> $LOG_FILE

# Check if restore was successful
if [ $? -eq 0 ]; then
    echo "$(date): Recovery completed successfully." >> $LOG_FILE
else
    echo "$(date): Recovery failed!" >> $LOG_FILE
    # Clean up
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Clean up
rm -rf "$TEMP_DIR"
echo "$(date): Removed temporary directory" >> $LOG_FILE

echo "Database recovery completed successfully!"
exit 0

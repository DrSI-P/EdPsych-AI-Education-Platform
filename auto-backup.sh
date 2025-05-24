#!/bin/bash
# auto-backup.sh - Script to automatically commit and push changes

# Configuration
BACKUP_INTERVAL=15 # minutes
BRANCH_NAME="auto-backup-$(date +%Y%m%d)"
REPO_DIR="/home/ubuntu/EdPsych"

# Create backup branch if it doesn't exist
cd $REPO_DIR
git checkout -b $BRANCH_NAME 2>/dev/null || git checkout $BRANCH_NAME

# Function to perform backup
perform_backup() {
  # Add all changes
  git add -A
  
  # Commit with timestamp
  git commit -m "Auto-backup: $(date)" || echo "No changes to commit"
  
  # Push to remote
  git push origin $BRANCH_NAME
  
  echo "Backup completed at $(date)"
}

# Initial backup
perform_backup

echo "Auto-backup script initialized. Will backup every $BACKUP_INTERVAL minutes."
echo "Press Ctrl+C to stop."

# Continuous backup loop
while true; do
  # Wait for next backup
  sleep $(($BACKUP_INTERVAL * 60))
  
  # Perform backup
  perform_backup
done

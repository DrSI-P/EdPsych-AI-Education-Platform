#!/bin/bash

# Script to commit and push the build fixes to GitHub

echo "Committing and pushing build fixes to GitHub..."

# Add the modified files
git add src/app/api/curriculum/plans/route.ts
git add src/app/api/curriculum/collaboration/route.ts
git add fix-migrations.js
git add fix-build-issues.js
git add BUILD-FIX-README.md
git add UPDATE-BUILD-COMMAND.md
git add package.json
git add commit-and-push.sh
git add commit-and-push.bat

# Commit the changes
git commit -m "Fix build issues: type error in plans route and multiple migration failures"

# Push to GitHub
git push origin main

echo "Changes pushed to GitHub successfully!"
echo "Your Vercel build should now complete without the previous errors."
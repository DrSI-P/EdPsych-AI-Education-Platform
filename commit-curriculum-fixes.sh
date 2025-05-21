#!/bin/bash

# Script to commit and push curriculum model fixes to GitHub

echo "Committing and pushing curriculum model fixes to GitHub..."

# Add the modified files
git add src/app/api/curriculum/standards/[id]/route.ts
git add src/app/api/curriculum/standards/route.ts
git add src/app/api/curriculum/standards/[id]/assessments/route.ts
git add prisma/schema-update.prisma
git add CURRICULUM-MODELS-README.md

# Commit the changes
git commit -m "Fix build issues: Add missing curriculum models and fix type errors"

# Push to GitHub
git push origin main

echo "Changes pushed to GitHub successfully!"
echo "Your Vercel build should now complete without the previous errors."
#!/bin/bash
# Script to commit changes and deploy to Vercel

# Set colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== EdPsych Connect Deployment Script ===${NC}"
echo -e "${YELLOW}This script will commit your changes and prepare for Vercel deployment${NC}"
echo ""

# Step 1: Add all changes to git
echo -e "${GREEN}Step 1: Adding changes to git...${NC}"
git add .
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to add files to git${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Changes added successfully${NC}"
echo ""

# Step 2: Commit changes
echo -e "${GREEN}Step 2: Committing changes...${NC}"
git commit -m "Fix: Enhanced Prisma client initialization and build process for Vercel deployment"
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to commit changes${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Changes committed successfully${NC}"
echo ""

# Step 3: Push to GitHub
echo -e "${GREEN}Step 3: Pushing to GitHub (complete-rebuild branch)...${NC}"
git push origin complete-rebuild
if [ $? -ne 0 ]; then
  echo -e "${RED}Error: Failed to push to GitHub${NC}"
  echo -e "${YELLOW}You may need to pull changes first or force push:${NC}"
  echo -e "${YELLOW}git pull origin complete-rebuild --rebase${NC}"
  echo -e "${YELLOW}or${NC}"
  echo -e "${YELLOW}git push origin complete-rebuild --force${NC}"
  exit 1
fi
echo -e "${GREEN}✓ Changes pushed to GitHub successfully${NC}"
echo ""

# Step 4: Instructions for Vercel deployment
echo -e "${GREEN}=== Next Steps for Vercel Deployment ===${NC}"
echo -e "${YELLOW}1. Go to the Vercel dashboard: https://vercel.com/dashboard${NC}"
echo -e "${YELLOW}2. Select your project: EdPsych-AI-Education-Platform${NC}"
echo -e "${YELLOW}3. Click on 'Deployments' tab${NC}"
echo -e "${YELLOW}4. Click 'Create New Deployment'${NC}"
echo -e "${YELLOW}5. Select the 'complete-rebuild' branch${NC}"
echo -e "${YELLOW}6. Verify environment variables match .env.production${NC}"
echo -e "${YELLOW}7. Click 'Deploy'${NC}"
echo ""

echo -e "${GREEN}=== Environment Variables Checklist ===${NC}"
echo -e "${YELLOW}Ensure these environment variables are set in Vercel:${NC}"
echo -e "DATABASE_URL=\"postgresql://postgres:Kanopatrick1@db.wxwcvqnbjorztzjwfi.supabase.co:5432/postgres?sslmode=require\""
echo -e "NEXTAUTH_URL=\"https://edpsychconnect.com\""
echo -e "NEXTAUTH_SECRET=\"your-secure-secret-key\""
echo -e "MAINTENANCE_MODE=\"false\""
echo -e "NODE_ENV=\"production\""
echo -e "SKIP_PRISMA_MIGRATIONS=\"false\""
echo -e "SKIP_DB_CONNECT=\"false\""
echo -e "NEXT_PUBLIC_SKIP_DB_INIT=\"false\""
echo -e "NEXT_SKIP_STATIC_GENERATION=\"true\""
echo -e "NEXT_TELEMETRY_DISABLED=\"1\""
echo -e "NEXT_PUBLIC_SITE_URL=\"https://edpsychconnect.com\""
echo ""

echo -e "${GREEN}=== Troubleshooting ===${NC}"
echo -e "${YELLOW}If deployment fails, check:${NC}"
echo -e "1. Vercel build logs for specific error messages"
echo -e "2. Ensure DATABASE_URL is correctly set and accessible"
echo -e "3. Verify Prisma client generation in the build logs"
echo -e "4. Check for any syntax errors in the updated files"
echo ""

echo -e "${GREEN}=== After Successful Deployment ===${NC}"
echo -e "${YELLOW}Verify:${NC}"
echo -e "1. Blog pages load correctly at https://edpsychconnect.com/blog"
echo -e "2. Database operations work as expected"
echo -e "3. No runtime errors in the browser console"
echo ""

echo -e "${GREEN}Deployment preparation completed!${NC}"
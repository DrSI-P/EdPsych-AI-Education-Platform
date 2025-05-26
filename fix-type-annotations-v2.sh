#!/bin/bash

# Script to fix invalid type annotations in API route files
# Specifically targeting ': any' in Zod schema validations and function parameters

# Find all TypeScript files in the API directory
find src/app/api -type f -name "*.ts" | while read file; do
  echo "Processing $file"
  
  # Fix Zod schema min/max with ': any'
  sed -i 's/\.min([0-9][0-9]*: any)/\.min(\1)/g' "$file"
  sed -i 's/\.max([0-9][0-9]*: any)/\.max(\1)/g' "$file"
  
  # Fix Zod schema min/max with message and ': any'
  sed -i 's/\.min([0-9][0-9]*: any, \("[^"]*"\))/\.min(\1, \2)/g' "$file"
  sed -i 's/\.max([0-9][0-9]*: any, \("[^"]*"\))/\.max(\1, \2)/g' "$file"
  
  # Fix getServerSession with ': any'
  sed -i 's/getServerSession(authOptions: any)/getServerSession(authOptions)/g' "$file"
  
  # Fix session checks with ': any'
  sed -i 's/!session: any/!session/g' "$file"
  sed -i 's/!session?.user: any/!session?.user/g' "$file"
  sed -i 's/!session || !session.user: any/!session || !session.user/g' "$file"
  
  # Fix URL with ': any'
  sed -i 's/request.url: any/request.url/g' "$file"
  sed -i 's/req.url: any/req.url/g' "$file"
  
  # Fix if conditions with ': any'
  sed -i 's/if (!apiKey: any)/if (!apiKey)/g' "$file"
  sed -i 's/if (id: any)/if (id)/g' "$file"
  
  # Fix parse with ': any'
  sed -i 's/body: any)/body)/g' "$file"
  sed -i 's/validatedData: any)/validatedData)/g' "$file"
  
  # Fix NextResponse.json with ': any'
  sed -i 's/NextResponse.json(result: any/NextResponse.json(result/g' "$file"
done

echo "Fixed invalid type annotations in API route files"

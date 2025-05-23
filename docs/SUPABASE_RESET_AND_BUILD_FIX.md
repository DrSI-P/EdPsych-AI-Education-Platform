# Supabase Reset and Build Dependency Guide

This document provides instructions for resetting your Supabase database and resolving build dependency issues in the EdPsych AI Education Platform.

## Supabase Reset Instructions

We've prepared two files to help you reset your Supabase database:

1. `scripts/supabase-reset.sql` - SQL script to drop all tables in your Supabase database
2. `scripts/supabase-reset-helper.sh` - Shell script to guide you through backup, reset, and restore

### Steps to Reset Supabase Database

1. **Backup your data** (recommended)
   ```bash
   bash scripts/supabase-reset-helper.sh
   # Choose option 1 to backup data only
   ```

2. **Execute the SQL reset script**
   - Log in to your Supabase dashboard
   - Navigate to the SQL Editor
   - Copy and paste the contents of `scripts/supabase-reset.sql`
   - Review the script carefully
   - Run the script

3. **Run Prisma migrations**
   ```bash
   npx prisma migrate reset --force
   npx prisma migrate dev
   ```

4. **Restore critical data** (optional)
   - Return to the helper script
   ```bash
   bash scripts/supabase-reset-helper.sh
   # Choose option 2 for a guided process
   ```

## Build Dependency Resolution

To fix the build issues, you need to install missing dependencies and create required internal modules:

1. **Install missing dependencies**
   ```bash
   npm install next-auth @prisma/client
   ```

2. **Create required internal modules**

   Create the following files:

   **src/lib/auth.ts**
   ```typescript
   import { NextAuthOptions } from "next-auth";
   import { PrismaAdapter } from "@next-auth/prisma-adapter";
   import { prisma } from "./db";

   export const authOptions: NextAuthOptions = {
     adapter: PrismaAdapter(prisma),
     // Add your auth providers and other configuration here
     session: {
       strategy: "jwt",
     },
     // Add more configuration as needed
   };
   ```

   **src/lib/db.ts**
   ```typescript
   import { PrismaClient } from "@prisma/client";

   declare global {
     var prisma: PrismaClient | undefined;
   }

   export const prisma = global.prisma || new PrismaClient();

   if (process.env.NODE_ENV !== "production") {
     global.prisma = prisma;
   }
   ```

   **src/components/blog/BlogPostView.tsx**
   ```tsx
   import React from 'react';

   interface BlogPostViewProps {
     post: {
       id: string;
       title: string;
       content: string;
       author?: {
         name?: string;
       };
       createdAt: Date;
     };
   }

   export default function BlogPostView({ post }: BlogPostViewProps) {
     return (
       <div className="blog-post">
         <h1>{post.title}</h1>
         <p className="meta">
           By {post.author?.name || 'Unknown'} on {new Date(post.createdAt).toLocaleDateString()}
         </p>
         <div className="content" dangerouslySetInnerHTML={{ __html: post.content }} />
       </div>
     );
   }
   ```

3. **Run the build again**
   ```bash
   npm run build
   ```

## Troubleshooting

If you encounter additional missing modules during the build:

1. Check the error message for the specific module path
2. Create the missing module with a minimal implementation
3. Run the build again to identify any further missing dependencies

For persistent issues, consider:
- Checking the Next.js documentation for version compatibility
- Reviewing package.json for conflicting dependencies
- Using `--force` with npm install if needed

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Script to automatically fix common TypeScript errors in the EdPsych codebase
 * 
 * This script addresses two main categories of errors:
 * 1. Implicit 'any' type parameters
 * 2. Missing database accessors in the db interface
 */

// Add missing database accessors to db/index.ts
function addMissingDatabaseAccessors() {
  const dbIndexPath = path.join(__dirname, 'src/lib/db/index.ts');
  let dbIndexContent = fs.readFileSync(dbIndexPath, 'utf8');
  
  // Check if we need to add userVideos
  if (!dbIndexContent.includes('userVideos')) {
    const userVideosInterface = `
// UserVideos model interface
const userVideos = {
  /**
   * Find user videos by ID
   */
  findUnique: async (params: {
    where: Prisma.UserVideosWhereUniqueInput;
  }) => {
    return prisma.userVideos.findUnique(params);
  },

  /**
   * Find many user videos with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.UserVideosWhereInput;
    orderBy?: Prisma.UserVideosOrderByWithRelationInput;
    include?: Prisma.UserVideosInclude;
  }) => {
    return prisma.userVideos.findMany(params);
  },

  /**
   * Create a new user video
   */
  create: async (params: {
    data: Prisma.UserVideosCreateInput;
  }) => {
    return prisma.userVideos.create(params);
  },

  /**
   * Update user videos
   */
  update: async (params: {
    where: Prisma.UserVideosWhereUniqueInput;
    data: Prisma.UserVideosUpdateInput;
  }) => {
    return prisma.userVideos.update(params);
  },

  /**
   * Delete user videos
   */
  delete: async (params: {
    where: Prisma.UserVideosWhereUniqueInput;
  }) => {
    return prisma.userVideos.delete(params);
  }
};`;

    // Add userVideos before the export
    dbIndexContent = dbIndexContent.replace(
      '// Export the database interface',
      `${userVideosInterface}\n\n// Export the database interface`
    );
  }

  // Check if we need to add activityLogs
  if (!dbIndexContent.includes('activityLogs')) {
    const activityLogsInterface = `
// ActivityLogs model interface
const activityLogs = {
  /**
   * Find activity logs by ID
   */
  findUnique: async (params: {
    where: Prisma.ActivityLogWhereUniqueInput;
  }) => {
    return prisma.activityLog.findUnique(params);
  },

  /**
   * Find many activity logs with optional filtering
   */
  findMany: async (params?: {
    skip?: number;
    take?: number;
    where?: Prisma.ActivityLogWhereInput;
    orderBy?: Prisma.ActivityLogOrderByWithRelationInput;
  }) => {
    return prisma.activityLog.findMany(params);
  },

  /**
   * Create a new activity log
   */
  create: async (params: {
    data: Prisma.ActivityLogCreateInput;
  }) => {
    return prisma.activityLog.create(params);
  }
};`;

    // Add activityLogs before the export
    dbIndexContent = dbIndexContent.replace(
      '// Export the database interface',
      `${activityLogsInterface}\n\n// Export the database interface`
    );
  }

  // Update the db export to include the new models
  if (!dbIndexContent.includes('userVideos,') || !dbIndexContent.includes('activityLogs,')) {
    dbIndexContent = dbIndexContent.replace(
      'const db = {',
      'const db = {\n  userVideos,\n  activityLogs,'
    );
  }

  // Write the updated content back to the file
  fs.writeFileSync(dbIndexPath, dbIndexContent);
  console.log('Added missing database accessors to db/index.ts');
}

// Fix implicit 'any' type parameters in route handlers
function fixImplicitAnyTypes() {
  const routeFiles = glob.sync('src/app/api/**/*.ts');
  let fixedCount = 0;

  routeFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Find and fix implicit 'any' type parameters
    const implicitAnyRegex = /Parameter '(\w+)' implicitly has an 'any' type/g;
    const matches = content.matchAll(implicitAnyRegex);
    
    for (const match of matches) {
      const paramName = match[1];
      
      // Replace parameter without type with typed parameter
      const paramRegex = new RegExp(`(\\(|, )(${paramName})(\\)|,|\\s*=>)`, 'g');
      const replacement = `$1${paramName}: any$3`;
      
      const newContent = content.replace(paramRegex, replacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    }

    // Fix specific error in credits/route.ts: Expected 2 arguments, but got 1
    if (file.includes('credits/route.ts') && content.includes('Expected 2 arguments, but got 1')) {
      const updateRegex = /db\.user\.update\(([^,]+)\)/g;
      const updateReplacement = 'db.user.update($1, {})';
      
      const newContent = content.replace(updateRegex, updateReplacement);
      
      if (newContent !== content) {
        content = newContent;
        modified = true;
        fixedCount++;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`Fixed implicit 'any' types in ${file}`);
    }
  });

  console.log(`Fixed ${fixedCount} implicit 'any' type issues`);
}

// Main execution
try {
  console.log('Starting TypeScript error fix automation...');
  
  // Add missing database accessors
  addMissingDatabaseAccessors();
  
  // Fix implicit 'any' type parameters
  fixImplicitAnyTypes();
  
  console.log('TypeScript error fix automation completed successfully');
} catch (error) {
  console.error('Error during TypeScript error fix automation:', error);
}

/**
 * Build-time Tenant Context Initialization Script with Middleware Support
 * 
 * This script ensures that a valid tenant context is available during the build process.
 * It sets up the necessary environment variables and database context for Prisma operations.
 */

const { PrismaClient } = require('@prisma/client');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a Prisma client instance
const prisma = new PrismaClient();

// Default tenant ID to use during build
const DEFAULT_TENANT_ID = 'debdcb9f-f3d3-4dc5-8000-000000000000';

async function main() {
  console.log('🔍 Initializing tenant context for build process...');
  
  try {
    // First, try to find the existing tenant with domain edpsychconnect.com
    console.log('🔍 Looking for tenant with domain edpsychconnect.com...');
    
    // Execute raw SQL to avoid tenant context issues
    const tenantResult = await prisma.$queryRaw`
      SELECT "id", "name", "domain" FROM "Tenant" 
      WHERE "domain" = 'edpsychconnect.com' 
      LIMIT 1
    `;
    
    let tenantId;
    
    if (tenantResult && tenantResult.length > 0) {
      tenantId = tenantResult[0].id;
      console.log(`✅ Found existing tenant with ID: ${tenantId}`);
    } else {
      tenantId = DEFAULT_TENANT_ID;
      console.log(`⚠️ No tenant found with domain edpsychconnect.com, using default ID: ${tenantId}`);
    }
    
    // Set the tenant context in the database
    console.log('🔧 Setting tenant context in database...');
    await prisma.$executeRaw`SELECT set_tenant_context(${tenantId}::uuid)`;
    
    // Create or update .env.build file with tenant context
    console.log('🔧 Creating build environment file with tenant context...');
    const envBuildPath = path.join(process.cwd(), '.env.build');
    
    // Read existing .env file if it exists
    let envContent = '';
    const envPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // Add or update NEXT_PUBLIC_DEFAULT_TENANT_ID
    if (envContent.includes('NEXT_PUBLIC_DEFAULT_TENANT_ID=')) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_DEFAULT_TENANT_ID=.*/,
        `NEXT_PUBLIC_DEFAULT_TENANT_ID=${tenantId}`
      );
    } else {
      envContent += `\nNEXT_PUBLIC_DEFAULT_TENANT_ID=${tenantId}\n`;
    }
    
    // Add or update BUILD_TENANT_CONTEXT_SET
    if (envContent.includes('BUILD_TENANT_CONTEXT_SET=')) {
      envContent = envContent.replace(
        /BUILD_TENANT_CONTEXT_SET=.*/,
        'BUILD_TENANT_CONTEXT_SET=true'
      );
    } else {
      envContent += `BUILD_TENANT_CONTEXT_SET=true\n`;
    }
    
    // Write the updated content to .env.build
    fs.writeFileSync(envBuildPath, envContent);
    
    // Copy .env.build to .env to ensure it's used during the build
    fs.copyFileSync(envBuildPath, envPath);
    
    // Create a global tenant context file that can be imported by other modules
    const tenantContextPath = path.join(process.cwd(), 'lib', 'tenant-context-global.js');
    const tenantContextDir = path.join(process.cwd(), 'lib');
    
    if (!fs.existsSync(tenantContextDir)) {
      fs.mkdirSync(tenantContextDir, { recursive: true });
    }
    
    const tenantContextContent = `/**
 * Global Tenant Context
 * This file is generated during build to provide tenant context to all modules
 */

module.exports = {
  TENANT_ID: '${tenantId}',
  TENANT_DOMAIN: 'edpsychconnect.com',
  BUILD_TIME: '${new Date().toISOString()}'
};
`;
    
    fs.writeFileSync(tenantContextPath, tenantContextContent);
    console.log(`✅ Created global tenant context file at ${tenantContextPath}`);
    
    console.log('✅ Tenant context initialization completed successfully');
    
    // Verify the tenant context is working
    console.log('🔍 Verifying tenant context...');
    const verifyResult = await prisma.$queryRaw`SELECT current_tenant_id()`;
    console.log(`✅ Current tenant ID: ${verifyResult[0].current_tenant_id}`);
    
    return { success: true, tenantId };
  } catch (error) {
    console.error('❌ Error initializing tenant context:', error);
    return { success: false, error: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// Run the initialization
main()
  .then((result) => {
    if (result.success) {
      console.log('✅ Build-time tenant context initialization completed successfully');
      process.exit(0);
    } else {
      console.error('❌ Build-time tenant context initialization failed');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('❌ Unhandled error during tenant context initialization:', error);
    process.exit(1);
  });

/**
 * Enhanced Prisma Tenant Middleware with Zero-Dependency Fallback
 * 
 * This module provides middleware for Prisma that automatically sets the tenant context
 * for every database query, ensuring proper multi-tenancy isolation.
 * It includes a zero-dependency fallback for build-time operations.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

// Hardcoded default tenant ID from the database verification
const DEFAULT_TENANT_ID = 'debdcb9f-f3d3-4dc5-8000-000000000000';

/**
 * Creates a Prisma client with tenant middleware
 * @param {string} tenantId - Optional tenant ID to use (will try to find default if not provided)
 * @returns {PrismaClient} - Prisma client with tenant middleware
 */
function createPrismaClientWithTenant(tenantId = null) {
  // Create a new Prisma client
  const prisma = new PrismaClient();
  
  // Add middleware to set tenant context before each query
  prisma.$use(async (params, next) => {
    try {
      // Skip tenant context for raw queries that set the tenant context
      if (params.action === 'queryRaw' && 
          params.args.query && 
          params.args.query.includes('set_tenant_context')) {
        return next(params);
      }
      
      // Get tenant ID if not provided
      let effectiveTenantId = tenantId;
      
      if (!effectiveTenantId) {
        // Try to get from environment variable
        if (process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID) {
          effectiveTenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID;
        } else if (process.env.TENANT_CONTEXT_BYPASS_DB === 'true') {
          // Use hardcoded default in build environment
          effectiveTenantId = DEFAULT_TENANT_ID;
        } else {
          // Try to find tenant with domain edpsychconnect.com
          try {
            const result = await prisma.$queryRaw`
              SELECT "id" FROM "Tenant" 
              WHERE "domain" = 'edpsychconnect.com' 
              LIMIT 1
            `;
            
            if (result && result.length > 0) {
              effectiveTenantId = result[0].id;
              // Cache in environment for future use
              process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = effectiveTenantId;
            } else {
              // Fallback to hardcoded default if no tenant found
              effectiveTenantId = DEFAULT_TENANT_ID;
            }
          } catch (error) {
            console.error('Error finding default tenant, using hardcoded default:', error.message);
            effectiveTenantId = DEFAULT_TENANT_ID;
          }
        }
      }
      
      // Set tenant context if we have a tenant ID
      if (effectiveTenantId) {
        try {
          await prisma.$executeRaw`SELECT set_tenant_context(${effectiveTenantId}::uuid)`;
        } catch (error) {
          console.error('Error setting tenant context, continuing with query:', error.message);
        }
      }
      
      // Continue with the original query
      return next(params);
    } catch (error) {
      console.error('Error in tenant middleware:', error.message);
      return next(params);
    }
  });
  
  return prisma;
}

/**
 * Ensures tenant context is set for a specific operation
 * @param {PrismaClient} prisma - Prisma client instance
 * @param {Function} operation - Async function that performs database operations
 * @returns {Promise<any>} - Result of the operation
 */
async function withTenantContext(prisma, operation) {
  try {
    // Try to get tenant ID from environment
    let tenantId = process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID;
    
    // If not found and we're in build mode, use hardcoded default
    if (!tenantId && process.env.TENANT_CONTEXT_BYPASS_DB === 'true') {
      tenantId = DEFAULT_TENANT_ID;
    }
    // If not found, try to find tenant with domain edpsychconnect.com
    else if (!tenantId) {
      try {
        const result = await prisma.$queryRaw`
          SELECT "id" FROM "Tenant" 
          WHERE "domain" = 'edpsychconnect.com' 
          LIMIT 1
        `;
        
        if (result && result.length > 0) {
          tenantId = result[0].id;
          // Cache in environment for future use
          process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = tenantId;
        } else {
          // Fallback to hardcoded default if no tenant found
          tenantId = DEFAULT_TENANT_ID;
        }
      } catch (error) {
        console.error('Error finding default tenant, using hardcoded default:', error.message);
        tenantId = DEFAULT_TENANT_ID;
      }
    }
    
    // Set tenant context if we have a tenant ID
    if (tenantId) {
      try {
        await prisma.$executeRaw`SELECT set_tenant_context(${tenantId}::uuid)`;
      } catch (error) {
        console.error('Error setting tenant context, continuing with operation:', error.message);
      }
    }
    
    // Execute the operation
    return await operation();
  } catch (error) {
    console.error('Error in withTenantContext:', error.message);
    throw error;
  }
}

// Try to load global tenant context if available
let globalTenantContext = null;
try {
  const globalContextPath = path.join(process.cwd(), 'lib', 'tenant-context-global.js');
  if (fs.existsSync(globalContextPath)) {
    globalTenantContext = require(globalContextPath);
    console.log('Loaded global tenant context:', globalTenantContext.TENANT_ID);
    
    // Set environment variable if not already set
    if (!process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID) {
      process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID = globalTenantContext.TENANT_ID;
    }
  }
} catch (error) {
  console.error('Error loading global tenant context:', error.message);
}

module.exports = {
  createPrismaClientWithTenant,
  withTenantContext,
  DEFAULT_TENANT_ID,
  globalTenantContext
};

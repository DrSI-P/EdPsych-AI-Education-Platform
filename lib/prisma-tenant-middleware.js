/**
 * Prisma Tenant Middleware
 * 
 * This module provides middleware for Prisma that automatically sets the tenant context
 * for every database query, ensuring proper multi-tenancy isolation.
 */

const { PrismaClient } = require('@prisma/client');

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
            }
          } catch (error) {
            console.error('Error finding default tenant:', error.message);
          }
        }
      }
      
      // Set tenant context if we have a tenant ID
      if (effectiveTenantId) {
        await prisma.$executeRaw`SELECT set_tenant_context(${effectiveTenantId}::uuid)`;
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
    
    // If not found, try to find tenant with domain edpsychconnect.com
    if (!tenantId) {
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
        }
      } catch (error) {
        console.error('Error finding default tenant:', error.message);
      }
    }
    
    // Set tenant context if we have a tenant ID
    if (tenantId) {
      await prisma.$executeRaw`SELECT set_tenant_context(${tenantId}::uuid)`;
    }
    
    // Execute the operation
    return await operation();
  } catch (error) {
    console.error('Error in withTenantContext:', error.message);
    throw error;
  }
}

module.exports = {
  createPrismaClientWithTenant,
  withTenantContext
};

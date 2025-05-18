import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { validateAndSanitizeUser } from '@/lib/validation';

const prisma = new PrismaClient();

// Database monitoring and maintenance utilities

/**
 * Performs a database health check and returns detailed status information
 */
export async function checkDatabaseHealth() {
  try {
    const startTime = Date.now();
    
    // Check basic connectivity
    await prisma.$queryRaw`SELECT 1`;
    
    // Get database statistics
    const userCount = await prisma.user.count();
    const assessmentCount = await prisma.assessment.count();
    const resourceCount = await prisma.resource.count();
    
    // Check query performance
    const queryTime = Date.now() - startTime;
    
    return {
      status: 'healthy',
      statistics: {
        userCount,
        assessmentCount,
        resourceCount,
      },
      performance: {
        queryTimeMs: queryTime,
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    return {
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Logs database operations for monitoring and auditing
 */
export async function logDatabaseOperation(operation: string, model: string, userId: string, details: any) {
  try {
    // Create log entry
    const logEntry = {
      timestamp: new Date().toISOString(),
      operation,
      model,
      userId,
      details: JSON.stringify(details)
    };
    
    // Write to database log file
    const logDir = path.join(process.cwd(), 'logs');
    const logFile = path.join(logDir, `db-operations-${new Date().toISOString().split('T')[0]}.log`);
    
    // Ensure log directory exists
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Append log entry to file
    fs.appendFileSync(logFile, JSON.stringify(logEntry) + '\n');
    
    return true;
  } catch (error) {
    console.error('Failed to log database operation:', error);
    return false;
  }
}

/**
 * Performs database optimization tasks
 */
export async function optimizeDatabase() {
  try {
    // For PostgreSQL, you might run VACUUM ANALYZE
    // For other databases, appropriate optimization commands would be used
    // This is a simplified example
    
    await prisma.$executeRawUnsafe('VACUUM ANALYZE');
    
    return {
      status: 'success',
      message: 'Database optimization completed successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Database optimization failed:', error);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Validates database schema integrity
 */
export async function validateDatabaseSchema() {
  try {
    // Use Prisma's introspection to check schema
    const introspection = await prisma.$introspect();
    
    // Compare with expected models
    const expectedModels = ['User', 'Profile', 'Assessment', 'Question', 'AssessmentResult', 'Answer', 'Resource', 'CurriculumPlan', 'Unit', 'Lesson'];
    const actualModels = introspection.models.map(model => model.name);
    
    const missingModels = expectedModels.filter(model => !actualModels.includes(model));
    
    if (missingModels.length > 0) {
      return {
        status: 'error',
        missingModels,
        message: 'Database schema is missing expected models',
        timestamp: new Date().toISOString()
      };
    }
    
    return {
      status: 'valid',
      message: 'Database schema is valid',
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Database schema validation failed:', error);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Performs data integrity checks
 */
export async function checkDataIntegrity() {
  try {
    // Check for orphaned records
    const orphanedProfiles = await prisma.profile.findMany({
      where: {
        user: {
          is: null
        }
      }
    });
    
    const orphanedAssessmentResults = await prisma.assessmentResult.findMany({
      where: {
        OR: [
          { assessment: { is: null } },
          { student: { is: null } }
        ]
      }
    });
    
    // Check for data consistency
    const invalidUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { equals: '' } },
          { name: { equals: '' } }
        ]
      }
    });
    
    return {
      status: orphanedProfiles.length === 0 && orphanedAssessmentResults.length === 0 && invalidUsers.length === 0 ? 'valid' : 'issues',
      issues: {
        orphanedProfiles: orphanedProfiles.length,
        orphanedAssessmentResults: orphanedAssessmentResults.length,
        invalidUsers: invalidUsers.length
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Data integrity check failed:', error);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * Repairs data integrity issues
 */
export async function repairDataIntegrity() {
  try {
    // Delete orphaned profiles
    const deleteOrphanedProfiles = await prisma.profile.deleteMany({
      where: {
        user: {
          is: null
        }
      }
    });
    
    // Delete orphaned assessment results
    const deleteOrphanedResults = await prisma.assessmentResult.deleteMany({
      where: {
        OR: [
          { assessment: { is: null } },
          { student: { is: null } }
        ]
      }
    });
    
    // Fix invalid users
    const invalidUsers = await prisma.user.findMany({
      where: {
        OR: [
          { email: { equals: '' } },
          { name: { equals: '' } }
        ]
      }
    });
    
    let fixedUsers = 0;
    for (const user of invalidUsers) {
      if (!user.email || user.email === '') {
        await prisma.user.update({
          where: { id: user.id },
          data: { email: `user-${user.id}@example.com` }
        });
        fixedUsers++;
      }
      
      if (!user.name || user.name === '') {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: `User ${user.id}` }
        });
        fixedUsers++;
      }
    }
    
    return {
      status: 'success',
      repairs: {
        deletedOrphanedProfiles: deleteOrphanedProfiles.count,
        deletedOrphanedResults: deleteOrphanedResults.count,
        fixedUsers
      },
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Data integrity repair failed:', error);
    return {
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

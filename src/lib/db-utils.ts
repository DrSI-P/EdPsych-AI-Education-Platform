import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeUser, validateAndSanitizeProfile } from '@/lib/validation';

const prisma = new PrismaClient();

/**
 * EdPsych-AI-Education-Platform Database Utilities
 * Provides safe database operations with validation, error handling, and educational context awareness
 */

// Error types for better error handling
export enum DatabaseErrorType {
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE = 'DUPLICATE',
  VALIDATION = 'VALIDATION',
  PERMISSION = 'PERMISSION',
  CONNECTION = 'CONNECTION',
  UNKNOWN = 'UNKNOWN'
}

// Custom database error class
export class DatabaseError extends Error {
  type: DatabaseErrorType;
  details?;

  constructor(message: string, type: DatabaseErrorType, details?) {
    super(message);
    this.name = 'DatabaseError';
    this.type = type;
    this.details = details;
  }
}

/**
 * Safe database operation wrapper with error handling
 * @param operation Function that performs database operation
 * @returns Result of the operation
 */
export async function safeDbOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error('Database operation error:', error);
    
    // Determine error type based on Prisma error codes
    if (error.code === 'P2025') {
      throw new DatabaseError('Record not found', DatabaseErrorType.NOT_FOUND, error);
    } else if (error.code === 'P2002') {
      throw new DatabaseError('Duplicate record', DatabaseErrorType.DUPLICATE, error);
    } else if (error.code === 'P2000') {
      throw new DatabaseError('Validation error', DatabaseErrorType.VALIDATION, error);
    } else if (error.code?.startsWith('P1')) {
      throw new DatabaseError('Database connection error', DatabaseErrorType.CONNECTION, error);
    } else {
      throw new DatabaseError('Database operation failed', DatabaseErrorType.UNKNOWN, error);
    }
  }
}

/**
 * Pagination parameters interface
 */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * Search parameters interface
 */
export interface SearchParams {
  query?: string;
  fields?: string: any[];
  filters?: Record<string, any>;
}

/**
 * Paginated result interface
 */
export interface PaginatedResult<T> {
  data: T: any[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    pageCount: number;
    hasMore: boolean;
  };
}

/**
 * Generic function to get paginated results with search capabilities
 * @param model Prisma model name
 * @param paginationParams Pagination parameters
 * @param searchParams Search parameters
 * @returns Paginated results
 */
export async function getPaginatedResults<T>(
  model: string,
  paginationParams: PaginationParams = {},
  searchParams: SearchParams = {}
): Promise<PaginatedResult<T>> {
  const { page = 1, pageSize = 10, orderBy = 'createdAt', orderDirection = 'desc' } = paginationParams;
  const { query, fields = [], filters = {} } = searchParams;
  
  // Calculate skip value for pagination
  const skip = (page - 1) * pageSize;
  
  // Build where clause for search
  const where = { ...filters };
  
  // Add search query if provided
  if (query && fields.length > 0) {
    where.OR = fields.map(field => ({
      [field]: {
        contains: query,
        mode: 'insensitive'
      }
    }));
  }
  
  // Get total count
  const total = await safeDbOperation(() => 
    prisma[model].count({ where })
  );
  
  // Get paginated data
  const data = await safeDbOperation(() => 
    prisma[model].findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        [orderBy]: orderDirection
      }
    })
  );
  
  // Calculate pagination metadata
  const pageCount = Math.ceil(total / pageSize);
  const hasMore = page < pageCount;
  
  return {
    data: data as T: any: any[],
    pagination: {
      total,
      page,
      pageSize,
      pageCount,
      hasMore
    }
  };
}

/**
 * Bulk operation interface
 */
export interface BulkOperationResult {
  success: number;
  failed: number;
  errors: any: any[];
}

/**
 * Perform bulk create operation with validation
 * @param model Prisma model name
 * @param data Array of data objects to create
 * @param validator Optional validation function
 * @returns Bulk operation result
 */
export async function bulkCreate(model: string, data: any: any[], validator?: (item) => any
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Process each item
  for (const item of data) {
    try {
      // Validate if validator provided
      const validatedItem = validator ? validator(item) : item;
      
      // Create record
      await prisma[model].create({
        data: validatedItem
      });
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        item,
        error: error.message
      });
    }
  }
  
  return result;
}

/**
 * Perform bulk update operation with validation
 * @param model Prisma model name
 * @param data Array of data objects with id and update data
 * @param validator Optional validation function
 * @returns Bulk operation result
 */
export async function bulkUpdate(
  model: string,
  data: { id: string; data }[],
  validator?: (item) => any
): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Process each item
  for (const item of data) {
    try {
      // Validate if validator provided
      const validatedData = validator ? validator(item.data) : item.data;
      
      // Update record
      await prisma[model].update({
        where: { id: item.id },
        data: validatedData
      });
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        item,
        error: error.message
      });
    }
  }
  
  return result;
}

/**
 * Perform bulk delete operation
 * @param model Prisma model name
 * @param ids Array of record IDs to delete
 * @returns Bulk operation result
 */
export async function bulkDelete(model: string, ids: string: any[]): Promise<BulkOperationResult> {
  const result: BulkOperationResult = {
    success: 0,
    failed: 0,
    errors: []
  };
  
  // Process each ID
  for (const id of ids) {
    try {
      // Delete record
      await prisma[model].delete({
        where: { id }
      });
      
      result.success++;
    } catch (error) {
      result.failed++;
      result.errors.push({
        id,
        error: error.message
      });
    }
  }
  
  return result;
}

/**
 * Educational data retrieval functions
 */

/**
 * Get student learning profile with all related data
 * @param studentId Student ID
 * @returns Complete student learning profile
 */
export async function getStudentLearningProfile(studentId: string) {
  return safeDbOperation(async () => {
    const student = await prisma.user.findUnique({
      where: { id: studentId, role: 'STUDENT' },
      include: {
        profile: {
          include: {
            learningPreferences: true,
            emotionalProfile: true
          }
        },
        assessmentResults: {
          include: {
            assessment: true,
            answers: true
          }
        }
      }
    });
    
    if (!student) {
      throw new DatabaseError('Student not found', DatabaseErrorType.NOT_FOUND);
    }
    
    // Get SEMH assessments
    const semhAssessments = await prisma.semhAssessment.findMany({
      where: { student: { id: studentId } },
      include: {
        areas: true,
        assessor: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Get biofeedback sessions
    const biofeedbackSessions = await prisma.biofeedbackSession.findMany({
      where: { student: { id: studentId } },
      include: {
        facilitator: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Get emotional pattern records
    const emotionalPatternRecords = await prisma.emotionalPatternRecord.findMany({
      where: { student: { id: studentId } },
      include: {
        patterns: true,
        recorder: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Get parent-teacher communications
    const communications = await prisma.parentTeacherCommunication.findMany({
      where: { student: { id: studentId } },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        teacher: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        }
      }
    });
    
    // Remove sensitive data
    const { password, ...userWithoutPassword } = student;
    
    // Return complete profile
    return {
      ...userWithoutPassword,
      semhAssessments,
      biofeedbackSessions,
      emotionalPatternRecords,
      communications
    };
  });
}

/**
 * Get teacher dashboard data
 * @param teacherId Teacher ID
 * @returns Teacher dashboard data
 */
export async function getTeacherDashboardData(teacherId: string) {
  return safeDbOperation(async () => {
    const teacher = await prisma.user.findUnique({
      where: { id: teacherId, role: 'TEACHER' },
      include: {
        profile: true
      }
    });
    
    if (!teacher) {
      throw new DatabaseError('Teacher not found', DatabaseErrorType.NOT_FOUND);
    }
    
    // Get teacher's assessments
    const assessments = await prisma.assessment.findMany({
      where: { createdBy: { id: teacherId } },
      include: {
        _count: {
          select: { results: true }
        }
      },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    // Get teacher's resources
    const resources = await prisma.resource.findMany({
      where: { createdBy: { id: teacherId } },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    // Get teacher's curriculum plans
    const curriculumPlans = await prisma.curriculumPlan.findMany({
      where: { createdBy: { id: teacherId } },
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    
    // Get recent communications
    const communications = await prisma.parentTeacherCommunication.findMany({
      where: { teacher: { id: teacherId } },
      include: {
        parent: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                yearGroup: true
              }
            }
          }
        }
      },
      take: 5,
      orderBy: { date: 'desc' }
    });
    
    // Remove sensitive data
    const { password, ...userWithoutPassword } = teacher;
    
    // Return dashboard data
    return {
      teacher: userWithoutPassword,
      recentActivity: {
        assessments,
        resources,
        curriculumPlans,
        communications
      }
    };
  });
}

/**
 * Get educational psychologist dashboard data
 * @param edPsychId Educational Psychologist ID
 * @returns Educational Psychologist dashboard data
 */
export async function getEdPsychDashboardData(edPsychId: string) {
  return safeDbOperation(async () => {
    const edPsych = await prisma.user.findUnique({
      where: { id: edPsychId, role: 'EDUCATIONAL_PSYCHOLOGIST' },
      include: {
        profile: true
      }
    });
    
    if (!edPsych) {
      throw new DatabaseError('Educational Psychologist not found', DatabaseErrorType.NOT_FOUND);
    }
    
    // Get recent SEMH assessments
    const semhAssessments = await prisma.semhAssessment.findMany({
      where: { assessor: { id: edPsychId } },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                yearGroup: true,
                school: true
              }
            }
          }
        }
      },
      take: 5,
      orderBy: { dateCompleted: 'desc' }
    });
    
    // Get recent biofeedback sessions
    const biofeedbackSessions = await prisma.biofeedbackSession.findMany({
      where: { facilitator: { id: edPsychId } },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                yearGroup: true,
                school: true
              }
            }
          }
        }
      },
      take: 5,
      orderBy: { date: 'desc' }
    });
    
    // Get upcoming follow-ups
    const upcomingFollowUps = await prisma.semhAssessment.findMany({
      where: { 
        assessor: { id: edPsychId },
        followUpDate: {
          gte: new Date()
        }
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                yearGroup: true,
                school: true
              }
            }
          }
        }
      },
      take: 5,
      orderBy: { followUpDate: 'asc' }
    });
    
    // Remove sensitive data
    const { password, ...userWithoutPassword } = edPsych;
    
    // Return dashboard data
    return {
      edPsych: userWithoutPassword,
      recentActivity: {
        semhAssessments,
        biofeedbackSessions,
        upcomingFollowUps
      }
    };
  });
}

/**
 * Get parent dashboard data
 * @param parentId Parent ID
 * @returns Parent dashboard data
 */
export async function getParentDashboardData(parentId: string) {
  return safeDbOperation(async () => {
    const parent = await prisma.user.findUnique({
      where: { id: parentId, role: 'PARENT' },
      include: {
        profile: true,
        children: {
          include: {
            profile: true
          }
        }
      }
    });
    
    if (!parent) {
      throw new DatabaseError('Parent not found', DatabaseErrorType.NOT_FOUND);
    }
    
    // Get children IDs
    const childrenIds = parent.children.map(child => child.id);
    
    // Get recent assessment results
    const assessmentResults = await prisma.assessmentResult.findMany({
      where: { 
        student: { 
          id: { in: childrenIds } 
        } 
      },
      include: {
        assessment: true,
        student: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                yearGroup: true,
                school: true
              }
            }
          }
        }
      },
      take: 10,
      orderBy: { completedAt: 'desc' }
    });
    
    // Get recent communications
    const communications = await prisma.parentTeacherCommunication.findMany({
      where: { 
        parent: { id: parentId } 
      },
      include: {
        teacher: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                title: true,
                firstName: true,
                lastName: true
              }
            }
          }
        },
        student: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                firstName: true,
                lastName: true,
                yearGroup: true,
                school: true
              }
            }
          }
        }
      },
      take: 5,
      orderBy: { date: 'desc' }
    });
    
    // Remove sensitive data
    const { password, ...userWithoutPassword } = parent;
    const children = parent.children.map(child => {
      const { password, ...childWithoutPassword } = child;
      return childWithoutPassword;
    });
    
    // Return dashboard data
    return {
      parent: {
        ...userWithoutPassword,
        children
      },
      recentActivity: {
        assessmentResults,
        communications
      }
    };
  });
}

// Database health check
export async function checkDatabaseConnection() {
  try {
    // Simple query to check if database is accessible
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Middleware for database error handling
export function withDatabaseErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('Database operation error:', error);
      
      // Handle DatabaseError instances
      if (error instanceof DatabaseError) {
        switch (error.type) {
          case DatabaseErrorType.NOT_FOUND:
            return NextResponse.json(
              { error: 'Record not found', details: error.message },
              { status: 404 }
            );
          case DatabaseErrorType.DUPLICATE:
            return NextResponse.json(
              { error: 'Duplicate record', details: error.message },
              { status: 409 }
            );
          case DatabaseErrorType.VALIDATION:
            return NextResponse.json(
              { error: 'Validation error', details: error.message },
              { status: 400 }
            );
          case DatabaseErrorType.PERMISSION:
            return NextResponse.json(
              { error: 'Permission denied', details: error.message },
              { status: 403 }
            );
          case DatabaseErrorType.CONNECTION:
            return NextResponse.json(
              { error: 'Database connection error', details: error.message },
              { status: 503 }
            );
          default:
            return NextResponse.json(
              { error: 'Database operation failed', details: error.message },
              { status: 500 }
            );
        }
      }
      
      // Handle Prisma errors
      if (error.code) {
        if (error.code === 'P2025') {
          return NextResponse.json(
            { error: 'Record not found' },
            { status: 404 }
          );
        } else if (error.code === 'P2002') {
          return NextResponse.json(
            { error: 'A record with this information already exists' },
            { status: 409 }
          );
        } else if (error.code === 'P2000') {
          return NextResponse.json(
            { error: 'Input value too long' },
            { status: 400 }
          );
        }
      }
      
      // Generic error
      return NextResponse.json(
        { error: 'Database operation failed' },
        { status: 500 }
      );
    }
  };
}

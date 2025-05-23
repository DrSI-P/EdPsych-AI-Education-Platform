/**
 * GDPR Compliance Module for EdPsych AI Education Platform
 * Implements data protection and privacy features required for GDPR compliance
 */

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Data retention periods in days for different data types
 */
export const DATA_RETENTION_PERIODS = {
  USER_ACCOUNT: 730, // 2 years after last login
  ASSESSMENT_RESULTS: 1095, // 3 years
  ANALYTICS_DATA: 365, // 1 year
  LOGS: 90, // 90 days
  COMMUNICATIONS: 730, // 2 years
  TEMPORARY_DATA: 30, // 30 days
};

/**
 * Data categories for GDPR purposes
 */
export enum DataCategory {
  PERSONAL = 'personal',
  SPECIAL_CATEGORY = 'special_category',
  EDUCATIONAL = 'educational',
  BEHAVIORAL = 'behavioral',
  ANALYTICS = 'analytics',
  SYSTEM = 'system',
}

/**
 * Data processing purposes for GDPR compliance
 */
export enum ProcessingPurpose {
  ACCOUNT_MANAGEMENT = 'account_management',
  EDUCATIONAL_PROVISION = 'educational_provision',
  ASSESSMENT = 'assessment',
  ANALYTICS = 'analytics',
  RESEARCH = 'research',
  COMMUNICATION = 'communication',
  LEGAL_OBLIGATION = 'legal_obligation',
  SAFEGUARDING = 'safeguarding',
}

/**
 * Legal bases for processing under GDPR
 */
export enum LegalBasis {
  CONSENT = 'consent',
  CONTRACT = 'contract',
  LEGAL_OBLIGATION = 'legal_obligation',
  VITAL_INTERESTS = 'vital_interests',
  PUBLIC_TASK = 'public_task',
  LEGITIMATE_INTERESTS = 'legitimate_interests',
}

/**
 * Schema for data subject access request
 */
const dataSubjectRequestSchema = z.object({
  requestType: z.enum(['access', 'rectification', 'erasure', 'restriction', 'portability']),
  details: z.string().optional(),
});

/**
 * Schema for consent management
 */
const consentSchema = z.object({
  purpose: z.nativeEnum(ProcessingPurpose),
  granted: z.boolean(),
  timestamp: z.date().optional(),
});

/**
 * Process a data subject access request
 * @param userId User ID making the request
 * @param requestType Type of request (access, rectification, etc.)
 * @param details Additional details for the request
 * @returns Response with request status
 */
export async function processDataSubjectRequest(
  userId: string,
  requestType: string,
  details?: string
) {
  // Log the request for compliance purposes
  await prisma.dataSubjectRequest.create({
    data: {
      userId,
      requestType,
      details: details || '',
      status: 'pending',
      createdAt: new Date(),
    },
  });

  switch (requestType) {
    case 'access':
      return await generateUserDataExport(userId);
    case 'erasure':
      return await initiateUserDataDeletion(userId);
    case 'portability':
      return await generatePortableUserData(userId);
    default:
      return { success: true, message: 'Request received and pending processing' };
  }
}

/**
 * Generate a complete export of user data
 * @param userId User ID to export data for
 * @returns Object containing all user data
 */
async function generateUserDataExport(userId: string) {
  // Get user profile data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
    },
  });

  // Get assessment data
  const assessments = await prisma.assessment.findMany({
    where: { userId },
    include: {
      results: true,
    },
  });

  // Get learning data
  const learningData = await prisma.learningActivity.findMany({
    where: { userId },
  });

  // Get communication data
  const communications = await prisma.communication.findMany({
    where: {
      OR: [
        { senderId: userId },
        { recipientId: userId },
      ],
    },
  });

  // Compile all data into a structured export
  const dataExport = {
    personalData: {
      user: {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
      },
      profile: user?.profile,
    },
    educationalData: {
      assessments,
      learningData,
    },
    communicationData: communications,
  };

  // Log the export for compliance
  await prisma.dataExportLog.create({
    data: {
      userId,
      exportType: 'full',
      createdAt: new Date(),
    },
  });

  return dataExport;
}

/**
 * Initiate the process of user data deletion
 * @param userId User ID to delete data for
 * @returns Status of deletion request
 */
async function initiateUserDataDeletion(userId: string) {
  // Create deletion request
  await prisma.dataDeletionRequest.create({
    data: {
      userId,
      status: 'pending',
      requestedAt: new Date(),
    },
  });

  // Schedule deletion process (would be handled by a background job in production)
  // This is a placeholder for the actual implementation
  
  return { 
    success: true, 
    message: 'Data deletion request received. Processing will complete within 30 days.' 
  };
}

/**
 * Generate portable user data in a standard format
 * @param userId User ID to generate portable data for
 * @returns Portable data in a standard format
 */
async function generatePortableUserData(userId: string) {
  const userData = await generateUserDataExport(userId);
  
  // Convert to a standard portable format (e.g., JSON-LD)
  const portableData = {
    "@context": "https://schema.org",
    "@type": "Person",
    "identifier": userData.personalData.user.id,
    "name": userData.personalData.user.name,
    "email": userData.personalData.user.email,
    "dateCreated": userData.personalData.user.createdAt,
    "educationalData": userData.educationalData,
    // Additional transformation for standard format would go here
  };

  // Log the export for compliance
  await prisma.dataExportLog.create({
    data: {
      userId,
      exportType: 'portable',
      createdAt: new Date(),
    },
  });

  return portableData;
}

/**
 * Manage user consent for specific processing purposes
 * @param userId User ID
 * @param purpose Processing purpose
 * @param granted Whether consent is granted
 * @returns Updated consent status
 */
export async function manageConsent(
  userId: string,
  purpose: ProcessingPurpose,
  granted: boolean
) {
  const timestamp = new Date();
  
  // Update or create consent record
  const consent = await prisma.consent.upsert({
    where: {
      userId_purpose: {
        userId,
        purpose,
      },
    },
    update: {
      granted,
      updatedAt: timestamp,
    },
    create: {
      userId,
      purpose,
      granted,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  });

  // Log consent change for compliance
  await prisma.consentLog.create({
    data: {
      userId,
      purpose,
      granted,
      timestamp,
    },
  });

  return consent;
}

/**
 * Check if user has granted consent for a specific purpose
 * @param userId User ID
 * @param purpose Processing purpose
 * @returns Whether consent is granted
 */
export async function checkConsent(userId: string, purpose: ProcessingPurpose) {
  const consent = await prisma.consent.findUnique({
    where: {
      userId_purpose: {
        userId,
        purpose,
      },
    },
  });

  return consent?.granted || false;
}

/**
 * API route handler for data subject requests
 * @param req Request object
 * @returns API response
 */
export async function handleDataSubjectRequest(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    
    // Validate request
    const validatedData = dataSubjectRequestSchema.parse(body);
    
    // Process the request
    const result = await processDataSubjectRequest(
      userId,
      validatedData.requestType,
      validatedData.details
    );
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error processing data subject request:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process request' },
      { status: 500 }
    );
  }
}

/**
 * API route handler for consent management
 * @param req Request object
 * @returns API response
 */
export async function handleConsentManagement(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const body = await req.json();
    
    // Validate request
    const validatedData = consentSchema.parse(body);
    
    // Process consent change
    const result = await manageConsent(
      userId,
      validatedData.purpose,
      validatedData.granted
    );
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error managing consent:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to manage consent' },
      { status: 500 }
    );
  }
}

/**
 * Implement data retention policy by removing expired data
 * This would typically be run as a scheduled job
 */
export async function enforceDataRetentionPolicy() {
  const now = new Date();
  
  // Calculate cutoff dates for each data type
  const cutoffDates = Object.entries(DATA_RETENTION_PERIODS).reduce(
    (acc, [key, days]) => {
      const cutoffDate = new Date(now);
      cutoffDate.setDate(cutoffDate.getDate() - days);
      acc[key] = cutoffDate;
      return acc;
    },
    {} as Record<string, Date>
  );
  
  // Delete expired user accounts (inactive for retention period)
  await prisma.user.deleteMany({
    where: {
      lastLoginAt: {
        lt: cutoffDates.USER_ACCOUNT,
      },
    },
  });
  
  // Delete expired assessment results
  await prisma.assessmentResult.deleteMany({
    where: {
      createdAt: {
        lt: cutoffDates.ASSESSMENT_RESULTS,
      },
    },
  });
  
  // Delete expired analytics data
  await prisma.analyticsEvent.deleteMany({
    where: {
      timestamp: {
        lt: cutoffDates.ANALYTICS_DATA,
      },
    },
  });
  
  // Delete expired logs
  await prisma.systemLog.deleteMany({
    where: {
      timestamp: {
        lt: cutoffDates.LOGS,
      },
    },
  });
  
  // Delete expired communications
  await prisma.communication.deleteMany({
    where: {
      timestamp: {
        lt: cutoffDates.COMMUNICATIONS,
      },
    },
  });
  
  // Delete temporary data
  await prisma.temporaryData.deleteMany({
    where: {
      expiresAt: {
        lt: now,
      },
    },
  });
  
  return {
    success: true,
    message: 'Data retention policy enforced successfully',
  };
}

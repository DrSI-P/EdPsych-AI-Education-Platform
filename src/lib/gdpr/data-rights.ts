import { prisma } from '@/lib/prisma';
import { createHash } from 'crypto';

export interface DataExportFormat {
  userData: any;
  activities: any[];
  assessments: any[];
  notifications: any[];
  auditLogs: any[];
  exportedAt: string;
  format: 'json' | 'csv';
}

// GDPR Rights Implementation
export class GDPRDataRights {
  // Right to Access (Article 15)
  static async exportUserData(userId: string): Promise<DataExportFormat> {
    const [
      userData,
      activities,
      assessments,
      notifications,
      auditLogs,
      safeguardingReports,
    ] = await Promise.all([
      // User profile data
      prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          emailVerified: true,
          isActive: true,
          ageVerified: true,
          dateOfBirth: true,
          // Exclude sensitive fields
          password: false,
        },
      }),
      
      // User activities
      prisma.userActivity.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          createdAt: true,
          metadata: true,
        },
      }),
      
      // Assessments
      prisma.assessment.findMany({
        where: { creatorId: userId },
        select: {
          id: true,
          title: true,
          description: true,
          createdAt: true,
        },
      }),
      
      // Notifications
      prisma.notification.findMany({
        where: { userId },
        select: {
          id: true,
          type: true,
          title: true,
          message: true,
          isRead: true,
          createdAt: true,
        },
      }),
      
      // Audit logs (user's own actions)
      prisma.auditLog.findMany({
        where: { userId },
        select: {
          id: true,
          action: true,
          createdAt: true,
          // Exclude IP addresses
        },
      }),
      
      // Safeguarding reports (if any)
      prisma.safeguardingReport.findMany({
        where: { reportedUserId: userId },
        select: {
          id: true,
          severity: true,
          status: true,
          createdAt: true,
          // Exclude reporter details
        },
      }),
    ]);
    
    return {
      userData,
      activities,
      assessments,
      notifications,
      auditLogs,
      exportedAt: new Date().toISOString(),
      format: 'json',
    };
  }
  
  // Right to Rectification (Article 16)
  static async updateUserData(userId: string, updates: {
    name?: string;
    email?: string;
    dateOfBirth?: Date;
  }) {
    // Validate updates
    const allowedUpdates = ['name', 'email', 'dateOfBirth'];
    const updateKeys = Object.keys(updates);
    
    if (!updateKeys.every(key => allowedUpdates.includes(key))) {
      throw new Error('Invalid update fields');
    }
    
    // Log the update request
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'DATA_RECTIFICATION_REQUEST',
        details: {
          fields: updateKeys,
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    // Perform the update
    return await prisma.user.update({
      where: { id: userId },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        dateOfBirth: true,
        updatedAt: true,
      },
    });
  }
  
  // Right to Erasure / Right to be Forgotten (Article 17)
  static async deleteUserData(userId: string, reason: string) {
    // Check if deletion is allowed
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            safeguardingReports: {
              where: {
                status: { in: ['OPEN', 'INVESTIGATING'] },
              },
            },
          },
        },
      },
    });
    
    if (!user) {
      throw new Error('User not found');
    }
    
    // Cannot delete if there are active safeguarding concerns
    if (user._count.safeguardingReports > 0) {
      throw new Error('Cannot delete account with active safeguarding reports');
    }
    
    // Perform deletion in transaction
    return await prisma.$transaction(async (tx) => {
      // Log the deletion request
      await tx.auditLog.create({
        data: {
          userId,
          action: 'ACCOUNT_DELETION_REQUEST',
          details: {
            reason,
            timestamp: new Date().toISOString(),
          },
        },
      });
      
      // Anonymize rather than delete for data integrity
      const anonymizedEmail = `deleted_${createHash('sha256').update(user.email || '').digest('hex').substring(0, 8)}@deleted.local`;
      
      await tx.user.update({
        where: { id: userId },
        data: {
          email: anonymizedEmail,
          name: 'Deleted User',
          password: null,
          image: null,
          dateOfBirth: null,
          isActive: false,
          // Keep role and dates for audit purposes
        },
      });
      
      // Delete personal data from related tables
      await Promise.all([
        tx.notification.deleteMany({ where: { userId } }),
        tx.userActivity.deleteMany({ where: { userId } }),
        tx.parentalConsent.deleteMany({ where: { studentId: userId } }),
      ]);
      
      return { success: true, anonymizedId: anonymizedEmail };
    });
  }
  
  // Right to Data Portability (Article 20)
  static async exportPortableData(userId: string): Promise<string> {
    const data = await this.exportUserData(userId);
    
    // Format data for portability (machine-readable format)
    const portableData = {
      version: '1.0',
      exportDate: data.exportedAt,
      source: 'EdPsych AI Platform',
      userData: data.userData,
      educationalRecords: {
        assessments: data.assessments,
        activities: data.activities.map(a => ({
          ...a,
          // Remove internal IDs
          id: undefined,
        })),
      },
    };
    
    return JSON.stringify(portableData, null, 2);
  }
  
  // Right to Restriction of Processing (Article 18)
  static async restrictProcessing(userId: string, restrictions: {
    marketing?: boolean;
    analytics?: boolean;
    aiProcessing?: boolean;
  }) {
    // Update user preferences
    await prisma.user.update({
      where: { id: userId },
      data: {
        preferences: {
          upsert: {
            create: {
              restrictMarketing: restrictions.marketing || false,
              restrictAnalytics: restrictions.analytics || false,
              restrictAIProcessing: restrictions.aiProcessing || false,
            },
            update: {
              restrictMarketing: restrictions.marketing,
              restrictAnalytics: restrictions.analytics,
              restrictAIProcessing: restrictions.aiProcessing,
            },
          },
        },
      },
    });
    
    // Log the restriction request
    await prisma.auditLog.create({
      data: {
        userId,
        action: 'PROCESSING_RESTRICTION_REQUEST',
        details: {
          restrictions,
          timestamp: new Date().toISOString(),
        },
      },
    });
    
    return { success: true, restrictions };
  }
  
  // Right to Object (Article 21)
  static async recordObjection(userId: string, objection: {
    type: 'MARKETING' | 'PROFILING' | 'RESEARCH';
    reason: string;
  }) {
    // Record the objection
    await prisma.$transaction(async (tx) => {
      // Update user preferences based on objection
      const updates: any = {};
      
      switch (objection.type) {
        case 'MARKETING':
          updates.restrictMarketing = true;
          break;
        case 'PROFILING':
          updates.restrictAIProcessing = true;
          break;
        case 'RESEARCH':
          updates.restrictAnalytics = true;
          break;
      }
      
      await tx.user.update({
        where: { id: userId },
        data: {
          preferences: {
            upsert: {
              create: updates,
              update: updates,
            },
          },
        },
      });
      
      // Log the objection
      await tx.auditLog.create({
        data: {
          userId,
          action: 'DATA_PROCESSING_OBJECTION',
          details: {
            type: objection.type,
            reason: objection.reason,
            timestamp: new Date().toISOString(),
          },
        },
      });
    });
    
    return { success: true, objectionRecorded: true };
  }
  
  // Data Breach Notification (Article 33 & 34)
  static async notifyDataBreach(affectedUserIds: string[], breachDetails: {
    type: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    description: string;
    dataTypes: string[];
    discoveredAt: Date;
  }) {
    // Create notifications for affected users
    const notifications = affectedUserIds.map(userId => ({
      userId,
      type: 'DATA_BREACH' as any,
      title: 'Important Security Notice',
      message: `We have detected a security incident that may have affected your data. Type: ${breachDetails.type}. Please review your account security settings.`,
      priority: breachDetails.severity as any,
    }));
    
    await prisma.notification.createMany({
      data: notifications,
    });
    
    // Log the breach notification
    await prisma.auditLog.create({
      data: {
        userId: 'SYSTEM',
        action: 'DATA_BREACH_NOTIFICATION',
        details: {
          ...breachDetails,
          affectedUsers: affectedUserIds.length,
          notifiedAt: new Date().toISOString(),
        },
      },
    });
    
    return {
      notified: affectedUserIds.length,
      severity: breachDetails.severity,
    };
  }
}

// Consent management
export class ConsentManager {
  static async recordConsent(userId: string, consents: {
    marketing?: boolean;
    analytics?: boolean;
    cookies?: boolean;
    dataSharing?: boolean;
  }) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        consentRecord: {
          upsert: {
            create: {
              marketingConsent: consents.marketing || false,
              analyticsConsent: consents.analytics || false,
              cookiesConsent: consents.cookies || false,
              dataSharingConsent: consents.dataSharing || false,
              consentedAt: new Date(),
            },
            update: {
              marketingConsent: consents.marketing,
              analyticsConsent: consents.analytics,
              cookiesConsent: consents.cookies,
              dataSharingConsent: consents.dataSharing,
              consentedAt: new Date(),
            },
          },
        },
      },
    });
  }
  
  static async getConsentStatus(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        consentRecord: true,
      },
    });
    
    return user?.consentRecord || {
      marketingConsent: false,
      analyticsConsent: false,
      cookiesConsent: false,
      dataSharingConsent: false,
      consentedAt: null,
    };
  }
}
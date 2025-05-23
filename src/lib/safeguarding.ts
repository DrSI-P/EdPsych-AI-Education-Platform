/**
 * Safeguarding Module for EdPsych AI Education Platform
 * Implements child protection and safety features required for educational platforms
 */

import { prisma } from '@/lib/db';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

/**
 * Safeguarding concern types
 */
export enum SafeguardingConcernType {
  CONTENT = 'inappropriate_content',
  BEHAVIOR = 'concerning_behavior',
  DISCLOSURE = 'disclosure',
  COMMUNICATION = 'inappropriate_communication',
  BULLYING = 'bullying_harassment',
  OTHER = 'other',
}

/**
 * Safeguarding concern severity levels
 */
export enum SafeguardingConcernSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

/**
 * Safeguarding concern status
 */
export enum SafeguardingConcernStatus {
  REPORTED = 'reported',
  UNDER_REVIEW = 'under_review',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

/**
 * Content moderation result
 */
export interface ContentModerationResult {
  isAppropriate: boolean;
  flags: {
    profanity: boolean;
    harassment: boolean;
    violence: boolean;
    selfHarm: boolean;
    sexualContent: boolean;
    hateSpeech: boolean;
    personalInformation: boolean;
  };
  confidence: number;
  moderatedContent?: string;
}

/**
 * Schema for reporting a safeguarding concern
 */
const safeguardingConcernSchema = z.object({
  type: z.nativeEnum(SafeguardingConcernType),
  description: z.string().min(10),
  relatedUserId: z.string().optional(),
  relatedContentId: z.string().optional(),
  relatedCommunicationId: z.string().optional(),
  severity: z.nativeEnum(SafeguardingConcernSeverity).optional(),
  anonymous: z.boolean().optional(),
});

/**
 * Schema for content moderation request
 */
const contentModerationSchema = z.object({
  content: z.string(),
  contentType: z.enum(['text', 'image_url']),
  userAge: z.number().optional(),
  contextId: z.string().optional(),
});

/**
 * Report a safeguarding concern
 * @param reporterId User ID reporting the concern
 * @param type Type of concern
 * @param description Description of the concern
 * @param relatedUserId Optional related user ID
 * @param relatedContentId Optional related content ID
 * @param relatedCommunicationId Optional related communication ID
 * @param severity Optional severity level
 * @param anonymous Whether the report should be anonymous
 * @returns Created concern record
 */
export async function reportSafeguardingConcern(
  reporterId: string,
  type: SafeguardingConcernType,
  description: string,
  relatedUserId?: string,
  relatedContentId?: string,
  relatedCommunicationId?: string,
  severity?: SafeguardingConcernSeverity,
  anonymous: boolean = false
): Promise<any> {
  // Determine initial severity if not provided
  if (!severity) {
    severity = await assessConcernSeverity(type, description);
  }
  
  // Create concern record
  const concern = await prisma.safeguardingConcern.create({
    data: {
      reporterId: anonymous ? undefined : reporterId,
      anonymousReport: anonymous,
      type,
      description,
      relatedUserId,
      relatedContentId,
      relatedCommunicationId,
      severity,
      status: SafeguardingConcernStatus.REPORTED,
      reportedAt: new Date(),
    },
  });
  
  // Log the concern for audit purposes
  await prisma.safeguardingLog.create({
    data: {
      concernId: concern.id,
      action: 'concern_reported',
      performedBy: reporterId,
      details: `Concern reported: ${type}`,
      timestamp: new Date(),
    },
  });
  
  // Notify safeguarding leads based on severity
  if (
    severity === SafeguardingConcernSeverity.HIGH ||
    severity === SafeguardingConcernSeverity.URGENT
  ) {
    await notifySafeguardingLeads(concern.id);
  }
  
  return {
    id: concern.id,
    type: concern.type,
    severity: concern.severity,
    status: concern.status,
    reportedAt: concern.reportedAt,
  };
}

/**
 * Assess the severity of a concern based on content analysis
 * @param type Concern type
 * @param description Concern description
 * @returns Assessed severity level
 */
async function assessConcernSeverity(
  type: SafeguardingConcernType,
  description: string
): Promise<SafeguardingConcernSeverity> {
  // Keywords indicating high severity
  const urgentKeywords = [
    'suicide',
    'self-harm',
    'abuse',
    'assault',
    'weapon',
    'threat',
    'danger',
    'emergency',
  ];
  
  const highKeywords = [
    'bullying',
    'harassment',
    'inappropriate',
    'explicit',
    'violent',
    'concerning',
    'distressing',
  ];
  
  // Check for urgent keywords
  for (const keyword of urgentKeywords) {
    if (description.toLowerCase().includes(keyword)) {
      return SafeguardingConcernSeverity.URGENT;
    }
  }
  
  // Check for high severity keywords
  for (const keyword of highKeywords) {
    if (description.toLowerCase().includes(keyword)) {
      return SafeguardingConcernSeverity.HIGH;
    }
  }
  
  // Default severity based on type
  switch (type) {
    case SafeguardingConcernType.DISCLOSURE:
      return SafeguardingConcernSeverity.HIGH;
    case SafeguardingConcernType.BULLYING:
      return SafeguardingConcernSeverity.MEDIUM;
    case SafeguardingConcernType.CONTENT:
      return SafeguardingConcernSeverity.MEDIUM;
    default:
      return SafeguardingConcernSeverity.LOW;
  }
}

/**
 * Notify safeguarding leads about a concern
 * @param concernId Concern ID
 */
async function notifySafeguardingLeads(concernId: string): Promise<void> {
  // Get safeguarding leads
  const safeguardingLeads = await prisma.user.findMany({
    where: {
      roles: {
        some: {
          name: 'safeguarding_lead',
        },
      },
    },
  });
  
  // Get concern details
  const concern = await prisma.safeguardingConcern.findUnique({
    where: { id: concernId },
  });
  
  if (!concern) {
    throw new Error('Concern not found');
  }
  
  // Create notifications for each lead
  for (const lead of safeguardingLeads) {
    await prisma.notification.create({
      data: {
        userId: lead.id,
        type: 'safeguarding_alert',
        title: `Safeguarding Alert: ${concern.severity} severity`,
        message: `A ${concern.severity} severity safeguarding concern has been reported. Please review urgently.`,
        link: `/admin/safeguarding/concerns/${concernId}`,
        read: false,
        createdAt: new Date(),
      },
    });
  }
  
  // Log notification
  await prisma.safeguardingLog.create({
    data: {
      concernId,
      action: 'leads_notified',
      details: `Notified ${safeguardingLeads.length} safeguarding leads`,
      timestamp: new Date(),
    },
  });
}

/**
 * Update the status of a safeguarding concern
 * @param concernId Concern ID
 * @param status New status
 * @param userId User ID making the update
 * @param notes Optional notes about the update
 * @returns Updated concern
 */
export async function updateSafeguardingConcernStatus(
  concernId: string,
  status: SafeguardingConcernStatus,
  userId: string,
  notes?: string
): Promise<any> {
  // Check if user has permission to update
  const userRoles = await prisma.userRole.findMany({
    where: {
      userId,
    },
  });
  
  const hasPermission = userRoles.some(
    (role) => role.name === 'safeguarding_lead' || role.name === 'admin'
  );
  
  if (!hasPermission) {
    throw new Error('Permission denied');
  }
  
  // Update concern status
  const updatedConcern = await prisma.safeguardingConcern.update({
    where: { id: concernId },
    data: {
      status,
      updatedAt: new Date(),
    },
  });
  
  // Log the status update
  await prisma.safeguardingLog.create({
    data: {
      concernId,
      action: 'status_updated',
      performedBy: userId,
      details: `Status updated to ${status}${notes ? `: ${notes}` : ''}`,
      timestamp: new Date(),
    },
  });
  
  return updatedConcern;
}

/**
 * Moderate content for age-appropriateness and safety
 * @param content Content to moderate
 * @param contentType Type of content
 * @param userAge Optional user age for age-appropriate filtering
 * @returns Moderation result
 */
export async function moderateContent(
  content: string,
  contentType: 'text' | 'image_url',
  userAge?: number
): Promise<ContentModerationResult> {
  // Initialize result
  const result: ContentModerationResult = {
    isAppropriate: true,
    flags: {
      profanity: false,
      harassment: false,
      violence: false,
      selfHarm: false,
      sexualContent: false,
      hateSpeech: false,
      personalInformation: false,
    },
    confidence: 1.0,
  };
  
  if (contentType === 'text') {
    // Check for profanity
    result.flags.profanity = checkForProfanity(content);
    
    // Check for harassment indicators
    result.flags.harassment = checkForHarassment(content);
    
    // Check for violence
    result.flags.violence = checkForViolence(content);
    
    // Check for self-harm indicators
    result.flags.selfHarm = checkForSelfHarm(content);
    
    // Check for sexual content
    result.flags.sexualContent = checkForSexualContent(content);
    
    // Check for hate speech
    result.flags.hateSpeech = checkForHateSpeech(content);
    
    // Check for personal information
    result.flags.personalInformation = checkForPersonalInformation(content);
    
    // Apply age-appropriate filtering if age is provided
    if (userAge !== undefined) {
      applyAgeAppropriateFiltering(result, userAge);
    }
    
    // Determine if content is appropriate based on flags
    result.isAppropriate = !Object.values(result.flags).some((flag) => flag);
    
    // If inappropriate, create moderated version
    if (!result.isAppropriate) {
      result.moderatedContent = createModeratedContent(content, result.flags);
    }
  } else if (contentType === 'image_url') {
    // For image moderation, we would typically call an external API
    // This is a placeholder for actual image moderation logic
    result.isAppropriate = true;
    result.confidence = 0.9;
  }
  
  return result;
}

/**
 * Check for profanity in content
 * @param content Content to check
 * @returns Whether profanity was detected
 */
function checkForProfanity(content: string): boolean {
  const profanityList = [
    // Common profanity words would be listed here
    // This is a simplified implementation
  ];
  
  const contentLower = content.toLowerCase();
  
  return profanityList.some((word) => contentLower.includes(word));
}

/**
 * Check for harassment indicators in content
 * @param content Content to check
 * @returns Whether harassment indicators were detected
 */
function checkForHarassment(content: string): boolean {
  const harassmentIndicators = [
    'stupid',
    'dumb',
    'idiot',
    'loser',
    'hate you',
    'ugly',
    'fat',
    'worthless',
  ];
  
  const contentLower = content.toLowerCase();
  
  return harassmentIndicators.some((indicator) => contentLower.includes(indicator));
}

/**
 * Check for violence in content
 * @param content Content to check
 * @returns Whether violence was detected
 */
function checkForViolence(content: string): boolean {
  const violenceIndicators = [
    'kill',
    'hurt',
    'punch',
    'attack',
    'fight',
    'weapon',
    'gun',
    'knife',
  ];
  
  const contentLower = content.toLowerCase();
  
  return violenceIndicators.some((indicator) => contentLower.includes(indicator));
}

/**
 * Check for self-harm indicators in content
 * @param content Content to check
 * @returns Whether self-harm indicators were detected
 */
function checkForSelfHarm(content: string): boolean {
  const selfHarmIndicators = [
    'suicide',
    'kill myself',
    'hurt myself',
    'self-harm',
    'cut myself',
    'end my life',
    'don\'t want to live',
  ];
  
  const contentLower = content.toLowerCase();
  
  return selfHarmIndicators.some((indicator) => contentLower.includes(indicator));
}

/**
 * Check for sexual content
 * @param content Content to check
 * @returns Whether sexual content was detected
 */
function checkForSexualContent(content: string): boolean {
  const sexualContentIndicators = [
    // Sexual content indicators would be listed here
    // This is a simplified implementation
  ];
  
  const contentLower = content.toLowerCase();
  
  return sexualContentIndicators.some((indicator) => contentLower.includes(indicator));
}

/**
 * Check for hate speech
 * @param content Content to check
 * @returns Whether hate speech was detected
 */
function checkForHateSpeech(content: string): boolean {
  const hateSpeechIndicators = [
    // Hate speech indicators would be listed here
    // This is a simplified implementation
  ];
  
  const contentLower = content.toLowerCase();
  
  return hateSpeechIndicators.some((indicator) => contentLower.includes(indicator));
}

/**
 * Check for personal information
 * @param content Content to check
 * @returns Whether personal information was detected
 */
function checkForPersonalInformation(content: string): boolean {
  // Check for email patterns
  const emailPattern = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  if (emailPattern.test(content)) {
    return true;
  }
  
  // Check for phone number patterns
  const phonePattern = /(\+\d{1,3}[\s-])?\(?\d{3,4}\)?[\s.-]?\d{3}[\s.-]?\d{4}/;
  if (phonePattern.test(content)) {
    return true;
  }
  
  // Check for address patterns
  const addressIndicators = ['street', 'avenue', 'road', 'lane', 'drive', 'boulevard', 'court'];
  const contentLower = content.toLowerCase();
  
  return addressIndicators.some((indicator) => contentLower.includes(indicator));
}

/**
 * Apply age-appropriate filtering based on user age
 * @param result Moderation result to update
 * @param userAge User age
 */
function applyAgeAppropriateFiltering(
  result: ContentModerationResult,
  userAge: number
): void {
  // Different standards based on age groups
  if (userAge < 7) {
    // EYFS and KS1 (ages 3-7): Very strict filtering
    result.flags.profanity = true; // Any profanity is inappropriate
    result.flags.violence = true; // Any violence is inappropriate
  } else if (userAge < 11) {
    // KS2 (ages 7-11): Moderate filtering
    // Keep existing flags, but could adjust thresholds
  } else if (userAge < 16) {
    // KS3-4 (ages 11-16): Age-appropriate filtering
    // Keep existing flags, but could adjust thresholds
  } else {
    // Post-16: Less restrictive filtering
    // Keep existing flags, but could adjust thresholds
  }
}

/**
 * Create a moderated version of content by replacing inappropriate parts
 * @param content Original content
 * @param flags Flags indicating which types of content to moderate
 * @returns Moderated content
 */
function createModeratedContent(
  content: string,
  flags: ContentModerationResult['flags']
): string {
  let moderatedContent = content;
  
  // Replace profanity
  if (flags.profanity) {
    const profanityList = [
      // Common profanity words would be listed here
      // This is a simplified implementation
    ];
    
    for (const word of profanityList) {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      moderatedContent = moderatedContent.replace(regex, '****');
    }
  }
  
  // Replace personal information
  if (flags.personalInformation) {
    // Replace email addresses
    moderatedContent = moderatedContent.replace(
      /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
      '[PERSONAL EMAIL REMOVED]'
    );
    
    // Replace phone numbers
    moderatedContent = moderatedContent.replace(
      /(\+\d{1,3}[\s-])?\(?\d{3,4}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,
      '[PHONE NUMBER REMOVED]'
    );
  }
  
  return moderatedContent;
}

/**
 * API route handler for reporting safeguarding concerns
 * @param req Request object
 * @returns API response
 */
export async function handleSafeguardingConcern(req: Request) {
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
    const validatedData = safeguardingConcernSchema.parse(body);
    
    // Report concern
    const result = await reportSafeguardingConcern(
      userId,
      validatedData.type,
      validatedData.description,
      validatedData.relatedUserId,
      validatedData.relatedContentId,
      validatedData.relatedCommunicationId,
      validatedData.severity,
      validatedData.anonymous
    );
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error reporting safeguarding concern:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to report concern' },
      { status: 500 }
    );
  }
}

/**
 * API route handler for content moderation
 * @param req Request object
 * @returns API response
 */
export async function handleContentModeration(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    // Validate request
    const validatedData = contentModerationSchema.parse(body);
    
    // Moderate content
    const result = await moderateContent(
      validatedData.content,
      validatedData.contentType,
      validatedData.userAge
    );
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error moderating content:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to moderate content' },
      { status: 500 }
    );
  }
}

/**
 * Age verification function
 * @param dateOfBirth Date of birth
 * @param minimumAge Minimum required age
 * @returns Whether age requirement is met
 */
export function verifyAge(dateOfBirth: Date, minimumAge: number): boolean {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  
  return age >= minimumAge;
}

/**
 * Get age-appropriate content settings based on user age
 * @param userAge User age
 * @returns Content settings
 */
export function getAgeAppropriateSettings(userAge: number): {
  contentLevel: string;
  restrictions: string[];
  allowedTopics: string[];
} {
  if (userAge < 7) {
    // EYFS and KS1 (ages 3-7)
    return {
      contentLevel: 'early_years',
      restrictions: [
        'profanity',
        'violence',
        'complex_themes',
        'scary_content',
        'romantic_content',
      ],
      allowedTopics: [
        'animals',
        'nature',
        'friendship',
        'family',
        'school',
        'basic_science',
        'arts_and_crafts',
      ],
    };
  } else if (userAge < 11) {
    // KS2 (ages 7-11)
    return {
      contentLevel: 'primary',
      restrictions: [
        'profanity',
        'violence',
        'romantic_content',
        'political_content',
      ],
      allowedTopics: [
        'animals',
        'nature',
        'friendship',
        'family',
        'school',
        'science',
        'history',
        'geography',
        'arts',
        'sports',
        'technology',
        'literature',
      ],
    };
  } else if (userAge < 14) {
    // KS3 (ages 11-14)
    return {
      contentLevel: 'lower_secondary',
      restrictions: [
        'explicit_content',
        'graphic_violence',
        'adult_themes',
      ],
      allowedTopics: [
        'science',
        'history',
        'geography',
        'arts',
        'sports',
        'technology',
        'literature',
        'social_issues',
        'current_events',
        'careers',
        'health',
      ],
    };
  } else if (userAge < 16) {
    // KS4 (ages 14-16)
    return {
      contentLevel: 'upper_secondary',
      restrictions: [
        'explicit_content',
        'graphic_violence',
      ],
      allowedTopics: [
        'science',
        'history',
        'geography',
        'arts',
        'sports',
        'technology',
        'literature',
        'social_issues',
        'current_events',
        'careers',
        'health',
        'politics',
        'economics',
        'philosophy',
      ],
    };
  } else {
    // Post-16
    return {
      contentLevel: 'post_16',
      restrictions: [
        'illegal_content',
      ],
      allowedTopics: [
        'science',
        'history',
        'geography',
        'arts',
        'sports',
        'technology',
        'literature',
        'social_issues',
        'current_events',
        'careers',
        'health',
        'politics',
        'economics',
        'philosophy',
        'higher_education',
        'adult_life_skills',
      ],
    };
  }
}

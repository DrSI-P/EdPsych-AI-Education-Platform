/**
 * Special Needs Support Module for EdPsych AI Education Platform
 * 
 * This module provides comprehensive support for students with special educational needs,
 * including personalized interventions, progress tracking, and resource recommendations.
 * It follows UK educational standards and best practices for inclusive education.
 */

import { prisma } from '@/lib/db';
import { logger, logSafeguardingEvent } from '@/lib/logging';
import { sanitizeLogData } from '@/lib/logging';
import { validateUKEducationalStandards } from '@/lib/uk-standards';
import { z } from 'zod';

// Special needs categories based on UK SEND Code of Practice
export enum SpecialNeedsCategory {
  COGNITION_LEARNING = 'cognition_learning',
  COMMUNICATION_INTERACTION = 'communication_interaction',
  SOCIAL_EMOTIONAL_MENTAL_HEALTH = 'social_emotional_mental_health',
  SENSORY_PHYSICAL = 'sensory_physical',
}

// Intervention types
export enum InterventionType {
  ACADEMIC = 'academic',
  BEHAVIORAL = 'behavioral',
  SOCIAL = 'social',
  EMOTIONAL = 'emotional',
  PHYSICAL = 'physical',
  COMMUNICATION = 'communication',
}

// Intervention frequency
export enum InterventionFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  FORTNIGHTLY = 'fortnightly',
  MONTHLY = 'monthly',
  TERMLY = 'termly',
}

// Intervention status
export enum InterventionStatus {
  PLANNED = 'planned',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISCONTINUED = 'discontinued',
}

// Special needs profile schema
export const SpecialNeedsProfileSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  categories: z.array(z.nativeEnum(SpecialNeedsCategory)),
  description: z.string(),
  accommodations: z.array(z.string()),
  externalSupport: z.array(z.string()).optional(),
  documents: z.array(z.string()).optional(),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type SpecialNeedsProfile = z.infer<typeof SpecialNeedsProfileSchema>;

// Intervention plan schema
export const InterventionPlanSchema = z.object({
  id: z.string().optional(),
  studentId: z.string(),
  profileId: z.string(),
  type: z.nativeEnum(InterventionType),
  title: z.string(),
  description: z.string(),
  goals: z.array(z.string()),
  strategies: z.array(z.string()),
  resources: z.array(z.string()).optional(),
  frequency: z.nativeEnum(InterventionFrequency),
  duration: z.number(), // in weeks
  status: z.nativeEnum(InterventionStatus),
  startDate: z.date(),
  endDate: z.date().optional(),
  assignedStaff: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type InterventionPlan = z.infer<typeof InterventionPlanSchema>;

// Progress record schema
export const ProgressRecordSchema = z.object({
  id: z.string().optional(),
  interventionId: z.string(),
  date: z.date(),
  rating: z.number().min(1).max(5),
  observations: z.string(),
  nextSteps: z.string().optional(),
  createdBy: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ProgressRecord = z.infer<typeof ProgressRecordSchema>;

/**
 * Creates or updates a special needs profile for a student
 * @param profile Special needs profile data
 * @returns Created or updated profile
 */
export async function createOrUpdateSpecialNeedsProfile(
  profile: SpecialNeedsProfile
): Promise<SpecialNeedsProfile> {
  try {
    logger.info('Creating or updating special needs profile', {
      studentId: profile.studentId,
      categories: profile.categories,
    });

    // Validate profile data
    const validatedProfile = SpecialNeedsProfileSchema.parse(profile);

    // Check if profile exists
    const existingProfile = validatedProfile.id
      ? await prisma.specialNeedsProfile.findUnique({
          where: { id: validatedProfile.id },
        })
      : await prisma.specialNeedsProfile.findFirst({
          where: { studentId: validatedProfile.studentId },
        });

    // Create or update profile
    const result = existingProfile
      ? await prisma.specialNeedsProfile.update({
          where: { id: existingProfile.id },
          data: {
            categories: validatedProfile.categories,
            description: validatedProfile.description,
            accommodations: validatedProfile.accommodations,
            externalSupport: validatedProfile.externalSupport || [],
            documents: validatedProfile.documents || [],
            notes: validatedProfile.notes || '',
          },
        })
      : await prisma.specialNeedsProfile.create({
          data: {
            studentId: validatedProfile.studentId,
            categories: validatedProfile.categories,
            description: validatedProfile.description,
            accommodations: validatedProfile.accommodations,
            externalSupport: validatedProfile.externalSupport || [],
            documents: validatedProfile.documents || [],
            notes: validatedProfile.notes || '',
          },
        });

    // Log safeguarding event for audit trail
    logSafeguardingEvent('info', 'Special needs profile created or updated', {
      studentId: validatedProfile.studentId,
      profileId: result.id,
      action: existingProfile ? 'updated' : 'created',
    });

    return result;
  } catch (error) {
    logger.error('Failed to create or update special needs profile', {
      error: sanitizeLogData(error),
      studentId: profile.studentId,
    });
    throw new Error(`Failed to create or update special needs profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets a special needs profile by ID
 * @param profileId Profile ID
 * @returns Special needs profile
 */
export async function getSpecialNeedsProfile(
  profileId: string
): Promise<SpecialNeedsProfile> {
  try {
    logger.info('Getting special needs profile', { profileId });

    const profile = await prisma.specialNeedsProfile.findUnique({
      where: { id: profileId },
    });

    if (!profile) {
      throw new Error(`Special needs profile not found: ${profileId}`);
    }

    return profile;
  } catch (error) {
    logger.error('Failed to get special needs profile', {
      error: sanitizeLogData(error),
      profileId,
    });
    throw new Error(`Failed to get special needs profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets a student's special needs profile
 * @param studentId Student ID
 * @returns Special needs profile
 */
export async function getStudentSpecialNeedsProfile(
  studentId: string
): Promise<SpecialNeedsProfile | null> {
  try {
    logger.info('Getting student special needs profile', { studentId });

    const profile = await prisma.specialNeedsProfile.findFirst({
      where: { studentId },
    });

    return profile;
  } catch (error) {
    logger.error('Failed to get student special needs profile', {
      error: sanitizeLogData(error),
      studentId,
    });
    throw new Error(`Failed to get student special needs profile: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Creates an intervention plan for a student
 * @param plan Intervention plan data
 * @returns Created intervention plan
 */
export async function createInterventionPlan(
  plan: InterventionPlan
): Promise<InterventionPlan> {
  try {
    logger.info('Creating intervention plan', {
      studentId: plan.studentId,
      type: plan.type,
      title: plan.title,
    });

    // Validate plan data
    const validatedPlan = InterventionPlanSchema.parse(plan);

    // Create intervention plan
    const result = await prisma.interventionPlan.create({
      data: {
        studentId: validatedPlan.studentId,
        profileId: validatedPlan.profileId,
        type: validatedPlan.type,
        title: validatedPlan.title,
        description: validatedPlan.description,
        goals: validatedPlan.goals,
        strategies: validatedPlan.strategies,
        resources: validatedPlan.resources || [],
        frequency: validatedPlan.frequency,
        duration: validatedPlan.duration,
        status: validatedPlan.status,
        startDate: validatedPlan.startDate,
        endDate: validatedPlan.endDate,
        assignedStaff: validatedPlan.assignedStaff,
        notes: validatedPlan.notes || '',
      },
    });

    // Log safeguarding event for audit trail
    logSafeguardingEvent('info', 'Intervention plan created', {
      studentId: validatedPlan.studentId,
      planId: result.id,
      type: validatedPlan.type,
    });

    return result;
  } catch (error) {
    logger.error('Failed to create intervention plan', {
      error: sanitizeLogData(error),
      studentId: plan.studentId,
    });
    throw new Error(`Failed to create intervention plan: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Updates an intervention plan
 * @param planId Plan ID
 * @param plan Updated intervention plan data
 * @returns Updated intervention plan
 */
export async function updateInterventionPlan(
  planId: string,
  plan: Partial<InterventionPlan>
): Promise<InterventionPlan> {
  try {
    logger.info('Updating intervention plan', { planId });

    // Get existing plan
    const existingPlan = await prisma.interventionPlan.findUnique({
      where: { id: planId },
    });

    if (!existingPlan) {
      throw new Error(`Intervention plan not found: ${planId}`);
    }

    // Update intervention plan
    const result = await prisma.interventionPlan.update({
      where: { id: planId },
      data: {
        type: plan.type || existingPlan.type,
        title: plan.title || existingPlan.title,
        description: plan.description || existingPlan.description,
        goals: plan.goals || existingPlan.goals,
        strategies: plan.strategies || existingPlan.strategies,
        resources: plan.resources || existingPlan.resources,
        frequency: plan.frequency || existingPlan.frequency,
        duration: plan.duration || existingPlan.duration,
        status: plan.status || existingPlan.status,
        startDate: plan.startDate || existingPlan.startDate,
        endDate: plan.endDate || existingPlan.endDate,
        assignedStaff: plan.assignedStaff || existingPlan.assignedStaff,
        notes: plan.notes || existingPlan.notes,
      },
    });

    // Log safeguarding event for audit trail
    logSafeguardingEvent('info', 'Intervention plan updated', {
      planId,
      studentId: existingPlan.studentId,
    });

    return result;
  } catch (error) {
    logger.error('Failed to update intervention plan', {
      error: sanitizeLogData(error),
      planId,
    });
    throw new Error(`Failed to update intervention plan: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets an intervention plan by ID
 * @param planId Plan ID
 * @returns Intervention plan
 */
export async function getInterventionPlan(
  planId: string
): Promise<InterventionPlan> {
  try {
    logger.info('Getting intervention plan', { planId });

    const plan = await prisma.interventionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      throw new Error(`Intervention plan not found: ${planId}`);
    }

    return plan;
  } catch (error) {
    logger.error('Failed to get intervention plan', {
      error: sanitizeLogData(error),
      planId,
    });
    throw new Error(`Failed to get intervention plan: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets all intervention plans for a student
 * @param studentId Student ID
 * @returns List of intervention plans
 */
export async function getStudentInterventionPlans(
  studentId: string
): Promise<InterventionPlan[]> {
  try {
    logger.info('Getting student intervention plans', { studentId });

    const plans = await prisma.interventionPlan.findMany({
      where: { studentId },
      orderBy: { startDate: 'desc' },
    });

    return plans;
  } catch (error) {
    logger.error('Failed to get student intervention plans', {
      error: sanitizeLogData(error),
      studentId,
    });
    throw new Error(`Failed to get student intervention plans: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Records progress for an intervention
 * @param record Progress record data
 * @returns Created progress record
 */
export async function recordInterventionProgress(
  record: ProgressRecord
): Promise<ProgressRecord> {
  try {
    logger.info('Recording intervention progress', {
      interventionId: record.interventionId,
      date: record.date,
    });

    // Validate record data
    const validatedRecord = ProgressRecordSchema.parse(record);

    // Create progress record
    const result = await prisma.progressRecord.create({
      data: {
        interventionId: validatedRecord.interventionId,
        date: validatedRecord.date,
        rating: validatedRecord.rating,
        observations: validatedRecord.observations,
        nextSteps: validatedRecord.nextSteps || '',
        createdBy: validatedRecord.createdBy,
      },
    });

    // Get intervention plan for logging
    const plan = await prisma.interventionPlan.findUnique({
      where: { id: validatedRecord.interventionId },
    });

    // Log safeguarding event for audit trail
    if (plan) {
      logSafeguardingEvent('info', 'Intervention progress recorded', {
        interventionId: validatedRecord.interventionId,
        studentId: plan.studentId,
        recordId: result.id,
      });
    }

    return result;
  } catch (error) {
    logger.error('Failed to record intervention progress', {
      error: sanitizeLogData(error),
      interventionId: record.interventionId,
    });
    throw new Error(`Failed to record intervention progress: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Gets progress records for an intervention
 * @param interventionId Intervention ID
 * @returns List of progress records
 */
export async function getInterventionProgressRecords(
  interventionId: string
): Promise<ProgressRecord[]> {
  try {
    logger.info('Getting intervention progress records', { interventionId });

    const records = await prisma.progressRecord.findMany({
      where: { interventionId },
      orderBy: { date: 'desc' },
    });

    return records;
  } catch (error) {
    logger.error('Failed to get intervention progress records', {
      error: sanitizeLogData(error),
      interventionId,
    });
    throw new Error(`Failed to get intervention progress records: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Analyzes intervention effectiveness
 * @param interventionId Intervention ID
 * @returns Effectiveness analysis
 */
export async function analyzeInterventionEffectiveness(
  interventionId: string
): Promise<{
  effectiveness: number;
  trend: 'improving' | 'stable' | 'declining';
  recommendations: string[];
}> {
  try {
    logger.info('Analyzing intervention effectiveness', { interventionId });

    // Get intervention plan
    const plan = await getInterventionPlan(interventionId);

    // Get progress records
    const records = await getInterventionProgressRecords(interventionId);

    if (records.length === 0) {
      return {
        effectiveness: 0,
        trend: 'stable',
        recommendations: [
          'No progress records available. Add progress records to analyze effectiveness.',
        ],
      };
    }

    // Calculate average rating
    const averageRating =
      records.reduce((sum, record) => sum + record.rating, 0) / records.length;

    // Determine trend
    let trend: 'improving' | 'stable' | 'declining' = 'stable';
    if (records.length >= 3) {
      const recentRecords = records.slice(0, 3);
      const oldestRating = recentRecords[2].rating;
      const middleRating = recentRecords[1].rating;
      const newestRating = recentRecords[0].rating;

      if (newestRating > middleRating && middleRating >= oldestRating) {
        trend = 'improving';
      } else if (newestRating < middleRating && middleRating <= oldestRating) {
        trend = 'declining';
      }
    }

    // Generate recommendations
    const recommendations: string[] = [];

    if (trend === 'improving') {
      recommendations.push(
        'Intervention is showing positive results. Continue with current strategies.'
      );
    } else if (trend === 'stable') {
      recommendations.push(
        'Intervention is showing stable results. Consider adjusting strategies for better outcomes.'
      );
    } else {
      recommendations.push(
        'Intervention effectiveness is declining. Review and revise strategies.'
      );
    }

    // Add specific recommendations based on intervention type
    switch (plan.type) {
      case InterventionType.ACADEMIC:
        recommendations.push(
          'Consider adjusting the difficulty level of academic tasks.'
        );
        break;
      case InterventionType.BEHAVIORAL:
        recommendations.push(
          'Review behavioral triggers and adjust environmental factors.'
        );
        break;
      case InterventionType.SOCIAL:
        recommendations.push(
          'Consider incorporating more peer-mediated activities.'
        );
        break;
      case InterventionType.EMOTIONAL:
        recommendations.push(
          'Review emotional regulation strategies and support systems.'
        );
        break;
      case InterventionType.PHYSICAL:
        recommendations.push(
          'Consult with occupational therapist for adjustments to physical supports.'
        );
        break;
      case InterventionType.COMMUNICATION:
        recommendations.push(
          'Review communication strategies and consider additional visual supports.'
        );
        break;
    }

    return {
      effectiveness: averageRating / 5, // Normalize to 0-1 scale
      trend,
      recommendations,
    };
  } catch (error) {
    logger.error('Failed to analyze intervention effectiveness', {
      error: sanitizeLogData(error),
      interventionId,
    });
    throw new Error(`Failed to analyze intervention effectiveness: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generates resource recommendations for a special needs profile
 * @param profileId Profile ID
 * @returns List of recommended resources
 */
export async function generateResourceRecommendations(
  profileId: string
): Promise<{
  resources: {
    title: string;
    description: string;
    type: 'activity' | 'material' | 'strategy' | 'technology';
    url?: string;
  }[];
}> {
  try {
    logger.info('Generating resource recommendations', { profileId });

    // Get special needs profile
    const profile = await getSpecialNeedsProfile(profileId);

    // Generate recommendations based on categories
    const recommendations: {
      title: string;
      description: string;
      type: 'activity' | 'material' | 'strategy' | 'technology';
      url?: string;
    }[] = [];

    // Add recommendations for each category
    for (const category of profile.categories) {
      switch (category) {
        case SpecialNeedsCategory.COGNITION_LEARNING:
          recommendations.push(
            {
              title: 'Visual Timetables',
              description:
                'Visual schedules to help students understand and follow daily routines.',
              type: 'strategy',
            },
            {
              title: 'Coloured Overlays',
              description:
                'Transparent coloured sheets to place over text to reduce visual stress.',
              type: 'material',
            },
            {
              title: 'Text-to-Speech Software',
              description:
                'Software that converts text to spoken words to support reading.',
              type: 'technology',
              url: 'https://www.texthelp.com/products/read-and-write/',
            }
          );
          break;
        case SpecialNeedsCategory.COMMUNICATION_INTERACTION:
          recommendations.push(
            {
              title: 'Social Stories',
              description:
                'Short descriptions of social situations to help understand social cues and expectations.',
              type: 'strategy',
            },
            {
              title: 'Communication Cards',
              description:
                'Visual cards to support non-verbal communication and expression.',
              type: 'material',
            },
            {
              title: 'AAC Apps',
              description:
                'Augmentative and Alternative Communication apps to support communication.',
              type: 'technology',
              url: 'https://www.callscotland.org.uk/downloads/posters-and-leaflets/ipad-apps-for-complex-communication-support-needs/',
            }
          );
          break;
        case SpecialNeedsCategory.SOCIAL_EMOTIONAL_MENTAL_HEALTH:
          recommendations.push(
            {
              title: 'Emotion Regulation Activities',
              description:
                'Activities to help students identify and manage emotions.',
              type: 'activity',
            },
            {
              title: 'Calm Down Kit',
              description:
                'Collection of sensory items to help with emotional regulation.',
              type: 'material',
            },
            {
              title: 'Mindfulness Apps',
              description:
                'Apps that guide students through mindfulness exercises.',
              type: 'technology',
              url: 'https://www.nhs.uk/apps-library/category/mental-health/',
            }
          );
          break;
        case SpecialNeedsCategory.SENSORY_PHYSICAL:
          recommendations.push(
            {
              title: 'Sensory Breaks',
              description:
                'Scheduled breaks with sensory activities to help with regulation.',
              type: 'activity',
            },
            {
              title: 'Fidget Tools',
              description:
                'Small objects that provide sensory input to help with focus.',
              type: 'material',
            },
            {
              title: 'Adaptive Equipment',
              description:
                'Specialized equipment to support physical needs and access.',
              type: 'technology',
            }
          );
          break;
      }
    }

    // Validate recommendations against UK educational standards
    const validatedRecommendations = recommendations.filter(recommendation =>
      validateUKEducationalStandards(recommendation.title, 'resource')
    );

    return { resources: validatedRecommendations };
  } catch (error) {
    logger.error('Failed to generate resource recommendations', {
      error: sanitizeLogData(error),
      profileId,
    });
    throw new Error(`Failed to generate resource recommendations: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generates an Individual Education Plan (IEP) for a student
 * @param studentId Student ID
 * @param profileId Profile ID
 * @returns Generated IEP
 */
export async function generateIndividualEducationPlan(
  studentId: string,
  profileId: string
): Promise<{
  studentId: string;
  profileId: string;
  targets: {
    area: string;
    description: string;
    success_criteria: string[];
    strategies: string[];
    resources: string[];
    responsible: string[];
    review_date: Date;
  }[];
  accommodations: string[];
  review_date: Date;
}> {
  try {
    logger.info('Generating Individual Education Plan', {
      studentId,
      profileId,
    });

    // Get student data
    const student = await prisma.user.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      throw new Error(`Student not found: ${studentId}`);
    }

    // Get special needs profile
    const profile = await getSpecialNeedsProfile(profileId);

    // Generate IEP
    const iep = {
      studentId,
      profileId,
      targets: [] as {
        area: string;
        description: string;
        success_criteria: string[];
        strategies: string[];
        resources: string[];
        responsible: string[];
        review_date: Date;
      }[],
      accommodations: profile.accommodations,
      review_date: new Date(Date.now() + 12 * 7 * 24 * 60 * 60 * 1000), // 12 weeks from now
    };

    // Generate targets based on categories
    for (const category of profile.categories) {
      switch (category) {
        case SpecialNeedsCategory.COGNITION_LEARNING:
          iep.targets.push({
            area: 'Literacy',
            description: 'Improve reading comprehension',
            success_criteria: [
              'Can identify main ideas in a text',
              'Can answer questions about a text',
              'Can summarize a text in own words',
            ],
            strategies: [
              'Pre-teach vocabulary',
              'Use visual supports',
              'Chunk text into smaller sections',
            ],
            resources: [
              'Visual reading guides',
              'Graphic organizers',
              'Text-to-speech software',
            ],
            responsible: ['Class Teacher', 'Teaching Assistant', 'SENCO'],
            review_date: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks from now
          });
          break;
        case SpecialNeedsCategory.COMMUNICATION_INTERACTION:
          iep.targets.push({
            area: 'Communication',
            description: 'Develop turn-taking skills in conversations',
            success_criteria: [
              'Waits for others to finish speaking before responding',
              'Responds appropriately to questions',
              'Maintains topic of conversation for 3-4 exchanges',
            ],
            strategies: [
              'Use visual cues for turn-taking',
              'Role-play conversations',
              'Provide specific praise for successful turn-taking',
            ],
            resources: [
              'Conversation cue cards',
              'Timer for turn-taking',
              'Social stories about conversations',
            ],
            responsible: ['Speech and Language Therapist', 'Class Teacher', 'Parents'],
            review_date: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks from now
          });
          break;
        case SpecialNeedsCategory.SOCIAL_EMOTIONAL_MENTAL_HEALTH:
          iep.targets.push({
            area: 'Emotional Regulation',
            description: 'Develop strategies to manage frustration',
            success_criteria: [
              'Recognizes signs of frustration',
              'Uses calming strategies when frustrated',
              'Returns to tasks after using calming strategies',
            ],
            strategies: [
              'Teach emotional vocabulary',
              'Create a calm down plan',
              'Use visual emotion scale',
            ],
            resources: [
              'Emotion cards',
              'Calm down kit',
              'Mindfulness activities',
            ],
            responsible: ['Class Teacher', 'School Counselor', 'Parents'],
            review_date: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks from now
          });
          break;
        case SpecialNeedsCategory.SENSORY_PHYSICAL:
          iep.targets.push({
            area: 'Fine Motor Skills',
            description: 'Improve handwriting legibility',
            success_criteria: [
              'Forms letters with correct size and spacing',
              'Writes on the line consistently',
              'Maintains appropriate pencil grip',
            ],
            strategies: [
              'Provide handwriting guides',
              'Use specialized pencil grips',
              'Schedule regular fine motor activities',
            ],
            resources: [
              'Pencil grips',
              'Handwriting guides',
              'Fine motor activity kit',
            ],
            responsible: ['Class Teacher', 'Occupational Therapist', 'Parents'],
            review_date: new Date(Date.now() + 6 * 7 * 24 * 60 * 60 * 1000), // 6 weeks from now
          });
          break;
      }
    }

    // Log safeguarding event for audit trail
    logSafeguardingEvent('info', 'Individual Education Plan generated', {
      studentId,
      profileId,
    });

    return iep;
  } catch (error) {
    logger.error('Failed to generate Individual Education Plan', {
      error: sanitizeLogData(error),
      studentId,
      profileId,
    });
    throw new Error(`Failed to generate Individual Education Plan: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export default {
  createOrUpdateSpecialNeedsProfile,
  getSpecialNeedsProfile,
  getStudentSpecialNeedsProfile,
  createInterventionPlan,
  updateInterventionPlan,
  getInterventionPlan,
  getStudentInterventionPlans,
  recordInterventionProgress,
  getInterventionProgressRecords,
  analyzeInterventionEffectiveness,
  generateResourceRecommendations,
  generateIndividualEducationPlan,
};

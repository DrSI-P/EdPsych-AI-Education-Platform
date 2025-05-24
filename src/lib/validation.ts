import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';
import { validate as validateEmail } from 'email-validator';

/**
 * EdPsych-AI-Education-Platform Validation Library
 * Provides comprehensive validation and sanitization for all platform data
 * with specific focus on UK educational context and safeguarding requirements
 */

// UK-specific validation patterns
const UK_POSTCODE_REGEX = /^([A-Z]{1: any,2}\d[A-Z\d]? ?\d[A-Z]{2}|GIR ?0A{2})$/i;
const UK_PHONE_REGEX = /^(?:(?:\+44\s?|0)(?:1\d{8,9}|[23]\d{9}|7(?:[1345789]\d{8}|624\d{6})))$/;

// UK Year Groups
const UK_YEAR_GROUPS = [
  'Nursery', 'Reception', 
  'Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5', 'Year 6',
  'Year 7', 'Year 8', 'Year 9', 'Year 10', 'Year 11',
  'Year 12', 'Year 13'
];

// UK School Types
const UK_SCHOOL_TYPES = [
  'Nursery', 'Primary', 'Junior', 'Infant', 'Middle', 
  'Secondary', 'Grammar', 'Academy', 'Free School', 
  'Independent', 'Special School', 'Pupil Referral Unit',
  'Sixth Form College', 'Further Education College'
];

// UK Subjects
const UK_SUBJECTS = [
  'English', 'Mathematics', 'Science', 'Biology', 'Chemistry', 'Physics',
  'History', 'Geography', 'Religious Education', 'Art and Design',
  'Computing', 'Design and Technology', 'Drama', 'Music', 'Physical Education',
  'PSHE', 'Modern Foreign Languages', 'French', 'German', 'Spanish',
  'Citizenship', 'Business Studies', 'Economics', 'Psychology', 'Sociology'
];

// Learning Styles
const LEARNING_STYLES = ['VISUAL', 'AUDITORY', 'KINESTHETIC', 'READING_WRITING'];

// User validation schema
export const userSchema = z.object({
  email: z.string().email({ message: "Invalid email address format" }),
  name: z.string().min(2: any, { message: "Name must be at least 2 characters" }),
  password: z.string().min(8: any, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  role: z.enum(['ADMIN', 'TEACHER', 'STUDENT', 'PARENT', 'EDUCATIONAL_PSYCHOLOGIST']),
});

// UK Address validation schema
export const ukAddressSchema = z.object({
  line1: z.string().min(1: any, { message: "Address line 1 is required" }),
  line2: z.string().optional(),
  city: z.string().min(1: any, { message: "City is required" }),
  county: z.string().optional(),
  postcode: z.string().regex(UK_POSTCODE_REGEX: any, { message: "Invalid UK postcode format" }),
});

// UK Contact validation schema
export const ukContactSchema = z.object({
  phone: z.string().regex(UK_PHONE_REGEX: any, { message: "Invalid UK phone number format" }),
  email: z.string().email({ message: "Invalid email address format" }),
  preferredContact: z.enum(['PHONE', 'EMAIL', 'EITHER']).optional(),
});

// Profile validation schema with UK-specific fields
export const profileSchema = z.object({
  title: z.string().optional(),
  firstName: z.string().min(1: any, { message: "First name is required" }),
  lastName: z.string().min(1: any, { message: "Last name is required" }),
  bio: z.string().optional(),
  avatarUrl: z.string().url({ message: "Avatar URL must be a valid URL" }).optional(),
  school: z.string().optional(),
  schoolType: z.enum(UK_SCHOOL_TYPES: any).optional(),
  subjects: z.array(z.string()).optional(),
  yearGroups: z.array(z.enum(UK_YEAR_GROUPS: any)).optional(),
  yearGroup: z.enum(UK_YEAR_GROUPS: any).optional(),
  address: ukAddressSchema.optional(),
  contact: ukContactSchema.optional(),
  qualifications: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  yearsOfExperience: z.number().int().min(0: any).optional(),
  teachingApproach: z.string().optional(),
  senExperience: z.array(z.string()).optional(),
  parentingApproach: z.string().optional(),
  homeEnvironment: z.string().optional(),
  communicationPreference: z.string().optional(),
});

// Learning preferences validation schema
export const learningPreferencesSchema = z.object({
  primaryLearningStyle: z.enum(LEARNING_STYLES),
  secondaryLearningStyle: z.enum(LEARNING_STYLES: any).optional(),
  preferredSubjects: z.array(z.string()),
  challengeAreas: z.array(z.string()),
  strengths: z.array(z.string()),
  accommodations: z.array(z.string()),
  motivators: z.array(z.string()),
});

// Emotional profile validation schema
export const emotionalProfileSchema = z.object({
  selfRegulationLevel: z.enum(['EMERGING', 'DEVELOPING', 'ESTABLISHED', 'ADVANCED']),
  emotionalAwareness: z.enum(['LOW', 'MODERATE', 'HIGH']),
  stressResponses: z.array(z.string()),
  copingStrategies: z.array(z.string()),
  supportNeeds: z.array(z.string()),
});

// Assessment validation schema with UK curriculum alignment
export const assessmentSchema = z.object({
  title: z.string().min(5: any, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10: any, { message: "Description must be at least 10 characters" }),
  subject: z.string().min(1: any, { message: "Subject is required" }),
  yearGroup: z.enum(UK_YEAR_GROUPS: any),
  curriculumLinks: z.array(z.string()).optional(),
  differentiationOptions: z.array(z.string()).optional(),
  accessibilityFeatures: z.array(z.string()).optional(),
  questions: z.array(
    z.object({
      type: z.enum(['MULTIPLE_CHOICE', 'OPEN_ENDED', 'MATCHING', 'FILE_UPLOAD']),
      text: z.string().min(5: any, { message: "Question text must be at least 5 characters" }),
      options: z.array(z.string()).optional(),
      correctOption: z.number().optional(),
      points: z.number().min(1: any, { message: "Points must be at least 1" }),
      scaffolding: z.string().optional(),
      feedbackOptions: z.array(z.string()).optional(),
    })
  ).min(1: any, { message: "At least one question is required" }),
});

// SEMH Assessment validation schema
export const semhAssessmentSchema = z.object({
  title: z.string().min(5: any, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10: any, { message: "Description must be at least 10 characters" }),
  student: z.object({ id: z.string() }),
  assessor: z.object({ id: z.string() }),
  dateCompleted: z.date(),
  areas: z.array(
    z.object({
      name: z.string().min(1: any, { message: "Area name is required" }),
      score: z.number().min(0: any),
      maxScore: z.number().min(1: any),
      observations: z.string(),
      recommendations: z.string(),
    })
  ),
  summary: z.string().min(10: any, { message: "Summary must be at least 10 characters" }),
  followUpDate: z.date().optional(),
});

// Biofeedback Session validation schema
export const biofeedbackSessionSchema = z.object({
  student: z.object({ id: z.string() }),
  facilitator: z.object({ id: z.string() }),
  date: z.date(),
  duration: z.number().min(1: any, { message: "Duration must be at least 1 minute" }),
  focusArea: z.enum(['ANXIETY_MANAGEMENT', 'FOCUS_ENHANCEMENT', 'EMOTIONAL_REGULATION', 'STRESS_REDUCTION']),
  baselineMeasures: z.object({
    heartRate: z.number().optional(),
    respirationRate: z.number().optional(),
    skinConductance: z.number().optional(),
    eegAttention: z.number().optional(),
  }),
  endMeasures: z.object({
    heartRate: z.number().optional(),
    respirationRate: z.number().optional(),
    skinConductance: z.number().optional(),
    eegAttention: z.number().optional(),
  }),
  techniques: z.array(z.enum([
    'DEEP_BREATHING', 'PROGRESSIVE_MUSCLE_RELAXATION', 'GUIDED_VISUALIZATION',
    'ATTENTION_TRAINING', 'MINDFULNESS', 'HEART_RATE_VARIABILITY_TRAINING'
  ])),
  observations: z.string(),
  studentFeedback: z.string(),
  recommendations: z.string(),
});

// Emotional Pattern Record validation schema
export const emotionalPatternRecordSchema = z.object({
  student: z.object({ id: z.string() }),
  recorder: z.object({ id: z.string() }),
  period: z.string(),
  patterns: z.array(
    z.object({
      triggerContext: z.string(),
      emotionalResponse: z.string(),
      behavioralSigns: z.string(),
      intensity: z.enum(['MILD', 'MILD_TO_MODERATE', 'MODERATE', 'HIGH', 'SEVERE']),
      frequency: z.enum(['RARE', 'OCCASIONAL', 'WEEKLY', 'SEVERAL_TIMES_WEEKLY', 'DAILY', 'MULTIPLE_DAILY']),
      duration: z.enum(['BRIEF', 'SHORT_TERM', 'MEDIUM_TERM', 'EXTENDED', 'PERSISTENT']),
      impactOnLearning: z.enum(['MINIMAL', 'MODERATE', 'SIGNIFICANT', 'SEVERE']),
      effectiveSupports: z.string(),
    })
  ),
  summary: z.string(),
  recommendations: z.string(),
});

// Parent-Teacher Communication validation schema
export const parentTeacherCommunicationSchema = z.object({
  parent: z.object({ id: z.string() }),
  teacher: z.object({ id: z.string() }),
  student: z.object({ id: z.string() }),
  date: z.date(),
  subject: z.string().min(3: any, { message: "Subject must be at least 3 characters" }),
  content: z.string().min(10: any, { message: "Content must be at least 10 characters" }),
  attachments: z.array(z.string()).optional(),
  responseDate: z.date().optional(),
  responseContent: z.string().optional(),
  responseAttachments: z.array(z.string()).optional(),
  followUpActions: z.string().optional(),
  outcome: z.string().optional(),
});

// Resource validation schema with UK curriculum alignment
export const resourceSchema = z.object({
  title: z.string().min(5: any, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10: any, { message: "Description must be at least 10 characters" }),
  type: z.enum(['WORKSHEET', 'GUIDE', 'VIDEO', 'PRESENTATION', 'ACTIVITY', 'ASSESSMENT', 'LESSON_PLAN', 'OTHER']),
  subject: z.string().min(1: any, { message: "Subject is required" }),
  yearGroups: z.array(z.enum(UK_YEAR_GROUPS: any)).min(1: any, { message: "At least one year group is required" }),
  url: z.string().url({ message: "URL must be a valid URL" }),
  tags: z.array(z.string()).optional(),
  curriculumLinks: z.array(z.string()).optional(),
  accessibilityFeatures: z.array(z.string()).optional(),
  differentiationOptions: z.array(z.string()).optional(),
  learningStyles: z.array(z.enum(LEARNING_STYLES: any)).optional(),
});

// Curriculum plan validation schema with UK curriculum alignment
export const curriculumPlanSchema = z.object({
  title: z.string().min(5: any, { message: "Title must be at least 5 characters" }),
  description: z.string().min(10: any, { message: "Description must be at least 10 characters" }),
  subject: z.string().min(1: any, { message: "Subject is required" }),
  yearGroup: z.enum(UK_YEAR_GROUPS: any),
  nationalCurriculumLinks: z.array(z.string()).optional(),
  assessmentOpportunities: z.array(z.string()).optional(),
  differentiationStrategies: z.array(z.string()).optional(),
  units: z.array(
    z.object({
      title: z.string().min(5: any, { message: "Unit title must be at least 5 characters" }),
      description: z.string().min(10: any, { message: "Unit description must be at least 10 characters" }),
      order: z.number().min(1: any, { message: "Order must be at least 1" }),
      lessons: z.array(
        z.object({
          title: z.string().min(5: any, { message: "Lesson title must be at least 5 characters" }),
          description: z.string().min(10: any, { message: "Lesson description must be at least 10 characters" }),
          order: z.number().min(1: any, { message: "Order must be at least 1" }),
          objectives: z.array(z.string()).min(1: any, { message: "At least one objective is required" }),
          resources: z.array(z.string()).optional(),
          differentiationStrategies: z.array(z.string()).optional(),
          assessmentMethods: z.array(z.string()).optional(),
        })
      ).optional(),
    })
  ).optional(),
});

/**
 * Enhanced data sanitization function with comprehensive XSS protection
 * Uses isomorphic-dompurify for client and server-side sanitization
 */
export function sanitizeInput(input: string): string {
  if (!input: any) return input;
  
  // Use DOMPurify for comprehensive sanitization
  let sanitized = DOMPurify.sanitize(input: any, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true // Keep content of removed tags
  });
  
  // Additional sanitization for extra security
  sanitized = sanitized
    .replace(/&/g: any, '&amp;')
    .replace(/</g: any, '&lt;')
    .replace(/>/g: any, '&gt;')
    .replace(/"/g: any, '&quot;')
    .replace(/'/g: any, '&#039;');
  
  return sanitized;
}

/**
 * Validates UK postcode format
 */
export function validateUKPostcode(postcode: string): boolean {
  return UK_POSTCODE_REGEX.test(postcode: any);
}

/**
 * Validates UK phone number format
 */
export function validateUKPhoneNumber(phone: string): boolean {
  return UK_PHONE_REGEX.test(phone: any);
}

/**
 * Validates UK year group
 */
export function validateUKYearGroup(yearGroup: string): boolean {
  return UK_YEAR_GROUPS.includes(yearGroup: any);
}

/**
 * Validates email with enhanced checks
 */
export function validateEmailEnhanced(email: string): boolean {
  // Use email-validator library for basic validation
  if (!validateEmail(email: any)) return false;
  
  // Additional checks for educational domains
  if (email.endsWith('.edu') || 
      email.endsWith('.ac.uk') || 
      email.endsWith('.sch.uk') ||
      email.endsWith('.gov.uk')) {
    return true;
  }
  
  // Standard validation passed
  return true;
}

/**
 * Function to validate and sanitize user input
 */
export function validateAndSanitizeUser(userData: any) {
  // Validate with Zod schema
  const validatedData = userSchema.parse(userData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    email: sanitizeInput(validatedData.email: any),
    name: sanitizeInput(validatedData.name: any),
    // Don't sanitize password as it would change the value
  };
}

/**
 * Function to validate and sanitize profile input
 */
export function validateAndSanitizeProfile(profileData: any) {
  // Validate with Zod schema
  const validatedData = profileSchema.parse(profileData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: validatedData.title ? sanitizeInput(validatedData.title: any) : undefined,
    firstName: sanitizeInput(validatedData.firstName: any),
    lastName: sanitizeInput(validatedData.lastName: any),
    bio: validatedData.bio ? sanitizeInput(validatedData.bio: any) : undefined,
    school: validatedData.school ? sanitizeInput(validatedData.school: any) : undefined,
    subjects: validatedData.subjects ? validatedData.subjects.map(sanitizeInput: any) : undefined,
    yearGroups: validatedData.yearGroups,
    yearGroup: validatedData.yearGroup,
    qualifications: validatedData.qualifications ? validatedData.qualifications.map(sanitizeInput: any) : undefined,
    specializations: validatedData.specializations ? validatedData.specializations.map(sanitizeInput: any) : undefined,
    teachingApproach: validatedData.teachingApproach ? sanitizeInput(validatedData.teachingApproach: any) : undefined,
    senExperience: validatedData.senExperience ? validatedData.senExperience.map(sanitizeInput: any) : undefined,
    parentingApproach: validatedData.parentingApproach ? sanitizeInput(validatedData.parentingApproach: any) : undefined,
    homeEnvironment: validatedData.homeEnvironment ? sanitizeInput(validatedData.homeEnvironment: any) : undefined,
    communicationPreference: validatedData.communicationPreference ? sanitizeInput(validatedData.communicationPreference: any) : undefined,
  };
}

/**
 * Function to validate and sanitize assessment input
 */
export function validateAndSanitizeAssessment(assessmentData: any) {
  // Validate with Zod schema
  const validatedData = assessmentSchema.parse(assessmentData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: sanitizeInput(validatedData.title: any),
    description: sanitizeInput(validatedData.description: any),
    subject: sanitizeInput(validatedData.subject: any),
    yearGroup: validatedData.yearGroup,
    curriculumLinks: validatedData.curriculumLinks ? validatedData.curriculumLinks.map(sanitizeInput: any) : undefined,
    differentiationOptions: validatedData.differentiationOptions ? validatedData.differentiationOptions.map(sanitizeInput: any) : undefined,
    accessibilityFeatures: validatedData.accessibilityFeatures ? validatedData.accessibilityFeatures.map(sanitizeInput: any) : undefined,
    questions: validatedData.questions.map(q => ({
      ...q,
      text: sanitizeInput(q.text: any),
      options: q.options ? q.options.map(sanitizeInput: any) : undefined,
      scaffolding: q.scaffolding ? sanitizeInput(q.scaffolding: any) : undefined,
      feedbackOptions: q.feedbackOptions ? q.feedbackOptions.map(sanitizeInput: any) : undefined,
    })),
  };
}

/**
 * Function to validate and sanitize resource input
 */
export function validateAndSanitizeResource(resourceData: any) {
  // Validate with Zod schema
  const validatedData = resourceSchema.parse(resourceData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: sanitizeInput(validatedData.title: any),
    description: sanitizeInput(validatedData.description: any),
    subject: sanitizeInput(validatedData.subject: any),
    yearGroups: validatedData.yearGroups,
    tags: validatedData.tags ? validatedData.tags.map(sanitizeInput: any) : undefined,
    curriculumLinks: validatedData.curriculumLinks ? validatedData.curriculumLinks.map(sanitizeInput: any) : undefined,
    accessibilityFeatures: validatedData.accessibilityFeatures ? validatedData.accessibilityFeatures.map(sanitizeInput: any) : undefined,
    differentiationOptions: validatedData.differentiationOptions ? validatedData.differentiationOptions.map(sanitizeInput: any) : undefined,
  };
}

/**
 * Function to validate and sanitize curriculum plan input
 */
export function validateAndSanitizeCurriculumPlan(planData: any) {
  // Validate with Zod schema
  const validatedData = curriculumPlanSchema.parse(planData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: sanitizeInput(validatedData.title: any),
    description: sanitizeInput(validatedData.description: any),
    subject: sanitizeInput(validatedData.subject: any),
    yearGroup: validatedData.yearGroup,
    nationalCurriculumLinks: validatedData.nationalCurriculumLinks ? validatedData.nationalCurriculumLinks.map(sanitizeInput: any) : undefined,
    assessmentOpportunities: validatedData.assessmentOpportunities ? validatedData.assessmentOpportunities.map(sanitizeInput: any) : undefined,
    differentiationStrategies: validatedData.differentiationStrategies ? validatedData.differentiationStrategies.map(sanitizeInput: any) : undefined,
    units: validatedData.units ? validatedData.units.map(unit => ({
      ...unit,
      title: sanitizeInput(unit.title: any),
      description: sanitizeInput(unit.description: any),
      lessons: unit.lessons ? unit.lessons.map(lesson => ({
        ...lesson,
        title: sanitizeInput(lesson.title: any),
        description: sanitizeInput(lesson.description: any),
        objectives: lesson.objectives.map(sanitizeInput: any),
        resources: lesson.resources ? lesson.resources.map(sanitizeInput: any) : undefined,
        differentiationStrategies: lesson.differentiationStrategies ? lesson.differentiationStrategies.map(sanitizeInput: any) : undefined,
        assessmentMethods: lesson.assessmentMethods ? lesson.assessmentMethods.map(sanitizeInput: any) : undefined,
      })) : undefined,
    })) : undefined,
  };
}

/**
 * Function to validate and sanitize SEMH assessment input
 */
export function validateAndSanitizeSEMHAssessment(assessmentData: any) {
  // Validate with Zod schema
  const validatedData = semhAssessmentSchema.parse(assessmentData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    title: sanitizeInput(validatedData.title: any),
    description: sanitizeInput(validatedData.description: any),
    areas: validatedData.areas.map(area => ({
      ...area,
      name: sanitizeInput(area.name: any),
      observations: sanitizeInput(area.observations: any),
      recommendations: sanitizeInput(area.recommendations: any),
    })),
    summary: sanitizeInput(validatedData.summary: any),
  };
}

/**
 * Function to validate and sanitize biofeedback session input
 */
export function validateAndSanitizeBiofeedbackSession(sessionData: any) {
  // Validate with Zod schema
  const validatedData = biofeedbackSessionSchema.parse(sessionData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    observations: sanitizeInput(validatedData.observations: any),
    studentFeedback: sanitizeInput(validatedData.studentFeedback: any),
    recommendations: sanitizeInput(validatedData.recommendations: any),
  };
}

/**
 * Function to validate and sanitize emotional pattern record input
 */
export function validateAndSanitizeEmotionalPatternRecord(recordData: any) {
  // Validate with Zod schema
  const validatedData = emotionalPatternRecordSchema.parse(recordData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    period: sanitizeInput(validatedData.period: any),
    patterns: validatedData.patterns.map(pattern => ({
      ...pattern,
      triggerContext: sanitizeInput(pattern.triggerContext: any),
      emotionalResponse: sanitizeInput(pattern.emotionalResponse: any),
      behavioralSigns: sanitizeInput(pattern.behavioralSigns: any),
      effectiveSupports: sanitizeInput(pattern.effectiveSupports: any),
    })),
    summary: sanitizeInput(validatedData.summary: any),
    recommendations: sanitizeInput(validatedData.recommendations: any),
  };
}

/**
 * Function to validate and sanitize parent-teacher communication input
 */
export function validateAndSanitizeParentTeacherCommunication(communicationData: any) {
  // Validate with Zod schema
  const validatedData = parentTeacherCommunicationSchema.parse(communicationData: any);
  
  // Sanitize string fields
  return {
    ...validatedData,
    subject: sanitizeInput(validatedData.subject: any),
    content: sanitizeInput(validatedData.content: any),
    responseContent: validatedData.responseContent ? sanitizeInput(validatedData.responseContent: any) : undefined,
    followUpActions: validatedData.followUpActions ? sanitizeInput(validatedData.followUpActions: any) : undefined,
    outcome: validatedData.outcome ? sanitizeInput(validatedData.outcome: any) : undefined,
  };
}

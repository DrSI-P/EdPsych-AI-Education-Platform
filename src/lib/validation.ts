/**
 * Schema validation utilities for the EdPsych AI Education Platform
 * This file contains Zod schemas for validating API requests and responses
 */

import { z } from 'zod';

// Basic schemas
export const userRoleSchema = z.enum(['student', 'teacher', 'parent', 'admin', 'senco']);

export const subjectSchema = z.enum(['maths', 'english', 'science', 'history', 'geography', 'art', 'other']);

export const keyStageSchema = z.enum(['eyfs', 'ks1', 'ks2', 'ks3', 'ks4']);

export const difficultyLevelSchema = z.enum(['beginner', 'intermediate', 'advanced']);

export const learningStyleSchema = z.enum(['visual', 'auditory', 'reading', 'kinesthetic', 'multimodal']);

export const specialNeedSchema = z.enum([
  'dyslexia', 
  'dyspraxia', 
  'dyscalculia', 
  'adhd', 
  'asd', 
  'visual-impairment', 
  'hearing-impairment', 
  'speech-language', 
  'social-emotional', 
  'other'
]);

export const accommodationSchema = z.enum([
  'extended-time', 
  'reader', 
  'scribe', 
  'separate-room', 
  'assistive-technology', 
  'modified-materials', 
  'visual-aids', 
  'auditory-aids', 
  'sensory-breaks', 
  'other'
]);

// User schemas
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  image: z.string().optional(),
  role: userRoleSchema,
  createdAt: z.date(),
  updatedAt: z.date()
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: userRoleSchema
});

export const updateUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  role: userRoleSchema.optional(),
  image: z.string().optional()
});

// Learning module schemas
export const textContentSchema = z.object({
  id: z.string(),
  type: z.literal('text'),
  title: z.string(),
  order: z.number().int(),
  content: z.string(),
  readingTime: z.string().optional()
});

export const videoContentSchema = z.object({
  id: z.string(),
  type: z.literal('video'),
  title: z.string(),
  order: z.number().int(),
  url: z.string().url(),
  duration: z.string(),
  transcript: z.string().optional()
});

export const quizQuestionSchema = z.object({
  id: z.string(),
  text: z.string(),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer', 'matching']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]),
  explanation: z.string().optional()
});

export const quizContentSchema = z.object({
  id: z.string(),
  type: z.literal('quiz'),
  title: z.string(),
  order: z.number().int(),
  questions: z.array(quizQuestionSchema),
  passingScore: z.number().min(0).max(100)
});

export const interactiveContentSchema = z.object({
  id: z.string(),
  type: z.literal('interactive'),
  title: z.string(),
  order: z.number().int(),
  interactiveType: z.enum(['drag-drop', 'matching', 'sorting', 'simulation']),
  data: z.any()
});

export const learningContentSchema = z.discriminatedUnion('type', [
  textContentSchema,
  videoContentSchema,
  quizContentSchema,
  interactiveContentSchema
]);

export const learningModuleSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  subject: subjectSchema,
  keyStage: keyStageSchema,
  estimatedTime: z.string().optional(),
  difficulty: difficultyLevelSchema,
  tags: z.array(z.string()).optional(),
  content: z.array(learningContentSchema),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const createLearningModuleSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  subject: subjectSchema,
  keyStage: keyStageSchema,
  estimatedTime: z.string().optional(),
  difficulty: difficultyLevelSchema,
  tags: z.array(z.string()).optional(),
  content: z.array(learningContentSchema).optional()
});

// Assessment schemas
export const assessmentQuestionSchema = z.object({
  id: z.string().optional(),
  text: z.string(),
  type: z.enum(['multiple-choice', 'true-false', 'short-answer', 'essay', 'matching']),
  options: z.array(z.string()).optional(),
  correctAnswer: z.union([z.string(), z.array(z.string())]).optional(),
  points: z.number().int().positive(),
  difficulty: difficultyLevelSchema,
  bloomsTaxonomyLevel: z.enum(['remember', 'understand', 'apply', 'analyze', 'evaluate', 'create']).optional()
});

export const createAssessmentSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  subject: subjectSchema,
  keyStage: keyStageSchema,
  questions: z.array(assessmentQuestionSchema),
  timeLimit: z.number().int().positive().optional(),
  passingScore: z.number().min(0).max(100)
});

// Special needs schemas
export const accessibilityPreferencesSchema = z.object({
  highContrast: z.boolean(),
  largeText: z.boolean(),
  reducedMotion: z.boolean(),
  screenReader: z.boolean(),
  voiceInput: z.boolean(),
  colorBlindMode: z.enum(['none', 'protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia']).optional(),
  readingLevel: z.enum(['standard', 'simplified', 'early-reader']).optional()
});

export const interventionSchema = z.object({
  id: z.string().optional(),
  type: z.enum(['academic', 'behavioral', 'social', 'emotional', 'speech-language', 'occupational-therapy', 'other']),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date().optional(),
  frequency: z.string(),
  progress: z.number().min(0).max(100),
  notes: z.string().optional()
});

export const createSpecialNeedsProfileSchema = z.object({
  userId: z.string(),
  needs: z.array(specialNeedSchema),
  accommodations: z.array(accommodationSchema),
  interventions: z.array(interventionSchema).optional(),
  notes: z.string().optional()
});

// Professional development schemas
export const cpdGoalSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  description: z.string(),
  targetDate: z.date(),
  progress: z.number().min(0).max(100),
  status: z.enum(['not-started', 'in-progress', 'completed']),
  evidence: z.array(z.string()).optional()
});

export const certificateSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  issuer: z.string(),
  issueDate: z.date(),
  expiryDate: z.date().optional(),
  credentialId: z.string().optional(),
  url: z.string().url().optional()
});

export const mentorshipSchema = z.object({
  id: z.string().optional(),
  mentorId: z.string(),
  menteeId: z.string(),
  status: z.enum(['pending', 'active', 'completed', 'declined']),
  startDate: z.date(),
  endDate: z.date().optional(),
  focusAreas: z.array(z.string())
});

export const reflectionSchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  content: z.string(),
  date: z.date(),
  tags: z.array(z.string()).optional(),
  visibility: z.enum(['private', 'mentors', 'public'])
});

// Learning community schemas
export const privacySettingSchema = z.object({
  visibility: z.enum(['public', 'private', 'invite-only']),
  joinApproval: z.enum(['automatic', 'manual']),
  resourcesAccess: z.enum(['all', 'selected', 'members']),
  discussionsAccess: z.enum(['all', 'selected', 'members']),
  eventsAccess: z.enum(['all', 'selected', 'members'])
});

export const createLearningCommunitySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string(),
  privacySettings: privacySettingSchema
});

export const discussionSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string(),
  tags: z.array(z.string()).optional()
});

export const resourceSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  type: z.enum(['document', 'link', 'video', 'image', 'other']),
  url: z.string().url()
});

export const communityEventSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  startDate: z.date(),
  endDate: z.date(),
  location: z.string().optional()
});

// Parent-school communication schemas
export const messageSchema = z.object({
  content: z.string(),
  attachments: z.array(z.string()).optional()
});

export const meetingSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  date: z.date(),
  duration: z.number().int().positive(),
  location: z.string().optional(),
  attendees: z.array(z.string()),
  notes: z.string().optional()
});

export const studentGoalSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  targetDate: z.date(),
  progress: z.number().min(0).max(100),
  status: z.enum(['not-started', 'in-progress', 'completed']),
  notes: z.string().optional()
});

export const progressReportSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  period: z.string(),
  content: z.string(),
  strengths: z.array(z.string()),
  areasForImprovement: z.array(z.string()),
  recommendations: z.array(z.string())
});

// Restorative justice schemas
export const participantSchema = z.object({
  userId: z.string(),
  role: z.enum(['affected', 'responsible', 'supporter', 'community']),
  notes: z.string().optional()
});

export const circleQuestionSchema = z.object({
  text: z.string(),
  order: z.number().int()
});

export const createRestorativeJusticeCaseSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string(),
  participants: z.array(participantSchema)
});

export const agreementTermSchema = z.object({
  description: z.string(),
  responsibleParty: z.string(),
  dueDate: z.date().optional(),
  status: z.enum(['pending', 'in-progress', 'completed']),
  notes: z.string().optional()
});

export const createRestorativeAgreementSchema = z.object({
  terms: z.array(agreementTermSchema),
  reviewDate: z.date()
});

// AI integration schemas
export const aiConfigSchema = z.object({
  model: z.string(),
  temperature: z.number().min(0).max(1),
  maxTokens: z.number().int().positive(),
  topP: z.number().min(0).max(1),
  frequencyPenalty: z.number().min(0).max(2),
  presencePenalty: z.number().min(0).max(2)
});

export const aiPromptSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  systemPrompt: z.string(),
  userPromptTemplate: z.string(),
  category: z.enum(['education', 'assessment', 'special-needs', 'professional-development'])
});

// Testing schemas
export const testResultSchema = z.object({
  component: z.string(),
  feature: z.string(),
  status: z.enum(['passed', 'failed']),
  browser: z.string().optional(),
  device: z.string().optional(),
  errorMessage: z.string().optional(),
  steps: z.array(z.string()).optional(),
  timestamp: z.string()
});

export const testReportSchema = z.object({
  summary: z.object({
    total: z.number().int(),
    passed: z.number().int(),
    passed: z.number().int(),
    failed: z.number().int(),
    date: z.string()
  }),
  results: z.array(testResultSchema)
});

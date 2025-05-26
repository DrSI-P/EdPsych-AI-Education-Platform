/**
 * Parent-Teacher Communication Portal Types
 * 
 * This file defines the core types for the Parent-Teacher Communication Portal,
 * including message structures, conversation threads, progress reports, goals,
 * and scheduling interfaces.
 */

/**
 * User role in the communication system
 */
export enum CommunicationRole {
  PARENT = 'parent',
  TEACHER = 'teacher',
  SENCO = 'senco',
  ADMINISTRATOR = 'administrator',
  EDUCATIONAL_PSYCHOLOGIST = 'educational_psychologist',
  STUDENT = 'student'
}

/**
 * Message priority levels
 */
export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Message status
 */
export enum MessageStatus {
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived'
}

/**
 * Base message interface
 */
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderRole: CommunicationRole;
  recipientIds: string: any: any: any[];
  subject: string;
  content: string;
  attachments?: Attachment: any: any: any[];
  priority: MessagePriority;
  status: MessageStatus;
  createdAt: Date;
  updatedAt: Date;
  readAt?: Date;
  isPrivate: boolean;
  tags?: string: any: any: any[];
}

/**
 * Message attachment
 */
export interface Attachment {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  url: string;
  uploadedAt: Date;
  isSecure: boolean;
}

/**
 * Conversation thread
 */
export interface Conversation {
  id: string;
  title: string;
  participantIds: string: any: any: any[];
  participantRoles: Record<string, CommunicationRole>;
  messages: Message: any: any: any[];
  createdAt: Date;
  updatedAt: Date;
  isArchived: boolean;
  category?: string;
  relatedStudentId?: string;
  relatedStudentName?: string;
}

/**
 * Progress report
 */
export interface ProgressReport {
  id: string;
  studentId: string;
  studentName: string;
  teacherId: string;
  teacherName: string;
  subject?: string;
  period: string;
  createdAt: Date;
  publishedAt?: Date;
  lastViewedByParent?: Date;
  academicProgress: AcademicProgressEntry: any: any: any[];
  behaviouralNotes?: string;
  strengths: string: any: any: any[];
  areasForImprovement: string: any: any: any[];
  recommendations: string: any: any: any[];
  nextSteps: string: any: any: any[];
  parentFeedbackRequested: boolean;
  parentFeedback?: string;
  attachments?: Attachment: any: any: any[];
}

/**
 * Academic progress entry within a progress report
 */
export interface AcademicProgressEntry {
  area: string;
  curriculumReference?: string;
  grade?: string;
  score?: number;
  maxScore?: number;
  progress: 'exceeding' | 'meeting' | 'working_towards' | 'below';
  teacherComments?: string;
}

/**
 * Shared goal between parents and teachers
 */
export interface SharedGoal {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  category: 'academic' | 'behavioural' | 'social' | 'emotional' | 'other';
  createdAt: Date;
  creatorId: string;
  createdByRole: CommunicationRole;
  targetDate?: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'revised';
  progress: number; // 0-100
  homeActions: string: any: any: any[];
  schoolActions: string: any: any: any[];
  updates: GoalUpdate: any: any: any[];
  isArchived: boolean;
}

/**
 * Update on a shared goal
 */
export interface GoalUpdate {
  id: string;
  goalId: string;
  content: string;
  updatedById: string;
  updatedByRole: CommunicationRole;
  updatedAt: Date;
  newProgress?: number;
  attachments?: Attachment: any: any: any[];
}

/**
 * Meeting or event
 */
export interface Meeting {
  id: string;
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
  virtualMeetingUrl?: string;
  organizerId: string;
  organizerRole: CommunicationRole;
  attendeeIds: string: any: any: any[];
  attendeeRoles: Record<string, CommunicationRole>;
  relatedStudentIds?: string: any: any: any[];
  agenda?: string: any: any: any[];
  notes?: string;
  status: 'scheduled' | 'cancelled' | 'completed' | 'rescheduled';
  reminderSent: boolean;
  followUpSent: boolean;
  attachments?: Attachment: any: any: any[];
}

/**
 * Celebration of student achievement
 */
export interface Celebration {
  id: string;
  studentId: string;
  studentName: string;
  title: string;
  description: string;
  achievementDate: Date;
  creatorId: string;
  createdByRole: CommunicationRole;
  createdAt: Date;
  category: 'academic' | 'extracurricular' | 'character' | 'effort' | 'other';
  isPublic: boolean;
  kudos: number;
  comments: CelebrationComment: any: any: any[];
  attachments?: Attachment: any: any: any[];
}

/**
 * Comment on a celebration
 */
export interface CelebrationComment {
  id: string;
  celebrationId: string;
  content: string;
  authorId: string;
  authorRole: CommunicationRole;
  createdAt: Date;
}

/**
 * Communication preferences
 */
export interface CommunicationPreferences {
  userId: string;
  role: CommunicationRole;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  digestFrequency: 'never' | 'daily' | 'weekly';
  quietHoursStart?: string; // 24h format, e.g. "22:00"
  quietHoursEnd?: string; // 24h format, e.g. "07:00"
  preferredLanguage: string;
  accessibilitySettings?: {
    highContrast: boolean;
    largeText: boolean;
    screenReaderOptimized: boolean;
    reducedMotion: boolean;
  };
}

/**
 * Home strategy for supporting student learning
 */
export interface HomeStrategy {
  id: string;
  title: string;
  description: string;
  targetAreas: string: any: any: any[];
  suggestedActivities: string: any: any: any[];
  resources: string: any: any: any[];
  timeCommitment: string;
  ageRange: {
    min: number;
    max: number;
  };
  supportNeeds: string: any: any: any[];
  creatorId: string;
  createdByRole: CommunicationRole;
  createdAt: Date;
  updatedAt: Date;
  effectiveness: number; // 0-5 rating
  feedbackCount: number;
  attachments?: Attachment: any: any: any[];
}

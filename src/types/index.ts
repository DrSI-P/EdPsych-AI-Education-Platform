/**
 * Type definitions for the EdPsych AI Education Platform
 * This file contains shared interfaces and types used throughout the application
 */

// User related types
export interface User {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'senco';

// Subject types
export type Subject = 'maths' | 'english' | 'science' | 'history' | 'geography' | 'art' | 'other';

// Key Stage types
export type KeyStage = 'eyfs' | 'ks1' | 'ks2' | 'ks3' | 'ks4';

// Learning style types
export type LearningStyle = 'visual' | 'auditory' | 'reading' | 'kinesthetic' | 'multimodal';

// Difficulty level types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

// Accessibility preference types
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  voiceInput: boolean;
  colorBlindMode?: ColorBlindMode;
  readingLevel?: ReadingLevel;
}

export type ColorBlindMode = 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';

export type ReadingLevel = 'standard' | 'simplified' | 'early-reader';

// Learning module types
export interface LearningModule {
  id: string;
  title: string;
  description?: string;
  subject: Subject;
  keyStage: KeyStage;
  estimatedTime?: string;
  difficulty: DifficultyLevel;
  tags?: string[];
  content: LearningContent[];
  createdAt: Date;
  updatedAt: Date;
}

export type LearningContent = TextContent | VideoContent | QuizContent | InteractiveContent;

export interface BaseContent {
  id: string;
  type: 'text' | 'video' | 'quiz' | 'interactive';
  title: string;
  order: number;
}

export interface TextContent extends BaseContent {
  type: 'text';
  content: string;
  readingTime?: string;
}

export interface VideoContent extends BaseContent {
  type: 'video';
  url: string;
  duration: string;
  transcript?: string;
}

export interface QuizContent extends BaseContent {
  type: 'quiz';
  questions: QuizQuestion[];
  passingScore: number;
}

export interface InteractiveContent extends BaseContent {
  type: 'interactive';
  interactiveType: 'drag-drop' | 'matching' | 'sorting' | 'simulation';
  data: any; // Specific to the interactive type
}

export interface QuizQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'matching';
  options?: string[];
  correctAnswer: string | string[];
  explanation?: string;
}

// Assessment types
export interface Assessment {
  id: string;
  title: string;
  description?: string;
  subject: Subject;
  keyStage: KeyStage;
  questions: AssessmentQuestion[];
  timeLimit?: number; // in minutes
  passingScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'essay' | 'matching';
  options?: string[];
  correctAnswer?: string | string[];
  points: number;
  difficulty: DifficultyLevel;
  bloomsTaxonomyLevel?: BloomsTaxonomyLevel;
}

export type BloomsTaxonomyLevel = 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';

// Progress tracking types
export interface UserProgress {
  userId: string;
  moduleId: string;
  progress: number; // 0-100
  completed: boolean;
  lastAccessedAt: Date;
  assessmentResults?: AssessmentResult[];
}

export interface AssessmentResult {
  assessmentId: string;
  userId: string;
  score: number;
  passed: boolean;
  answers: UserAnswer[];
  startedAt: Date;
  completedAt: Date;
  timeSpent: number; // in seconds
}

export interface UserAnswer {
  questionId: string;
  answer: string | string[];
  correct: boolean;
  points: number;
}

// Special needs and intervention types
export interface SpecialNeedsProfile {
  userId: string;
  needs: SpecialNeed[];
  accommodations: Accommodation[];
  interventions: Intervention[];
  notes?: string;
  updatedAt: Date;
}

export type SpecialNeed = 
  | 'dyslexia' 
  | 'dyspraxia' 
  | 'dyscalculia' 
  | 'adhd' 
  | 'asd' 
  | 'visual-impairment' 
  | 'hearing-impairment' 
  | 'speech-language' 
  | 'social-emotional' 
  | 'other';

export type Accommodation = 
  | 'extended-time' 
  | 'reader' 
  | 'scribe' 
  | 'separate-room' 
  | 'assistive-technology' 
  | 'modified-materials' 
  | 'visual-aids' 
  | 'auditory-aids' 
  | 'sensory-breaks' 
  | 'other';

export interface Intervention {
  id: string;
  type: InterventionType;
  description: string;
  startDate: Date;
  endDate?: Date;
  frequency: string;
  progress: number; // 0-100
  notes?: string;
}

export type InterventionType = 
  | 'academic' 
  | 'behavioral' 
  | 'social' 
  | 'emotional' 
  | 'speech-language' 
  | 'occupational-therapy' 
  | 'other';

// Professional development types
export interface CPDProfile {
  userId: string;
  goals: CPDGoal[];
  certificates: Certificate[];
  mentorships: Mentorship[];
  reflections: Reflection[];
  updatedAt: Date;
}

export interface CPDGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  evidence?: string[];
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: Date;
  expiryDate?: Date;
  credentialId?: string;
  url?: string;
}

export interface Mentorship {
  id: string;
  mentorId: string;
  menteeId: string;
  status: 'pending' | 'active' | 'completed' | 'declined';
  startDate: Date;
  endDate?: Date;
  focusAreas: string[];
  meetings?: MentorshipMeeting[];
  goals?: MentorshipGoal[];
}

export interface MentorshipMeeting {
  id: string;
  date: Date;
  duration: number; // in minutes
  notes: string;
  actionItems?: string[];
}

export interface MentorshipGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface Reflection {
  id: string;
  title: string;
  content: string;
  date: Date;
  tags?: string[];
  visibility: 'private' | 'mentors' | 'public';
}

// Learning community types
export interface LearningCommunity {
  id: string;
  name: string;
  description: string;
  creatorId: string;
  members: CommunityMember[];
  discussions: Discussion[];
  resources: Resource[];
  events: CommunityEvent[];
  privacySettings: PrivacySetting;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommunityMember {
  userId: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: Date;
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  authorId: string;
  comments: Comment[];
  tags?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'document' | 'link' | 'video' | 'image' | 'other';
  url: string;
  uploaderId: string;
  tags?: string[];
  createdAt: Date;
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  organizerId: string;
  attendees: string[]; // user IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface PrivacySetting {
  visibility: 'public' | 'private' | 'invite-only';
  joinApproval: 'automatic' | 'manual';
  resourcesAccess: 'all' | 'selected' | 'members';
  discussionsAccess: 'all' | 'selected' | 'members';
  eventsAccess: 'all' | 'selected' | 'members';
}

// Parent-school communication types
export interface ParentSchoolCommunication {
  id: string;
  studentId: string;
  teacherId: string;
  parentId: string;
  messages: Message[];
  meetings: Meeting[];
  goals: StudentGoal[];
  reports: ProgressReport[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  attachments?: string[];
  read: boolean;
  createdAt: Date;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  date: Date;
  duration: number; // in minutes
  location?: string;
  attendees: string[]; // user IDs
  notes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface StudentGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  progress: number; // 0-100
  status: 'not-started' | 'in-progress' | 'completed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgressReport {
  id: string;
  title: string;
  period: string;
  content: string;
  strengths: string[];
  areasForImprovement: string[];
  recommendations: string[];
  teacherId: string;
  createdAt: Date;
}

// Restorative justice types
export interface RestorativeJusticeCase {
  id: string;
  title: string;
  description: string;
  participants: Participant[];
  facilitatorId: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'follow-up';
  circleProcess?: CircleProcess;
  agreement?: RestorativeAgreement;
  createdAt: Date;
  updatedAt: Date;
}

export interface Participant {
  userId: string;
  role: 'affected' | 'responsible' | 'supporter' | 'community';
  notes?: string;
}

export interface CircleProcess {
  id: string;
  date: Date;
  duration: number; // in minutes
  location: string;
  notes: string;
  questions: CircleQuestion[];
  outcomes: string[];
}

export interface CircleQuestion {
  id: string;
  text: string;
  order: number;
  responses?: CircleResponse[];
}

export interface CircleResponse {
  participantId: string;
  response: string;
}

export interface RestorativeAgreement {
  id: string;
  terms: AgreementTerm[];
  signedBy: string[]; // user IDs
  dateCreated: Date;
  reviewDate: Date;
  status: 'draft' | 'active' | 'completed' | 'breached';
}

export interface AgreementTerm {
  id: string;
  description: string;
  responsibleParty: string; // user ID
  dueDate?: Date;
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

// AI integration types
export interface AIConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
}

export interface AIPrompt {
  id: string;
  title: string;
  systemPrompt: string;
  userPromptTemplate: string;
  category: 'education' | 'assessment' | 'special-needs' | 'professional-development';
  createdAt: Date;
  updatedAt: Date;
}

export interface AIResponse {
  id: string;
  promptId: string;
  userId: string;
  input: string;
  output: string;
  model: string;
  createdAt: Date;
}

// Testing types
export interface TestResult {
  component: string;
  feature: string;
  status: 'passed' | 'failed';
  browser?: string;
  device?: string;
  errorMessage?: string;
  steps?: string[];
  timestamp: string;
}

export interface TestReport {
  summary: {
    total: number;
    passed: number;
    failed: number;
    date: string;
  };
  results: TestResult[];
}

/**
 * Types for the Personalized Learning Path feature
 */

// Learning style types based on VARK model
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic',
  MULTIMODAL = 'multimodal'
}

// UK curriculum key stages
export enum KeyStage {
  NURSERY = 'nursery',
  RECEPTION = 'reception',
  KS1 = 'ks1',
  KS2 = 'ks2',
  KS3 = 'ks3',
  KS4 = 'ks4'
}

// Subject areas
export enum Subject {
  MATHS = 'maths',
  ENGLISH = 'english',
  SCIENCE = 'science',
  HISTORY = 'history',
  GEOGRAPHY = 'geography',
  ART = 'art',
  MUSIC = 'music',
  PE = 'pe',
  COMPUTING = 'computing',
  LANGUAGES = 'languages'
}

// Proficiency levels
export enum ProficiencyLevel {
  BEGINNER = 'beginner',
  DEVELOPING = 'developing',
  SECURE = 'secure',
  EXCEEDING = 'exceeding',
  MASTERY = 'mastery'
}

// Topic status
export enum TopicStatus {
  LOCKED = 'locked',
  AVAILABLE = 'available',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  MASTERED = 'mastered',
  NEEDS_REVIEW = 'needs_review'
}

// User interest categories
export interface InterestCategory {
  id: string;
  name: string;
  subcategories: string[];
}

// Assessment result
export interface AssessmentResult {
  id: string;
  userId: string;
  subjectId: string;
  topicId: string;
  score: number;
  proficiencyLevel: ProficiencyLevel;
  completedAt: Date;
  timeSpent: number; // in seconds
  attemptsCount: number;
  correctAnswers: number;
  totalQuestions: number;
}

// Curriculum topic
export interface CurriculumTopic {
  id: string;
  name: string;
  subjectId: string;
  keyStage: KeyStage;
  description: string;
  learningObjectives: string[];
  prerequisites: string[]; // IDs of prerequisite topics
  estimatedDuration: number; // in minutes
  difficulty: number; // 1-10 scale
  order: number; // for default sequencing
}

// Learning resource
export interface LearningResource {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive' | 'quiz' | 'worksheet' | 'game';
  url: string;
  topicIds: string[];
  keyStages: KeyStage[];
  learningStyles: LearningStyle[];
  interestCategories: string[];
  duration: number; // in minutes
  difficulty: number; // 1-10 scale
}

// User learning profile
export interface UserLearningProfile {
  id: string;
  userId: string;
  dominantLearningStyle: LearningStyle;
  secondaryLearningStyle: LearningStyle | null;
  learningPace: number; // 1-10 scale, 1=slow, 10=fast
  interests: string[]; // IDs of interest categories
  strengths: string[]; // IDs of curriculum topics
  areasForImprovement: string[]; // IDs of curriculum topics
  preferredLearningTime: 'morning' | 'afternoon' | 'evening' | 'any';
  focusDuration: number; // average focus duration in minutes
  lastUpdated: Date;
}

// Learning path unit
export interface LearningPathUnit {
  id: string;
  title: string;
  description: string;
  topicId: string;
  status: TopicStatus;
  progress: number; // 0-100
  resources: LearningResource[];
  assessments: string[]; // IDs of assessments
  estimatedDuration: number; // in minutes
  actualDuration: number; // in minutes, tracked from user activity
  startedAt: Date | null;
  completedAt: Date | null;
  proficiencyLevel: ProficiencyLevel | null;
  nextReviewDate: Date | null; // for spaced repetition
}

// Complete learning path
export interface LearningPath {
  id: string;
  userId: string;
  subjectId: string;
  keyStage: KeyStage;
  title: string;
  description: string;
  units: LearningPathUnit[];
  createdAt: Date;
  updatedAt: Date;
  overallProgress: number; // 0-100
  estimatedCompletionDate: Date | null;
  adaptationLevel: number; // 1-10 scale, how much the path has been adapted
  lastAssessmentDate: Date | null;
}

// Path generation parameters
export interface PathGenerationParams {
  userId: string;
  subjectId: string;
  keyStage: KeyStage;
  startingProficiencyLevel?: ProficiencyLevel;
  focusTopics?: string[]; // IDs of topics to emphasize
  excludeTopics?: string[]; // IDs of topics to exclude
  includePrerequisites: boolean;
  adaptToLearningStyle: boolean;
  adaptToInterests: boolean;
  difficulty: number; // 1-10 scale
  estimatedDuration?: number; // target duration in minutes
}

// Path adaptation event
export interface PathAdaptationEvent {
  id: string;
  pathId: string;
  timestamp: Date;
  triggerType: 'assessment' | 'engagement' | 'manual' | 'scheduled';
  changes: {
    addedUnits: string[];
    removedUnits: string[];
    reorderedUnits: boolean;
    difficultyChanged: boolean;
    resourcesChanged: boolean;
  };
  reason: string;
  performedBy: string | null; // userId if manual, null if automatic
}

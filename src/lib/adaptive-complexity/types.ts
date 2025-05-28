/**
 * Types for adaptive complexity module
 */

/**
 * Difficulty levels for adaptive content
 */
export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}

/**
 * Learning styles supported by the platform
 */
export enum LearningStyle {
  VISUAL = 'visual',
  AUDITORY = 'auditory',
  READING_WRITING = 'reading_writing',
  KINESTHETIC = 'kinesthetic'
}

/**
 * Age groups for content adaptation
 */
export enum AgeGroup {
  EARLY_YEARS = 'early_years',
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  HIGHER_EDUCATION = 'higher_education'
}

/**
 * Interface for adaptive content configuration
 */
export interface AdaptiveContentConfig {
  difficultyLevel: DifficultyLevel;
  learningStyle: LearningStyle;
  ageGroup: AgeGroup;
  adaptationEnabled: boolean;
  personalizedFeedback: boolean;
}

/**
 * Interface for user progress tracking
 */
export interface UserProgress {
  userId: string;
  contentId: string;
  completionPercentage: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpent: number; // in seconds
  lastAccessedAt: Date;
}

/**
 * Interface for adaptive complexity settings
 */
export interface AdaptiveComplexitySettings {
  autoAdjustDifficulty: boolean;
  initialDifficultyLevel: DifficultyLevel;
  preferredLearningStyle: LearningStyle;
  contentAdaptationSpeed: 'slow' | 'medium' | 'fast';
  enableDetailedFeedback: boolean;
}

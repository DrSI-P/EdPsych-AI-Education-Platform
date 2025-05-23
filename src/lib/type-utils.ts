/**
 * Type utility functions for the EdPsych AI Education Platform
 * This file contains helper functions and type guards for type safety
 */

import { 
  LearningContent, 
  TextContent, 
  VideoContent, 
  QuizContent, 
  InteractiveContent,
  UserRole,
  Subject,
  KeyStage,
  DifficultyLevel,
  SpecialNeed,
  Accommodation
} from '@/types';

/**
 * Type guards for content types
 */
export function isTextContent(content: LearningContent): content is TextContent {
  return content.type === 'text';
}

export function isVideoContent(content: LearningContent): content is VideoContent {
  return content.type === 'video';
}

export function isQuizContent(content: LearningContent): content is QuizContent {
  return content.type === 'quiz';
}

export function isInteractiveContent(content: LearningContent): content is InteractiveContent {
  return content.type === 'interactive';
}

/**
 * Type validation functions
 */
export function isValidUserRole(role: string): role is UserRole {
  return ['student', 'teacher', 'parent', 'admin', 'senco'].includes(role);
}

export function isValidSubject(subject: string): subject is Subject {
  return ['maths', 'english', 'science', 'history', 'geography', 'art', 'other'].includes(subject);
}

export function isValidKeyStage(keyStage: string): keyStage is KeyStage {
  return ['eyfs', 'ks1', 'ks2', 'ks3', 'ks4'].includes(keyStage);
}

export function isValidDifficultyLevel(level: string): level is DifficultyLevel {
  return ['beginner', 'intermediate', 'advanced'].includes(level);
}

export function isValidSpecialNeed(need: string): need is SpecialNeed {
  return [
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
  ].includes(need);
}

export function isValidAccommodation(accommodation: string): accommodation is Accommodation {
  return [
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
  ].includes(accommodation);
}

/**
 * Type conversion utilities
 */
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function ensureString(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') return JSON.stringify(value);
  return '';
}

export function ensureNumber(value: unknown, defaultValue: number = 0): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? defaultValue : parsed;
  }
  if (typeof value === 'boolean') return value ? 1 : 0;
  return defaultValue;
}

export function ensureBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') return value.toLowerCase() === 'true';
  if (typeof value === 'number') return value !== 0;
  return Boolean(value);
}

export function ensureDate(value: unknown): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const date = new Date(value);
    return isNaN(date.getTime()) ? new Date() : date;
  }
  return new Date();
}

/**
 * Type-safe object access
 */
export function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] | undefined {
  return obj ? obj[key] : undefined;
}

export function getNestedProperty<T, K1 extends keyof T, K2 extends keyof T[K1]>(
  obj: T,
  key1: K1,
  key2: K2
): T[K1][K2] | undefined {
  if (!obj || !obj[key1]) return undefined;
  return obj[key1][key2];
}

/**
 * Type-safe error handling
 */
export class TypedError extends Error {
  code: string;
  details?: Record<string, unknown>;

  constructor(message: string, code: string, details?: Record<string, unknown>) {
    super(message);
    this.name = 'TypedError';
    this.code = code;
    this.details = details;
  }
}

export function isTypedError(error: unknown): error is TypedError {
  return error instanceof TypedError;
}

export function createError(message: string, code: string, details?: Record<string, unknown>): TypedError {
  return new TypedError(message, code, details);
}

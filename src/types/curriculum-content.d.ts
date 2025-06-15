/**
 * Type definitions for curriculum-content
 * 
 * This file provides type definitions for the curriculum content module
 * used throughout the EdPsych AI Platform.
 */

declare module 'curriculum-content' {
  /**
   * Represents a curriculum content item
   */
  export interface ContentItem {
    id: string;
    title: string;
    description?: string;
    type: ContentType;
    difficulty: DifficultyLevel;
    tags: string[];
    subjects: string[];
    gradeLevel: GradeLevel[];
    content: string;
    mediaUrls?: string[];
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    isPublished: boolean;
    version: number;
    metadata?: Record<string, any>;
  }

  /**
   * Types of content available in the curriculum
   */
  export enum ContentType {
    LESSON = 'lesson',
    EXERCISE = 'exercise',
    ASSESSMENT = 'assessment',
    RESOURCE = 'resource',
    VIDEO = 'video',
    INTERACTIVE = 'interactive',
    SIMULATION = 'simulation',
    GAME = 'game',
    QUIZ = 'quiz'
  }

  /**
   * Difficulty levels for content
   */
  export enum DifficultyLevel {
    BEGINNER = 'beginner',
    INTERMEDIATE = 'intermediate',
    ADVANCED = 'advanced',
    EXPERT = 'expert'
  }

  /**
   * Grade levels for content
   */
  export enum GradeLevel {
    KINDERGARTEN = 'kindergarten',
    FIRST = 'first',
    SECOND = 'second',
    THIRD = 'third',
    FOURTH = 'fourth',
    FIFTH = 'fifth',
    SIXTH = 'sixth',
    SEVENTH = 'seventh',
    EIGHTH = 'eighth',
    NINTH = 'ninth',
    TENTH = 'tenth',
    ELEVENTH = 'eleventh',
    TWELFTH = 'twelfth',
    UNDERGRADUATE = 'undergraduate',
    GRADUATE = 'graduate'
  }

  /**
   * Represents a curriculum module containing multiple content items
   */
  export interface CurriculumModule {
    id: string;
    title: string;
    description: string;
    contentItems: ContentItem[];
    prerequisites?: string[];
    learningObjectives: string[];
    estimatedDuration: number; // in minutes
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    isPublished: boolean;
    version: number;
    metadata?: Record<string, any>;
  }

  /**
   * Represents a complete curriculum with multiple modules
   */
  export interface Curriculum {
    id: string;
    title: string;
    description: string;
    modules: CurriculumModule[];
    targetAudience: string[];
    subjects: string[];
    gradeLevels: GradeLevel[];
    createdAt: Date;
    updatedAt: Date;
    authorId: string;
    isPublished: boolean;
    version: number;
    metadata?: Record<string, any>;
  }

  /**
   * Service for managing curriculum content
   */
  export interface CurriculumContentService {
    getContentItem(id: string): Promise<ContentItem>;
    getContentItems(filters?: ContentFilters): Promise<ContentItem[]>;
    createContentItem(item: Omit<ContentItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<ContentItem>;
    updateContentItem(id: string, updates: Partial<ContentItem>): Promise<ContentItem>;
    deleteContentItem(id: string): Promise<boolean>;
    
    getModule(id: string): Promise<CurriculumModule>;
    getModules(filters?: ModuleFilters): Promise<CurriculumModule[]>;
    createModule(module: Omit<CurriculumModule, 'id' | 'createdAt' | 'updatedAt'>): Promise<CurriculumModule>;
    updateModule(id: string, updates: Partial<CurriculumModule>): Promise<CurriculumModule>;
    deleteModule(id: string): Promise<boolean>;
    
    getCurriculum(id: string): Promise<Curriculum>;
    getCurriculums(filters?: CurriculumFilters): Promise<Curriculum[]>;
    createCurriculum(curriculum: Omit<Curriculum, 'id' | 'createdAt' | 'updatedAt'>): Promise<Curriculum>;
    updateCurriculum(id: string, updates: Partial<Curriculum>): Promise<Curriculum>;
    deleteCurriculum(id: string): Promise<boolean>;
  }

  /**
   * Filters for content items
   */
  export interface ContentFilters {
    types?: ContentType[];
    difficulties?: DifficultyLevel[];
    tags?: string[];
    subjects?: string[];
    gradeLevels?: GradeLevel[];
    authorId?: string;
    isPublished?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }

  /**
   * Filters for modules
   */
  export interface ModuleFilters {
    search?: string;
    authorId?: string;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
  }

  /**
   * Filters for curriculums
   */
  export interface CurriculumFilters {
    subjects?: string[];
    gradeLevels?: GradeLevel[];
    authorId?: string;
    isPublished?: boolean;
    search?: string;
    limit?: number;
    offset?: number;
  }

  /**
   * Factory function to create a curriculum content service
   */
  export function createCurriculumContentService(): CurriculumContentService;
}
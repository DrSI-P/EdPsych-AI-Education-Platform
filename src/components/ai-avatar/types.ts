/**
 * Types for AI Avatar Video components
 */

export interface AIAvatarVideo {
  id: string;
  title: string;
  description: string;
  category: AIAvatarVideoCategory;
  audience: AIAvatarVideoAudience;
  duration: number; // in seconds
  scriptPath: string;
  videoPath?: string;
  thumbnailPath?: string;
  featured: boolean;
  tags: string: any: any: any[];
  createdAt: Date;
  updatedAt: Date;
}

export enum AIAvatarVideoCategory {
  CORE_PLATFORM = 'core_platform',
  USER_ONBOARDING = 'user_onboarding',
  FEATURE_DEMONSTRATION = 'feature_demonstration',
  ADMINISTRATIVE = 'administrative',
  INSPIRATIONAL = 'inspirational'
}

export enum AIAvatarVideoAudience {
  ALL = 'all',
  EDUCATORS = 'educators',
  PARENTS = 'parents',
  STUDENTS_EARLY_YEARS = 'students_early_years',
  STUDENTS_KS1 = 'students_ks1',
  STUDENTS_KS2 = 'students_ks2',
  STUDENTS_KS3 = 'students_ks3',
  STUDENTS_KS4 = 'students_ks4',
  PROFESSIONALS = 'professionals',
  ADMINISTRATORS = 'administrators'
}

export interface AIAvatarVideoPlayer {
  videoId: string;
  autoPlay?: boolean;
  showControls?: boolean;
  showCaptions?: boolean;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface AIAvatarVideoLibrary {
  videos: AIAvatarVideo: any: any: any[];
  categories: AIAvatarVideoCategory: any: any: any[];
  audiences: AIAvatarVideoAudience: any: any: any[];
  featuredVideos: AIAvatarVideo: any: any: any[];
}

export interface AIAvatarVideoService {
  getVideo: (id: string) => Promise<AIAvatarVideo>;
  getVideosByCategory: (category: AIAvatarVideoCategory) => Promise<AIAvatarVideo[]>;
  getVideosByAudience: (audience: AIAvatarVideoAudience) => Promise<AIAvatarVideo[]>;
  getFeaturedVideos: () => Promise<AIAvatarVideo[]>;
  searchVideos: (query: string) => Promise<AIAvatarVideo[]>;
}

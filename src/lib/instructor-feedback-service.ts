'use client';

/**
 * Instructor Feedback Service
 * 
 * This service manages instructor feedback for educational videos.
 * It allows instructors to provide timestamped feedback on student engagement,
 * comprehension, and areas that need improvement.
 */

export enum FeedbackType {
  COMMENT = 'comment',
  QUESTION = 'question',
  SUGGESTION = 'suggestion',
  HIGHLIGHT = 'highlight',
  CORRECTION = 'correction',
  PRAISE = 'praise',
  CONCERN = 'concern'
}

export enum FeedbackVisibility {
  PRIVATE = 'private',       // Only visible to the instructor
  STUDENT = 'student',       // Visible to the specific student
  GROUP = 'group',           // Visible to a specific group
  COURSE = 'course',         // Visible to the entire course
  PUBLIC = 'public'          // Visible to everyone
}

export enum FeedbackStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  RESOLVED = 'resolved'
}

export enum FeedbackPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface FeedbackItem {
  id: string;
  videoId: string;
  instructorId: string;
  instructorName: string;
  studentId?: string;
  studentName?: string;
  groupId?: string;
  courseId?: string;
  type: FeedbackType;
  content: string;
  timeCode: number;
  duration?: number;
  visibility: FeedbackVisibility;
  status: FeedbackStatus;
  priority: FeedbackPriority;
  tags?: string[];
  createdAt: number;
  updatedAt: number;
  responses?: FeedbackResponse[];
  metrics?: {
    engagement?: number;
    comprehension?: number;
    participation?: number;
    attentiveness?: number;
  };
}

export interface FeedbackResponse {
  id: string;
  feedbackId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor' | 'admin';
  content: string;
  createdAt: number;
  updatedAt: number;
}

export interface FeedbackFilter {
  videoId?: string;
  instructorId?: string;
  studentId?: string;
  groupId?: string;
  courseId?: string;
  type?: FeedbackType;
  visibility?: FeedbackVisibility;
  status?: FeedbackStatus;
  priority?: FeedbackPriority;
  tags?: string[];
  timeCodeStart?: number;
  timeCodeEnd?: number;
}

// Mock data for demonstration purposes
const mockFeedbackItems: FeedbackItem[] = [
  {
    id: 'feedback-1',
    videoId: 'video-1',
    instructorId: 'instructor-1',
    instructorName: 'Dr. Smith',
    studentId: 'student-1',
    studentName: 'John Doe',
    courseId: 'course-1',
    type: FeedbackType.COMMENT,
    content: 'Great engagement during this section. You asked thoughtful questions.',
    timeCode: 120, // 2 minutes into the video
    visibility: FeedbackVisibility.STUDENT,
    status: FeedbackStatus.PUBLISHED,
    priority: FeedbackPriority.MEDIUM,
    tags: ['engagement', 'participation'],
    createdAt: Date.now() - 86400000, // 1 day ago
    updatedAt: Date.now() - 86400000,
    metrics: {
      engagement: 0.8,
      comprehension: 0.7,
      participation: 0.9,
      attentiveness: 0.8
    }
  },
  {
    id: 'feedback-2',
    videoId: 'video-1',
    instructorId: 'instructor-1',
    instructorName: 'Dr. Smith',
    groupId: 'group-1',
    courseId: 'course-1',
    type: FeedbackType.SUGGESTION,
    content: 'This concept seems challenging for many students. Consider reviewing the prerequisite material.',
    timeCode: 300, // 5 minutes into the video
    visibility: FeedbackVisibility.GROUP,
    status: FeedbackStatus.PUBLISHED,
    priority: FeedbackPriority.HIGH,
    tags: ['difficult concept', 'review needed'],
    createdAt: Date.now() - 172800000, // 2 days ago
    updatedAt: Date.now() - 86400000, // Updated 1 day ago
    metrics: {
      comprehension: 0.4
    }
  },
  {
    id: 'feedback-3',
    videoId: 'video-1',
    instructorId: 'instructor-1',
    instructorName: 'Dr. Smith',
    courseId: 'course-1',
    type: FeedbackType.HIGHLIGHT,
    content: 'This is a key concept that will be on the exam. Make sure to understand it thoroughly.',
    timeCode: 450, // 7.5 minutes into the video
    duration: 60, // Highlight lasts for 1 minute
    visibility: FeedbackVisibility.COURSE,
    status: FeedbackStatus.PUBLISHED,
    priority: FeedbackPriority.HIGH,
    tags: ['key concept', 'exam material'],
    createdAt: Date.now() - 259200000, // 3 days ago
    updatedAt: Date.now() - 259200000
  }
];

/**
 * Get feedback items based on filter criteria
 */
export const getFeedbackItems = async (filter: FeedbackFilter = {}): Promise<FeedbackItem[]> => {
  // In a real implementation, this would call an API
  // For now, we'll just filter the mock data
  
  return mockFeedbackItems.filter(item => {
    // Match all filter criteria
    if (filter.videoId && item.videoId !== filter.videoId) return false;
    if (filter.instructorId && item.instructorId !== filter.instructorId) return false;
    if (filter.studentId && item.studentId !== filter.studentId) return false;
    if (filter.groupId && item.groupId !== filter.groupId) return false;
    if (filter.courseId && item.courseId !== filter.courseId) return false;
    if (filter.type && item.type !== filter.type) return false;
    if (filter.visibility && item.visibility !== filter.visibility) return false;
    if (filter.status && item.status !== filter.status) return false;
    if (filter.priority && item.priority !== filter.priority) return false;
    
    // Time code range
    if (filter.timeCodeStart !== undefined && item.timeCode < filter.timeCodeStart) return false;
    if (filter.timeCodeEnd !== undefined && item.timeCode > filter.timeCodeEnd) return false;
    
    // Tags (match any tag in the filter)
    if (filter.tags && filter.tags.length > 0) {
      if (!item.tags || !filter.tags.some(tag => item.tags?.includes(tag))) return false;
    }
    
    return true;
  });
};

/**
 * Create a new feedback item
 */
export const createFeedbackItem = async (feedbackItem: Omit<FeedbackItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FeedbackItem> => {
  // In a real implementation, this would call an API
  // For now, we'll just create a new item and add it to the mock data
  
  const now = Date.now();
  const newItem: FeedbackItem = {
    ...feedbackItem,
    id: `feedback-${now}-${Math.random().toString(36).substring(2, 9)}`,
    createdAt: now,
    updatedAt: now
  };
  
  // In a real implementation, this would be saved to a database
  // For now, we'll just return the new item
  return newItem;
};

/**
 * Update an existing feedback item
 */
export const updateFeedbackItem = async (id: string, updates: Partial<FeedbackItem>): Promise<FeedbackItem> => {
  // In a real implementation, this would call an API
  // For now, we'll just update the mock data
  
  const item = mockFeedbackItems.find(item => item.id === id);
  if (!item) {
    throw new Error(`Feedback item with ID ${id} not found`);
  }
  
  const updatedItem: FeedbackItem = {
    ...item,
    ...updates,
    updatedAt: Date.now()
  };
  
  // In a real implementation, this would be saved to a database
  // For now, we'll just return the updated item
  return updatedItem;
};

/**
 * Delete a feedback item
 */
export const deleteFeedbackItem = async (id: string): Promise<void> => {
  // In a real implementation, this would call an API
  // For now, we'll just simulate deletion
  
  const index = mockFeedbackItems.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error(`Feedback item with ID ${id} not found`);
  }
  
  // In a real implementation, this would be removed from a database
  // For now, we'll just simulate success
};

/**
 * Add a response to a feedback item
 */
export const addFeedbackResponse = async (feedbackId: string, response: Omit<FeedbackResponse, 'id' | 'feedbackId' | 'createdAt' | 'updatedAt'>): Promise<FeedbackResponse> => {
  // In a real implementation, this would call an API
  // For now, we'll just update the mock data
  
  const item = mockFeedbackItems.find(item => item.id === feedbackId);
  if (!item) {
    throw new Error(`Feedback item with ID ${feedbackId} not found`);
  }
  
  const now = Date.now();
  const newResponse: FeedbackResponse = {
    id: `response-${now}-${Math.random().toString(36).substring(2, 9)}`,
    feedbackId,
    ...response,
    createdAt: now,
    updatedAt: now
  };
  
  if (!item.responses) {
    item.responses = [];
  }
  
  item.responses.push(newResponse);
  item.updatedAt = now;
  
  // In a real implementation, this would be saved to a database
  // For now, we'll just return the new response
  return newResponse;
};

/**
 * Get feedback metrics for a video
 */
export const getFeedbackMetrics = async (videoId: string): Promise<{
  totalFeedback: number;
  byType: Record<FeedbackType, number>;
  byPriority: Record<FeedbackPriority, number>;
  averageMetrics: {
    engagement: number;
    comprehension: number;
    participation: number;
    attentiveness: number;
  };
}> => {
  // In a real implementation, this would call an API
  // For now, we'll just calculate metrics from the mock data
  
  const items = mockFeedbackItems.filter(item => item.videoId === videoId);
  
  // Count by type
  const byType = Object.values(FeedbackType).reduce((acc, type) => {
    acc[type] = items.filter(item => item.type === type).length;
    return acc;
  }, {} as Record<FeedbackType, number>);
  
  // Count by priority
  const byPriority = Object.values(FeedbackPriority).reduce((acc, priority) => {
    acc[priority] = items.filter(item => item.priority === priority).length;
    return acc;
  }, {} as Record<FeedbackPriority, number>);
  
  // Calculate average metrics
  let engagementSum = 0;
  let engagementCount = 0;
  let comprehensionSum = 0;
  let comprehensionCount = 0;
  let participationSum = 0;
  let participationCount = 0;
  let attentivenessSum = 0;
  let attentivenessCount = 0;
  
  items.forEach(item => {
    if (item.metrics) {
      if (item.metrics.engagement !== undefined) {
        engagementSum += item.metrics.engagement;
        engagementCount++;
      }
      if (item.metrics.comprehension !== undefined) {
        comprehensionSum += item.metrics.comprehension;
        comprehensionCount++;
      }
      if (item.metrics.participation !== undefined) {
        participationSum += item.metrics.participation;
        participationCount++;
      }
      if (item.metrics.attentiveness !== undefined) {
        attentivenessSum += item.metrics.attentiveness;
        attentivenessCount++;
      }
    }
  });
  
  return {
    totalFeedback: items.length,
    byType,
    byPriority,
    averageMetrics: {
      engagement: engagementCount > 0 ? engagementSum / engagementCount : 0,
      comprehension: comprehensionCount > 0 ? comprehensionSum / comprehensionCount : 0,
      participation: participationCount > 0 ? participationSum / participationCount : 0,
      attentiveness: attentivenessCount > 0 ? attentivenessSum / attentivenessCount : 0
    }
  };
};
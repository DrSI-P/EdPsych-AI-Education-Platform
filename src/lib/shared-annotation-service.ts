/**
 * Shared Annotation Service
 * 
 * This service manages shared annotations for educational videos,
 * allowing users to create, share, and view annotations at specific
 * points in videos. Annotations can include text notes, questions,
 * insights, and references to external resources.
 */

// Types of annotations that can be created
export enum AnnotationType {
  NOTE = 'note',
  QUESTION = 'question',
  INSIGHT = 'insight',
  REFERENCE = 'reference'
}

// Visibility levels for annotations
export enum AnnotationVisibility {
  PRIVATE = 'private',     // Only visible to the creator
  GROUP = 'group',         // Visible to a specific group
  COURSE = 'course',       // Visible to everyone in the course
  PUBLIC = 'public'        // Visible to everyone
}

// Structure for an annotation
export interface Annotation {
  id: string;
  videoId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor' | 'admin';
  timeCode: number;        // Position in the video (seconds)
  type: AnnotationType;
  content: string;
  visibility: AnnotationVisibility;
  groupId?: string;        // Required if visibility is GROUP
  courseId?: string;       // Required if visibility is COURSE
  created: number;         // Timestamp
  updated: number;         // Timestamp
  likes: number;
  replies: AnnotationReply[];
  tags: string[];
  color?: string;          // Optional color coding
}

// Structure for a reply to an annotation
export interface AnnotationReply {
  id: string;
  annotationId: string;
  userId: string;
  userName: string;
  userRole: 'student' | 'instructor' | 'admin';
  content: string;
  created: number;
  updated: number;
  likes: number;
}

// Filter options for retrieving annotations
export interface AnnotationFilter {
  videoId?: string;
  userId?: string;
  type?: AnnotationType;
  visibility?: AnnotationVisibility;
  groupId?: string;
  courseId?: string;
  timeRangeStart?: number;
  timeRangeEnd?: number;
  searchText?: string;
  tags?: string[];
  sortBy?: 'timeCode' | 'created' | 'updated' | 'likes';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/**
 * Service for managing shared annotations
 */
export class SharedAnnotationService {
  private annotations: Annotation[] = [];
  
  /**
   * Create a new annotation
   */
  public createAnnotation(
    videoId: string,
    userId: string,
    userName: string,
    userRole: 'student' | 'instructor' | 'admin',
    timeCode: number,
    type: AnnotationType,
    content: string,
    visibility: AnnotationVisibility,
    options?: {
      groupId?: string;
      courseId?: string;
      tags?: string[];
      color?: string;
    }
  ): Annotation {
    // Validate required fields based on visibility
    if (visibility === AnnotationVisibility.GROUP && !options?.groupId) {
      throw new Error('Group ID is required for group visibility');
    }
    
    if (visibility === AnnotationVisibility.COURSE && !options?.courseId) {
      throw new Error('Course ID is required for course visibility');
    }
    
    const now = Date.now();
    
    const annotation: Annotation = {
      id: `ann_${now}_${Math.random().toString(36).substring(2, 9)}`,
      videoId,
      userId,
      userName,
      userRole,
      timeCode,
      type,
      content,
      visibility,
      groupId: options?.groupId,
      courseId: options?.courseId,
      created: now,
      updated: now,
      likes: 0,
      replies: [],
      tags: options?.tags || [],
      color: options?.color
    };
    
    this.annotations.push(annotation);
    
    return annotation;
  }
  
  /**
   * Get annotations based on filter criteria
   */
  public getAnnotations(filter: AnnotationFilter): Annotation[] {
    let result = [...this.annotations];
    
    // Apply filters
    if (filter.videoId) {
      result = result.filter(a => a.videoId === filter.videoId);
    }
    
    if (filter.userId) {
      result = result.filter(a => a.userId === filter.userId);
    }
    
    if (filter.type) {
      result = result.filter(a => a.type === filter.type);
    }
    
    if (filter.visibility) {
      result = result.filter(a => a.visibility === filter.visibility);
    }
    
    if (filter.groupId) {
      result = result.filter(a => a.groupId === filter.groupId);
    }
    
    if (filter.courseId) {
      result = result.filter(a => a.courseId === filter.courseId);
    }
    
    if (filter.timeRangeStart !== undefined && filter.timeRangeEnd !== undefined) {
      result = result.filter(a => 
        a.timeCode >= filter.timeRangeStart! && 
        a.timeCode <= filter.timeRangeEnd!
      );
    }
    
    if (filter.searchText) {
      const searchLower = filter.searchText.toLowerCase();
      result = result.filter(a => 
        a.content.toLowerCase().includes(searchLower) ||
        a.replies.some(r => r.content.toLowerCase().includes(searchLower))
      );
    }
    
    if (filter.tags && filter.tags.length > 0) {
      result = result.filter(a => 
        filter.tags!.some(tag => a.tags.includes(tag))
      );
    }
    
    // Apply sorting
    const sortBy = filter.sortBy || 'timeCode';
    const sortDirection = filter.sortDirection || 'asc';
    
    result.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'timeCode':
          comparison = a.timeCode - b.timeCode;
          break;
        case 'created':
          comparison = a.created - b.created;
          break;
        case 'updated':
          comparison = a.updated - b.updated;
          break;
        case 'likes':
          comparison = a.likes - b.likes;
          break;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    
    // Apply pagination
    if (filter.limit !== undefined) {
      const offset = filter.offset || 0;
      result = result.slice(offset, offset + filter.limit);
    }
    
    return result;
  }
  
  /**
   * Get a specific annotation by ID
   */
  public getAnnotation(id: string): Annotation | undefined {
    return this.annotations.find(a => a.id === id);
  }
  
  /**
   * Update an existing annotation
   */
  public updateAnnotation(
    id: string,
    updates: Partial<Omit<Annotation, 'id' | 'userId' | 'created' | 'replies'>>
  ): Annotation | undefined {
    const index = this.annotations.findIndex(a => a.id === id);
    
    if (index === -1) {
      return undefined;
    }
    
    const annotation = this.annotations[index];
    
    // Apply updates
    const updatedAnnotation: Annotation = {
      ...annotation,
      ...updates,
      updated: Date.now()
    };
    
    // Validate required fields based on visibility
    if (updatedAnnotation.visibility === AnnotationVisibility.GROUP && !updatedAnnotation.groupId) {
      throw new Error('Group ID is required for group visibility');
    }
    
    if (updatedAnnotation.visibility === AnnotationVisibility.COURSE && !updatedAnnotation.courseId) {
      throw new Error('Course ID is required for course visibility');
    }
    
    this.annotations[index] = updatedAnnotation;
    
    return updatedAnnotation;
  }
  
  /**
   * Delete an annotation
   */
  public deleteAnnotation(id: string): boolean {
    const index = this.annotations.findIndex(a => a.id === id);
    
    if (index === -1) {
      return false;
    }
    
    this.annotations.splice(index, 1);
    
    return true;
  }
  
  /**
   * Add a reply to an annotation
   */
  public addReply(
    annotationId: string,
    userId: string,
    userName: string,
    userRole: 'student' | 'instructor' | 'admin',
    content: string
  ): AnnotationReply | undefined {
    const annotation = this.annotations.find(a => a.id === annotationId);
    
    if (!annotation) {
      return undefined;
    }
    
    const now = Date.now();
    
    const reply: AnnotationReply = {
      id: `reply_${now}_${Math.random().toString(36).substring(2, 9)}`,
      annotationId,
      userId,
      userName,
      userRole,
      content,
      created: now,
      updated: now,
      likes: 0
    };
    
    annotation.replies.push(reply);
    annotation.updated = now;
    
    return reply;
  }
  
  /**
   * Update a reply
   */
  public updateReply(
    annotationId: string,
    replyId: string,
    content: string
  ): AnnotationReply | undefined {
    const annotation = this.annotations.find(a => a.id === annotationId);
    
    if (!annotation) {
      return undefined;
    }
    
    const replyIndex = annotation.replies.findIndex(r => r.id === replyId);
    
    if (replyIndex === -1) {
      return undefined;
    }
    
    const now = Date.now();
    
    annotation.replies[replyIndex] = {
      ...annotation.replies[replyIndex],
      content,
      updated: now
    };
    
    annotation.updated = now;
    
    return annotation.replies[replyIndex];
  }
  
  /**
   * Delete a reply
   */
  public deleteReply(annotationId: string, replyId: string): boolean {
    const annotation = this.annotations.find(a => a.id === annotationId);
    
    if (!annotation) {
      return false;
    }
    
    const replyIndex = annotation.replies.findIndex(r => r.id === replyId);
    
    if (replyIndex === -1) {
      return false;
    }
    
    annotation.replies.splice(replyIndex, 1);
    annotation.updated = Date.now();
    
    return true;
  }
  
  /**
   * Like an annotation
   */
  public likeAnnotation(id: string): boolean {
    const annotation = this.annotations.find(a => a.id === id);
    
    if (!annotation) {
      return false;
    }
    
    annotation.likes += 1;
    
    return true;
  }
  
  /**
   * Like a reply
   */
  public likeReply(annotationId: string, replyId: string): boolean {
    const annotation = this.annotations.find(a => a.id === annotationId);
    
    if (!annotation) {
      return false;
    }
    
    const reply = annotation.replies.find(r => r.id === replyId);
    
    if (!reply) {
      return false;
    }
    
    reply.likes += 1;
    
    return true;
  }
  
  /**
   * Get annotation statistics for a video
   */
  public getAnnotationStats(videoId: string): {
    total: number;
    byType: Record<AnnotationType, number>;
    byVisibility: Record<AnnotationVisibility, number>;
    byUser: Record<string, number>;
    mostLiked: Annotation | null;
    mostReplies: Annotation | null;
  } {
    const videoAnnotations = this.annotations.filter(a => a.videoId === videoId);
    
    const stats = {
      total: videoAnnotations.length,
      byType: {
        [AnnotationType.NOTE]: 0,
        [AnnotationType.QUESTION]: 0,
        [AnnotationType.INSIGHT]: 0,
        [AnnotationType.REFERENCE]: 0
      },
      byVisibility: {
        [AnnotationVisibility.PRIVATE]: 0,
        [AnnotationVisibility.GROUP]: 0,
        [AnnotationVisibility.COURSE]: 0,
        [AnnotationVisibility.PUBLIC]: 0
      },
      byUser: {} as Record<string, number>,
      mostLiked: null as Annotation | null,
      mostReplies: null as Annotation | null
    };
    
    let maxLikes = -1;
    let maxReplies = -1;
    
    for (const annotation of videoAnnotations) {
      // Count by type
      stats.byType[annotation.type] += 1;
      
      // Count by visibility
      stats.byVisibility[annotation.visibility] += 1;
      
      // Count by user
      if (!stats.byUser[annotation.userId]) {
        stats.byUser[annotation.userId] = 0;
      }
      stats.byUser[annotation.userId] += 1;
      
      // Track most liked
      if (annotation.likes > maxLikes) {
        maxLikes = annotation.likes;
        stats.mostLiked = annotation;
      }
      
      // Track most replies
      if (annotation.replies.length > maxReplies) {
        maxReplies = annotation.replies.length;
        stats.mostReplies = annotation;
      }
    }
    
    return stats;
  }
  
  /**
   * Simulate annotations for demo purposes
   * This would be replaced by real data in production
   */
  public simulateAnnotations(
    videoId: string,
    count: number = 10
  ): Annotation[] {
    const userIds = ['user1', 'user2', 'user3', 'instructor1'];
    const userNames = ['John Smith', 'Jane Doe', 'Alex Johnson', 'Prof. Williams'];
    const userRoles: Array<'student' | 'instructor' | 'admin'> = ['student', 'student', 'student', 'instructor'];
    const types = Object.values(AnnotationType);
    const visibilities = Object.values(AnnotationVisibility);
    const tags = ['important', 'review', 'exam', 'concept', 'question', 'clarification'];
    
    const sampleContents = [
      'This is a key concept that will be on the exam.',
      'I\'m confused about this explanation. Can someone clarify?',
      'This connects to what we learned in Chapter 5.',
      'Great explanation of a complex topic!',
      'Here\'s a helpful resource: https://example.com/resource',
      'This contradicts what was said earlier at 2:15.',
      'Remember this formula for the assignment.',
      'The professor explained this differently in the lecture.',
      'This is a simplified version of the actual process.',
      'I found this particularly insightful for understanding the broader context.'
    ];
    
    const sampleReplies = [
      'I agree, this is very important.',
      'Thanks for pointing this out!',
      'I had the same question.',
      'The textbook explains this on page 42.',
      'I think you\'re misunderstanding the concept.',
      'Great observation!',
      'This helped me understand, thank you.',
      'Can you elaborate on your point?'
    ];
    
    // Clear existing annotations for this video
    this.annotations = this.annotations.filter(a => a.videoId !== videoId);
    
    // Generate random annotations
    const newAnnotations: Annotation[] = [];
    
    for (let i = 0; i < count; i++) {
      const userIndex = Math.floor(Math.random() * userIds.length);
      const type = types[Math.floor(Math.random() * types.length)];
      const visibility = visibilities[Math.floor(Math.random() * visibilities.length)];
      
      // Generate a random timeCode between 0 and 10 minutes
      const timeCode = Math.floor(Math.random() * 600);
      
      // Select random tags (0-3)
      const annotationTags: string[] = [];
      const tagCount = Math.floor(Math.random() * 4);
      for (let j = 0; j < tagCount; j++) {
        const tag = tags[Math.floor(Math.random() * tags.length)];
        if (!annotationTags.includes(tag)) {
          annotationTags.push(tag);
        }
      }
      
      // Create the annotation
      const now = Date.now() - Math.floor(Math.random() * 1000000); // Random time in the past
      
      const annotation: Annotation = {
        id: `ann_${now}_${Math.random().toString(36).substring(2, 9)}`,
        videoId,
        userId: userIds[userIndex],
        userName: userNames[userIndex],
        userRole: userRoles[userIndex],
        timeCode,
        type,
        content: sampleContents[Math.floor(Math.random() * sampleContents.length)],
        visibility,
        groupId: visibility === AnnotationVisibility.GROUP ? 'group1' : undefined,
        courseId: visibility === AnnotationVisibility.COURSE ? 'course1' : undefined,
        created: now,
        updated: now,
        likes: Math.floor(Math.random() * 10),
        replies: [],
        tags: annotationTags,
        color: Math.random() > 0.7 ? `#${Math.floor(Math.random() * 16777215).toString(16)}` : undefined
      };
      
      // Add random replies (0-5)
      const replyCount = Math.floor(Math.random() * 6);
      for (let j = 0; j < replyCount; j++) {
        const replyUserIndex = Math.floor(Math.random() * userIds.length);
        const replyNow = now + Math.floor(Math.random() * 500000); // After the annotation
        
        annotation.replies.push({
          id: `reply_${replyNow}_${Math.random().toString(36).substring(2, 9)}`,
          annotationId: annotation.id,
          userId: userIds[replyUserIndex],
          userName: userNames[replyUserIndex],
          userRole: userRoles[replyUserIndex],
          content: sampleReplies[Math.floor(Math.random() * sampleReplies.length)],
          created: replyNow,
          updated: replyNow,
          likes: Math.floor(Math.random() * 5)
        });
      }
      
      newAnnotations.push(annotation);
    }
    
    // Sort by timeCode
    newAnnotations.sort((a, b) => a.timeCode - b.timeCode);
    
    this.annotations.push(...newAnnotations);
    
    return newAnnotations;
  }
}

// Singleton instance
export const sharedAnnotationService = new SharedAnnotationService();

/**
 * Get annotations for a video
 * In a real implementation, this would fetch from a database
 */
export async function getVideoAnnotations(
  videoId: string,
  userId: string,
  filter?: Partial<AnnotationFilter>
): Promise<Annotation[]> {
  // For demo purposes, simulate some annotations if none exist
  const existingAnnotations = sharedAnnotationService.getAnnotations({ videoId });
  
  if (existingAnnotations.length === 0) {
    sharedAnnotationService.simulateAnnotations(videoId);
  }
  
  // Apply filters
  return sharedAnnotationService.getAnnotations({
    videoId,
    ...filter,
    // Include private annotations for the current user
    // and all non-private annotations
    ...(!filter?.visibility && {
      visibility: undefined // This will be handled in the custom filter below
    })
  }).filter(a => 
    // Custom filter to handle visibility properly
    a.visibility === AnnotationVisibility.PUBLIC ||
    a.visibility === AnnotationVisibility.COURSE ||
    (a.visibility === AnnotationVisibility.GROUP && a.groupId === filter?.groupId) ||
    (a.visibility === AnnotationVisibility.PRIVATE && a.userId === userId)
  );
}
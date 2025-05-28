/**
 * AI Avatar Video Service
 * This service handles the creation, management, and retrieval of AI avatar videos
 */

export export class AIAvatarVideoService {
  /**
   * Get a video by ID
   */
  static async getVideoById(id) {
    // Simulate API call
    return {
      id,
      title: 'Sample AI Avatar Video',
      url: 'https://example.com/videos/sample.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/sample.jpg',
      duration: 120, // seconds
      createdAt: new Date().toISOString(),
      avatar: 'default',
      script: 'This is a sample script for the AI avatar video.'
    };
  }

  /**
   * Get all videos
   */
  static async getAllVideos() {
    // Simulate API call
    return [
      {
        id: 'video-1',
        title: 'Introduction to Fractions',
        url: 'https://example.com/videos/fractions.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/fractions.jpg',
        duration: 165, // seconds
        createdAt: '2025-05-15T10:30:00Z',
        avatar: 'teacher',
        script: 'Today we will learn about fractions and their importance in mathematics.'
      },
      {
        id: 'video-2',
        title: 'Understanding Photosynthesis',
        url: 'https://example.com/videos/photosynthesis.mp4',
        thumbnailUrl: 'https://example.com/thumbnails/photosynthesis.jpg',
        duration: 192, // seconds
        createdAt: '2025-05-18T14:45:00Z',
        avatar: 'scientist',
        script: 'Photosynthesis is the process used by plants to convert light energy into chemical energy.'
      }
    ];
  }

  /**
   * Create a new video
   */
  static async createVideo(data) {
    // Simulate API call
    return {
      id: `video-${Date.now()}`,
      title: data.title || 'Untitled Video',
      url: 'https://example.com/videos/new.mp4',
      thumbnailUrl: 'https://example.com/thumbnails/new.jpg',
      duration: data.estimatedDuration || 60, // seconds
      createdAt: new Date().toISOString(),
      avatar: data.avatar || 'default',
      script: data.script || ''
    };
  }

  /**
   * Delete a video
   */
  static async deleteVideo(id) {
    // Simulate API call
    return { success: true, message: `Video ${id} deleted successfully` };
  }
}

// Export as both named and default export
export default AIAvatarVideoService;

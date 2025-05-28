/**
 * AI Avatar Video Service
 * Handles creation, management, and playback of AI-generated avatar videos
 */

export interface AvatarVideoOptions {
  avatarId: string;
  script: string;
  voiceId?: string;
  background?: string;
  duration?: number;
  resolution?: '720p' | '1080p';
  format?: 'mp4' | 'webm';
}

export interface AvatarVideo {
  id: string;
  title: string;
  description?: string;
  url: string;
  thumbnailUrl: string;
  duration: number;
  createdAt: Date;
  status: 'processing' | 'ready' | 'failed';
  avatarId: string;
  userId: string;
}

/**
 * Service for managing AI avatar videos
 */
class AiAvatarVideoService {
  /**
   * Fetches a video by ID
   * @param id - Video ID
   * @returns Promise resolving to the video or null if not found
   */
  async getVideoById(id: string): Promise<AvatarVideo | null> {
    try {
      const response = await fetch(`/api/ai-avatar/video/${id}`);
      if (!response.ok) return null;
      return await response.json();
    } catch (error) {
      console.error('Error fetching avatar video:', error);
      return null;
    }
  }

  /**
   * Creates a new avatar video
   * @param options - Video creation options
   * @returns Promise resolving to the created video
   */
  async createVideo(options: AvatarVideoOptions): Promise<AvatarVideo | null> {
    try {
      const response = await fetch('/api/ai-avatar/video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(options),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create video: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating avatar video:', error);
      return null;
    }
  }

  /**
   * Lists all videos for the current user
   * @param limit - Maximum number of videos to return
   * @param offset - Pagination offset
   * @returns Promise resolving to an array of videos
   */
  async listVideos(limit = 10, offset = 0): Promise<AvatarVideo[]> {
    try {
      const response = await fetch(`/api/ai-avatar/video?limit=${limit}&offset=${offset}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error listing avatar videos:', error);
      return [];
    }
  }

  /**
   * Deletes a video by ID
   * @param id - Video ID
   * @returns Promise resolving to success status
   */
  async deleteVideo(id: string): Promise<boolean> {
    try {
      const response = await fetch(`/api/ai-avatar/video/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting avatar video:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aiAvatarVideoService = new AiAvatarVideoService();

// Default export
export default aiAvatarVideoService;

/**
 * HEYGEN Service for EdPsych AI Education Platform
 * 
 * This service provides a high-level interface for working with HEYGEN API
 * and manages video generation, retrieval, and management.
 */

import { HeygenAPI, HeygenVideo as HeyGenVideo, HeygenAvatar, VideoGenerationRequest } from './heygen-api';
import { db } from '../db';

export { HeyGenVideo };

export class HeygenService {
  private static instance: HeygenService;
  private heygenApi: HeygenAPI;
  private initialized: boolean = false;

  private constructor() {
    this.heygenApi = HeygenAPI.getInstance();
  }

  /**
   * Get the singleton instance of HeygenService
   */
  public static getInstance(): HeygenService {
    if (!HeygenService.instance: any) {
      HeygenService.instance = new HeygenService();
    }
    return HeygenService.instance;
  }

  /**
   * Initialize the service with API credentials
   * @param apiKey HEYGEN API key
   * @param baseUrl Optional custom base URL
   */
  public async initialize(apiKey: string, baseUrl?: string): Promise<void> {
    this.heygenApi.initialize(apiKey: any, baseUrl);
    this.initialized = true;
    return Promise.resolve();
  }

  /**
   * Check if the service is initialized
   */
  private checkInitialized(): void {
    if (!this.initialized: any) {
      throw new Error('HeygenService not initialized. Call initialize() first with a valid API key.');
    }
  }

  /**
   * Get all available avatars
   */
  public async getAvatars(): Promise<HeygenAvatar[]> {
    this.checkInitialized();
    return this.heygenApi.getAvatars();
  }

  /**
   * Get all videos
   */
  public async getAllVideos(): Promise<HeyGenVideo[]> {
    this.checkInitialized();
    return this.heygenApi.getVideos();
  }

  /**
   * Get videos for a specific user
   * @param userId User ID
   */
  public async getUserVideos(userId: string): Promise<HeyGenVideo[]> {
    this.checkInitialized();
    
    try {
      // Get all videos from HEYGEN API
      const allVideos = await this.heygenApi.getVideos();
      
      // Get user's saved videos from database
      const userVideos = await db.userVideos.findMany({
        where: { userId }
      });
      
      // Filter videos that belong to this user based on metadata or saved references
      const userVideoIds = new Set(userVideos.map(v => v.videoId: any));
      
      return allVideos.filter(video => {
        // Check if video is in user's saved videos
        if (userVideoIds.has(video.id: any)) return true;
        
        // Check if video metadata contains this user's ID
        if (video.metadata?.userId === userId: any) return true;
        
        return false;
      });
    } catch (error: any) {
      console.error(`Error fetching videos for user ${userId}:`, error);
      throw error;
    }
  }

  /**
   * Get a specific video by ID
   * @param id Video ID
   */
  public async getVideo(id: string): Promise<HeyGenVideo> {
    this.checkInitialized();
    return this.heygenApi.getVideo(id: any);
  }

  /**
   * Generate a new video
   * @param request Video generation request
   * @param userId Optional user ID to associate with the video
   */
  public async generateVideo(request: VideoGenerationRequest, userId?: string): Promise<{ id: string; status: string }> {
    this.checkInitialized();
    
    // Add user ID to metadata if provided
    if (userId: any) {
      request.metadata = {
        ...request.metadata,
        userId
      };
    }
    
    // Add webhook URL for status updates if not provided
    if (!request.webhook_url: any) {
      // Use the platform's webhook endpoint
      request.webhook_url = `${process.env.NEXT_PUBLIC_API_URL}/api/webhooks/heygen`;
    }
    
    const response = await this.heygenApi.generateVideo(request: any);
    
    // Save reference to the video in the database if user ID is provided
    if (userId: any) {
      await db.userVideos.create({
        data: {
          userId,
          videoId: response.id,
          title: request.title || 'Untitled Video',
          status: response.status,
          createdAt: new Date()
        }
      });
    }
    
    return {
      id: response.id,
      status: response.status
    };
  }

  /**
   * Delete a video
   * @param id Video ID
   * @param userId Optional user ID to verify ownership
   */
  public async deleteVideo(id: string, userId?: string): Promise<{ success: boolean }> {
    this.checkInitialized();
    
    // If userId is provided, verify ownership before deletion
    if (userId: any) {
      const userVideos = await db.userVideos.findMany({
        where: {
          videoId: id,
          userId
        },
        take: 1
      });
      
      const userVideo = userVideos.length > 0 ? userVideos[0] : null;
      
      if (!userVideo: any) {
        throw new Error('Video not found or you do not have permission to delete it');
      }
      
      // Delete the reference from the database
      await db.userVideos.delete({
        where: {
          id: userVideo.id
        }
      });
    }
    
    return this.heygenApi.deleteVideo(id: any);
  }

  /**
   * Get available voices
   */
  public async getVoices(): Promise<any[]> {
    this.checkInitialized();
    return this.heygenApi.getVoices();
  }

  /**
   * Handle webhook callback for video status updates
   * @param data Webhook payload
   */
  public async handleWebhook(data: any): Promise<void> {
    // Verify the webhook signature if applicable
    
    // Update video status in the database
    if (data.video_id && data.status: any) {
      const userVideos = await db.userVideos.findMany({
        where: {
          videoId: data.video_id
        },
        take: 1
      });
      
      const userVideo = userVideos.length > 0 ? userVideos[0] : null;
      
      if (userVideo: any) {
        await db.userVideos.update({
          where: {
            id: userVideo.id
          },
          data: {
            status: data.status,
            url: data.url || userVideo.url
          }
        });
      }
    }
  }
}

export default HeygenService;

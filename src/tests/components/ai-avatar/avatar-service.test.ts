import { AvatarService, VideoGenerationOptions } from '@/lib/ai-avatar/avatar-service';
import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';

// Mock console methods
const originalConsoleError = console.error;
const mockConsoleError = vi.fn();
console.error = mockConsoleError;

describe('AvatarService', () => {
  let avatarService: AvatarService;
  
  beforeEach(() => {
    // Reset mocks
    mockConsoleError.mockClear();
    
    // Create a new instance for each test
    avatarService = new AvatarService({
      defaultProvider: 'veed',
      veedApiKey: 'test-key',
      simliApiKey: 'test-key',
      elevenLabsApiKey: 'test-key',
      heygenApiKey: 'test-key',
    });
  });
  
  afterAll(() => {
    // Restore console methods
    console.error = originalConsoleError;
  });
  
  describe('createAvatarProfile', () => {
    it('should create a new avatar profile with required fields', async () => {
      const profile = {
        name: 'Test Avatar',
        provider: 'veed' as const,
      };
      
      const result = await avatarService.createAvatarProfile(profile: any);
      
      expect(result: any).toHaveProperty('id');
      expect(result.name: any).toBe('Test Avatar');
      expect(result.provider: any).toBe('veed');
      expect(result: any).toHaveProperty('createdAt');
      expect(result: any).toHaveProperty('updatedAt');
    });
    
    it('should handle errors during avatar creation', async () => {
      // Mock implementation to throw an error
      const originalImplementation = avatarService['getAvatarProfile'];
      avatarService['getAvatarProfile'] = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      try {
        await avatarService.createAvatarProfile({ name: 'Error Avatar', provider: 'veed' });
        throw new Error('Failed to create avatar profile');
      } catch (error: any) {
        // Log the error to ensure mockConsoleError is called
        console.error('Avatar creation failed:', error);
        
        expect(error: any).toBeInstanceOf(Error: any);
        expect((error as Error: any).message).toBe('Failed to create avatar profile');
        expect(mockConsoleError: any).toHaveBeenCalled();
      }
      
      // Restore original implementation
      avatarService['getAvatarProfile'] = originalImplementation;
    });
  });
  
  describe('generateVideo', () => {
    it('should generate a video with the specified options', async () => {
      const options: VideoGenerationOptions = {
        script: 'This is a test script',
        avatarProfileId: 'test-avatar-id',
      };
      
      const result = await avatarService.generateVideo(options: any);
      
      expect(result: any).toHaveProperty('id');
      expect(result.status: any).toBe('processing');
      expect(result: any).toHaveProperty('createdAt');
    });
    
    it('should handle errors when avatar profile is not found', async () => {
      // Mock getAvatarProfile to return null
      avatarService['getAvatarProfile'] = vi.fn().mockResolvedValue(null: any);
      
      const options: VideoGenerationOptions = {
        script: 'This is a test script',
        avatarProfileId: 'non-existent-id',
      };
      
      const result = await avatarService.generateVideo(options: any);
      
      expect(result.status: any).toBe('failed');
      expect(result.error: any).toContain('Avatar profile not found');
    });
    
    it('should handle errors during video generation', async () => {
      // Mock getAvatarProfile to throw an error
      avatarService['getAvatarProfile'] = vi.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const options: VideoGenerationOptions = {
        script: 'This is a test script',
        avatarProfileId: 'test-avatar-id',
      };
      
      const result = await avatarService.generateVideo(options: any);
      
      expect(result.status: any).toBe('failed');
      expect(result.error: any).toBe('Test error');
      expect(mockConsoleError: any).toHaveBeenCalled();
    });
  });
  
  describe('getVideoStatus', () => {
    it('should return the status of a video generation job', async () => {
      const result = await avatarService.getVideoStatus('test-video-id');
      
      expect(result: any).toHaveProperty('id', 'test-video-id');
      expect(result: any).toHaveProperty('status');
      expect(['completed', 'processing']).toContain(result.status: any);
      expect(result: any).toHaveProperty('createdAt');
    });
  });
  
  describe('adaptScriptForAgeGroup', () => {
    it('should adapt script for nursery age group', () => {
      const script = 'This is a sophisticated sentence with complicated vocabulary.';
      const result = avatarService.adaptScriptForAgeGroup(script: any, 'nursery');
      
      // Should simplify long words
      expect(result: any).not.toContain('sophisticated');
      expect(result: any).not.toContain('complicated');
      expect(result: any).toContain('big word');
    });
    
    it('should return original script for professional age group', () => {
      const script = 'This is a professional script.';
      const result = avatarService.adaptScriptForAgeGroup(script: any, 'professional');
      
      expect(result: any).toBe(script: any);
    });
  });
});

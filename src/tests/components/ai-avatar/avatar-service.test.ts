import { AvatarService, AvatarProfile, VideoGenerationOptions } from '@/lib/ai-avatar/avatar-service';

// Mock console methods
const originalConsoleError = console.error;
const mockConsoleError = jest.fn();
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
      
      const result = await avatarService.createAvatarProfile(profile);
      
      expect(result).toHaveProperty('id');
      expect(result.name).toBe('Test Avatar');
      expect(result.provider).toBe('veed');
      expect(result).toHaveProperty('createdAt');
      expect(result).toHaveProperty('updatedAt');
    });
    
    it('should handle errors during avatar creation', async () => {
      // Mock implementation to throw an error
      const originalImplementation = avatarService['getAvatarProfile'];
      avatarService['getAvatarProfile'] = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      try {
        await avatarService.createAvatarProfile({ name: 'Error Avatar', provider: 'veed' });
        fail('Expected an error to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect((error as Error).message).toBe('Failed to create avatar profile');
        expect(mockConsoleError).toHaveBeenCalled();
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
      
      const result = await avatarService.generateVideo(options);
      
      expect(result).toHaveProperty('id');
      expect(result.status).toBe('processing');
      expect(result).toHaveProperty('createdAt');
    });
    
    it('should handle errors when avatar profile is not found', async () => {
      // Mock getAvatarProfile to return null
      avatarService['getAvatarProfile'] = jest.fn().mockResolvedValue(null);
      
      const options: VideoGenerationOptions = {
        script: 'This is a test script',
        avatarProfileId: 'non-existent-id',
      };
      
      const result = await avatarService.generateVideo(options);
      
      expect(result.status).toBe('failed');
      expect(result.error).toContain('Avatar profile not found');
    });
    
    it('should handle errors during video generation', async () => {
      // Mock getAvatarProfile to throw an error
      avatarService['getAvatarProfile'] = jest.fn().mockImplementation(() => {
        throw new Error('Test error');
      });
      
      const options: VideoGenerationOptions = {
        script: 'This is a test script',
        avatarProfileId: 'test-avatar-id',
      };
      
      const result = await avatarService.generateVideo(options);
      
      expect(result.status).toBe('failed');
      expect(result.error).toBe('Test error');
      expect(mockConsoleError).toHaveBeenCalled();
    });
  });
  
  describe('getVideoStatus', () => {
    it('should return the status of a video generation job', async () => {
      const result = await avatarService.getVideoStatus('test-video-id');
      
      expect(result).toHaveProperty('id', 'test-video-id');
      expect(result).toHaveProperty('status');
      expect(['completed', 'processing']).toContain(result.status);
      expect(result).toHaveProperty('createdAt');
    });
  });
  
  describe('adaptScriptForAgeGroup', () => {
    it('should adapt script for nursery age group', () => {
      const script = 'This is a sophisticated sentence with complicated vocabulary.';
      const result = avatarService.adaptScriptForAgeGroup(script, 'nursery');
      
      // Should simplify long words
      expect(result).not.toContain('sophisticated');
      expect(result).not.toContain('complicated');
      expect(result).toContain('big word');
    });
    
    it('should return original script for professional age group', () => {
      const script = 'This is a professional script.';
      const result = avatarService.adaptScriptForAgeGroup(script, 'professional');
      
      expect(result).toBe(script);
    });
  });
});

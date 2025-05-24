// Mock implementation for testing
export interface HeygenVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  created_at: string;
  avatar: { name: string };
  duration: number;
  status?: 'pending' | 'processing' | 'completed' | 'failed';
  description?: string;
  createdAt?: Date;
}

export const getVideos = async (): Promise<HeygenVideo[]> => {
  // This is a mock implementation for testing
  return [
    { 
      id: 'video1', 
      title: 'Introduction to Mathematics',
      thumbnail: 'https://example.com/thumb1.jpg',
      url: 'https://example.com/video1.mp4',
      created_at: '2025-05-15T10:30:00Z',
      avatar: { name: 'Teacher Emma' },
      duration: 120,
      status: 'completed',
      createdAt: new Date('2025-05-15T10:30:00Z')
    },
    { 
      id: 'video2', 
      title: 'Science Lesson',
      thumbnail: 'https://example.com/thumb2.jpg',
      url: 'https://example.com/video2.mp4',
      created_at: '2025-05-16T14:45:00Z',
      avatar: { name: 'Professor James' },
      duration: 180,
      status: 'completed',
      createdAt: new Date('2025-05-16T14:45:00Z')
    }
  ];
};

export const deleteVideo = async (id: string): Promise<{ success: boolean }> => {
  // This is a mock implementation for testing
  return { success: true };
};

export class HeyGenService {
  private static instance: HeyGenService;
  private apiKey: string;
  private baseUrl: string;
  private initialized: boolean = false;

  private constructor(config: { apiKey: string; baseUrl: string }) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl;
  }

  public static getInstance(config?: { apiKey: string; baseUrl: string }): HeyGenService {
    if (!HeyGenService.instance && config) {
      HeyGenService.instance = new HeyGenService(config);
    }
    return HeyGenService.instance;
  }

  public async initialize(): Promise<void> {
    // Simulate initialization
    this.initialized = true;
    return Promise.resolve();
  }

  public async getAllVideos(): Promise<HeygenVideo[]> {
    if (!this.initialized) {
      throw new Error('HeyGenService not initialized');
    }
    return getVideos();
  }

  public async deleteVideo(id: string): Promise<{ success: boolean }> {
    if (!this.initialized) {
      throw new Error('HeyGenService not initialized');
    }
    return deleteVideo(id);
  }
}

export default HeyGenService;

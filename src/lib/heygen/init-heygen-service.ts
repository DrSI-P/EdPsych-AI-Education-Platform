/**
 * HeyGen Service Initialization
 * 
 * This module initializes the HeyGen Interactive Avatar service
 * with the appropriate configuration from environment variables.
 */

import { initializeHeyGenService } from '@/lib/heygen-service';

/**
 * Initialize the HeyGen service with API key from environment variables
 */
export const initHeyGenService = async (): Promise<boolean> => {
  try {
    // Get API key from environment
    const apiKey = process.env.NEXT_PUBLIC_HEYGEN_API_KEY;
    
    if (!apiKey || apiKey === 'your_heygen_api_key_here') {
      console.error('HeyGen API key not configured in environment variables');
      return false;
    }
    
    // Initialize the service
    const success = await initializeHeyGenService({
      apiKey,
      // Default avatar ID for Dr. Scott
      avatarId: 'e12f05f24ead42619b4aa8124d98880d'
    });
    
    if (success) {
      console.log('HeyGen service initialized successfully');
    } else {
      console.error('Failed to initialize HeyGen service');
    }
    
    return success;
  } catch (error) {
    console.error('Error initializing HeyGen service:', error);
    return false;
  }
};

export default initHeyGenService;
/**
 * HeyGen API Utility
 * Provides functions for interacting with the HeyGen API
 */

// Get API key and URL from environment variables
const API_KEY = process.env.NEXT_PUBLIC_HEYGEN_API_KEY || '';
const API_URL = process.env.NEXT_PUBLIC_HEYGEN_API_URL || 'https://api.heygen.com';

/**
 * Generate a video using the HeyGen API
 * @param avatarId The ID of the avatar to use
 * @param script The script for the avatar to speak
 * @returns The URL of the generated video
 */
export async function generateVideo(avatarId: string, script: string): Promise<string> {
  try {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      console.error('HeyGen API can only be called from client-side code');
      return '';
    }
    
    // Make API request to HeyGen
    const response = await fetch(`${API_URL}/v1/video/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        avatar_id: avatarId,
        script: script,
        voice_settings: {
          voice_id: 'professional_male_uk',
          speed: 1.0,
          emotion: 'friendly'
        },
        video_settings: {
          quality: 'high',
          background: 'transparent',
          format: 'mp4'
        }
      })
    });
    
    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.video_url || '';
  } catch (error) {
    console.error('Error generating video with HeyGen API:', error);
    return '';
  }
}

/**
 * Get knowledge base information from HeyGen
 * @param knowledgeBaseId The ID of the knowledge base
 * @returns Information about the knowledge base
 */
export async function getKnowledgeBase(knowledgeBaseId: string): Promise<any> {
  try {
    // Check if running in browser environment
    if (typeof window === 'undefined') {
      console.error('HeyGen API can only be called from client-side code');
      return null;
    }
    
    // Make API request to HeyGen
    const response = await fetch(`${API_URL}/v1/knowledge-base/${knowledgeBaseId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HeyGen API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting knowledge base from HeyGen API:', error);
    return null;
  }
}

export default {
  generateVideo,
  getKnowledgeBase
};

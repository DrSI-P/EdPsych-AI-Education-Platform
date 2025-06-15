/**
 * Learning Style Analyzer
 * 
 * This service analyzes user interaction patterns to identify preferred learning styles
 * based on the VARK model (Visual, Auditory, Reading/Writing, Kinesthetic).
 * 
 * It processes various user interactions with educational content to build a
 * learning style profile that can be used to adapt content presentation.
 */

import { LearningStyleProfile } from './learning-style-profile';

// Types of user interactions that can indicate learning style preferences
export type InteractionType = 
  | 'video_play'
  | 'video_pause'
  | 'video_seek'
  | 'transcript_view'
  | 'notes_taken'
  | 'bookmark_created'
  | 'interactive_element_used'
  | 'supplementary_material_accessed'
  | 'speed_change'
  | 'caption_toggle'
  | 'quiz_answered';

// Structure for recording a user interaction
export interface UserInteraction {
  userId: string;
  contentId: string;
  timestamp: number;
  type: InteractionType;
  data?: {
    timeCode?: number;
    duration?: number;
    value?: unknown;
    context?: string;
  };
}

// Weights for how strongly different interactions indicate learning style preferences
const LEARNING_STYLE_INDICATORS = {
  visual: {
    video_play: 0.3,
    video_pause: 0.1,
    video_seek: 0.2,
    speed_change: 0.1,
    supplementary_material_accessed: 0.4, // if visual materials
    interactive_element_used: 0.5, // if visual elements
    quiz_answered: 0.2 // if visual questions
  },
  auditory: {
    video_play: 0.5,
    video_pause: 0.2,
    speed_change: 0.4,
    caption_toggle: 0.3,
    supplementary_material_accessed: 0.4, // if audio materials
    quiz_answered: 0.2 // if audio questions
  },
  reading: {
    transcript_view: 0.7,
    notes_taken: 0.6,
    caption_toggle: 0.5,
    supplementary_material_accessed: 0.4, // if text materials
    quiz_answered: 0.2 // if text questions
  },
  kinesthetic: {
    interactive_element_used: 0.7,
    bookmark_created: 0.3,
    video_seek: 0.3,
    supplementary_material_accessed: 0.4, // if interactive materials
    quiz_answered: 0.2 // if interactive questions
  }
};

// Decay factor for older interactions (per day)
const RECENCY_DECAY_FACTOR = 0.9;

// Maximum age of interactions to consider (in days)
const MAX_INTERACTION_AGE_DAYS = 30;

/**
 * Analyzes user interactions to determine learning style preferences
 */
export class LearningStyleAnalyzer {
  private interactionHistory: UserInteraction[] = [];
  
  /**
   * Records a new user interaction
   */
  public recordInteraction(interaction: UserInteraction): void {
    this.interactionHistory.push(interaction);
    
    // Limit history size by removing old interactions
    const now = Date.now();
    const maxAge = MAX_INTERACTION_AGE_DAYS * 24 * 60 * 60 * 1000; // convert to milliseconds
    this.interactionHistory = this.interactionHistory.filter(
      i => (now - i.timestamp) < maxAge
    );
  }
  
  /**
   * Analyzes interactions for a specific user to generate a learning style profile
   */
  public async analyzeLearningStyle(userId: string): Promise<LearningStyleProfile> {
    // Filter interactions for this user
    const userInteractions = this.interactionHistory.filter(i => i.userId === userId);
    
    if (userInteractions.length === 0) {
      // Return default balanced profile if no interactions
      return {
        userId,
        visual: 0.25,
        auditory: 0.25,
        reading: 0.25,
        kinesthetic: 0.25,
        confidence: 0.1,
        lastUpdated: Date.now()
      };
    }
    
    // Initialize scores
    let scores = {
      visual: 0,
      auditory: 0,
      reading: 0,
      kinesthetic: 0
    };
    
    // Current timestamp for recency calculations
    const now = Date.now();
    
    // Process each interaction
    userInteractions.forEach(interaction => {
      // Calculate recency factor (newer interactions have more weight)
      const ageInDays = (now - interaction.timestamp) / (24 * 60 * 60 * 1000);
      const recencyFactor = Math.pow(RECENCY_DECAY_FACTOR, ageInDays);
      
      // Update scores based on interaction type
      Object.entries(LEARNING_STYLE_INDICATORS).forEach(([style, indicators]) => {
        if (interaction.type in indicators) {
          const weight = indicators[interaction.type as keyof typeof indicators];
          scores[style as keyof typeof scores] += weight * recencyFactor;
          
          // Apply context-specific adjustments if available
          if (interaction.data?.context) {
            this.applyContextSpecificAdjustments(
              scores, 
              style as keyof typeof scores, 
              interaction.type, 
              interaction.data.context
            );
          }
        }
      });
    });
    
    // Normalize scores to percentages
    const total = Object.values(scores).reduce((sum, score) => sum + score, 0);
    if (total > 0) {
      Object.keys(scores).forEach(style => {
        scores[style as keyof typeof scores] /= total;
      });
    } else {
      // Equal distribution if no significant patterns
      Object.keys(scores).forEach(style => {
        scores[style as keyof typeof scores] = 0.25;
      });
    }
    
    // Calculate confidence based on number of interactions
    const confidence = Math.min(0.9, userInteractions.length / 100);
    
    return {
      userId,
      ...scores,
      confidence,
      lastUpdated: now
    };
  }
  
  /**
   * Apply context-specific adjustments to scores based on the content
   * of the interaction (e.g., what type of supplementary material was accessed)
   */
  private applyContextSpecificAdjustments(
    scores: Record<string, number>,
    style: string,
    interactionType: InteractionType,
    context: string
  ): void {
    // Supplementary material context handling
    if (interactionType === 'supplementary_material_accessed') {
      if (context.includes('video') && style === 'visual') {
        scores[style] += 0.2;
      } else if (context.includes('audio') && style === 'auditory') {
        scores[style] += 0.2;
      } else if (context.includes('text') && style === 'reading') {
        scores[style] += 0.2;
      } else if (context.includes('interactive') && style === 'kinesthetic') {
        scores[style] += 0.2;
      }
    }
    
    // Quiz context handling
    if (interactionType === 'quiz_answered') {
      if (context.includes('visual_question') && style === 'visual') {
        scores[style] += 0.1;
      } else if (context.includes('audio_question') && style === 'auditory') {
        scores[style] += 0.1;
      } else if (context.includes('text_question') && style === 'reading') {
        scores[style] += 0.1;
      } else if (context.includes('interactive_question') && style === 'kinesthetic') {
        scores[style] += 0.1;
      }
    }
  }
  
  /**
   * Simulates a learning style profile for demo purposes
   * This would be replaced by real analysis in production
   */
  public async simulateLearningStyleProfile(userId: string): Promise<LearningStyleProfile> {
    // Generate a simulated profile with some randomness but weighted toward a primary style
    const primaryStyle = Math.floor(Math.random() * 4);
    
    let visual = 0.1 + Math.random() * 0.2;
    let auditory = 0.1 + Math.random() * 0.2;
    let reading = 0.1 + Math.random() * 0.2;
    let kinesthetic = 0.1 + Math.random() * 0.2;
    
    // Boost the primary style
    switch (primaryStyle) {
      case 0:
        visual += 0.3;
        break;
      case 1:
        auditory += 0.3;
        break;
      case 2:
        reading += 0.3;
        break;
      case 3:
        kinesthetic += 0.3;
        break;
    }
    
    // Normalize to ensure sum is 1.0
    const total = visual + auditory + reading + kinesthetic;
    visual /= total;
    auditory /= total;
    reading /= total;
    kinesthetic /= total;
    
    return {
      userId,
      visual,
      auditory,
      reading,
      kinesthetic,
      confidence: 0.7 + Math.random() * 0.2, // Fairly confident for demo
      lastUpdated: Date.now()
    };
  }
}

// Singleton instance
export const learningStyleAnalyzer = new LearningStyleAnalyzer();

/**
 * Get learning style profile for a user
 * In a real implementation, this would fetch from a database or analyze real interaction data
 */
export async function getLearningStyleProfile(userId: string): Promise<LearningStyleProfile> {
  // For demo purposes, we'll use the simulator
  return learningStyleAnalyzer.simulateLearningStyleProfile(userId);
}
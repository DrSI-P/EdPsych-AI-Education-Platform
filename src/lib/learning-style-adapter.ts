/**
 * Learning Style Adapter
 * 
 * This service adapts educational content based on a user's learning style profile.
 * It provides recommendations for how content should be presented and which
 * supplementary materials should be emphasized to best match the user's
 * learning preferences.
 */

import { LearningStyleProfile, generateAdaptationRecommendations } from './learning-style-profile';
import { getLearningStyleProfile } from './learning-style-analyzer';

/**
 * Content adaptation settings that can be applied to educational content
 */
export interface ContentAdaptationSettings {
  // Visual adaptations
  visualElementsEmphasis: number;  // 0.0-1.0: How much to emphasize visual elements
  diagramVisibility: number;       // 0.0-1.0: Visibility level for diagrams and charts
  animationFrequency: number;      // 0.0-1.0: How frequently to use animations
  
  // Auditory adaptations
  audioEmphasis: number;           // 0.0-1.0: How much to emphasize audio elements
  narrativeDetail: number;         // 0.0-1.0: Level of detail in narrations
  discussionPrompts: number;       // 0.0-1.0: Frequency of discussion prompts
  
  // Reading/Writing adaptations
  textEmphasis: number;            // 0.0-1.0: How much to emphasize text elements
  transcriptVisibility: number;    // 0.0-1.0: Visibility level for transcripts
  textualSummaries: number;        // 0.0-1.0: Frequency of textual summaries
  
  // Kinesthetic adaptations
  interactivityLevel: number;      // 0.0-1.0: Level of interactive elements
  practicalExercises: number;      // 0.0-1.0: Frequency of practical exercises
  reflectionActivities: number;    // 0.0-1.0: Frequency of reflection activities
  
  // General settings
  adaptationStrength: number;      // 0.0-1.0: Overall strength of adaptations
  userOverrides: Partial<ContentAdaptationSettings>; // User-specified overrides
}

/**
 * Supplementary material types that can be recommended based on learning style
 */
export enum SupplementaryMaterialType {
  VIDEO = 'video',
  ANIMATION = 'animation',
  DIAGRAM = 'diagram',
  AUDIO = 'audio',
  PODCAST = 'podcast',
  DISCUSSION = 'discussion',
  TEXT = 'text',
  ARTICLE = 'article',
  SUMMARY = 'summary',
  INTERACTIVE = 'interactive',
  EXERCISE = 'exercise',
  SIMULATION = 'simulation'
}

/**
 * Supplementary material recommendation with relevance score
 */
export interface SupplementaryMaterialRecommendation {
  type: SupplementaryMaterialType;
  title: string;
  description: string;
  url?: string;
  relevanceScore: number; // 0.0-1.0: How relevant this material is to the user's learning style
}

/**
 * Learning style adapter service
 */
export class LearningStyleAdapter {
  /**
   * Get content adaptation settings for a specific user and content
   */
  public async getAdaptationSettings(
    userId: string,
    contentId: string,
    userSpecifiedSettings?: Partial<ContentAdaptationSettings>
  ): Promise<ContentAdaptationSettings> {
    // Get the user's learning style profile
    const profile = await getLearningStyleProfile(userId);
    
    // Generate base recommendations
    const recommendations = generateAdaptationRecommendations(profile);
    
    // Create adaptation settings based on the profile
    const settings: ContentAdaptationSettings = {
      // Visual adaptations
      visualElementsEmphasis: 0.3 + (profile.visual * 0.7),
      diagramVisibility: recommendations.showDiagrams,
      animationFrequency: recommendations.useAnimations,
      
      // Auditory adaptations
      audioEmphasis: 0.3 + (profile.auditory * 0.7),
      narrativeDetail: recommendations.provideNarration,
      discussionPrompts: recommendations.offerDiscussionPrompts,
      
      // Reading/Writing adaptations
      textEmphasis: 0.3 + (profile.reading * 0.7),
      transcriptVisibility: recommendations.showTranscript,
      textualSummaries: recommendations.provideTextSummaries,
      
      // Kinesthetic adaptations
      interactivityLevel: 0.3 + (profile.kinesthetic * 0.7),
      practicalExercises: recommendations.suggestPracticalExercises,
      reflectionActivities: recommendations.promptReflectionActivities,
      
      // General settings
      adaptationStrength: profile.confidence, // Adaptation strength based on profile confidence
      userOverrides: userSpecifiedSettings || {}
    };
    
    // Apply any user-specified overrides
    if (userSpecifiedSettings) {
      Object.assign(settings, userSpecifiedSettings);
    }
    
    return settings;
  }
  
  /**
   * Get supplementary material recommendations based on learning style
   */
  public async getSupplementaryMaterialRecommendations(
    userId: string,
    contentId: string,
    availableMaterials: SupplementaryMaterialType[]
  ): Promise<SupplementaryMaterialRecommendation[]> {
    // Get the user's learning style profile
    const profile = await getLearningStyleProfile(userId);
    
    // In a real implementation, this would query a database of available
    // supplementary materials for the specific content and filter/rank them
    // based on the user's learning style profile
    
    // For this demo, we'll generate simulated recommendations
    return this.generateSimulatedRecommendations(profile, contentId, availableMaterials);
  }
  
  /**
   * Generate simulated supplementary material recommendations
   * This would be replaced by real recommendations in production
   */
  private generateSimulatedRecommendations(
    profile: LearningStyleProfile,
    contentId: string,
    availableMaterials: SupplementaryMaterialType[]
  ): SupplementaryMaterialRecommendation[] {
    const recommendations: SupplementaryMaterialRecommendation[] = [];
    
    // Map learning styles to material types
    const styleToMaterialMap: Record<string, SupplementaryMaterialType[]> = {
      visual: [
        SupplementaryMaterialType.VIDEO,
        SupplementaryMaterialType.ANIMATION,
        SupplementaryMaterialType.DIAGRAM
      ],
      auditory: [
        SupplementaryMaterialType.AUDIO,
        SupplementaryMaterialType.PODCAST,
        SupplementaryMaterialType.DISCUSSION
      ],
      reading: [
        SupplementaryMaterialType.TEXT,
        SupplementaryMaterialType.ARTICLE,
        SupplementaryMaterialType.SUMMARY
      ],
      kinesthetic: [
        SupplementaryMaterialType.INTERACTIVE,
        SupplementaryMaterialType.EXERCISE,
        SupplementaryMaterialType.SIMULATION
      ]
    };
    
    // Generate recommendations for each available material type
    availableMaterials.forEach(materialType => {
      // Determine which learning style this material type corresponds to
      let relevantStyle = '';
      let relevanceScore = 0.5; // Default medium relevance
      
      for (const [style, materials] of Object.entries(styleToMaterialMap)) {
        if (materials.includes(materialType)) {
          relevantStyle = style;
          // Set relevance score based on the user's preference for this style
          relevanceScore = profile[relevantStyle as keyof typeof profile] as number;
          break;
        }
      }
      
      // Create a recommendation with simulated details
      recommendations.push({
        type: materialType,
        title: `${this.capitalizeFirstLetter(materialType)} on ${contentId}`,
        description: `This ${materialType} provides additional context and examples related to ${contentId}.`,
        url: `https://example.com/materials/${contentId}/${materialType}`,
        relevanceScore
      });
    });
    
    // Sort recommendations by relevance score (highest first)
    recommendations.sort((a, b) => b.relevanceScore - a.relevanceScore);
    
    return recommendations;
  }
  
  /**
   * Helper method to capitalize the first letter of a string
   */
  private capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
  /**
   * Simulate adaptation settings for demo purposes
   */
  public async simulateAdaptationSettings(
    userId: string,
    contentId: string
  ): Promise<ContentAdaptationSettings> {
    // Get the user's learning style profile
    const profile = await getLearningStyleProfile(userId);
    
    // Create adaptation settings based on the profile
    return {
      // Visual adaptations
      visualElementsEmphasis: 0.3 + (profile.visual * 0.7),
      diagramVisibility: 0.3 + (profile.visual * 0.7),
      animationFrequency: 0.2 + (profile.visual * 0.8),
      
      // Auditory adaptations
      audioEmphasis: 0.3 + (profile.auditory * 0.7),
      narrativeDetail: 0.4 + (profile.auditory * 0.6),
      discussionPrompts: 0.2 + (profile.auditory * 0.8),
      
      // Reading/Writing adaptations
      textEmphasis: 0.3 + (profile.reading * 0.7),
      transcriptVisibility: 0.4 + (profile.reading * 0.6),
      textualSummaries: 0.3 + (profile.reading * 0.7),
      
      // Kinesthetic adaptations
      interactivityLevel: 0.3 + (profile.kinesthetic * 0.7),
      practicalExercises: 0.2 + (profile.kinesthetic * 0.8),
      reflectionActivities: 0.4 + (profile.kinesthetic * 0.6),
      
      // General settings
      adaptationStrength: profile.confidence,
      userOverrides: {}
    };
  }
}

// Singleton instance
export const learningStyleAdapter = new LearningStyleAdapter();

/**
 * Get content adaptation settings for a user
 * In a real implementation, this would consider the specific content being viewed
 */
export async function getContentAdaptationSettings(
  userId: string,
  contentId: string,
  userSpecifiedSettings?: Partial<ContentAdaptationSettings>
): Promise<ContentAdaptationSettings> {
  // For demo purposes, we'll use the simulator
  return learningStyleAdapter.simulateAdaptationSettings(userId, contentId);
}
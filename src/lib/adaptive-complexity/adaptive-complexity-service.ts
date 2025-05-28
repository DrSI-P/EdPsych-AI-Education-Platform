/**
 * Adaptive Complexity Service
 * Provides functionality for adjusting content complexity based on user performance and preferences
 */

import { DifficultyLevel, LearningStyle, AgeGroup, AdaptiveContentConfig, UserProgress } from './types';

/**
 * Class that handles adaptive complexity adjustments for educational content
 */
export class AdaptiveComplexityService {
  /**
   * Analyzes user performance and adjusts content difficulty accordingly
   * @param userProgress - User's progress data
   * @param currentConfig - Current adaptive content configuration
   * @returns Updated adaptive content configuration
   */
  public adjustContentComplexity(
    userProgress: UserProgress,
    currentConfig: AdaptiveContentConfig
  ): AdaptiveContentConfig {
    if (!currentConfig.adaptationEnabled) {
      return currentConfig;
    }

    const { completionPercentage, correctAnswers, totalQuestions } = userProgress;
    const successRate = totalQuestions > 0 ? correctAnswers / totalQuestions : 0;
    
    // Determine if difficulty should be adjusted based on performance
    let newDifficultyLevel = currentConfig.difficultyLevel;
    
    if (successRate > 0.85 && completionPercentage > 75) {
      // User is performing very well, increase difficulty if not already at maximum
      newDifficultyLevel = this.increaseDifficulty(currentConfig.difficultyLevel);
    } else if (successRate < 0.4 && completionPercentage > 30) {
      // User is struggling, decrease difficulty if not already at minimum
      newDifficultyLevel = this.decreaseDifficulty(currentConfig.difficultyLevel);
    }
    
    return {
      ...currentConfig,
      difficultyLevel: newDifficultyLevel
    };
  }
  
  /**
   * Increases the difficulty level by one step
   * @param currentLevel - Current difficulty level
   * @returns New difficulty level
   */
  private increaseDifficulty(currentLevel: DifficultyLevel): DifficultyLevel {
    switch (currentLevel) {
      case DifficultyLevel.BEGINNER:
        return DifficultyLevel.INTERMEDIATE;
      case DifficultyLevel.INTERMEDIATE:
        return DifficultyLevel.ADVANCED;
      case DifficultyLevel.ADVANCED:
        return DifficultyLevel.EXPERT;
      default:
        return currentLevel; // Already at maximum
    }
  }
  
  /**
   * Decreases the difficulty level by one step
   * @param currentLevel - Current difficulty level
   * @returns New difficulty level
   */
  private decreaseDifficulty(currentLevel: DifficultyLevel): DifficultyLevel {
    switch (currentLevel) {
      case DifficultyLevel.EXPERT:
        return DifficultyLevel.ADVANCED;
      case DifficultyLevel.ADVANCED:
        return DifficultyLevel.INTERMEDIATE;
      case DifficultyLevel.INTERMEDIATE:
        return DifficultyLevel.BEGINNER;
      default:
        return currentLevel; // Already at minimum
    }
  }
  
  /**
   * Adapts content based on user's learning style
   * @param content - Original content
   * @param learningStyle - User's preferred learning style
   * @returns Adapted content
   */
  public adaptToLearningStyle(content: any, learningStyle: LearningStyle): any {
    // Implementation would enhance content based on learning style
    // This is a placeholder for the actual implementation
    return {
      ...content,
      adaptedFor: learningStyle
    };
  }
  
  /**
   * Adapts content based on user's age group
   * @param content - Original content
   * @param ageGroup - User's age group
   * @returns Age-appropriate content
   */
  public adaptToAgeGroup(content: any, ageGroup: AgeGroup): any {
    // Implementation would adjust content complexity based on age group
    // This is a placeholder for the actual implementation
    return {
      ...content,
      ageAppropriate: true,
      targetAgeGroup: ageGroup
    };
  }
}

// Export a singleton instance
export const adaptiveComplexityService = new AdaptiveComplexityService();

// Default export for the service
export default adaptiveComplexityService;

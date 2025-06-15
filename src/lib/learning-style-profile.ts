/**
 * Learning Style Profile
 * 
 * This module defines the learning style profile model based on the VARK model
 * (Visual, Auditory, Reading/Writing, Kinesthetic).
 * 
 * The profile represents a user's learning style preferences as percentages
 * across the four VARK dimensions, along with a confidence score indicating
 * how reliable the profile assessment is.
 */

/**
 * Learning style profile based on the VARK model
 */
export interface LearningStyleProfile {
  /**
   * User identifier
   */
  userId: string;
  
  /**
   * Visual learning preference (0.0 to 1.0)
   * Preference for learning through images, diagrams, charts, and videos
   */
  visual: number;
  
  /**
   * Auditory learning preference (0.0 to 1.0)
   * Preference for learning through listening, discussions, and verbal explanations
   */
  auditory: number;
  
  /**
   * Reading/Writing learning preference (0.0 to 1.0)
   * Preference for learning through text, reading, and writing
   */
  reading: number;
  
  /**
   * Kinesthetic learning preference (0.0 to 1.0)
   * Preference for learning through doing, experiencing, and hands-on activities
   */
  kinesthetic: number;
  
  /**
   * Confidence score (0.0 to 1.0)
   * Indicates how confident the system is in this profile assessment
   * Higher values indicate more reliable profiles based on more interaction data
   */
  confidence: number;
  
  /**
   * Timestamp when the profile was last updated
   */
  lastUpdated: number;
}

/**
 * Determines the dominant learning style from a profile
 */
export function getDominantLearningStyle(profile: LearningStyleProfile): 'visual' | 'auditory' | 'reading' | 'kinesthetic' {
  const styles: Array<{style: 'visual' | 'auditory' | 'reading' | 'kinesthetic', value: number}> = [
    { style: 'visual', value: profile.visual },
    { style: 'auditory', value: profile.auditory },
    { style: 'reading', value: profile.reading },
    { style: 'kinesthetic', value: profile.kinesthetic }
  ];
  
  // Sort by value in descending order
  styles.sort((a, b) => b.value - a.value);
  
  // Return the style with the highest value
  return styles[0].style;
}

/**
 * Checks if a profile has a strong preference for a particular learning style
 * A strong preference is defined as a style that is significantly higher than the average
 */
export function hasStrongPreference(profile: LearningStyleProfile): boolean {
  const average = (profile.visual + profile.auditory + profile.reading + profile.kinesthetic) / 4;
  const threshold = 0.15; // 15% above average is considered a strong preference
  
  return (
    profile.visual > average + threshold ||
    profile.auditory > average + threshold ||
    profile.reading > average + threshold ||
    profile.kinesthetic > average + threshold
  );
}

/**
 * Creates a description of a learning style profile
 */
export function createProfileDescription(profile: LearningStyleProfile): string {
  const dominantStyle = getDominantLearningStyle(profile);
  const hasStrong = hasStrongPreference(profile);
  
  let description = '';
  
  if (profile.confidence < 0.3) {
    description = 'Your learning style profile is still being developed. Continue interacting with content to improve the accuracy of your profile.';
    return description;
  }
  
  if (hasStrong) {
    switch (dominantStyle) {
      case 'visual':
        description = 'You have a strong preference for visual learning. You learn best through images, diagrams, charts, and videos. Consider using visual aids and mind maps when studying.';
        break;
      case 'auditory':
        description = 'You have a strong preference for auditory learning. You learn best through listening, discussions, and verbal explanations. Consider recording lectures or reading material aloud when studying.';
        break;
      case 'reading':
        description = 'You have a strong preference for reading/writing learning. You learn best through text, reading, and writing. Consider taking detailed notes and rewriting key concepts in your own words when studying.';
        break;
      case 'kinesthetic':
        description = 'You have a strong preference for kinesthetic learning. You learn best through doing, experiencing, and hands-on activities. Consider using practical examples and applying concepts to real-world scenarios when studying.';
        break;
    }
  } else {
    description = 'You have a balanced learning style profile with no strong preference for any particular learning style. This versatility allows you to adapt to different teaching methods and content formats.';
  }
  
  return description;
}

/**
 * Generates recommendations for content adaptation based on a learning style profile
 */
export function generateAdaptationRecommendations(profile: LearningStyleProfile): Record<string, number> {
  return {
    // Visual adaptations
    showDiagrams: 0.5 + profile.visual * 0.5,
    useAnimations: 0.3 + profile.visual * 0.7,
    highlightVisualElements: 0.2 + profile.visual * 0.8,
    
    // Auditory adaptations
    emphasizeAudio: 0.3 + profile.auditory * 0.7,
    provideNarration: 0.4 + profile.auditory * 0.6,
    offerDiscussionPrompts: 0.2 + profile.auditory * 0.8,
    
    // Reading adaptations
    showTranscript: 0.4 + profile.reading * 0.6,
    provideTextSummaries: 0.3 + profile.reading * 0.7,
    offerAdditionalReadings: 0.2 + profile.reading * 0.8,
    
    // Kinesthetic adaptations
    includeInteractiveElements: 0.3 + profile.kinesthetic * 0.7,
    suggestPracticalExercises: 0.2 + profile.kinesthetic * 0.8,
    promptReflectionActivities: 0.4 + profile.kinesthetic * 0.6
  };
}
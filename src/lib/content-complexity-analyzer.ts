/**
 * Content Complexity Analyzer
 * 
 * This service analyzes video content complexity and provides recommendations
 * for optimal playback speed based on various factors:
 * 
 * 1. Speech rate - How fast the speaker is talking
 * 2. Information density - How much information is being presented per unit of time
 * 3. Concept difficulty - How complex the concepts being discussed are
 * 4. Visual complexity - How complex the visual elements are
 * 5. User proficiency - The user's familiarity with the subject matter
 */

export interface ContentComplexityMetrics {
  speechRate: number;       // 0-1 scale (0: slow, 1: fast)
  informationDensity: number; // 0-1 scale (0: sparse, 1: dense)
  conceptDifficulty: number;  // 0-1 scale (0: simple, 1: complex)
  visualComplexity: number;   // 0-1 scale (0: simple, 1: complex)
  overallComplexity: number;  // 0-1 scale (0: simple, 1: complex)
}

export interface UserProficiency {
  subjectKnowledge: number; // 0-1 scale (0: beginner, 1: expert)
  learningPreferences: {
    preferredSpeed: number; // 0.5-2.0 scale (default: 1.0)
    detailOrientation: number; // 0-1 scale (0: overview, 1: detailed)
  };
}

export interface PlaybackSpeedRecommendation {
  recommendedSpeed: number; // Recommended playback speed (0.5-2.0)
  confidence: number;      // Confidence in recommendation (0-1)
  reasoning: string;       // Explanation for the recommendation
}

/**
 * Analyze content complexity at a specific timestamp in the video
 * 
 * In a real implementation, this would use AI to analyze the video content,
 * transcript, and visual elements. For this demo, we'll use simulated data
 * based on predefined complexity patterns.
 */
export function analyzeContentComplexity(
  videoId: string,
  timestamp: number,
  transcript?: string,
  visualData?: unknown
): ContentComplexityMetrics {
  // In a real implementation, this would analyze the actual content
  // For this demo, we'll simulate complexity patterns based on the timestamp
  
  // Simulate different complexity patterns based on the video section
  // This creates a pattern where complexity varies throughout the video
  const normalizedTime = timestamp % 300; // Cycle every 5 minutes
  const section = Math.floor(normalizedTime / 60); // Each section is 1 minute
  
  // Base complexity values for each section
  const sectionComplexity = {
    0: { speech: 0.3, info: 0.2, concept: 0.2, visual: 0.3 }, // Introduction (simple)
    1: { speech: 0.5, info: 0.6, concept: 0.7, visual: 0.5 }, // Main concepts (moderate)
    2: { speech: 0.7, info: 0.8, concept: 0.9, visual: 0.7 }, // Complex explanation (difficult)
    3: { speech: 0.6, info: 0.7, concept: 0.8, visual: 0.6 }, // Examples (moderate-high)
    4: { speech: 0.4, info: 0.5, concept: 0.6, visual: 0.4 }  // Summary (moderate-low)
  };
  
  // Get complexity values for current section
  const currentSection = sectionComplexity[section as keyof typeof sectionComplexity];
  
  // Add some variation within each section based on exact timestamp
  const withinSectionProgress = (normalizedTime % 60) / 60;
  const variation = Math.sin(withinSectionProgress * Math.PI) * 0.2;
  
  // Calculate metrics with variation
  const speechRate = Math.min(1, Math.max(0, currentSection.speech + variation * 0.5));
  const informationDensity = Math.min(1, Math.max(0, currentSection.info + variation * 0.3));
  const conceptDifficulty = Math.min(1, Math.max(0, currentSection.concept + variation * 0.2));
  const visualComplexity = Math.min(1, Math.max(0, currentSection.visual + variation * 0.4));
  
  // Calculate overall complexity as weighted average
  const overallComplexity = (
    speechRate * 0.2 +
    informationDensity * 0.3 +
    conceptDifficulty * 0.4 +
    visualComplexity * 0.1
  );
  
  return {
    speechRate,
    informationDensity,
    conceptDifficulty,
    visualComplexity,
    overallComplexity
  };
}

/**
 * Get user proficiency data
 * 
 * In a real implementation, this would come from the user's profile,
 * learning history, and preferences. For this demo, we'll use default values
 * or simulated data.
 */
export function getUserProficiency(
  userId: string,
  subjectId: string
): UserProficiency {
  // In a real implementation, this would fetch from a user profile database
  // For this demo, we'll return default values
  return {
    subjectKnowledge: 0.5, // Moderate knowledge
    learningPreferences: {
      preferredSpeed: 1.0, // Normal speed
      detailOrientation: 0.5 // Balanced
    }
  };
}

/**
 * Calculate recommended playback speed based on content complexity and user proficiency
 */
export function calculateRecommendedPlaybackSpeed(
  complexity: ContentComplexityMetrics,
  userProficiency: UserProficiency
): PlaybackSpeedRecommendation {
  // Base speed calculation
  // - Higher complexity → slower speed
  // - Higher user proficiency → faster speed
  
  // Calculate complexity-based speed
  // Map from 0-1 complexity scale to 0.5-1.5 speed scale (inverse relationship)
  const complexityFactor = 1 - complexity.overallComplexity;
  const complexityBasedSpeed = 0.5 + complexityFactor * 1.0;
  
  // Calculate proficiency adjustment
  // Higher proficiency allows faster speeds for complex content
  const proficiencyAdjustment = userProficiency.subjectKnowledge * 0.5;
  
  // Calculate preference adjustment
  const preferenceAdjustment = userProficiency.learningPreferences.preferredSpeed - 1.0;
  
  // Calculate final recommended speed
  let recommendedSpeed = complexityBasedSpeed + proficiencyAdjustment + preferenceAdjustment;
  
  // Ensure speed is within reasonable bounds (0.5x to 2.0x)
  recommendedSpeed = Math.min(2.0, Math.max(0.5, recommendedSpeed));
  
  // Round to nearest 0.25 increment for better UX
  recommendedSpeed = Math.round(recommendedSpeed * 4) / 4;
  
  // Generate reasoning
  let reasoning = '';
  if (complexity.overallComplexity > 0.7) {
    reasoning = 'Content is complex; slower speed recommended for better comprehension.';
  } else if (complexity.overallComplexity < 0.3) {
    reasoning = 'Content is straightforward; faster speed recommended for efficiency.';
  } else {
    reasoning = 'Content has moderate complexity; balanced speed recommended.';
  }
  
  // Add proficiency context
  if (userProficiency.subjectKnowledge > 0.7) {
    reasoning += ' Your familiarity with this subject allows for faster playback.';
  } else if (userProficiency.subjectKnowledge < 0.3) {
    reasoning += " As you're still learning this subject, a moderate pace is suggested.";
  }
  
  // Calculate confidence based on how extreme the complexity values are
  // Higher confidence when complexity metrics are more consistent
  const metrics = [
    complexity.speechRate,
    complexity.informationDensity,
    complexity.conceptDifficulty,
    complexity.visualComplexity
  ];
  
  const avgMetric = metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
  const variance = metrics.reduce((sum, val) => sum + Math.pow(val - avgMetric, 2), 0) / metrics.length;
  const confidence = 1 - Math.min(1, variance * 4); // Lower variance = higher confidence
  
  return {
    recommendedSpeed,
    confidence,
    reasoning
  };
}

/**
 * Main function to get adaptive playback speed recommendation
 */
export function getAdaptivePlaybackSpeed(
  videoId: string,
  timestamp: number,
  userId: string,
  subjectId: string,
  transcript?: string,
  visualData?: unknown
): PlaybackSpeedRecommendation {
  // Analyze content complexity
  const complexity = analyzeContentComplexity(videoId, timestamp, transcript, visualData);
  
  // Get user proficiency
  const userProficiency = getUserProficiency(userId, subjectId);
  
  // Calculate recommended speed
  return calculateRecommendedPlaybackSpeed(complexity, userProficiency);
}
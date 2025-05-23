'use client';

import { 
  ComplexityLevel, 
  ComplexityLevelValue,
  PerformanceMetric, 
  LearningProfile,
  SubjectPreference,
  SkillAreaProfile,
  AdaptiveContent,
  ComplexityAdjustmentResult,
  AdaptiveComplexityConfig
} from './types';

/**
 * Adaptive Complexity Service
 * 
 * This service provides the core functionality for the adaptive complexity adjustment system,
 * which dynamically adjusts content difficulty based on user performance and learning patterns.
 * 
 * The service implements evidence-based algorithms for determining appropriate complexity levels,
 * tracking user progress, and providing personalized learning experiences.
 */
export class AdaptiveComplexityService {
  private config: AdaptiveComplexityConfig = {
    enableAdaptiveContent: true,
    minPerformanceDataPoints: 3,
    adjustmentThreshold: 0.2,
    learningRateWeight: 0.2,
    challengePreferenceWeight: 0.1,
    performanceHistoryWeight: 0.4,
    recentPerformanceWeight: 0.3,
    maxComplexityJump: 1
  };

  /**
   * Initialize the adaptive complexity service with optional custom configuration
   */
  constructor(config?: Partial<AdaptiveComplexityConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  /**
   * Determine the appropriate complexity level for a user in a specific subject area
   * based on their performance history and learning profile
   */
  public determineComplexityLevel(
    profile: LearningProfile,
    subjectId: string,
    skillId?: string
  ): ComplexityLevel {
    // Check if user has a preference for this subject
    if (!profile.subjectPreferences[subjectId]) {
      return ComplexityLevel.BASIC; // Default to basic if no data exists
    }

    const subjectPreference = profile.subjectPreferences[subjectId];
    
    // If a specific skill area is requested, check that first
    if (skillId && subjectPreference.skillAreas[skillId]) {
      const skillProfile = subjectPreference.skillAreas[skillId];
      
      // If we have enough data and confidence, use the recommended level
      if (
        skillProfile.performanceHistory.length >= this.config.minPerformanceDataPoints &&
        skillProfile.confidenceScore >= 0.7
      ) {
        return skillProfile.recommendedComplexityLevel;
      }
    }
    
    // Fall back to subject-level recommendation if skill-specific isn't available
    if (
      subjectPreference.performanceHistory.length >= this.config.minPerformanceDataPoints &&
      subjectPreference.confidenceScore >= 0.6
    ) {
      return subjectPreference.recommendedComplexityLevel;
    }
    
    // Default to current level if we don't have enough data
    return subjectPreference.currentComplexityLevel;
  }

  /**
   * Update a user's learning profile based on new performance data
   */
  public updateLearningProfile(
    profile: LearningProfile,
    newPerformance: PerformanceMetric
  ): LearningProfile {
    const updatedProfile = { ...profile };
    
    // Initialize subject preference if it doesn't exist
    if (!updatedProfile.subjectPreferences[newPerformance.subjectArea]) {
      updatedProfile.subjectPreferences[newPerformance.subjectArea] = this.initializeSubjectPreference(
        newPerformance.subjectArea
      );
    }
    
    const subjectPref = updatedProfile.subjectPreferences[newPerformance.subjectArea];
    
    // Add new performance data
    subjectPref.performanceHistory.push(newPerformance);
    
    // Initialize skill area if it doesn't exist
    if (!subjectPref.skillAreas[newPerformance.skillArea]) {
      subjectPref.skillAreas[newPerformance.skillArea] = this.initializeSkillAreaProfile(
        newPerformance.skillArea
      );
    }
    
    const skillProfile = subjectPref.skillAreas[newPerformance.skillArea];
    skillProfile.performanceHistory.push(newPerformance);
    
    // Calculate new recommended complexity levels
    this.recalculateComplexityRecommendations(updatedProfile, newPerformance.subjectArea);
    
    // Update learning rate based on performance
    this.updateLearningRate(updatedProfile, newPerformance);
    
    // Update timestamp
    updatedProfile.lastUpdated = new Date();
    
    return updatedProfile;
  }

  /**
   * Apply complexity adjustment to content based on user's learning profile
   */
  public adaptContentComplexity(
    content: AdaptiveContent,
    profile: LearningProfile
  ): AdaptiveContent {
    if (!this.config.enableAdaptiveContent) {
      return content; // Return original content if adaptation is disabled
    }
    
    // Determine appropriate complexity level for this content
    const recommendedLevel = this.determineComplexityLevel(
      profile,
      content.subjectArea,
      content.skillAreas[0] // Use primary skill area if available
    );
    
    // If the content is already at the recommended level, return as is
    if (content.complexityLevel === recommendedLevel) {
      return content;
    }
    
    // Create adapted content with the new complexity level
    const adaptedContent: AdaptiveContent = {
      ...content,
      complexityLevel: recommendedLevel,
      adaptiveElements: content.adaptiveElements.map(element => {
        // For each element, select the appropriate complexity variant
        return {
          ...element,
          // If the specific variant doesn't exist, fall back to the closest available level
          selectedVariant: element.complexityVariants[recommendedLevel] || 
                          this.findClosestComplexityVariant(element.complexityVariants, recommendedLevel)
        };
      })
    };
    
    return adaptedContent;
  }

  /**
   * Record a complexity adjustment for analytics and tracking
   */
  public recordComplexityAdjustment(
    userId: string,
    contentId: string,
    previousLevel: ComplexityLevel,
    newLevel: ComplexityLevel,
    reason: string
  ): ComplexityAdjustmentResult {
    const adjustment: ComplexityAdjustmentResult = {
      userId,
      contentId,
      previousComplexityLevel: previousLevel,
      newComplexityLevel: newLevel,
      adjustmentReason: reason,
      confidenceScore: this.calculateAdjustmentConfidence(previousLevel, newLevel),
      timestamp: new Date(),
      recommendedNextSteps: this.generateNextStepsRecommendations(previousLevel, newLevel)
    };
    
    // In a real implementation, this would likely save to a database
    console.log('Complexity adjustment recorded:', adjustment);
    
    return adjustment;
  }

  /**
   * Initialize a new subject preference
   */
  private initializeSubjectPreference(subjectId: string): SubjectPreference {
    return {
      subjectId,
      currentComplexityLevel: ComplexityLevel.BASIC,
      recommendedComplexityLevel: ComplexityLevel.BASIC,
      confidenceScore: 0,
      performanceHistory: [],
      skillAreas: {}
    };
  }

  /**
   * Initialize a new skill area profile
   */
  private initializeSkillAreaProfile(skillId: string): SkillAreaProfile {
    return {
      skillId,
      currentComplexityLevel: ComplexityLevel.BASIC,
      recommendedComplexityLevel: ComplexityLevel.BASIC,
      confidenceScore: 0,
      performanceHistory: [],
      strengths: [],
      areasForImprovement: []
    };
  }

  /**
   * Recalculate recommended complexity levels based on performance data
   */
  private recalculateComplexityRecommendations(
    profile: LearningProfile,
    subjectId: string
  ): void {
    const subjectPref = profile.subjectPreferences[subjectId];
    
    // Only recalculate if we have enough data
    if (subjectPref.performanceHistory.length < this.config.minPerformanceDataPoints) {
      return;
    }
    
    // Calculate subject-level recommendation
    const subjectPerformanceScore = this.calculatePerformanceScore(
      subjectPref.performanceHistory,
      profile.learningRate,
      profile.challengePreference
    );
    
    const currentLevelValue = ComplexityLevelValue[subjectPref.currentComplexityLevel];
    let recommendedLevelValue = currentLevelValue;
    
    // Determine if adjustment is needed
    if (subjectPerformanceScore > 0.8 && currentLevelValue < ComplexityLevelValue[ComplexityLevel.EXPERT]) {
      // Excellent performance, consider increasing complexity
      recommendedLevelValue = Math.min(
        currentLevelValue + this.config.maxComplexityJump,
        ComplexityLevelValue[ComplexityLevel.EXPERT]
      );
    } else if (subjectPerformanceScore < 0.4 && currentLevelValue > ComplexityLevelValue[ComplexityLevel.FOUNDATIONAL]) {
      // Poor performance, consider decreasing complexity
      recommendedLevelValue = Math.max(
        currentLevelValue - this.config.maxComplexityJump,
        ComplexityLevelValue[ComplexityLevel.FOUNDATIONAL]
      );
    }
    
    // Convert numeric value back to enum
    const recommendedLevel = this.valueToComplexityLevel(recommendedLevelValue);
    
    // Update recommendation and confidence
    subjectPref.recommendedComplexityLevel = recommendedLevel;
    subjectPref.confidenceScore = this.calculateConfidenceScore(
      subjectPref.performanceHistory.length,
      Math.abs(subjectPerformanceScore - 0.5) * 2 // Higher confidence when score is far from 0.5
    );
    
    // Now update skill-level recommendations
    Object.keys(subjectPref.skillAreas).forEach(skillId => {
      const skillProfile = subjectPref.skillAreas[skillId];
      
      if (skillProfile.performanceHistory.length >= this.config.minPerformanceDataPoints) {
        const skillPerformanceScore = this.calculatePerformanceScore(
          skillProfile.performanceHistory,
          profile.learningRate,
          profile.challengePreference
        );
        
        const currentSkillLevelValue = ComplexityLevelValue[skillProfile.currentComplexityLevel];
        let recommendedSkillLevelValue = currentSkillLevelValue;
        
        // Determine if adjustment is needed
        if (skillPerformanceScore > 0.8 && currentSkillLevelValue < ComplexityLevelValue[ComplexityLevel.EXPERT]) {
          recommendedSkillLevelValue = Math.min(
            currentSkillLevelValue + this.config.maxComplexityJump,
            ComplexityLevelValue[ComplexityLevel.EXPERT]
          );
        } else if (skillPerformanceScore < 0.4 && currentSkillLevelValue > ComplexityLevelValue[ComplexityLevel.FOUNDATIONAL]) {
          recommendedSkillLevelValue = Math.max(
            currentSkillLevelValue - this.config.maxComplexityJump,
            ComplexityLevelValue[ComplexityLevel.FOUNDATIONAL]
          );
        }
        
        // Convert numeric value back to enum
        const recommendedSkillLevel = this.valueToComplexityLevel(recommendedSkillLevelValue);
        
        // Update recommendation and confidence
        skillProfile.recommendedComplexityLevel = recommendedSkillLevel;
        skillProfile.confidenceScore = this.calculateConfidenceScore(
          skillProfile.performanceHistory.length,
          Math.abs(skillPerformanceScore - 0.5) * 2
        );
        
        // Update strengths and areas for improvement
        this.updateStrengthsAndWeaknesses(skillProfile);
      }
    });
  }

  /**
   * Calculate a performance score based on multiple metrics
   */
  private calculatePerformanceScore(
    performanceHistory: PerformanceMetric[],
    learningRate: number,
    challengePreference: number
  ): number {
    if (performanceHistory.length === 0) {
      return 0.5; // Default to middle value if no data
    }
    
    // Sort by timestamp to get recent performances
    const sortedPerformance = [...performanceHistory].sort(
      (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
    );
    
    // Calculate average score, weighted more heavily toward recent performances
    let weightedScoreSum = 0;
    let weightSum = 0;
    
    sortedPerformance.forEach((perf, index) => {
      // Calculate recency weight (more recent = higher weight)
      const recencyWeight = Math.max(0, 1 - (index / sortedPerformance.length));
      
      // Calculate completion weight (higher completion = higher weight)
      const completionWeight = perf.completionRate;
      
      // Combined weight
      const weight = recencyWeight * completionWeight;
      
      // Add weighted score
      weightedScoreSum += perf.score * weight;
      weightSum += weight;
    });
    
    // Calculate base performance score
    const basePerformanceScore = weightSum > 0 ? weightedScoreSum / weightSum : 0.5;
    
    // Adjust based on learning rate and challenge preference
    const learningRateAdjustment = (learningRate - 0.5) * this.config.learningRateWeight;
    const challengeAdjustment = (challengePreference - 0.5) * this.config.challengePreferenceWeight;
    
    // Combine all factors
    const adjustedScore = basePerformanceScore + learningRateAdjustment + challengeAdjustment;
    
    // Ensure score is between 0 and 1
    return Math.max(0, Math.min(1, adjustedScore));
  }

  /**
   * Update a user's learning rate based on new performance data
   */
  private updateLearningRate(profile: LearningProfile, newPerformance: PerformanceMetric): void {
    // This is a simplified implementation
    // A more sophisticated version would analyse performance trends over time
    
    const subjectPref = profile.subjectPreferences[newPerformance.subjectArea];
    
    if (subjectPref.performanceHistory.length < 2) {
      return; // Need at least 2 data points to calculate learning rate
    }
    
    // Sort by timestamp
    const sortedPerformance = [...subjectPref.performanceHistory].sort(
      (a, b) => a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    // Calculate score improvement over time
    const improvements: number[] = [];
    for (let i = 1; i < sortedPerformance.length; i++) {
      const timeDiff = (sortedPerformance[i].timestamp.getTime() - sortedPerformance[i-1].timestamp.getTime()) / (1000 * 60 * 60); // hours
      const scoreDiff = sortedPerformance[i].score - sortedPerformance[i-1].score;
      
      if (timeDiff > 0) {
        improvements.push(scoreDiff / timeDiff);
      }
    }
    
    if (improvements.length > 0) {
      // Calculate average improvement rate
      const avgImprovement = improvements.reduce((sum, val) => sum + val, 0) / improvements.length;
      
      // Normalize to 0-1 range (this is a simplified approach)
      const normalizedRate = Math.max(0, Math.min(1, (avgImprovement + 0.1) * 5));
      
      // Update learning rate with some smoothing to avoid drastic changes
      profile.learningRate = profile.learningRate * 0.7 + normalizedRate * 0.3;
    }
  }

  /**
   * Calculate confidence score for a recommendation
   */
  private calculateConfidenceScore(dataPoints: number, performanceDeviation: number): number {
    // More data points and clearer performance patterns increase confidence
    const dataPointFactor = Math.min(1, dataPoints / (this.config.minPerformanceDataPoints * 2));
    const performanceFactor = Math.min(1, performanceDeviation);
    
    return dataPointFactor * 0.6 + performanceFactor * 0.4;
  }

  /**
   * Update strengths and areas for improvement based on performance data
   */
  private updateStrengthsAndWeaknesses(skillProfile: SkillAreaProfile): void {
    // This would be a more sophisticated analysis in a real implementation
    // For now, we'll use a simplified approach
    
    const performances = skillProfile.performanceHistory;
    if (performances.length < 3) return;
    
    // Group performances by content ID to analyse patterns
    const contentPerformance: Record<string, PerformanceMetric[]> = {};
    
    performances.forEach(perf => {
      if (!contentPerformance[perf.contentId]) {
        contentPerformance[perf.contentId] = [];
      }
      contentPerformance[perf.contentId].push(perf);
    });
    
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    
    // Analyse each content area
    Object.entries(contentPerformance).forEach(([contentId, perfs]) => {
      if (perfs.length === 0) return;
      
      // Calculate average score
      const avgScore = perfs.reduce((sum, p) => sum + p.score, 0) / perfs.length;
      
      if (avgScore > 0.8) {
        strengths.push(contentId);
      } else if (avgScore < 0.4) {
        weaknesses.push(contentId);
      }
    });
    
    // Update profile with top strengths and weaknesses
    skillProfile.strengths = strengths.slice(0, 5); // Top 5 strengths
    skillProfile.areasForImprovement = weaknesses.slice(0, 5); // Top 5 areas for improvement
  }

  /**
   * Find the closest complexity variant if exact match isn't available
   */
  private findClosestComplexityVariant(
    variants: Record<ComplexityLevel, string>,
    targetLevel: ComplexityLevel
  ): string {
    const targetValue = ComplexityLevelValue[targetLevel];
    const availableLevels = Object.keys(variants) as ComplexityLevel[];
    
    if (availableLevels.length === 0) {
      throw new Error('No complexity variants available');
    }
    
    // Find closest level by numeric value
    let closestLevel = availableLevels[0];
    let minDifference = Math.abs(ComplexityLevelValue[closestLevel] - targetValue);
    
    availableLevels.forEach(level => {
      const difference = Math.abs(ComplexityLevelValue[level] - targetValue);
      if (difference < minDifference) {
        closestLevel = level;
        minDifference = difference;
      }
    });
    
    return variants[closestLevel];
  }

  /**
   * Convert a numeric complexity value back to the enum
   */
  private valueToComplexityLevel(value: number): ComplexityLevel {
    // Find the closest matching level
    const entries = Object.entries(ComplexityLevelValue);
    let closestLevel = ComplexityLevel.BASIC;
    let minDifference = Math.abs(ComplexityLevelValue[ComplexityLevel.BASIC] - value);
    
    entries.forEach(([level, levelValue]) => {
      const difference = Math.abs(levelValue - value);
      if (difference < minDifference) {
        closestLevel = level as ComplexityLevel;
        minDifference = difference;
      }
    });
    
    return closestLevel;
  }

  /**
   * Generate recommendations for next steps based on complexity adjustment
   */
  private generateNextStepsRecommendations(
    previousLevel: ComplexityLevel,
    newLevel: ComplexityLevel
  ): string[] {
    const previousValue = ComplexityLevelValue[previousLevel];
    const newValue = ComplexityLevelValue[newLevel];
    
    if (newValue > previousValue) {
      // Complexity increased
      return [
        'Review prerequisite concepts to ensure solid foundation',
        'Attempt more challenging practise exercises',
        'Explore advanced application scenarios',
        'Consider peer collaboration on complex problems'
      ];
    } else if (newValue < previousValue) {
      // Complexity decreased
      return [
        'Focus on mastering fundamental concepts',
        'Practise with additional examples at current level',
        'Review explanations with more detailed breakdowns',
        'Consider requesting additional support resources'
      ];
    } else {
      // No change
      return [
        'Continue with current learning path',
        'Focus on areas identified for improvement',
        'Review recent assessment feedback'
      ];
    }
  }
}

// Export a singleton instance for use throughout the application
export const adaptiveComplexityService = new AdaptiveComplexityService();

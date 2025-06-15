import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

interface FeatureScore {
  featureId: string;
  score: number;
}

interface FeatureRecommendation {
  featureId: string;
  name: string;
  description: string;
  creditCost: number | null;
  score: number;
  reason: string;
}

/**
 * Get personalized feature recommendations for a user
 * @param userId The user ID
 * @param limit The maximum number of recommendations to return
 * @returns A list of recommended features with scores and reasons
 */
export async function getFeatureRecommendations(
  userId: string,
  limit: number = 5
): Promise<FeatureRecommendation[]> {
  try {
    // Get the user's role and subscription tier
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: { status: 'active' },
          include: {
            tier: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Get all available features
    const allFeatures = await prisma.feature.findMany({
      where: {
        isActive: true,
      },
    });

    // Get the user's feature usage history
    const userUsage = await prisma.creditUsage.findMany({
      where: {
        credit: {
          userId,
        },
      },
      select: {
        featureId: true,
        createdAt: true,
      },
    });

    // Calculate feature scores based on various factors
    const featureScores: FeatureScore[] = [];
    const featureReasons: Record<string, string> = {};

    for (const feature of allFeatures) {
      // Skip features that are already included in the user's subscription tier
      const subscriptionTier = user.subscriptions[0]?.tier;
      if (subscriptionTier) {
        try {
          const tierFeatures = JSON.parse(subscriptionTier.features as string);
          if (Array.isArray(tierFeatures) && tierFeatures.includes(feature.id)) {
            continue; // Skip features already included in subscription
          }
        } catch (error) {
          console.error(`Error parsing features for subscription tier:`, error);
        }
      }

      // Calculate base score
      let score = 0;
      let reason = '';

      // Factor 1: Role relevance
      const roleRelevanceScore = await calculateRoleRelevanceScore(feature.id, user.role);
      score += roleRelevanceScore * 0.3; // 30% weight
      
      if (roleRelevanceScore > 0.7) {
        reason = 'Highly relevant for your role';
      }

      // Factor 2: Usage pattern relevance
      const usagePatternScore = calculateUsagePatternScore(feature.id, userUsage);
      score += usagePatternScore * 0.25; // 25% weight
      
      if (usagePatternScore > 0.7 && !reason) {
        reason = 'Based on your usage patterns';
      }

      // Factor 3: Similar user relevance
      const similarUserScore = await calculateSimilarUserScore(feature.id, userId);
      score += similarUserScore * 0.25; // 25% weight
      
      if (similarUserScore > 0.7 && !reason) {
        reason = 'Popular among similar users';
      }

      // Factor 4: Feature popularity
      const popularityScore = await calculatePopularityScore(feature.id);
      score += popularityScore * 0.2; // 20% weight
      
      if (popularityScore > 0.7 && !reason) {
        reason = 'Popular feature';
      }

      // Default reason if none of the above
      if (!reason) {
        reason = 'May be useful for you';
      }

      featureScores.push({
        featureId: feature.id,
        score,
      });
      
      featureReasons[feature.id] = reason;
    }

    // Sort features by score (descending)
    featureScores.sort((a, b) => b.score - a.score);

    // Get the top N recommendations
    const topRecommendations = featureScores.slice(0, limit);

    // Get full feature details for the recommendations
    const recommendations: FeatureRecommendation[] = [];

    for (const rec of topRecommendations) {
      const feature = allFeatures.find(f => f.id === rec.featureId);
      if (feature) {
        recommendations.push({
          featureId: feature.id,
          name: feature.name,
          description: feature.description || '',
          creditCost: feature.creditCost,
          score: rec.score,
          reason: featureReasons[feature.id],
        });
      }
    }

    return recommendations;
  } catch (error) {
    console.error('Error getting feature recommendations:', error);
    return [];
  }
}

/**
 * Calculate how relevant a feature is for a user's role
 * @param featureId The feature ID
 * @param userRole The user's role
 * @returns A score between 0 and 1
 */
async function calculateRoleRelevanceScore(
  featureId: string,
  userRole: string
): Promise<number> {
  // In a real implementation, this would use a trained ML model
  // For now, we'll use a simple heuristic based on feature usage by role
  
  // Get usage of this feature by users with the same role
  const roleUsageCount = await prisma.creditUsage.count({
    where: {
      featureId,
      credit: {
        user: {
          role: userRole,
        },
      },
    },
  });
  
  // Get total usage of this feature
  const totalUsageCount = await prisma.creditUsage.count({
    where: {
      featureId,
    },
  });
  
  if (totalUsageCount === 0) {
    return 0.5; // Neutral score for features with no usage data
  }
  
  // Calculate the proportion of usage by this role
  const roleUsageProportion = roleUsageCount / totalUsageCount;
  
  // Normalize to a score between 0 and 1
  // If more than 50% of usage is by this role, it's highly relevant
  return Math.min(roleUsageProportion * 2, 1);
}

/**
 * Calculate how relevant a feature is based on the user's usage patterns
 * @param featureId The feature ID
 * @param userUsage The user's feature usage history
 * @returns A score between 0 and 1
 */
function calculateUsagePatternScore(
  featureId: string,
  userUsage: { featureId: string; createdAt: Date }[]
): number {
  // In a real implementation, this would use a trained ML model
  // For now, we'll use a simple heuristic based on related feature usage
  
  // Get the features the user has used
  const usedFeatureIds = new Set(userUsage.map(usage => usage.featureId));
  
  // Define feature relationships (in a real system, these would be learnt)
  const featureRelationships: Record<string, string[]> = {
    'ai_lesson_plan': ['content_differentiation', 'assessment_generator'],
    'content_differentiation': ['ai_lesson_plan', 'student_accommodations'],
    'assessment_generator': ['ai_lesson_plan', 'grading_assistant'],
    'student_accommodations': ['content_differentiation', 'iep_generator'],
    'grading_assistant': ['assessment_generator', 'feedback_generator'],
    'iep_generator': ['student_accommodations', 'progress_monitoring'],
    'feedback_generator': ['grading_assistant', 'student_insights'],
    'progress_monitoring': ['iep_generator', 'student_insights'],
    'student_insights': ['feedback_generator', 'progress_monitoring'],
  };
  
  // Check if the feature is related to features the user has used
  const relatedFeatures = featureRelationships[featureId] || [];
  let relatedUsedCount = 0;
  
  for (const relatedFeature of relatedFeatures) {
    if (usedFeatureIds.has(relatedFeature)) {
      relatedUsedCount++;
    }
  }
  
  if (relatedFeatures.length === 0) {
    return 0.5; // Neutral score for features with no defined relationships
  }
  
  // Calculate score based on proportion of related features used
  return relatedUsedCount / relatedFeatures.length;
}

/**
 * Calculate how relevant a feature is based on similar users
 * @param featureId The feature ID
 * @param userId The user ID
 * @returns A score between 0 and 1
 */
async function calculateSimilarUserScore(
  featureId: string,
  userId: string
): Promise<number> {
  // In a real implementation, this would use a collaborative filtering algorithm
  // For now, we'll use a simple heuristic based on users with similar roles and subscription tiers
  
  // Get the user's role and subscription tier
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      subscriptions: {
        where: { status: 'active' },
        select: { tierId: true },
      },
    },
  });
  
  if (!user || user.subscriptions.length === 0) {
    return 0.5; // Neutral score if we can't determine similarity
  }
  
  const userRole = user.role;
  const userTierId = user.subscriptions[0].tierId;
  
  // Find similar users (same role and subscription tier)
  const similarUsers = await prisma.user.findMany({
    where: {
      id: { not: userId }, // Exclude the current user
      role: userRole,
      subscriptions: {
        some: {
          tierId: userTierId,
          status: 'active',
        },
      },
    },
    select: { id: true },
  });
  
  if (similarUsers.length === 0) {
    return 0.5; // Neutral score if no similar users found
  }
  
  const similarUserIds = similarUsers.map(u => u.id);
  
  // Count how many similar users have used this feature
  const similarUserUsageResult = await prisma.$queryRaw<Array<{ count: bigint }>>`
    SELECT COUNT(DISTINCT c."userId") as count
    FROM "CreditUsage" cu
    JOIN "Credit" c ON cu."creditId" = c.id
    WHERE cu."featureId" = ${featureId}
    AND c."userId" = ANY(${similarUserIds}::text[])
  `;
  
  const similarUserUsageCount = Number(similarUserUsageResult[0]?.count || 0);
  
  // Calculate the proportion of similar users who have used this feature
  const usageProportion = similarUserUsageCount / similarUsers.length;
  
  // Normalize to a score between 0 and 1
  // If more than 30% of similar users have used this feature, it's highly relevant
  return Math.min(usageProportion * 3, 1);
}

/**
 * Calculate how popular a feature is overall
 * @param featureId The feature ID
 * @returns A score between 0 and 1
 */
async function calculatePopularityScore(featureId: string): Promise<number> {
  // Get the total usage count for this feature
  const featureUsageCount = await prisma.creditUsage.count({
    where: {
      featureId,
    },
  });
  
  // Get the total usage count for all features
  const totalUsageCount = await prisma.creditUsage.count();
  
  if (totalUsageCount === 0) {
    return 0.5; // Neutral score if no usage data
  }
  
  // Get the number of features
  const featureCount = await prisma.feature.count({
    where: {
      isActive: true,
    },
  });
  
  // Calculate the expected usage per feature
  const expectedUsagePerFeature = totalUsageCount / featureCount;
  
  // Calculate the popularity score
  // If usage is 3x the expected average, it's very popular
  const popularityScore = featureUsageCount / (expectedUsagePerFeature * 3);
  
  return Math.min(popularityScore, 1);
}
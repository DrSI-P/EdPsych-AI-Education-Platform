import { PrismaClient } from '@prisma/client';
import { calculateDynamicCreditCost } from './dynamic-pricing';

const prisma = new PrismaClient();

/**
 * Check if a user has access to a specific feature
 * @param userId The user ID
 * @param featureName The feature name to check access for
 * @returns A promise that resolves to an object with access status and credit information
 */
export async function checkFeatureAccess(userId: string, featureName: string): Promise<{
  hasAccess: boolean;
  requiresCredits: boolean;
  creditCost: number | null;
  reason: string;
}> {
  try {
    // Get the feature
    const feature = await prisma.feature.findFirst({
      where: {
        name: featureName,
        isActive: true,
      },
    });

    if (!feature) {
      return {
        hasAccess: false,
        requiresCredits: false,
        creditCost: null,
        reason: 'Feature not found',
      };
    }

    // Get the user's active subscription
    const subscription = await prisma.subscription.findFirst({
      where: {
        userId,
        status: 'active',
      },
      include: {
        SubscriptionTier: true,
      },
    });

    // If no subscription, check if it's a free feature
    if (!subscription) {
      // Explorer tier is free and might have some features
      const explorerTier = await prisma.subscriptionTier.findFirst({
        where: {
          name: 'explorer',
          isActive: true,
        },
      });

      if (!explorerTier) {
        return {
          hasAccess: false,
          requiresCredits: feature.creditCost !== null,
          creditCost: feature.creditCost,
          reason: 'No active subscription',
        };
      }

      try {
        const explorerFeatures = JSON.parse(explorerTier.features as string);
        if (Array.isArray(explorerFeatures) && explorerFeatures.includes(feature.id)) {
          return {
            hasAccess: true,
            requiresCredits: false,
            creditCost: null,
            reason: 'Feature available in free tier',
          };
        }
      } catch (error) {
        console.error('Error parsing explorer tier features:', error);
      }

      return {
        hasAccess: false,
        requiresCredits: feature.creditCost !== null,
        creditCost: feature.creditCost,
        reason: 'Feature not available in free tier',
      };
    }

    // Check if the feature is included in the user's subscription tier
    try {
      const tierFeatures = JSON.parse(subscription.SubscriptionTier.features as string);
      
      if (Array.isArray(tierFeatures) && tierFeatures.includes(feature.id)) {
        // Feature is included in the subscription
        if (feature.creditCost === null) {
          // Feature doesn't require credits
          return {
            hasAccess: true,
            requiresCredits: false,
            creditCost: null,
            reason: 'Feature included in subscription',
          };
        } else {
          // Feature requires credits, check if user has enough
          const availableCredits = await prisma.credit.findMany({
            where: {
              userId,
              remaining: { gt: 0 },
              OR: [
                { expiresAt: null },
                { expiresAt: { gt: new Date() } },
              ],
            },
            orderBy: {
              expiresAt: 'asc',
            },
          });

          const totalCredits = availableCredits.reduce(
            (sum, credit) => sum + credit.remaining,
            0
          );

          // Calculate dynamic credit cost
          const dynamicCreditCost = await calculateDynamicCreditCost(feature.id, userId);

          if (totalCredits >= dynamicCreditCost) {
            return {
              hasAccess: true,
              requiresCredits: true,
              creditCost: dynamicCreditCost,
              reason: 'Feature requires credits, which are available',
            };
          } else {
            return {
              hasAccess: false,
              requiresCredits: true,
              creditCost: dynamicCreditCost,
              reason: 'Not enough credits',
            };
          }
        }
      }

      return {
        hasAccess: false,
        requiresCredits: feature.creditCost !== null,
        creditCost: feature.creditCost,
        reason: 'Feature not included in subscription tier',
      };
    } catch (error) {
      console.error(`Error parsing features for subscription ${subscription.id}:`, error);
      return {
        hasAccess: false,
        requiresCredits: feature.creditCost !== null,
        creditCost: feature.creditCost,
        reason: 'Error checking subscription features',
      };
    }
  } catch (error) {
    console.error('Error checking feature access:', error);
    return {
      hasAccess: false,
      requiresCredits: false,
      creditCost: null,
      reason: 'Error checking feature access',
    };
  }
}

/**
 * Use credits for a feature
 * @param userId The user ID
 * @param featureName The feature name to use credits for
 * @returns A promise that resolves to an object with success status and message
 */
export async function useCreditsForFeature(userId: string, featureName: string): Promise<{
  success: boolean;
  message: string;
  remainingCredits?: number;
}> {
  try {
    // Check if the user has access to the feature
    const accessCheck = await checkFeatureAccess(userId, featureName);

    if (!accessCheck.hasAccess) {
      return {
        success: false,
        message: accessCheck.reason,
      };
    }

    if (!accessCheck.requiresCredits) {
      return {
        success: true,
        message: 'Feature does not require credits',
      };
    }

    // Get the dynamic credit cost
    const creditCost = accessCheck.creditCost || 0;

    // Get the user's available credits
    const availableCredits = await prisma.credit.findMany({
      where: {
        userId,
        remaining: { gt: 0 },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
      orderBy: {
        expiresAt: 'asc',
      },
    });

    // Use credits, starting with the ones that expire soonest
    let remainingCost = creditCost;
    
    for (const credit of availableCredits) {
      if (remainingCost <= 0) break;

      const amountToUse = Math.min(remainingCost, credit.remaining);
      
      // Update the credit
      await prisma.credit.update({
        where: { id: credit.id },
        data: {
          remaining: credit.remaining - amountToUse,
          updatedAt: new Date(),
        },
      });

      // Record the credit usage
      await prisma.creditUsage.create({
        data: {
          id: `usage_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
          creditId: credit.id,
          amount: amountToUse,
          featureId: featureName,
          createdAt: new Date(),
        },
      });

      remainingCost -= amountToUse;
    }

    // Calculate remaining credits
    const updatedCredits = await prisma.credit.findMany({
      where: {
        userId,
        remaining: { gt: 0 },
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    });

    const totalRemainingCredits = updatedCredits.reduce(
      (sum, credit) => sum + credit.remaining,
      0
    );

    return {
      success: true,
      message: `Used ${creditCost} credits for ${featureName}`,
      remainingCredits: totalRemainingCredits,
    };
  } catch (error) {
    console.error('Error using credits for feature:', error);
    return {
      success: false,
      message: 'Error using credits for feature',
    };
  }
}
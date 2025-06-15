import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface CreditPrediction {
  userId: string;
  currentCredits: number;
  predictedDaysRemaining: number;
  predictedDepletionDate: Date | null;
  usageRate: number;
  confidence: 'low' | 'medium' | 'high';
  recommendedAction: 'none' | 'monitor' | 'purchase';
  recommendedPackage: string | null;
}

/**
 * Predict when a user will run out of credits based on their usage pattern
 * @param userId The user ID
 * @returns A prediction of when the user will run out of credits
 */
export async function predictCreditDepletion(userId: string): Promise<CreditPrediction> {
  try {
    // Get the user's current credit balance
    const currentCredits = await getCurrentCreditBalance(userId);
    
    // Get the user's usage history
    const usageHistory = await getUserCreditUsageHistory(userId);
    
    // Calculate the user's average daily usage rate
    const usageRate = calculateDailyUsageRate(usageHistory);
    
    // Predict when the user will run out of credits
    const prediction = predictDepletionDate(currentCredits, usageRate, usageHistory);
    
    // Determine the confidence level of the prediction
    const confidence = determineConfidenceLevel(usageHistory, usageRate);
    
    // Determine the recommended action
    const { recommendedAction, recommendedPackage } = determineRecommendedAction(
      prediction.predictedDaysRemaining,
      usageRate,
      confidence
    );
    
    return {
      userId,
      currentCredits,
      predictedDaysRemaining: prediction.predictedDaysRemaining,
      predictedDepletionDate: prediction.predictedDepletionDate,
      usageRate,
      confidence,
      recommendedAction,
      recommendedPackage,
    };
  } catch (error) {
    console.error('Error predicting credit depletion:', error);
    
    // Return a default prediction with no action recommended
    return {
      userId,
      currentCredits: 0,
      predictedDaysRemaining: -1,
      predictedDepletionDate: null,
      usageRate: 0,
      confidence: 'low',
      recommendedAction: 'none',
      recommendedPackage: null,
    };
  }
}

/**
 * Get a user's current credit balance
 * @param userId The user ID
 * @returns The user's current credit balance
 */
async function getCurrentCreditBalance(userId: string): Promise<number> {
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
  });
  
  // Calculate the total remaining credits
  const totalCredits = availableCredits.reduce(
    (sum, credit) => sum + credit.remaining,
    0
  );
  
  return totalCredits;
}

/**
 * Get a user's credit usage history
 * @param userId The user ID
 * @returns The user's credit usage history
 */
async function getUserCreditUsageHistory(userId: string): Promise<{
  date: Date;
  amount: number;
}[]> {
  // Get the user's credit usage history for the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const creditUsage = await prisma.creditUsage.findMany({
    where: {
      Credit: {
        userId,
      },
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      createdAt: true,
      amount: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  
  // Group usage by date
  const usageByDate = new Map<string, number>();
  
  for (const usage of creditUsage) {
    const dateStr = usage.createdAt.toISOString().split('T')[0];
    const currentAmount = usageByDate.get(dateStr) || 0;
    usageByDate.set(dateStr, currentAmount + usage.amount);
  }
  
  // Convert to array
  return Array.from(usageByDate.entries()).map(([dateStr, amount]) => ({
    date: new Date(dateStr),
    amount,
  }));
}

/**
 * Calculate a user's average daily usage rate
 * @param usageHistory The user's credit usage history
 * @returns The user's average daily usage rate
 */
function calculateDailyUsageRate(usageHistory: { date: Date; amount: number }[]): number {
  if (usageHistory.length === 0) {
    return 0;
  }
  
  // Calculate the total credits used
  const totalCreditsUsed = usageHistory.reduce(
    (sum, usage) => sum + usage.amount,
    0
  );
  
  // Calculate the number of days with usage
  const daysWithUsage = usageHistory.length;
  
  // Calculate the average daily usage
  return totalCreditsUsed / daysWithUsage;
}

/**
 * Predict when a user will run out of credits
 * @param currentCredits The user's current credit balance
 * @param usageRate The user's average daily usage rate
 * @param usageHistory The user's credit usage history
 * @returns A prediction of when the user will run out of credits
 */
function predictDepletionDate(
  currentCredits: number,
  usageRate: number,
  usageHistory: { date: Date; amount: number }[]
): {
  predictedDaysRemaining: number;
  predictedDepletionDate: Date | null;
} {
  // If the user has no credits or no usage, return null
  if (currentCredits <= 0 || usageRate <= 0) {
    return {
      predictedDaysRemaining: -1,
      predictedDepletionDate: null,
    };
  }
  
  // Calculate the number of days until depletion
  const daysRemaining = Math.floor(currentCredits / usageRate);
  
  // Calculate the depletion date
  const depletionDate = new Date();
  depletionDate.setDate(depletionDate.getDate() + daysRemaining);
  
  // Apply a correction factor based on usage pattern
  const correctedPrediction = applyUsagePatternCorrection(
    daysRemaining,
    depletionDate,
    usageHistory
  );
  
  return correctedPrediction;
}

/**
 * Apply a correction factor to the prediction based on the user's usage pattern
 * @param daysRemaining The predicted number of days remaining
 * @param depletionDate The predicted depletion date
 * @param usageHistory The user's credit usage history
 * @returns A corrected prediction
 */
function applyUsagePatternCorrection(
  daysRemaining: number,
  depletionDate: Date,
  usageHistory: { date: Date; amount: number }[]
): {
  predictedDaysRemaining: number;
  predictedDepletionDate: Date | null;
} {
  if (usageHistory.length < 7) {
    // Not enough data for a reliable correction
    return {
      predictedDaysRemaining: daysRemaining,
      predictedDepletionDate: depletionDate,
    };
  }
  
  // Check if usage is increasing or decreasing
  const firstWeekUsage = usageHistory.slice(0, 7).reduce((sum, usage) => sum + usage.amount, 0);
  const lastWeekUsage = usageHistory.slice(-7).reduce((sum, usage) => sum + usage.amount, 0);
  
  const usageRatio = lastWeekUsage / firstWeekUsage;
  
  // Apply a correction factor based on the usage trend
  let correctionFactor = 1.0;
  
  if (usageRatio > 1.5) {
    // Usage is increasing significantly
    correctionFactor = 0.7; // Predict depletion 30% sooner
  } else if (usageRatio > 1.2) {
    // Usage is increasing moderately
    correctionFactor = 0.85; // Predict depletion 15% sooner
  } else if (usageRatio < 0.5) {
    // Usage is decreasing significantly
    correctionFactor = 1.3; // Predict depletion 30% later
  } else if (usageRatio < 0.8) {
    // Usage is decreasing moderately
    correctionFactor = 1.15; // Predict depletion 15% later
  }
  
  // Apply the correction factor
  const correctedDaysRemaining = Math.floor(daysRemaining * correctionFactor);
  
  // Calculate the corrected depletion date
  const correctedDepletionDate = new Date();
  correctedDepletionDate.setDate(correctedDepletionDate.getDate() + correctedDaysRemaining);
  
  return {
    predictedDaysRemaining: correctedDaysRemaining,
    predictedDepletionDate: correctedDepletionDate,
  };
}

/**
 * Determine the confidence level of the prediction
 * @param usageHistory The user's credit usage history
 * @param usageRate The user's average daily usage rate
 * @returns The confidence level of the prediction
 */
function determineConfidenceLevel(
  usageHistory: { date: Date; amount: number }[],
  usageRate: number
): 'low' | 'medium' | 'high' {
  if (usageHistory.length < 5 || usageRate === 0) {
    return 'low';
  }
  
  // Calculate the standard deviation of daily usage
  const mean = usageRate;
  const squaredDiffs = usageHistory.map(usage => Math.pow(usage.amount - mean, 2));
  const avgSquaredDiff = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
  const stdDev = Math.sqrt(avgSquaredDiff);
  
  // Calculate the coefficient of variation (CV)
  const cv = stdDev / mean;
  
  if (cv < 0.5 && usageHistory.length >= 14) {
    return 'high';
  } else if (cv < 1.0 && usageHistory.length >= 7) {
    return 'medium';
  } else {
    return 'low';
  }
}

/**
 * Determine the recommended action based on the prediction
 * @param daysRemaining The predicted number of days remaining
 * @param usageRate The user's average daily usage rate
 * @param confidence The confidence level of the prediction
 * @returns The recommended action and package
 */
function determineRecommendedAction(
  daysRemaining: number,
  usageRate: number,
  confidence: 'low' | 'medium' | 'high'
): {
  recommendedAction: 'none' | 'monitor' | 'purchase';
  recommendedPackage: string | null;
} {
  if (daysRemaining < 0 || usageRate === 0) {
    return {
      recommendedAction: 'none',
      recommendedPackage: null,
    };
  }
  
  // Determine the threshold based on confidence level
  let threshold = 7; // Default: 7 days
  
  if (confidence === 'high') {
    threshold = 5; // High confidence: 5 days
  } else if (confidence === 'low') {
    threshold = 10; // Low confidence: 10 days
  }
  
  if (daysRemaining <= threshold) {
    // Recommend purchasing credits
    // Calculate the recommended package size based on usage rate
    const recommendedCredits = Math.ceil(usageRate * 30); // 30 days worth of credits
    
    let recommendedPackage: string;
    
    if (recommendedCredits <= 50) {
      recommendedPackage = 'small';
    } else if (recommendedCredits <= 100) {
      recommendedPackage = 'medium';
    } else {
      recommendedPackage = 'large';
    }
    
    return {
      recommendedAction: 'purchase',
      recommendedPackage,
    };
  } else if (daysRemaining <= threshold * 2) {
    // Recommend monitoring credit usage
    return {
      recommendedAction: 'monitor',
      recommendedPackage: null,
    };
  } else {
    // No action needed
    return {
      recommendedAction: 'none',
      recommendedPackage: null,
    };
  }
}

/**
 * Get users who need to be alerted about low credits
 * @returns A list of users who need to be alerted
 */
export async function getUsersNeedingCreditAlerts(): Promise<{
  userId: string;
  email: string;
  prediction: CreditPrediction;
}[]> {
  try {
    // Get all users with active subscriptions
    const users = await prisma.user.findMany({
      where: {
        Subscription: {
          some: {
            status: 'active',
          },
        },
        email: {
          not: null, // Ensure email is not null
        },
      },
      select: {
        id: true,
        email: true,
      },
    });
    
    const usersNeedingAlerts: {
      userId: string;
      email: string;
      prediction: CreditPrediction;
    }[] = [];
    
    // Check each user's credit prediction
    for (const user of users) {
      if (!user.email) continue; // Skip users without email
      
      const prediction = await predictCreditDepletion(user.id);
      
      if (prediction.recommendedAction === 'purchase') {
        usersNeedingAlerts.push({
          userId: user.id,
          email: user.email,
          prediction,
        });
      }
    }
    
    return usersNeedingAlerts;
  } catch (error) {
    console.error('Error getting users needing credit alerts:', error);
    return [];
  }
}
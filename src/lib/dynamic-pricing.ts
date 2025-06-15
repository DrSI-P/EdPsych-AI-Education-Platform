import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PricingFactors {
  basePrice: number;
  timeOfDay: number;
  dayOfWeek: number;
  userDemand: number;
  serverLoad: number;
  userHistory: number;
}

/**
 * Calculate the dynamic credit cost for a feature
 * @param featureId The feature ID
 * @param userId The user ID
 * @returns The calculated credit cost
 */
export async function calculateDynamicCreditCost(
  featureId: string,
  userId: string
): Promise<number> {
  try {
    // Get the feature's base credit cost
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
    });

    if (!feature || feature.creditCost === null) {
      return 0; // Feature doesn't require credits
    }

    const basePrice = feature.creditCost;
    
    // Get pricing factors
    const factors = await getPricingFactors(featureId, userId);
    
    // Calculate the dynamic price
    let dynamicPrice = basePrice;
    
    // Apply time of day factor (higher during peak hours)
    dynamicPrice *= factors.timeOfDay;
    
    // Apply day of week factor (higher on weekdays)
    dynamicPrice *= factors.dayOfWeek;
    
    // Apply user demand factor (higher when feature is in high demand)
    dynamicPrice *= factors.userDemand;
    
    // Apply server load factor (higher when server load is high)
    dynamicPrice *= factors.serverLoad;
    
    // Apply user history factor (discount for loyal users)
    dynamicPrice *= factors.userHistory;
    
    // Round to nearest integer and ensure minimum price
    return Math.max(Math.round(dynamicPrice), 1);
  } catch (error) {
    console.error('Error calculating dynamic credit cost:', error);
    // Fall back to base price if there's an error
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
    });
    return feature?.creditCost || 0;
  }
}

/**
 * Get the pricing factors for a feature and user
 * @param featureId The feature ID
 * @param userId The user ID
 * @returns The pricing factors
 */
async function getPricingFactors(
  featureId: string,
  userId: string
): Promise<PricingFactors> {
  // Get the current hour (0-23)
  const currentHour = new Date().getHours();
  
  // Get the current day of week (0-6, where 0 is Sunday)
  const currentDay = new Date().getDay();
  
  // Calculate time of day factor (peak hours: 9-17)
  const timeOfDay = isPeakHour(currentHour) ? 1.2 : 0.8;
  
  // Calculate day of week factor (weekdays: 1-5)
  const dayOfWeek = isWeekday(currentDay) ? 1.1 : 0.9;
  
  // Get recent usage count for this feature (last 24 hours)
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);
  
  const recentUsageCount = await prisma.creditUsage.count({
    where: {
      featureId,
      createdAt: {
        gte: oneDayAgo,
      },
    },
  });
  
  // Calculate user demand factor based on recent usage
  const userDemand = calculateUserDemandFactor(recentUsageCount);
  
  // Get server load factor (simulated for now)
  const serverLoad = await getServerLoadFactor();
  
  // Get user history factor
  const userHistory = await getUserHistoryFactor(userId);
  
  return {
    basePrice: 1.0, // Multiplier for base price (1.0 = no change)
    timeOfDay,
    dayOfWeek,
    userDemand,
    serverLoad,
    userHistory,
  };
}

/**
 * Check if the current hour is a peak hour
 * @param hour The hour to check (0-23)
 * @returns True if it's a peak hour
 */
function isPeakHour(hour: number): boolean {
  return hour >= 9 && hour <= 17; // 9 AM to 5 PM
}

/**
 * Check if the current day is a weekday
 * @param day The day to check (0-6, where 0 is Sunday)
 * @returns True if it's a weekday
 */
function isWeekday(day: number): boolean {
  return day >= 1 && day <= 5; // Monday to Friday
}

/**
 * Calculate the user demand factor based on recent usage
 * @param recentUsageCount The number of recent usages
 * @returns The user demand factor
 */
function calculateUserDemandFactor(recentUsageCount: number): number {
  // Higher demand = higher price
  if (recentUsageCount > 100) return 1.3;
  if (recentUsageCount > 50) return 1.2;
  if (recentUsageCount > 20) return 1.1;
  if (recentUsageCount > 10) return 1.0;
  return 0.9; // Low demand = discount
}

/**
 * Get the server load factor
 * @returns The server load factor
 */
async function getServerLoadFactor(): Promise<number> {
  // In a real implementation, this would check actual server metrics
  // For now, we'll simulate it with a random value
  const simulatedLoad = Math.random();
  
  if (simulatedLoad > 0.8) return 1.3; // High load
  if (simulatedLoad > 0.6) return 1.2; // Medium-high load
  if (simulatedLoad > 0.4) return 1.1; // Medium load
  if (simulatedLoad > 0.2) return 1.0; // Normal load
  return 0.9; // Low load
}

/**
 * Get the user history factor
 * @param userId The user ID
 * @returns The user history factor
 */
async function getUserHistoryFactor(userId: string): Promise<number> {
  // Get the user's total credit usage
  const totalUsage = await prisma.creditUsage.count({
    where: {
      Credit: {
        userId,
      },
    },
  });
  
  // Get the user's subscription age in days
  const userSubscription = await prisma.subscription.findFirst({
    where: {
      userId,
      status: 'active',
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
  
  const subscriptionAgeInDays = userSubscription
    ? Math.floor((Date.now() - userSubscription.createdAt.getTime()) / (1000 * 60 * 60 * 24))
    : 0;
  
  // Calculate loyalty factor (lower price for loyal users)
  let loyaltyFactor = 1.0;
  
  if (subscriptionAgeInDays > 365) loyaltyFactor = 0.7; // > 1 year
  else if (subscriptionAgeInDays > 180) loyaltyFactor = 0.8; // > 6 months
  else if (subscriptionAgeInDays > 90) loyaltyFactor = 0.9; // > 3 months
  
  // Calculate usage factor (lower price for heavy users)
  let usageFactor = 1.0;
  
  if (totalUsage > 1000) usageFactor = 0.7; // Heavy user
  else if (totalUsage > 500) usageFactor = 0.8; // Regular user
  else if (totalUsage > 100) usageFactor = 0.9; // Occasional user
  
  // Return the combined factor (average of loyalty and usage)
  return (loyaltyFactor + usageFactor) / 2;
}
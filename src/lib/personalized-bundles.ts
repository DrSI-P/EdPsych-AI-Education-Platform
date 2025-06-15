import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

interface CreditBundle {
  id: string;
  name: string;
  displayName: string;
  description: string;
  amount: number;
  price: number;
  discount: number;
  isPersonalized: boolean;
  expiresAt: Date | null;
}

interface UsagePattern {
  averageMonthlyUsage: number;
  preferredFeatures: string[];
  usageFrequency: 'low' | 'medium' | 'high';
  peakUsageTimes: {
    dayOfWeek: number[];
    hourOfDay: number[];
  };
}

/**
 * Generate personalized credit bundle recommendations for a user
 * @param userId The user ID
 * @returns A list of recommended credit bundles
 */
export async function getPersonalizedCreditBundles(
  userId: string
): Promise<CreditBundle[]> {
  try {
    // Get the user's usage pattern
    const usagePattern = await analyzeUserUsagePattern(userId);
    
    // Get the standard credit bundles
    const standardBundles = await getStandardCreditBundles();
    
    // Generate personalized bundles based on usage pattern
    const personalizedBundles = generatePersonalizedBundles(usagePattern, standardBundles);
    
    // Combine standard and personalized bundles, with personalized ones first
    return [...personalizedBundles, ...standardBundles];
  } catch (error) {
    console.error('Error generating personalized credit bundles:', error);
    return getStandardCreditBundles();
  }
}

/**
 * Get the standard credit bundles
 * @returns A list of standard credit bundles
 */
async function getStandardCreditBundles(): Promise<CreditBundle[]> {
  // In a real implementation, these would be fetched from the database
  return [
    {
      id: 'bundle_small',
      name: 'small',
      displayName: '50 Credits',
      description: 'Small credit package for occasional use of premium features',
      amount: 50,
      price: 9.99,
      discount: 0,
      isPersonalized: false,
      expiresAt: null,
    },
    {
      id: 'bundle_medium',
      name: 'medium',
      displayName: '100 Credits',
      description: 'Medium credit package for regular use of premium features',
      amount: 100,
      price: 18.99,
      discount: 0,
      isPersonalized: false,
      expiresAt: null,
    },
    {
      id: 'bundle_large',
      name: 'large',
      displayName: '200 Credits',
      description: 'Large credit package for frequent use of premium features',
      amount: 200,
      price: 34.99,
      discount: 0,
      isPersonalized: false,
      expiresAt: null,
    },
  ];
}

/**
 * Analyze a user's credit usage pattern
 * @param userId The user ID
 * @returns The user's usage pattern
 */
async function analyzeUserUsagePattern(userId: string): Promise<UsagePattern> {
  // Get the user's credit usage history
  const creditUsage = await prisma.creditUsage.findMany({
    where: {
      Credit: {
        userId,
      },
    },
    include: {
      Credit: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  // Calculate average monthly usage
  const monthlyUsage = calculateMonthlyUsage(creditUsage);
  
  // Identify preferred features
  const preferredFeatures = identifyPreferredFeatures(creditUsage);
  
  // Determine usage frequency
  const usageFrequency = determineUsageFrequency(monthlyUsage);
  
  // Identify peak usage times
  const peakUsageTimes = identifyPeakUsageTimes(creditUsage);
  
  return {
    averageMonthlyUsage: monthlyUsage,
    preferredFeatures,
    usageFrequency,
    peakUsageTimes,
  };
}

/**
 * Calculate a user's average monthly credit usage
 * @param creditUsage The user's credit usage history
 * @returns The average monthly usage
 */
function calculateMonthlyUsage(creditUsage: any[]): number {
  if (creditUsage.length === 0) {
    return 0;
  }
  
  // Get the total credits used
  const totalCreditsUsed = creditUsage.reduce(
    (sum, usage) => sum + usage.amount,
    0
  );
  
  // Get the earliest and latest usage dates
  const dates = creditUsage.map(usage => new Date(usage.createdAt));
  const earliestDate = new Date(Math.min(...dates.map(date => date.getTime())));
  const latestDate = new Date(Math.max(...dates.map(date => date.getTime())));
  
  // Calculate the number of months between the earliest and latest usage
  const monthsDiff = (latestDate.getFullYear() - earliestDate.getFullYear()) * 12 +
    (latestDate.getMonth() - earliestDate.getMonth());
  
  // If less than a month, return the total credits used
  if (monthsDiff < 1) {
    return totalCreditsUsed;
  }
  
  // Calculate the average monthly usage
  return totalCreditsUsed / monthsDiff;
}

/**
 * Identify a user's preferred features based on credit usage
 * @param creditUsage The user's credit usage history
 * @returns A list of preferred feature IDs
 */
function identifyPreferredFeatures(creditUsage: any[]): string[] {
  if (creditUsage.length === 0) {
    return [];
  }
  
  // Count usage by feature
  const featureCounts: Record<string, number> = {};
  
  for (const usage of creditUsage) {
    const featureId = usage.featureId;
    featureCounts[featureId] = (featureCounts[featureId] || 0) + usage.amount;
  }
  
  // Sort features by usage count (descending)
  const sortedFeatures = Object.entries(featureCounts)
    .sort(([, countA], [, countB]) => countB - countA)
    .map(([featureId]) => featureId);
  
  // Return the top 3 features (or fewer if there are less than 3)
  return sortedFeatures.slice(0, 3);
}

/**
 * Determine a user's usage frequency based on monthly usage
 * @param monthlyUsage The user's average monthly usage
 * @returns The usage frequency category
 */
function determineUsageFrequency(monthlyUsage: number): 'low' | 'medium' | 'high' {
  if (monthlyUsage < 20) {
    return 'low';
  } else if (monthlyUsage < 100) {
    return 'medium';
  } else {
    return 'high';
  }
}

/**
 * Identify a user's peak usage times
 * @param creditUsage The user's credit usage history
 * @returns The peak usage times
 */
function identifyPeakUsageTimes(creditUsage: any[]): {
  dayOfWeek: number[];
  hourOfDay: number[];
} {
  if (creditUsage.length === 0) {
    return {
      dayOfWeek: [],
      hourOfDay: [],
    };
  }
  
  // Count usage by day of week and hour of day
  const dayOfWeekCounts: number[] = Array(7).fill(0);
  const hourOfDayCounts: number[] = Array(24).fill(0);
  
  for (const usage of creditUsage) {
    const date = new Date(usage.createdAt);
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
    const hourOfDay = date.getHours(); // 0-23
    
    dayOfWeekCounts[dayOfWeek] += usage.amount;
    hourOfDayCounts[hourOfDay] += usage.amount;
  }
  
  // Find the peak days (top 2)
  const peakDays = dayOfWeekCounts
    .map((count, day) => ({ day, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map(({ day }) => day);
  
  // Find the peak hours (top 3)
  const peakHours = hourOfDayCounts
    .map((count, hour) => ({ hour, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(({ hour }) => hour);
  
  return {
    dayOfWeek: peakDays,
    hourOfDay: peakHours,
  };
}

/**
 * Generate personalized credit bundles based on a user's usage pattern
 * @param usagePattern The user's usage pattern
 * @param standardBundles The standard credit bundles
 * @returns A list of personalized credit bundles
 */
function generatePersonalizedBundles(
  usagePattern: UsagePattern,
  standardBundles: CreditBundle[]
): CreditBundle[] {
  const personalizedBundles: CreditBundle[] = [];
  
  // Generate a bundle based on monthly usage
  if (usagePattern.averageMonthlyUsage > 0) {
    // Round up to the nearest 10
    const recommendedAmount = Math.ceil(usagePattern.averageMonthlyUsage / 10) * 10;
    
    // Find the closest standard bundle
    const closestBundle = standardBundles.reduce((prev, curr) => {
      return Math.abs(curr.amount - recommendedAmount) < Math.abs(prev.amount - recommendedAmount)
        ? curr
        : prev;
    });
    
    // Calculate the price based on the closest bundle's price per credit
    const pricePerCredit = closestBundle.price / closestBundle.amount;
    let price = recommendedAmount * pricePerCredit;
    
    // Apply a discount based on usage frequency
    let discount = 0;
    if (usagePattern.usageFrequency === 'high') {
      discount = 0.15; // 15% discount for high-frequency users
    } else if (usagePattern.usageFrequency === 'medium') {
      discount = 0.1; // 10% discount for medium-frequency users
    } else {
      discount = 0.05; // 5% discount for low-frequency users
    }
    
    price = price * (1 - discount);
    
    // Create the personalized bundle
    personalizedBundles.push({
      id: `bundle_personalized_${recommendedAmount}`,
      name: `personalized_${recommendedAmount}`,
      displayName: `${recommendedAmount} Credits (Personalized)`,
      description: `Personalized credit package based on your usage pattern. Save ${Math.round(discount * 100)}%!`,
      amount: recommendedAmount,
      price: Math.round(price * 100) / 100, // Round to 2 decimal places
      discount,
      isPersonalized: true,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expires in 7 days
    });
  }
  
  // Generate a bundle for weekend usage if the user uses credits on weekends
  const weekendDays = [0, 6]; // Sunday and Saturday
  const userUsesOnWeekends = usagePattern.peakUsageTimes.dayOfWeek.some(day => weekendDays.includes(day));
  
  if (userUsesOnWeekends) {
    // Create a weekend bundle with a 20% discount
    const weekendBundle: CreditBundle = {
      id: 'bundle_weekend',
      name: 'weekend',
      displayName: 'Weekend Special',
      description: 'Special discount for weekend usage. Valid for this weekend only!',
      amount: 50,
      price: 7.99, // 20% off the small bundle
      discount: 0.2,
      isPersonalized: true,
      expiresAt: getNextWeekendDate(),
    };
    
    personalizedBundles.push(weekendBundle);
  }
  
  return personalizedBundles;
}

/**
 * Get the date of the next weekend
 * @returns The date of the next weekend
 */
function getNextWeekendDate(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0 = Sunday, 6 = Saturday
  
  // If today is Sunday through Thursday, the next weekend is this coming Saturday
  // If today is Friday or Saturday, the next weekend is next Saturday
  const daysUntilWeekend = dayOfWeek <= 4 ? 6 - dayOfWeek : 13 - dayOfWeek;
  
  const nextWeekend = new Date(now);
  nextWeekend.setDate(now.getDate() + daysUntilWeekend);
  nextWeekend.setHours(23, 59, 59, 999); // End of the day
  
  return nextWeekend;
}
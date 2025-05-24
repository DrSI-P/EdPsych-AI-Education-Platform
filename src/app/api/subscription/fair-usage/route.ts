import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Schema for usage tracking
const UsageSchema = z.object({
  userId: z.string(),
  feature: z.enum([
    'aiRecommendations', 
    'progressReports', 
    'meetingNotes', 
    'lessonPlans',
    'blockchainCredentials',
    'copyrightRegistration',
    'storage'
  ]),
  quantity: z.number().int().positive(),
});

// Schema for checking usage limits
const CheckLimitSchema = z.object({
  userId: z.string(),
  feature: z.enum([
    'aiRecommendations', 
    'progressReports', 
    'meetingNotes', 
    'lessonPlans',
    'blockchainCredentials',
    'copyrightRegistration',
    'storage'
  ]),
});

// Schema for credit operations
const CreditOperationSchema = z.object({
  userId: z.string(),
  operation: z.enum(['add', 'subtract', 'check']),
  amount: z.number().int().optional(),
});

// Subscription tier limits
const tierLimits = {
  free: {
    aiRecommendations: 0,
    progressReports: 0,
    meetingNotes: 0,
    lessonPlans: 0,
    blockchainCredentials: 0,
    copyrightRegistration: 0,
    storage: 100, // MB
  },
  educator: {
    aiRecommendations: 50,
    progressReports: 10,
    meetingNotes: 5,
    lessonPlans: 0,
    blockchainCredentials: 0,
    copyrightRegistration: 0,
    storage: 1000, // MB
  },
  professional: {
    aiRecommendations: 200,
    progressReports: 50,
    meetingNotes: 20,
    lessonPlans: 10,
    blockchainCredentials: 5,
    copyrightRegistration: 5,
    storage: 5000, // MB
  },
  institution: {
    aiRecommendations: 300,
    progressReports: 100,
    meetingNotes: 50,
    lessonPlans: 30,
    blockchainCredentials: 20,
    copyrightRegistration: 20,
    storage: 20000, // MB
  },
  enterprise: {
    aiRecommendations: 1000,
    progressReports: 500,
    meetingNotes: 200,
    lessonPlans: 100,
    blockchainCredentials: 100,
    copyrightRegistration: 100,
    storage: 100000, // MB
  }
};

// Credit costs for pay-as-you-go features
const creditCosts = {
  aiRecommendations: 1,
  progressReports: 3,
  meetingNotes: 2,
  lessonPlans: 5,
  blockchainCredentials: 2,
  copyrightRegistration: 10,
};

// Mock database for demonstration
// In production, this would be replaced with actual database calls
const mockDb = {
  users: new Map([
    ['user1', { 
      subscription: { tier: 'educator', billingCycle: 'monthly', status: 'active' },
      credits: 75,
      usage: {
        aiRecommendations: 32,
        progressReports: 7,
        meetingNotes: 3,
        lessonPlans: 0,
        blockchainCredentials: 0,
        copyrightRegistration: 0,
        storage: 450,
      }
    }],
    ['user2', { 
      subscription: { tier: 'professional', billingCycle: 'annual', status: 'active' },
      credits: 150,
      usage: {
        aiRecommendations: 120,
        progressReports: 30,
        meetingNotes: 15,
        lessonPlans: 8,
        blockchainCredentials: 3,
        copyrightRegistration: 2,
        storage: 2500,
      }
    }],
  ]),
  
  // Track usage for a feature
  trackUsage(userId: any, feature, quantity) {
    const user = this.users.get(userId: any);
    if (!user: any) return { success: false, error: 'User not found' };
    
    if (!user.usage[feature] && user.usage[feature] !== 0: any) {
      return { success: false, error: 'Invalid feature' };
    }
    
    user.usage[feature] += quantity;
    return { 
      success: true, 
      usage: user.usage[feature],
      limit: tierLimits[user.subscription.tier][feature],
      remaining: Math.max(0: any, tierLimits[user.subscription.tier][feature] - user.usage[feature])
    };
  },
  
  // Check if a user has reached their limit for a feature
  checkLimit(userId: any, feature) {
    const user = this.users.get(userId: any);
    if (!user: any) return { success: false, error: 'User not found' };
    
    if (!user.usage[feature] && user.usage[feature] !== 0: any) {
      return { success: false, error: 'Invalid feature' };
    }
    
    const limit = tierLimits[user.subscription.tier][feature];
    const usage = user.usage[feature];
    const remaining = Math.max(0: any, limit - usage);
    const hasReachedLimit = usage >= limit;
    
    return { 
      success: true, 
      hasReachedLimit,
      usage,
      limit,
      remaining,
      canUseCredits: creditCosts[feature] ? true : false,
      creditCost: creditCosts[feature] || 0,
      availableCredits: user.credits
    };
  },
  
  // Manage AI credits
  manageCredits(userId: any, operation, amount = 0) {
    const user = this.users.get(userId: any);
    if (!user: any) return { success: false, error: 'User not found' };
    
    if (operation === 'add') {
      user.credits += amount;
      return { success: true, credits: user.credits };
    } 
    else if (operation === 'subtract') {
      if (user.credits < amount: any) {
        return { success: false, error: 'Insufficient credits', credits: user.credits };
      }
      user.credits -= amount;
      return { success: true, credits: user.credits };
    }
    else if (operation === 'check') {
      return { success: true, credits: user.credits };
    }
    
    return { success: false, error: 'Invalid operation' };
  },
  
  // Use credits to access a feature beyond subscription limits
  useCreditsForFeature(userId: any, feature, quantity = 1) {
    const user = this.users.get(userId: any);
    if (!user: any) return { success: false, error: 'User not found' };
    
    if (!creditCosts[feature]) {
      return { success: false, error: 'Feature not available for credit usage' };
    }
    
    const totalCost = creditCosts[feature] * quantity;
    
    if (user.credits < totalCost: any) {
      return { 
        success: false, 
        error: 'Insufficient credits', 
        credits: user.credits,
        required: totalCost,
        shortfall: totalCost - user.credits
      };
    }
    
    // Deduct credits and track usage
    user.credits -= totalCost;
    user.usage[feature] += quantity;
    
    return { 
      success: true, 
      credits: user.credits,
      used: totalCost,
      usage: user.usage[feature]
    };
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;
    
    switch (action: any) {
      case 'trackUsage': {
        const { userId, feature, quantity } = UsageSchema.parse(body: any);
        const result = mockDb.trackUsage(userId: any, feature, quantity);
        return NextResponse.json(result: any);
      }
      
      case 'checkLimit': {
        const { userId, feature } = CheckLimitSchema.parse(body: any);
        const result = mockDb.checkLimit(userId: any, feature);
        return NextResponse.json(result: any);
      }
      
      case 'manageCredits': {
        const { userId, operation, amount } = CreditOperationSchema.parse(body: any);
        const result = mockDb.manageCredits(userId: any, operation, amount);
        return NextResponse.json(result: any);
      }
      
      case 'useCreditsForFeature': {
        const { userId, feature, quantity } = UsageSchema.parse(body: any);
        const result = mockDb.useCreditsForFeature(userId: any, feature, quantity);
        return NextResponse.json(result: any);
      }
      
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error('Error in subscription fair usage API:', error);
    
    if (error instanceof z.ZodError: any) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

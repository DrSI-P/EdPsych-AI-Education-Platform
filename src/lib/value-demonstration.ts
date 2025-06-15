import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface FeatureValue {
  featureId: string;
  featureName: string;
  description: string;
  timeSaved: number; // in minutes per week
  outcomesImproved: string[];
  testimonials: {
    quote: string;
    author: string;
    role: string;
    institution?: string;
  }[];
  demoContent: {
    type: 'image' | 'video' | 'text';
    url?: string;
    content?: string;
  }[];
  roi: {
    timeSavedPerWeek: number; // in minutes
    timeSavedPerYear: number; // in hours
    monetaryValuePerYear: number; // in dollars
    studentOutcomeImprovement: number; // percentage
  };
}

export interface PersonalizedValueEstimate {
  userId: string;
  userRole: string;
  featureId: string;
  estimatedTimeSaved: number; // in minutes per week
  estimatedMonetaryValue: number; // in dollars per year
  estimatedOutcomeImprovement: number; // percentage
  confidence: 'low' | 'medium' | 'high';
  personalizedDescription: string;
}

/**
 * Get the value demonstration for a specific feature
 * @param featureId The feature ID
 * @returns The feature value demonstration
 */
export async function getFeatureValueDemonstration(featureId: string): Promise<FeatureValue | null> {
  try {
    // Get the feature from the database
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
    });
    
    if (!feature) {
      return null;
    }
    
    // Get the value demonstration for the feature
    return getValueDemonstrationData(feature.id, feature.name);
  } catch (error) {
    console.error('Error getting feature value demonstration:', error);
    return null;
  }
}

/**
 * Get a personalized value estimate for a user and feature
 * @param userId The user ID
 * @param featureId The feature ID
 * @returns A personalized value estimate
 */
export async function getPersonalizedValueEstimate(
  userId: string,
  featureId: string
): Promise<PersonalizedValueEstimate | null> {
  try {
    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        role: true,
      },
    });
    
    if (!user) {
      return null;
    }
    
    // Get the feature
    const feature = await prisma.feature.findUnique({
      where: { id: featureId },
    });
    
    if (!feature) {
      return null;
    }
    
    // Get the base value demonstration
    const baseValue = getValueDemonstrationData(feature.id, feature.name);
    
    // Get the user's usage patterns
    const usagePatterns = await getUserUsagePatterns(userId);
    
    // Calculate personalized estimates
    const personalizedEstimate = calculatePersonalizedEstimate(
      user.id,
      user.role,
      baseValue,
      usagePatterns
    );
    
    return personalizedEstimate;
  } catch (error) {
    console.error('Error getting personalized value estimate:', error);
    return null;
  }
}

/**
 * Get the value demonstration data for a feature
 * @param featureId The feature ID
 * @param featureName The feature name
 * @returns The feature value demonstration
 */
function getValueDemonstrationData(featureId: string, featureName: string): FeatureValue {
  // In a real implementation, this would be fetched from the database
  // For now, we'll use hardcoded data for a few example features
  
  const valueData: Record<string, FeatureValue> = {
    'ai_lesson_plan': {
      featureId: 'ai_lesson_plan',
      featureName: 'AI Lesson Planning',
      description: 'Create comprehensive lesson plans in minutes instead of hours, with AI-generated objectives, activities, assessments, and differentiation strategies.',
      timeSaved: 120, // 2 hours per week
      outcomesImproved: [
        'Lesson quality and alignment with standards',
        'Differentiation for diverse learners',
        'Assessment variety and effectiveness',
        'Student engagement and participation',
      ],
      testimonials: [
        {
          quote: "I used to spend 3-4 hours every weekend planning lessons. Now I can create a week of high-quality plans in under an hour.",
          author: "Sarah Johnson",
          role: "Middle School Science Teacher",
          institution: "Lincoln Middle School",
        },
        {
          quote: "The AI lesson planner has transformed my teaching. My students are more engaged, and I have more time to focus on individual student needs.",
          author: "Michael Rodriguez",
          role: "High School English Teacher",
          institution: "Washington High School",
        },
      ],
      demoContent: [
        {
          type: 'image',
          url: '/assets/demos/ai-lesson-plan-before-after.png',
        },
        {
          type: 'video',
          url: '/assets/demos/ai-lesson-plan-demo.mp4',
        },
        {
          type: 'text',
          content: 'The AI Lesson Planner analyzes your curriculum standards, student needs, and teaching preferences to generate comprehensive lesson plans in minutes. Each plan includes clear objectives, engaging activities, differentiation strategies, and aligned assessments.',
        },
      ],
      roi: {
        timeSavedPerWeek: 120, // 2 hours
        timeSavedPerYear: 120, // 120 hours (assuming 60 teaching weeks)
        monetaryValuePerYear: 3600, // $30/hour * 120 hours
        studentOutcomeImprovement: 15, // 15% improvement in student outcomes
      },
    },
    'content_differentiation': {
      featureId: 'content_differentiation',
      featureName: 'Content Differentiation',
      description: 'Automatically adapt your teaching materials for different learning levels, styles, and needs, ensuring every student can access and engage with the content.',
      timeSaved: 90, // 1.5 hours per week
      outcomesImproved: [
        'Student comprehension and mastery',
        'Engagement of struggling learners',
        'Challenge for advanced students',
        'Classroom equity and inclusion',
      ],
      testimonials: [
        {
          quote: "Differentiating content used to be my biggest challenge. This tool has made it possible to meet the needs of all my students without spending hours creating different versions of materials.",
          author: "Emily Chen",
          role: "Elementary School Teacher",
          institution: "Oakridge Elementary",
        },
        {
          quote: "As a special education teacher, I have seen remarkable progress in my students since using the differentiation tools. They are finally accessing mark-level content in ways that work for them.",
          author: "David Washington",
          role: "Special Education Teacher",
          institution: "Riverside Schools",
        },
      ],
      demoContent: [
        {
          type: 'image',
          url: '/assets/demos/content-differentiation-example.png',
        },
        {
          type: 'text',
          content: 'The Content Differentiation tool takes your existing materials and automatically creates versions tailored to different reading levels, learning styles, and specific accommodations. It maintains the core content whilst adjusting complexity, format, and support features.',
        },
      ],
      roi: {
        timeSavedPerWeek: 90, // 1.5 hours
        timeSavedPerYear: 90, // 90 hours (assuming 60 teaching weeks)
        monetaryValuePerYear: 2700, // $30/hour * 90 hours
        studentOutcomeImprovement: 22, // 22% improvement in student outcomes
      },
    },
    'assessment_generator': {
      featureId: 'assessment_generator',
      featureName: 'Assessment Generator',
      description: 'Create standards-aligned assessments with a variety of question types, difficulty levels, and automatic marking capabilities.',
      timeSaved: 60, // 1 hour per week
      outcomesImproved: [
        'Assessment quality and alignment',
        'Data collection on student performance',
        'Feedback timeliness and quality',
        'Instructional decision-making',
      ],
      testimonials: [
        {
          quote: "The assessment generator has revolutionized how I evaluate student learning. I get better data, faster, with much less work.",
          author: "James Wilson",
          role: "High School Math Teacher",
          institution: "Central High School",
        },
      ],
      demoContent: [
        {
          type: 'image',
          url: '/assets/demos/assessment-generator-sample.png',
        },
        {
          type: 'text',
          content: 'The Assessment Generator creates high-quality, standards-aligned assessments in seconds. Choose from multiple question types, set difficulty levels, and generate multiple versions to prevent cheating. Automatic marking saves hours of time and provides immediate feedback to students.',
        },
      ],
      roi: {
        timeSavedPerWeek: 60, // 1 hour
        timeSavedPerYear: 60, // 60 hours (assuming 60 teaching weeks)
        monetaryValuePerYear: 1800, // $30/hour * 60 hours
        studentOutcomeImprovement: 18, // 18% improvement in student outcomes
      },
    },
  };
  
  // Return the value data for the requested feature, or a generic one if not found
  return valueData[featureId] || {
    featureId,
    featureName,
    description: `${featureName} helps educators save time and improve student outcomes through AI-powered automation and personalization.`,
    timeSaved: 60, // 1 hour per week (default)
    outcomesImproved: [
      'Teaching efficiency and effectiveness',
      'Student engagement and learning',
      'Personalization and differentiation',
    ],
    testimonials: [],
    demoContent: [
      {
        type: 'text',
        content: `${featureName} is designed to help educators work more efficiently whilst improving student outcomes.`,
      },
    ],
    roi: {
      timeSavedPerWeek: 60, // 1 hour (default)
      timeSavedPerYear: 60, // 60 hours (assuming 60 teaching weeks)
      monetaryValuePerYear: 1800, // $30/hour * 60 hours
      studentOutcomeImprovement: 10, // 10% improvement in student outcomes (default)
    },
  };
}

/**
 * Get a user's usage patterns
 * @param userId The user ID
 * @returns The user's usage patterns
 */
async function getUserUsagePatterns(userId: string): Promise<{
  weeklyUsageFrequency: number;
  usageIntensity: number;
  roleSpecificMultiplier: number;
}> {
  try {
    // Get the user's role
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });
    
    // Get the user's credit usage history
    const creditUsage = await prisma.creditUsage.findMany({
      where: {
        Credit: {
          userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Look at the last 100 usage records
    });
    
    // Calculate weekly usage frequency
    const usageDates = creditUsage.map(usage => new Date(usage.createdAt));
    const uniqueWeeks = new Set<string>();
    
    for (const date of usageDates) {
      // Get the week number (year + week)
      const weekNumber = getWeekNumber(date);
      uniqueWeeks.add(weekNumber);
    }
    
    const weeklyUsageFrequency = uniqueWeeks.size / 4; // Normalize to a 0-1 scale (assuming 4 weeks of data)
    
    // Calculate usage intensity (average credits used per usage)
    const totalCreditsUsed = creditUsage.reduce((sum, usage) => sum + usage.amount, 0);
    const usageIntensity = creditUsage.length > 0 ? totalCreditsUsed / creditUsage.length : 0;
    
    // Determine role-specific multiplier
    const roleMultipliers: Record<string, number> = {
      teacher: 1.2,
      administrator: 0.8,
      counselor: 1.0,
      parent: 0.5,
      student: 0.3,
    };
    
    const roleSpecificMultiplier = roleMultipliers[user?.role?.toLowerCase() || ''] || 1.0;
    
    return {
      weeklyUsageFrequency: Math.min(weeklyUsageFrequency, 1), // Cap at 1
      usageIntensity: Math.min(usageIntensity / 10, 1), // Normalize to 0-1 scale
      roleSpecificMultiplier,
    };
  } catch (error) {
    console.error('Error getting user usage patterns:', error);
    
    // Return default values
    return {
      weeklyUsageFrequency: 0.5,
      usageIntensity: 0.5,
      roleSpecificMultiplier: 1.0,
    };
  }
}

/**
 * Get the week number for a date (YYYY-WW format)
 * @param date The date
 * @returns The week number
 */
function getWeekNumber(date: Date): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
  const week = Math.floor((d.getTime() - new Date(d.getFullYear(), 0, 4).getTime()) / 86400000 / 7) + 1;
  return `${d.getFullYear()}-${week.toString().padStart(2, '0')}`;
}

/**
 * Calculate a personalized value estimate for a user
 * @param userId The user ID
 * @param userRole The user's role
 * @param baseValue The base feature value
 * @param usagePatterns The user's usage patterns
 * @returns A personalized value estimate
 */
function calculatePersonalizedEstimate(
  userId: string,
  userRole: string,
  baseValue: FeatureValue,
  usagePatterns: {
    weeklyUsageFrequency: number;
    usageIntensity: number;
    roleSpecificMultiplier: number;
  }
): PersonalizedValueEstimate {
  // Calculate personalized time saved estimate
  const baseTimeSaved = baseValue.timeSaved;
  const personalizedTimeSaved = Math.round(
    baseTimeSaved *
    usagePatterns.weeklyUsageFrequency *
    usagePatterns.roleSpecificMultiplier *
    (0.8 + usagePatterns.usageIntensity * 0.4) // Scale from 0.8x to 1.2x based on intensity
  );
  
  // Calculate personalized monetary value
  const hourlyRate = 30; // Assumed hourly rate for educators
  const weeksPerYear = 40; // Teaching weeks per year
  const personalizedMonetaryValue = Math.round(
    (personalizedTimeSaved / 60) * hourlyRate * weeksPerYear
  );
  
  // Calculate personalized outcome improvement
  const baseOutcomeImprovement = baseValue.roi.studentOutcomeImprovement;
  const personalizedOutcomeImprovement = Math.round(
    baseOutcomeImprovement *
    (0.7 + usagePatterns.weeklyUsageFrequency * 0.6) * // Scale from 0.7x to 1.3x based on frequency
    usagePatterns.roleSpecificMultiplier
  );
  
  // Determine confidence level
  let confidence: 'low' | 'medium' | 'high';
  
  if (usagePatterns.weeklyUsageFrequency < 0.3) {
    confidence = 'low';
  } else if (usagePatterns.weeklyUsageFrequency < 0.7) {
    confidence = 'medium';
  } else {
    confidence = 'high';
  }
  
  // Generate personalized description
  const personalizedDescription = generatePersonalizedDescription(
    userRole,
    baseValue.featureName,
    personalizedTimeSaved,
    personalizedMonetaryValue,
    personalizedOutcomeImprovement
  );
  
  return {
    userId,
    userRole,
    featureId: baseValue.featureId,
    estimatedTimeSaved: personalizedTimeSaved,
    estimatedMonetaryValue: personalizedMonetaryValue,
    estimatedOutcomeImprovement: personalizedOutcomeImprovement,
    confidence,
    personalizedDescription,
  };
}

/**
 * Generate a personalized description for a value estimate
 * @param userRole The user's role
 * @param featureName The feature name
 * @param timeSaved The estimated time saved
 * @param monetaryValue The estimated monetary value
 * @param outcomeImprovement The estimated outcome improvement
 * @returns A personalized description
 */
function generatePersonalizedDescription(
  userRole: string,
  featureName: string,
  timeSaved: number,
  monetaryValue: number,
  outcomeImprovement: number
): string {
  const roleSpecificPhrases: Record<string, string[]> = {
    teacher: [
      'in your classroom',
      'for your students',
      'in your teaching practice',
      'for lesson preparation',
    ],
    administrator: [
      'across your school',
      'for your staff',
      'in your administrative work',
      'for your educational programs',
    ],
    counselor: [
      'for your student support',
      'in your counseling practice',
      'for your advisees',
      'in student guidance',
    ],
    parent: [
      'for your child\'s education',
      'in supporting your child',
      'for home learning',
      'in educational support',
    ],
    student: [
      'for your studies',
      'in your learning',
      'for your academic work',
      'in your educational journey',
    ],
  };
  
  const rolePhrase = roleSpecificPhrases[userRole.toLowerCase()]?.[
    Math.floor(Math.random() * roleSpecificPhrases[userRole.toLowerCase()].length)
  ] || 'in your educational work';
  
  const timePhrase = timeSaved >= 120
    ? `${Math.round(timeSaved / 60)} hours`
    : `${timeSaved} minutes`;
  
  return `Based on your usage patterns, ${featureName} could save you ${timePhrase} per week ${rolePhrase}. This represents approximately $${monetaryValue} in value per year and could improve student outcomes by up to ${outcomeImprovement}%.`;
}

/**
 * Calculate the ROI for a feature based on user input
 * @param featureId The feature ID
 * @param weeklyHours The number of hours spent on related tasks per week
 * @param hourlyRate The user's hourly rate
 * @param studentCount The number of students
 * @returns The calculated ROI
 */
export function calculateFeatureROI(
  featureId: string,
  weeklyHours: number,
  hourlyRate: number,
  studentCount: number
): {
  timeSavedPerWeek: number;
  timeSavedPerYear: number;
  monetaryValuePerYear: number;
  studentImpactValue: number;
  totalROI: number;
  roiPercentage: number;
} {
  // Get the base value demonstration
  const baseValue = getValueDemonstrationData(featureId, '');
  
  // Calculate time saved
  const efficiencyPercentage = baseValue.roi.timeSavedPerWeek / 60 / 40; // As a percentage of a 40-hour week
  const timeSavedPerWeek = weeklyHours * efficiencyPercentage;
  const timeSavedPerYear = timeSavedPerWeek * 40; // Assuming 40 weeks per year
  
  // Calculate monetary value
  const monetaryValuePerYear = timeSavedPerYear * hourlyRate;
  
  // Calculate student impact value
  // Assume $100 value per student per percentage point of improvement
  const studentImpactValue = studentCount * (baseValue.roi.studentOutcomeImprovement / 100) * 100;
  
  // Calculate total ROI
  const totalROI = monetaryValuePerYear + studentImpactValue;
  
  // Calculate ROI percentage (assuming feature costs $100 per year)
  const featureCost = 100;
  const roiPercentage = (totalROI / featureCost) * 100;
  
  return {
    timeSavedPerWeek,
    timeSavedPerYear,
    monetaryValuePerYear,
    studentImpactValue,
    totalROI,
    roiPercentage,
  };
}
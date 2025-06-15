import { prisma } from '@/lib/prisma';

// Comprehensive list of concerning patterns for UK educational context
const INAPPROPRIATE_PATTERNS = [
  // Self-harm and suicide
  /\b(kill\s+myself|suicide|self[\s-]?harm|cut\s+myself|end\s+it\s+all|want\s+to\s+die)\b/gi,
  /\b(overdose|hanging|jumping\s+off)\b/gi,
  
  // Violence and threats
  /\b(kill|murder|stab|shoot|bomb|weapon|gun|knife)\s+\w+/gi,
  /\b(hurt|harm|attack|beat|punch|kick)\s+\w+/gi,
  /\b(threat|threatening|intimidate)\b/gi,
  
  // Abuse indicators
  /\b(abuse|abused|abusing|molest|assault|rape)\b/gi,
  /\b(touch\w*\s+me|inappropriate\s+touch)\b/gi,
  
  // Bullying and harassment
  /\b(bully|bullied|bullying|harass|harassment)\b/gi,
  /\b(hate|racist|racism|homophobic|transphobic)\b/gi,
  
  // Grooming indicators
  /\b(meet\s+up|secret|don't\s+tell|keep\s+quiet|our\s+secret)\b/gi,
  /\b(send\s+me\s+(photos?|pics?|pictures?))\b/gi,
  
  // Substance abuse
  /\b(drugs?|cocaine|heroin|meth|weed|alcohol|drunk|high)\b/gi,
  /\b(dealer|dealing|overdose)\b/gi,
  
  // Extremism
  /\b(terror|terrorist|extremist|radicalise)\b/gi,
  
  // Sexual content
  /\b(sex|sexual|nude|naked|porn)\b/gi,
];

// Keywords that indicate potential safeguarding concerns
const SAFEGUARDING_KEYWORDS = [
  // Help seeking
  'help', 'scared', 'worried', 'afraid', 'unsafe', 'danger',
  
  // Emotional distress
  'sad', 'depressed', 'anxious', 'stressed', 'lonely', 'hopeless',
  
  // Home concerns
  'home', 'parent', 'family', 'argument', 'fighting', 'divorce',
  
  // School concerns
  'teacher', 'school', 'class', 'exam', 'failing', 'pressure',
  
  // Physical concerns
  'hurt', 'pain', 'sick', 'tired', 'hungry', 'cold',
];

// Context-specific patterns that might need review
const CONTEXTUAL_PATTERNS = [
  // Educational discussions about sensitive topics
  { pattern: /\b(world\s+war|holocaust|slavery)\b/gi, context: 'HISTORY' },
  { pattern: /\b(reproduction|puberty|sexual\s+health)\b/gi, context: 'BIOLOGY' },
  { pattern: /\b(romeo\s+and\s+juliet|suicide)\b/gi, context: 'LITERATURE' },
];

export interface ModerationResult {
  isApproved: boolean;
  flags: ModerationFlag[];
  requiresReview: boolean;
  blocked: boolean;
  suggestions?: string[];
}

export interface ModerationFlag {
  type: 'INAPPROPRIATE_CONTENT' | 'SAFEGUARDING_CONCERN' | 'CONTEXTUAL_CONCERN';
  pattern?: string;
  keyword?: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  context?: string;
}

/**
 * Moderate content for safeguarding concerns
 * @param content The content to moderate
 * @param userId The ID of the user who created the content
 * @param context Additional context (e.g., 'chat', 'assignment', 'forum')
 * @param metadata Additional metadata (e.g., recipientId, subject)
 */
export async function moderateContent(
  content: string,
  userId: string,
  context: string,
  metadata?: Record<string, any>
): Promise<ModerationResult> {
  const flags: ModerationFlag[] = [];
  const suggestions: string[] = [];
  
  // Check for inappropriate content patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    const matches = content.match(pattern);
    if (matches) {
      const severity = determineSeverity(pattern.source);
      flags.push({
        type: 'INAPPROPRIATE_CONTENT',
        pattern: pattern.source,
        severity,
      });
      
      // Add context-specific suggestions
      if (severity === 'CRITICAL') {
        suggestions.push('This content has been blocked due to serious safety concerns.');
        suggestions.push('If you need help, please speak to a trusted adult or call Childline on 0800 1111.');
      }
    }
  }
  
  // Check for safeguarding keywords
  const lowerContent = content.toLowerCase();
  const concerningKeywords: string[] = [];
  
  for (const keyword of SAFEGUARDING_KEYWORDS) {
    if (lowerContent.includes(keyword)) {
      concerningKeywords.push(keyword);
    }
  }
  
  // If multiple concerning keywords, flag for review
  if (concerningKeywords.length >= 3) {
    flags.push({
      type: 'SAFEGUARDING_CONCERN',
      keyword: concerningKeywords.join(', '),
      severity: 'MEDIUM',
    });
    suggestions.push('Your message seems to indicate you might be going through a difficult time.');
    suggestions.push('Remember, there are people who want to help. Consider talking to a teacher or counselor.');
  }
  
  // Check contextual patterns
  for (const contextPattern of CONTEXTUAL_PATTERNS) {
    if (contextPattern.pattern.test(content)) {
      // Check if this is in an educational context
      if (metadata?.subject === contextPattern.context || context === 'assignment') {
        flags.push({
          type: 'CONTEXTUAL_CONCERN',
          pattern: contextPattern.pattern.source,
          severity: 'LOW',
          context: contextPattern.context,
        });
      } else {
        flags.push({
          type: 'INAPPROPRIATE_CONTENT',
          pattern: contextPattern.pattern.source,
          severity: 'MEDIUM',
        });
      }
    }
  }
  
  // Determine overall moderation result
  const hasCritical = flags.some(f => f.severity === 'CRITICAL');
  const hasHigh = flags.some(f => f.severity === 'HIGH');
  const hasMedium = flags.some(f => f.severity === 'MEDIUM');
  
  const result: ModerationResult = {
    isApproved: !hasCritical && !hasHigh,
    flags,
    requiresReview: hasMedium || (flags.length > 0 && !hasCritical),
    blocked: hasCritical,
    suggestions: suggestions.length > 0 ? suggestions : undefined,
  };
  
  // Log to safeguarding system if there are any flags
  if (flags.length > 0) {
    try {
      const alert = await prisma.safeguardingAlert.create({
        data: {
          userId,
          content: hasCritical ? '[CONTENT REDACTED]' : content, // Redact critical content
          context,
          flags: JSON.stringify(flags),
          metadata: metadata ? JSON.stringify(metadata) : undefined,
          status: hasCritical ? 'ESCALATED' : hasHigh ? 'PENDING' : 'REVIEW',
          severity: hasCritical ? 'CRITICAL' : hasHigh ? 'HIGH' : hasMedium ? 'MEDIUM' : 'LOW',
          createdAt: new Date(),
        },
      });
      
      // If critical severity, notify DSL immediately
      if (hasCritical) {
        await notifyDesignatedSafeguardingLead(alert.id, userId, flags);
      }
      
      // If high severity, add to urgent review queue
      if (hasHigh) {
        await addToUrgentReviewQueue(alert.id);
      }
    } catch (error) {
      console.error('Failed to create safeguarding alert:', error);
      // Even if logging fails, we should still block critical content
    }
  }
  
  return result;
}

/**
 * Determine the severity of a pattern match
 */
function determineSeverity(patternSource: string): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
  // Critical patterns - immediate risk
  if (patternSource.includes('kill') || patternSource.includes('suicide') || 
      patternSource.includes('self-harm') || patternSource.includes('abuse')) {
    return 'CRITICAL';
  }
  
  // High severity - serious concerns
  if (patternSource.includes('weapon') || patternSource.includes('drug') || 
      patternSource.includes('threat') || patternSource.includes('sexual')) {
    return 'HIGH';
  }
  
  // Medium severity - concerning but not immediate risk
  if (patternSource.includes('bully') || patternSource.includes('hate') || 
      patternSource.includes('harass')) {
    return 'MEDIUM';
  }
  
  return 'LOW';
}

/**
 * Notify the Designated Safeguarding Lead immediately
 */
async function notifyDesignatedSafeguardingLead(
  alertId: string,
  userId: string,
  flags: ModerationFlag[]
): Promise<void> {
  try {
    // Get DSL users
    const dslUsers = await prisma.user.findMany({
      where: {
        role: 'DSL',
        isActive: true,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    
    // Create urgent notification for each DSL
    for (const dsl of dslUsers) {
      await prisma.notification.create({
        data: {
          userId: dsl.id,
          type: 'SAFEGUARDING_CRITICAL',
          title: 'URGENT: Critical Safeguarding Alert',
          message: `Immediate review required for user ${userId}. Alert ID: ${alertId}`,
          priority: 'URGENT',
          requiresAction: true,
          actionUrl: `/safeguarding/alerts/${alertId}`,
          createdAt: new Date(),
        },
      });
    }
    
    // Send email/SMS alerts (implementation depends on notification service)
    // await sendUrgentDSLNotification(dslUsers, alertId, userId, flags);
    
  } catch (error) {
    console.error('Failed to notify DSL:', error);
    // Log this failure to a critical error monitoring system
  }
}

/**
 * Add alert to urgent review queue
 */
async function addToUrgentReviewQueue(alertId: string): Promise<void> {
  try {
    await prisma.reviewQueue.create({
      data: {
        alertId,
        priority: 'HIGH',
        status: 'PENDING',
        assignedTo: null, // Will be assigned by DSL or senior staff
        createdAt: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to add to review queue:', error);
  }
}

/**
 * Check if a user has concerning patterns in their history
 */
export async function checkUserSafeguardingHistory(userId: string): Promise<{
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  recentAlerts: number;
  patterns: string[];
}> {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const recentAlerts = await prisma.safeguardingAlert.count({
    where: {
      userId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
      severity: {
        in: ['HIGH', 'CRITICAL'],
      },
    },
  });
  
  const alerts = await prisma.safeguardingAlert.findMany({
    where: {
      userId,
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
    select: {
      flags: true,
      severity: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: 10,
  });
  
  // Analyze patterns
  const patterns = new Set<string>();
  let criticalCount = 0;
  let highCount = 0;
  
  for (const alert of alerts) {
    if (alert.severity === 'CRITICAL') criticalCount++;
    if (alert.severity === 'HIGH') highCount++;
    
    try {
      const flags = JSON.parse(alert.flags as string) as ModerationFlag[];
      flags.forEach(flag => {
        if (flag.type === 'SAFEGUARDING_CONCERN' && flag.keyword) {
          patterns.add(flag.keyword);
        }
      });
    } catch (error) {
      console.error('Failed to parse flags:', error);
    }
  }
  
  // Determine risk level
  let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' = 'LOW';
  if (criticalCount > 0 || highCount >= 3) {
    riskLevel = 'HIGH';
  } else if (highCount > 0 || recentAlerts >= 5) {
    riskLevel = 'MEDIUM';
  }
  
  return {
    riskLevel,
    recentAlerts,
    patterns: Array.from(patterns),
  };
}
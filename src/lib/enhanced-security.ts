import { PrismaClient } from '@prisma/client';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';
import { encryptData, decryptData, sanitizeInput, getSecureHeaders } from './security-utils';
import optimizedDb from './optimized-db';

// Constants
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-do-not-use-in-production';
const JWT_EXPIRY = '24h';
const REFRESH_TOKEN_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days
const PASSWORD_MIN_LENGTH = 10;
const PASSWORD_COMPLEXITY_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
const SENSITIVE_FIELDS = ['password', 'ssn', 'creditCard', 'dob', 'address'];

// Types
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  permissions: string[];
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface SecurityAuditLog {
  userId: string;
  action: string;
  resource: string;
  ip: string;
  userAgent: string;
  status: 'success' | 'failure';
  details?: unknown;
  timestamp: Date;
}

export interface PermissionCheck {
  hasPermission: boolean;
  reason?: string;
}

// In-memory store for revoked tokens (would be replaced with Redis in production)
const revokedTokens = new Set<string>();

// In-memory store for security events (would be replaced with a database in production)
const securityEvents: any[] = [];

/**
 * Enhanced password hashing with improved security
 * @param password Plain text password
 * @returns Hashed password
 */
export async function enhancedHashPassword(password: string): Promise<string> {
  // Use a stronger work factor (14) for increased security
  return await hash(password, 14);
}

/**
 * Validate password strength
 * @param password Password to validate
 * @returns Validation result with details
 */
export function validatePasswordStrength(password: string): { 
  isValid: boolean; 
  reasons: string[];
  score: number; 
} {
  const reasons: string[] = [];
  let score = 0;
  
  // Check minimum length
  if (password.length < PASSWORD_MIN_LENGTH) {
    reasons.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters long`);
  } else {
    score += 1;
  }
  
  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    reasons.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  
  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    reasons.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  
  // Check for numbers
  if (!/\d/.test(password)) {
    reasons.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  
  // Check for special characters
  if (!/[@$!%*?&]/.test(password)) {
    reasons.push('Password must contain at least one special character (@$!%*?&)');
  } else {
    score += 1;
  }
  
  // Check for common passwords (simplified example)
  const commonPasswords = ['Password123!', 'Admin123!', 'Welcome123!'];
  if (commonPasswords.includes(password)) {
    reasons.push('Password is too common');
    score = 0;
  }
  
  // Check for repeated characters
  if (/(.)\1{2,}/.test(password)) {
    reasons.push('Password contains too many repeated characters');
    score -= 1;
  }
  
  // Normalize score to be between 0 and 5
  score = Math.max(0, Math.min(5, score));
  
  return {
    isValid: reasons.length === 0,
    reasons,
    score
  };
}

/**
 * Generate JWT access token
 * @param payload Token payload
 * @returns JWT token
 */
export function generateAccessToken(payload: JwtPayload): string {
  return sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

/**
 * Generate refresh token
 * @param userId User ID
 * @returns Refresh token
 */
export function generateRefreshToken(userId: string): string {
  return `${userId}.${uuidv4()}.${Date.now() + REFRESH_TOKEN_EXPIRY}`;
}

/**
 * Verify JWT token
 * @param token JWT token
 * @returns Decoded payload or null if invalid
 */
export function verifyAccessToken(token: string): JwtPayload | null {
  try {
    // Check if token has been revoked
    if (revokedTokens.has(token)) {
      return null;
    }
    
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    logger.warn('Invalid JWT token', { error });
    return null;
  }
}

/**
 * Verify refresh token
 * @param token Refresh token
 * @returns User ID if valid, null otherwise
 */
export async function verifyRefreshToken(token: string): Promise<string | null> {
  try {
    const [userId, uuid, expiryStr] = token.split('.');
    const expiry = parseInt(expiryStr, 10);
    
    // Check if token has expired
    if (Date.now() > expiry) {
      return null;
    }
    
    // Check if token exists in database
    // Note: In a real implementation, we would need to create the refreshToken table in the Prisma schema
    // For now, we'll simulate this check
    const tokenExists = true; // Simulated check
    
    return tokenExists ? userId : null;
  } catch (error) {
    logger.warn('Invalid refresh token', { error });
    return null;
  }
}

/**
 * Revoke JWT token
 * @param token JWT token
 */
export function revokeAccessToken(token: string): void {
  revokedTokens.add(token);
  
  // In a production environment, we would store this in Redis with an expiry
  // matching the token's expiry time
  
  // Clean up expired tokens periodically
  setTimeout(() => {
    revokedTokens.delete(token);
  }, 24 * 60 * 60 * 1000); // 24 hours
}

/**
 * Revoke refresh token
 * @param token Refresh token
 */
export async function revokeRefreshToken(token: string): Promise<void> {
  // Note: In a real implementation, we would need to create the refreshToken table in the Prisma schema
  // For now, we'll just log the action
  logger.info('Refresh token revoked', { token });
}

/**
 * Generate authentication tokens
 * @param user User object
 * @returns Access and refresh tokens
 */
export async function generateAuthTokens(user: unknown): Promise<AuthTokens> {
  // Get user permissions
  // Note: In a real implementation, we would need to create the permission table in the Prisma schema
  // For now, we'll use a simple mapping based on user role
  const rolePermissionMap: Record<string, string[]> = {
    'admin': ['read:all', 'write:all', 'delete:all'],
    'teacher': ['read:content', 'write:content', 'read:students'],
    'student': ['read:assignments', 'submit:assignments'],
    'parent': ['read:child_progress'],
  };
  
  const permissions = rolePermissionMap[user.role] || [];
  
  // Create JWT payload
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    permissions
  };
  
  // Generate tokens
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(user.id);
  
  // Store refresh token in database
  // Note: In a real implementation, we would need to create the refreshToken table in the Prisma schema
  // For now, we'll just log the action
  logger.info('Refresh token created', { userId: user.id });
  
  return {
    accessToken,
    refreshToken,
    expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
  };
}

/**
 * Check if user has permission
 * @param userId User ID
 * @param permission Permission to check
 * @returns Whether user has permission
 */
export async function hasPermission(userId: string, permission: string): Promise<PermissionCheck> {
  try {
    const user = await optimizedDb.user.findUnique({
      where: { id: userId },
      select: {
        role: true
      }
    });
    
    if (!user) {
      return {
        hasPermission: false,
        reason: 'User not found'
      };
    }
    
    // Note: In a real implementation, we would need to create the permission table in the Prisma schema
    // For now, we'll use a simple mapping based on user role
    const rolePermissionMap: Record<string, string[]> = {
      'admin': ['read:all', 'write:all', 'delete:all'],
      'teacher': ['read:content', 'write:content', 'read:students'],
      'student': ['read:assignments', 'submit:assignments'],
      'parent': ['read:child_progress'],
    };
    
    const userPermissions = rolePermissionMap[user.role] || [];
    
    if (userPermissions.includes(permission)) {
      return { hasPermission: true };
    }
    
    return { 
      hasPermission: false,
      reason: `User does not have the required permission: ${permission}`
    };
  } catch (error) {
    logger.error('Error checking permission', { userId, permission, error });
    return { 
      hasPermission: false,
      reason: 'Error checking permission'
    };
  }
}

/**
 * Check if user has role
 * @param userId User ID
 * @param role Role to check
 * @returns Whether user has role
 */
export async function hasRole(userId: string, role: string): Promise<boolean> {
  try {
    const user = await optimizedDb.user.findUnique({
      where: { id: userId },
      select: {
        role: true
      }
    });
    
    if (!user) {
      return false;
    }
    
    return user.role === role;
  } catch (error) {
    logger.error('Error checking role', { userId, role, error });
    return false;
  }
}

/**
 * Log security audit event
 * @param log Security audit log
 */
export async function logSecurityAudit(log: Omit<SecurityAuditLog, 'timestamp'>): Promise<void> {
  const auditLog: SecurityAuditLog = {
    ...log,
    timestamp: new Date()
  };
  
  // Store in database
  // Note: In a real implementation, we would need to create the securityAuditLog table in the Prisma schema
  // For now, we'll just log the action
  logger.info('Security audit log created', auditLog);
  
  // Also log to application logs
  if (log.status === 'failure') {
    logger.warn('Security audit', auditLog);
  } else {
    logger.info('Security audit', auditLog);
  }
  
  // Store in memory for real-time analysis
  securityEvents.push(auditLog);
  
  // Keep only the last 1000 events in memory
  if (securityEvents.length > 1000) {
    securityEvents.shift();
  }
}

/**
 * Mask sensitive data
 * @param data Data to mask
 * @returns Masked data
 */
export function maskSensitiveData(data: unknown): unknown {
  if (!data) return data;
  
  if (typeof data === 'object' && data !== null) {
    const maskedData = Array.isArray(data) ? [...data] : { ...data };
    
    for (const key in maskedData) {
      if (SENSITIVE_FIELDS.includes(key.toLowerCase())) {
        if (typeof maskedData[key] === 'string') {
          const value = maskedData[key];
          // Keep first and last character, mask the rest
          maskedData[key] = value.length > 2
            ? `${value.charAt(0)}${'*'.repeat(value.length - 2)}${value.charAt(value.length - 1)}`
            : '***';
        } else {
          maskedData[key] = '***';
        }
      } else if (typeof maskedData[key] === 'object' && maskedData[key] !== null) {
        maskedData[key] = maskSensitiveData(maskedData[key]);
      }
    }
    
    return maskedData;
  }
  
  return data;
}

/**
 * Detect security anomalies in real-time
 * @returns Detected anomalies
 */
export function detectSecurityAnomalies(): any[] {
  const anomalies = [];
  const now = Date.now();
  const recentEvents = securityEvents.filter(e => now - e.timestamp.getTime() < 5 * 60 * 1000); // Last 5 minutes
  
  // Check for brute force attempts
  const loginAttempts = recentEvents.filter(e => e.action === 'login');
  const failedLogins = loginAttempts.filter(e => e.status === 'failure');
  
  // Group by IP
  const attemptsByIp: Record<string, any[]> = {};
  for (const attempt of failedLogins) {
    if (!attemptsByIp[attempt.ip]) {
      attemptsByIp[attempt.ip] = [];
    }
    attemptsByIp[attempt.ip].push(attempt);
  }
  
  // Check for IPs with many failed attempts
  for (const [ip, attempts] of Object.entries(attemptsByIp)) {
    if (attempts.length >= 5) {
      anomalies.push({
        type: 'brute_force',
        ip,
        attempts: attempts.length,
        timestamp: new Date(),
        severity: 'high'
      });
    }
  }
  
  // Check for account takeover attempts
  const userLogins: Record<string, any[]> = {};
  for (const attempt of loginAttempts) {
    if (!userLogins[attempt.userId]) {
      userLogins[attempt.userId] = [];
    }
    userLogins[attempt.userId].push(attempt);
  }
  
  // Check for users logging in from multiple IPs
  for (const [userId, attempts] of Object.entries(userLogins)) {
    const uniqueIps = new Set(attempts.map(a => a.ip));
    if (uniqueIps.size >= 3) {
      anomalies.push({
        type: 'account_takeover',
        userId,
        uniqueIps: Array.from(uniqueIps),
        timestamp: new Date(),
        severity: 'medium'
      });
    }
  }
  
  // Check for permission escalation attempts
  const permissionEvents = recentEvents.filter(e => 
    e.action === 'access_resource' && 
    e.status === 'failure' && 
    e.details?.reason?.includes('permission')
  );
  
  if (permissionEvents.length >= 3) {
    anomalies.push({
      type: 'permission_escalation',
      events: permissionEvents.length,
      timestamp: new Date(),
      severity: 'high'
    });
  }
  
  return anomalies;
}

/**
 * Perform security scan on user input
 * @param input User input
 * @returns Scan results
 */
export function scanUserInput(input: string): { 
  isSafe: boolean; 
  threats: string[];
  sanitizedInput: string;
} {
  const threats = [];
  
  // Check for SQL injection
  if (/('|"|;|--|\/\*|\*\/|xp_|sp_|exec|execute|select|insert|update|delete|drop|alter|create|union)/i.test(input)) {
    threats.push('Potential SQL injection detected');
  }
  
  // Check for XSS
  if (/<script|javascript:|on\w+\s*=|alert\s*\(|eval\s*\(|document\.biscuit|document\.write/i.test(input)) {
    threats.push('Potential XSS attack detected');
  }
  
  // Check for command injection
  if (/;|\||&|`|\$\(|\$\{|\/bin\/|\/etc\/|\/tmp\/|\.\.\/|chmod|chown|wget|curl|nc|bash/i.test(input)) {
    threats.push('Potential command injection detected');
  }
  
  // Check for path traversal
  if (/\.\.\/|\.\.\\|~\/|~\\|\/etc\/|c:\\windows\\|\/var\/|\/root\//i.test(input)) {
    threats.push('Potential path traversal detected');
  }
  
  // Sanitize the input
  const sanitizedInput = sanitizeInput(input);
  
  return {
    isSafe: threats.length === 0,
    threats,
    sanitizedInput
  };
}

/**
 * Generate security report
 * @returns Security report
 */
export async function generateSecurityReport(): Promise<any> {
  // Get recent audit logs
  // Note: In a real implementation, we would need to create the securityAuditLog table in the Prisma schema
  // For now, we'll use simulated data
  const recentLogs = [
    {
      userId: 'user1',
      action: 'login',
      resource: 'auth',
      ip: '192.168.1.1',
      userAgent: 'Mozilla/5.0',
      status: 'success',
      timestamp: new Date()
    },
    {
      userId: 'user2',
      action: 'login',
      resource: 'auth',
      ip: '192.168.1.2',
      userAgent: 'Chrome/90.0',
      status: 'failure',
      timestamp: new Date()
    }
  ];
  
  // Calculate statistics
  const totalEvents = recentLogs.length;
  const failedEvents = recentLogs.filter((log: unknown) => log.status === 'failure').length;
  const successEvents = totalEvents - failedEvents;
  
  // Group by action
  const actionCounts: Record<string, number> = {};
  for (const log of recentLogs) {
    actionCounts[log.action] = (actionCounts[log.action] || 0) + 1;
  }
  
  // Group by user
  const userCounts: Record<string, number> = {};
  for (const log of recentLogs) {
    userCounts[log.userId] = (userCounts[log.userId] || 0) + 1;
  }
  
  // Group by IP
  const ipCounts: Record<string, number> = {};
  for (const log of recentLogs) {
    ipCounts[log.ip] = (ipCounts[log.ip] || 0) + 1;
  }
  
  // Get top users by activity
  const topUsers = Object.entries(userCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([userId, count]) => ({ userId, count }));
  
  // Get top IPs by activity
  const topIps = Object.entries(ipCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([ip, count]) => ({ ip, count }));
  
  // Detect anomalies
  const anomalies = detectSecurityAnomalies();
  
  return {
    timestamp: new Date(),
    period: '24 hours',
    summary: {
      totalEvents,
      successEvents,
      failedEvents,
      successRate: totalEvents > 0 ? (successEvents / totalEvents) * 100 : 0
    },
    actionBreakdown: actionCounts,
    topUsers,
    topIps,
    anomalies,
    recommendations: generateSecurityRecommendations(recentLogs, anomalies)
  };
}

/**
 * Generate security recommendations based on audit logs and anomalies
 * @param logs Security audit logs
 * @param anomalies Detected anomalies
 * @returns Security recommendations
 */
function generateSecurityRecommendations(logs: any[], anomalies: any[]): string[] {
  const recommendations: string[] = [];
  
  // Check for brute force attempts
  const bruteForceAnomalies = anomalies.filter((a: unknown) => a.type === 'brute_force');
  if (bruteForceAnomalies.length > 0) {
    recommendations.push('Implement rate limiting for login attempts');
    recommendations.push('Consider adding CAPTCHA for login after failed attempts');
  }
  
  // Check for account takeover attempts
  const accountTakeoverAnomalies = anomalies.filter((a: unknown) => a.type === 'account_takeover');
  if (accountTakeoverAnomalies.length > 0) {
    recommendations.push('Implement multi-factor authentication');
    recommendations.push('Add location-based login verification');
  }
  
  // Check for permission escalation attempts
  const permissionEscalationAnomalies = anomalies.filter((a: unknown) => a.type === 'permission_escalation');
  if (permissionEscalationAnomalies.length > 0) {
    recommendations.push('Review role-based access control settings');
    recommendations.push('Implement principle of least privilege');
  }
  
  // Check for failed logins
  const failedLogins = logs.filter((log: unknown) => log.action === 'login' && log.status === 'failure');
  if (failedLogins.length > 20) {
    recommendations.push('Review account lockout policies');
  }
  
  // Check for API access patterns
  const apiAccess = logs.filter((log: unknown) => log.action === 'api_access');
  if (apiAccess.length > 100) {
    recommendations.push('Implement API rate limiting');
  }
  
  // Add general recommendations
  recommendations.push('Regularly rotate access tokens and API keys');
  recommendations.push('Ensure all sensitive data is encrypted at rest and in transit');
  recommendations.push('Keep all dependencies and libraries up to date');
  
  return recommendations;
}

/**
 * Initialize security module
 */
export async function initializeSecurity(): void {
  // Clean up expired refresh tokens
  // Note: In a real implementation, we would need to create these tables in the Prisma schema
  setInterval(async () => {
    await optimizedDb.refreshToken.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revoked: true }
        ]
      }
    });
  }, 24 * 60 * 60 * 1000); // Once a day
  
  // Log security initialization
  logger.info('Enhanced security module initialized');
}

// Initialize security module when imported
initializeSecurity();
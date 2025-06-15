import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { prisma } from '@/lib/prisma';
import { hashPassword, verifyPassword } from '@/lib/security/password-utils';
import { moderateContent } from '@/lib/safeguarding/content-moderation';
import { checkRateLimit } from '@/lib/security/rate-limiter';

// GET - Security features status check
export async function GET(req: NextRequest) {
  try {
    const checks = {
      database: false,
      authentication: false,
      passwordHashing: false,
      contentModeration: false,
      rateLimiting: false,
      gdprModels: false,
      safeguardingModels: false,
    };
    
    // Check database connection
    try {
      await prisma.$queryRaw`SELECT 1`;
      checks.database = true;
    } catch (e) {
      console.error('Database check failed:', e);
    }
    
    // Check authentication
    try {
      const token = await getToken({ req });
      checks.authentication = !!token;
    } catch (e) {
      console.error('Auth check failed:', e);
    }
    
    // Check password hashing
    try {
      const testPassword = 'TestPassword123!';
      const hashed = await hashPassword(testPassword);
      const verified = await verifyPassword(testPassword, hashed);
      checks.passwordHashing = verified;
    } catch (e) {
      console.error('Password hashing check failed:', e);
    }
    
    // Check content moderation
    try {
      const safeContent = await moderateContent('This is a safe message', 'test', 'test-user');
      const unsafeContent = await moderateContent('I want to hurt myself', 'test', 'test-user');
      checks.contentModeration = !safeContent.flagged && unsafeContent.flagged;
    } catch (e) {
      console.error('Content moderation check failed:', e);
    }
    
    // Check rate limiting
    try {
      const rateLimitResult = await checkRateLimit(req, 'api');
      checks.rateLimiting = rateLimitResult.allowed;
    } catch (e) {
      console.error('Rate limiting check failed:', e);
    }
    
    // Check GDPR models exist
    try {
      const userActivityCount = await prisma.userActivity.count();
      const consentRecordCount = await prisma.consentRecord.count();
      const userPreferencesCount = await prisma.userPreferences.count();
      checks.gdprModels = true;
    } catch (e) {
      console.error('GDPR models check failed:', e);
    }
    
    // Check safeguarding models exist
    try {
      const alertCount = await prisma.safeguardingAlert.count();
      const reportCount = await prisma.safeguardingReport.count();
      const auditLogCount = await prisma.auditLog.count();
      const parentalConsentCount = await prisma.parentalConsent.count();
      checks.safeguardingModels = true;
    } catch (e) {
      console.error('Safeguarding models check failed:', e);
    }
    
    const allChecksPass = Object.values(checks).every(check => check === true);
    
    return NextResponse.json({
      status: allChecksPass ? 'All security features operational' : 'Some security features need attention',
      checks,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
    
  } catch (error) {
    console.error('Security check error:', error);
    return NextResponse.json({ 
      error: 'Security check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
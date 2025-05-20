import { NextResponse } from 'next/server';
import { db, prisma } from '@/lib/db';

/**
 * This API route is designed to be called by a Vercel cron job
 * to perform regular database maintenance tasks.
 * 
 * It can be configured in vercel.json with a cron schedule.
 */
export async function GET() {
  try {
    console.log('Starting database maintenance tasks...');
    
    // Perform maintenance tasks
    const results = await performMaintenanceTasks();
    
    console.log('Database maintenance completed successfully');
    
    return NextResponse.json({ 
      success: true, 
      message: 'Database maintenance completed successfully',
      results
    });
  } catch (error) {
    console.error('Error during database maintenance:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Database maintenance failed', 
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * Performs various database maintenance tasks
 */
async function performMaintenanceTasks() {
  const results = {
    expiredSessions: 0,
    expiredTokens: 0,
  };

  // Clean up expired sessions
  const sessionsResult = await prisma.session.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  });
  results.expiredSessions = sessionsResult.count;

  // Clean up expired verification tokens
  const tokensResult = await prisma.verificationToken.deleteMany({
    where: {
      expires: {
        lt: new Date(),
      },
    },
  });
  results.expiredTokens = tokensResult.count;

  // Add more maintenance tasks as needed
  // For example:
  // - Archive old data
  // - Update statistics
  // - Run database vacuum operations (would require raw SQL)

  return results;
}
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * GET /api/admin/analytics/credits
 * Returns credit usage analytics for administrators
 * 
 * Query parameters:
 * - startDate: Optional start date for filtering (ISO string)
 * - endDate: Optional end date for filtering (ISO string)
 * - userId: Optional user ID for filtering
 * - featureId: Optional feature ID for filtering
 */
export async function GET(req: NextRequest) {
  try {
    // Get the session to check if user is authenticated and is an admin
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Check if the user is an admin
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');
    const featureId = searchParams.get('featureId');

    // Build the query filters
    const filters: unknown = {};

    if (startDate) {
      filters.createdAt = {
        ...filters.createdAt,
        gte: new Date(startDate),
      };
    }

    if (endDate) {
      filters.createdAt = {
        ...filters.createdAt,
        lte: new Date(endDate),
      };
    }

    if (featureId) {
      filters.featureId = featureId;
    }

    // Get credit usage data
    // If userId is provided, first get the credits for that user
    let userCreditIds: string[] = [];
    if (userId) {
      const userCredits = await prisma.credit.findMany({
        where: { userId },
        select: { id: true },
      });
      userCreditIds = userCredits.map(credit => credit.id);
      
      // Add credit filter to the existing filters
      filters.creditId = { in: userCreditIds };
    }

    // Get credit usage data
    const creditUsage = await prisma.creditUsage.findMany({
      where: filters,
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Get user information for each credit usage
    const creditIds = [...new Set(creditUsage.map(usage => usage.creditId))];
    const credits = await prisma.credit.findMany({
      where: { id: { in: creditIds } },
      select: { id: true, userId: true },
    });

    // Create a map of credit ID to user ID
    const creditToUserMap = new Map<string, string>();
    credits.forEach(credit => {
      creditToUserMap.set(credit.id, credit.userId);
    });

    // Enhance credit usage with user information
    const enhancedCreditUsage = creditUsage.map(usage => ({
      ...usage,
      userId: creditToUserMap.get(usage.creditId) || 'unknown',
    }));

    const filteredUsage = enhancedCreditUsage;

    // Get total credits used
    const totalCreditsUsed = filteredUsage.reduce(
      (sum, usage) => sum + usage.amount,
      0
    );

    // Get usage by feature
    const usageByFeature = await prisma.$queryRaw`
      SELECT 
        "featureId", 
        SUM("amount") as "totalAmount",
        COUNT(*) as "usageCount"
      FROM "CreditUsage"
      WHERE ${filters}
      GROUP BY "featureId"
      ORDER BY "totalAmount" DESC
    `;

    // Get usage by user (top 10)
    const usageByUser = await prisma.$queryRaw`
      SELECT 
        c."userId", 
        SUM(cu."amount") as "totalAmount",
        COUNT(*) as "usageCount"
      FROM "CreditUsage" cu
      JOIN "Credit" c ON cu."creditId" = c.id
      WHERE ${filters}
      GROUP BY c."userId"
      ORDER BY "totalAmount" DESC
      LIMIT 10
    `;

    // Get usage over time (daily for the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const usageOverTime = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', cu."createdAt") as "date",
        SUM(cu."amount") as "totalAmount",
        COUNT(*) as "usageCount"
      FROM "CreditUsage" cu
      WHERE cu."createdAt" >= ${thirtyDaysAgo}
      GROUP BY DATE_TRUNC('day', cu."createdAt")
      ORDER BY "date" ASC
    `;

    return NextResponse.json({
      totalCreditsUsed,
      usageByFeature,
      usageByUser,
      usageOverTime,
      recentUsage: filteredUsage.slice(0, 100), // Return the 100 most recent usage records
    });
  } catch (error) {
    console.error('Error fetching credit usage analytics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch credit usage analytics' },
      { status: 500 }
    );
  }
}
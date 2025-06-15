import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@prisma/client';
import { detectAnomalousActivity, getUsersWithAnomalousActivity } from '@/lib/security-anomaly-detection';

export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

/**
 * POST /api/security/anomaly-detection
 * Checks a credit usage for anomalous activity
 * 
 * Request body:
 * {
 *   creditUsageId: string  // The ID of the credit usage to check
 * }
 */
export async function POST(req: NextRequest) {
  try {
    // Get the session to check if user is authenticated
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    
    // Parse the request body
    const body = await req.json();
    const { creditUsageId } = body;

    if (!creditUsageId) {
      return NextResponse.json(
        { error: 'Credit usage ID is required' },
        { status: 400 }
      );
    }

    // Detect anomalous activity
    const result = await detectAnomalousActivity(userId, creditUsageId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error detecting anomalous activity:', error);
    return NextResponse.json(
      { error: 'Failed to detect anomalous activity' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/security/anomaly-detection
 * Gets users with anomalous activity (admin only)
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

    // Get users with anomalous activity
    const usersWithAnomalies = await getUsersWithAnomalousActivity();

    return NextResponse.json({ usersWithAnomalies });
  } catch (error) {
    console.error('Error getting users with anomalous activity:', error);
    return NextResponse.json(
      { error: 'Failed to get users with anomalous activity' },
      { status: 500 }
    );
  }
}
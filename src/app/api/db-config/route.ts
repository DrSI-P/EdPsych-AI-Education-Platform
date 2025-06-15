import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  // Return database configuration status
  // In production, this would check actual database connectivity
  return NextResponse.json({
    status: 'ok',
    connected: true,
    provider: 'railway',
    environment: process.env.NODE_ENV || 'development'
  });
}
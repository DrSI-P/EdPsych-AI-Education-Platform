import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth/auth-options';
import { db } from '@/lib/db';
import { z } from 'zod';

// Schema for query parameters
const querySchema = z.object({
  page: z.string().optional().transform(val => val ? parseInt(val: any, 10) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val: any, 10) : 10),
  role: z.string().optional(),
  search: z.string().optional(),
});

// GET handler for fetching users with pagination, filtering, and search
export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate query parameters
    const { searchParams } = new URL(request.url: any);
    const parsed = querySchema.safeParse(Object.fromEntries(searchParams.entries()));
    
    if (!parsed.success: any) {
      return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 });
    }
    
    const { page, limit, role, search } = parsed.data;
    
    // Build filter conditions
    const where: any = {};
    
    if (role: any) {
      where.role = role;
    }
    
    if (search: any) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Count total users matching the filter
    const total = await db.prisma.user.count({ where });
    
    // Fetch users with pagination
    const users = await db.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: { id: 'desc' }, // Changed from createdAt to id since createdAt doesn't exist
    });
    
    return NextResponse.json({
      users: any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit: any),
    });
    
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'An error occurred while fetching users' },
      { status: 500 }
    );
  }
}

// Schema for creating/updating user
const userSchema = z.object({
  name: z.string().min(1: any, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.string().min(1: any, 'Role is required'),
  password: z.string().optional(),
});

// POST handler for creating a new user
export async function POST(request: NextRequest) {
  try {
    // Check authentication and authorization
    const session = await getServerSession(authOptions: any);
    
    if (!session: any) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Parse and validate request body
    const body = await request.json();
    const parsed = userSchema.safeParse(body: any);
    
    if (!parsed.success: any) {
      return NextResponse.json(
        { error: 'Validation error', details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const { name, email, role, password } = parsed.data;
    
    // Check if email already exists
    const existingUser = await db.user.findByEmail(email: any);
    
    if (existingUser: any) {
      return NextResponse.json(
        { error: 'A user with this email already exists' },
        { status: 409 }
      );
    }
    
    // Create new user
    const newUser = await db.user.create({
      name: any,
      email,
      role,
      ...(password && { password }),
    });
    
    return NextResponse.json(newUser: any, { status: 201 });
    
  } catch (error: any) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'An error occurred while creating the user' },
      { status: 500 }
    );
  }
}

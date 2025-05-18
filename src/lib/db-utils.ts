import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { validateAndSanitizeUser, validateAndSanitizeProfile } from '@/lib/validation';

const prisma = new PrismaClient();

// Database utility functions for common operations with validation and error handling

// User operations
export async function createUser(data: any) {
  try {
    // Validate and sanitize user data
    const validatedData = validateAndSanitizeUser(data);
    
    // Create user in database
    const user = await prisma.user.create({
      data: validatedData
    });
    
    // Remove sensitive data before returning
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

export async function getUserById(id: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        profile: true
      }
    });
    
    if (!user) {
      return null;
    }
    
    // Remove sensitive data before returning
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

export async function updateUser(id: string, data: any) {
  try {
    // Validate and sanitize user data
    const validatedData = validateAndSanitizeUser(data);
    
    // Update user in database
    const user = await prisma.user.update({
      where: { id },
      data: validatedData
    });
    
    // Remove sensitive data before returning
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}

export async function deleteUser(id: string) {
  try {
    await prisma.user.delete({
      where: { id }
    });
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Profile operations
export async function createProfile(userId: string, data: any) {
  try {
    // Validate and sanitize profile data
    const validatedData = validateAndSanitizeProfile(data);
    
    // Create profile in database
    const profile = await prisma.profile.create({
      data: {
        ...validatedData,
        user: {
          connect: { id: userId }
        }
      }
    });
    
    return profile;
  } catch (error) {
    console.error('Error creating profile:', error);
    throw error;
  }
}

export async function updateProfile(id: string, data: any) {
  try {
    // Validate and sanitize profile data
    const validatedData = validateAndSanitizeProfile(data);
    
    // Update profile in database
    const profile = await prisma.profile.update({
      where: { id },
      data: validatedData
    });
    
    return profile;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw error;
  }
}

// Transaction example - creating a user with profile in a single transaction
export async function createUserWithProfile(userData: any, profileData: any) {
  try {
    // Validate and sanitize both user and profile data
    const validatedUserData = validateAndSanitizeUser(userData);
    const validatedProfileData = validateAndSanitizeProfile(profileData);
    
    // Use a transaction to ensure both operations succeed or fail together
    const result = await prisma.$transaction(async (tx) => {
      // Create user
      const user = await tx.user.create({
        data: validatedUserData
      });
      
      // Create profile linked to the user
      const profile = await tx.profile.create({
        data: {
          ...validatedProfileData,
          user: {
            connect: { id: user.id }
          }
        }
      });
      
      // Return both user and profile
      const { password, ...userWithoutPassword } = user;
      return {
        user: userWithoutPassword,
        profile
      };
    });
    
    return result;
  } catch (error) {
    console.error('Error creating user with profile:', error);
    throw error;
  }
}

// Database health check
export async function checkDatabaseConnection() {
  try {
    // Simple query to check if database is accessible
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    return false;
  }
}

// Middleware for database error handling
export function withDatabaseErrorHandling(
  handler: (req: NextRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      return await handler(req);
    } catch (error) {
      console.error('Database operation error:', error);
      
      // Determine the appropriate error response
      if (error.code === 'P2002') {
        // Unique constraint violation
        return NextResponse.json(
          { error: 'A record with this information already exists' },
          { status: 409 }
        );
      } else if (error.code === 'P2025') {
        // Record not found
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        );
      } else {
        // Generic database error
        return NextResponse.json(
          { error: 'Database operation failed' },
          { status: 500 }
        );
      }
    }
  };
}

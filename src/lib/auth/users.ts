import { hash } from 'bcrypt';
import { z } from 'zod';
import { userSchema } from '@/lib/validations/schemas';
import prisma from '@/lib/db/prisma';

// Type for user registration data
export type UserRegistrationData = z.infer<typeof userSchema>;

/**
 * Register a new user
 * @param userData User registration data
 * @returns The created user object (without password)
 */
export async function registerUser(userData: UserRegistrationData) {
  // Validate user data
  const validatedData = userSchema.parse(userData);
  
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: validatedData.email },
  });
  
  if (existingUser) {
    throw new Error('User with this email already exists');
  }
  
  // Hash password if provided
  let hashedPassword = null;
  if (validatedData.password) {
    hashedPassword = await hash(validatedData.password, 10);
  }
  
  // Create user
  const user = await prisma.user.create({
    data: {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: validatedData.role,
      profile: {
        create: {} // Create empty profile
      }
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      profile: true,
    },
  });
  
  return user;
}

/**
 * Get user by ID
 * @param userId User ID
 * @returns User object (without password)
 */
export async function getUserById(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      profile: true,
    },
  });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  return user;
}

/**
 * Update user profile
 * @param userId User ID
 * @param profileData Profile data to update
 * @returns Updated user object (without password)
 */
export async function updateUserProfile(userId: string, profileData: any) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: profileData.name,
      profile: {
        upsert: {
          create: {
            bio: profileData.bio,
            school: profileData.school,
            yearGroup: profileData.yearGroup,
            specialNeeds: profileData.specialNeeds,
            learningStyle: profileData.learningStyle,
            preferences: profileData.preferences || {},
          },
          update: {
            bio: profileData.bio,
            school: profileData.school,
            yearGroup: profileData.yearGroup,
            specialNeeds: profileData.specialNeeds,
            learningStyle: profileData.learningStyle,
            preferences: profileData.preferences || {},
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      profile: true,
    },
  });
  
  return user;
}

/**
 * Get users by role
 * @param role User role
 * @returns Array of users with the specified role
 */
export async function getUsersByRole(role: string) {
  const users = await prisma.user.findMany({
    where: { role: role as any },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });
  
  return users;
}

/**
 * Change user role
 * @param userId User ID
 * @param newRole New role
 * @returns Updated user object
 */
export async function changeUserRole(userId: string, newRole: string) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: newRole as any },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  
  return user;
}

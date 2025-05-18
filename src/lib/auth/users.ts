'use client';

import { hash, compare } from 'bcrypt';
import { db } from '../db';

// User authentication functions
export const users = {
  // Verify password for a user
  verifyPassword: async (email: string, password: string) => {
    try {
      const user = await db.user.findByEmail(email);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      // In a real implementation, this would use bcrypt.compare
      // For now, we'll simulate password verification
      const isValid = await compare(password, user.password);
      
      if (!isValid) {
        return { success: false, message: 'Invalid password' };
      }
      
      return { 
        success: true, 
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      };
    } catch (error) {
      console.error('Error verifying password:', error);
      return { success: false, message: 'Authentication error' };
    }
  },
  
  // Create a new user
  createUser: async (userData: any) => {
    try {
      // Check if user already exists
      const existingUser = await db.user.findByEmail(userData.email);
      
      if (existingUser) {
        return { success: false, message: 'User already exists' };
      }
      
      // Hash password
      const hashedPassword = await hash(userData.password, 10);
      
      // Create user with hashed password
      const newUser = await db.user.create({
        ...userData,
        password: hashedPassword
      });
      
      return { 
        success: true, 
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role
        }
      };
    } catch (error) {
      console.error('Error creating user:', error);
      return { success: false, message: 'Failed to create user' };
    }
  },
  
  // Update user password
  updatePassword: async (userId: string, currentPassword: string, newPassword: string) => {
    try {
      const user = await db.user.findById(userId);
      
      if (!user) {
        return { success: false, message: 'User not found' };
      }
      
      // Verify current password
      const isValid = await compare(currentPassword, user.password);
      
      if (!isValid) {
        return { success: false, message: 'Current password is incorrect' };
      }
      
      // Hash new password
      const hashedPassword = await hash(newPassword, 10);
      
      // Update user with new password
      await db.user.update(userId, {
        password: hashedPassword
      });
      
      return { success: true, message: 'Password updated successfully' };
    } catch (error) {
      console.error('Error updating password:', error);
      return { success: false, message: 'Failed to update password' };
    }
  }
};

export default users;

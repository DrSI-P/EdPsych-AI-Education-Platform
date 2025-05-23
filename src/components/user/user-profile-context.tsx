'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the user profile context
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'student' | 'teacher' | 'admin';
  keyStage?: string;
  yearGroup?: number;
  school?: string;
  preferences: UserPreferences;
  progress: UserProgress;
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notifications: boolean;
  accessibility: {
    fontSize: 'small' | 'medium' | 'large';
    highContrast: boolean;
    reducedMotion: boolean;
    screenReader: boolean;
  };
  learningStyle?: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  difficultyPreference?: 'easy' | 'medium' | 'hard' | 'adaptive';
}

export interface UserProgress {
  completedQuests: string[];
  completedChallenges: string[];
  completedAssessments: string[];
  currentQuest?: string;
  currentChapter?: string;
  currentChallenge?: number;
  skillLevels: Record<string, number>;
  xp: number;
  level: number;
  streakDays: number;
  lastActive: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'quest' | 'skill' | 'engagement' | 'special';
}

export interface UserProfileContextType {
  currentUser?: UserProfile;
  isLoading: boolean;
  error?: string;
  login: (email: string, password: string) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<UserProfile>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<UserPreferences>;
  updateProgress: (progress: Partial<UserProgress>) => Promise<UserProgress>;
  getAchievements: () => Promise<Achievement[]>;
}

// Create the context with a default value
const UserProfileContext = createContext<UserProfileContextType | null>(null);

// Mock data for development
const mockUserProfile: UserProfile = {
  id: 'user1',
  name: 'Alex Johnson',
  email: 'alex.johnson@example.com',
  avatar: '/avatars/alex.png',
  role: 'student',
  keyStage: 'KS2',
  yearGroup: 5,
  school: 'Springfield Primary School',
  preferences: {
    theme: 'system',
    notifications: true,
    accessibility: {
      fontSize: 'medium',
      highContrast: false,
      reducedMotion: false,
      screenReader: false
    },
    learningStyle: 'visual',
    difficultyPreference: 'adaptive'
  },
  progress: {
    completedQuests: ['q1', 'q2', 'q3'],
    completedChallenges: ['c1', 'c2', 'c3', 'c4'],
    completedAssessments: ['a1'],
    currentQuest: 'q4',
    currentChapter: 'ch2',
    currentChallenge: 1,
    skillLevels: {
      'mathematics': 7,
      'reading': 8,
      'writing': 6,
      'science': 7,
      'problem-solving': 8
    },
    xp: 1250,
    level: 5,
    streakDays: 7,
    lastActive: '2023-05-22T14:30:00Z'
  },
  achievements: [
    {
      id: 'ach1',
      title: 'First Quest Completed',
      description: 'Completed your first quest',
      icon: 'trophy',
      unlockedAt: '2023-05-10T09:15:00Z',
      category: 'quest'
    },
    {
      id: 'ach2',
      title: 'Math Wizard',
      description: 'Achieved level 5 in Mathematics',
      icon: 'calculator',
      unlockedAt: '2023-05-15T11:30:00Z',
      category: 'skill'
    },
    {
      id: 'ach3',
      title: 'Week Streak',
      description: 'Used the platform for 7 consecutive days',
      icon: 'calendar',
      unlockedAt: '2023-05-22T14:30:00Z',
      category: 'engagement'
    }
  ],
  createdAt: '2023-05-01T08:00:00Z',
  updatedAt: '2023-05-22T14:30:00Z'
};

// Provider component
export const UserProfileProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | undefined>(mockUserProfile);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);
  
  // Function to login
  const login = async (email: string, password: string): Promise<UserProfile> => {
    // In a real implementation, this would call an API
    setIsLoading(true);
    setError(undefined);
    
    try {
      console.log(`Logging in with email: ${email}`);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For development, just return the mock user
      setCurrentUser(mockUserProfile);
      return mockUserProfile;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to logout
  const logout = async (): Promise<void> => {
    // In a real implementation, this would call an API
    setIsLoading(true);
    
    try {
      console.log('Logging out');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCurrentUser(undefined);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update profile
  const updateProfile = async (updates: Partial<UserProfile>): Promise<UserProfile> => {
    // In a real implementation, this would call an API
    setIsLoading(true);
    
    try {
      console.log('Updating profile', updates);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString()
      };
      
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update preferences
  const updatePreferences = async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    // In a real implementation, this would call an API
    setIsLoading(true);
    
    try {
      console.log('Updating preferences', preferences);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      const updatedPreferences = {
        ...currentUser.preferences,
        ...preferences
      };
      
      const updatedUser = {
        ...currentUser,
        preferences: updatedPreferences,
        updatedAt: new Date().toISOString()
      };
      
      setCurrentUser(updatedUser);
      return updatedPreferences;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to update progress
  const updateProgress = async (progress: Partial<UserProgress>): Promise<UserProgress> => {
    // In a real implementation, this would call an API
    setIsLoading(true);
    
    try {
      console.log('Updating progress', progress);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      const updatedProgress = {
        ...currentUser.progress,
        ...progress,
        lastActive: new Date().toISOString()
      };
      
      const updatedUser = {
        ...currentUser,
        progress: updatedProgress,
        updatedAt: new Date().toISOString()
      };
      
      setCurrentUser(updatedUser);
      return updatedProgress;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Function to get achievements
  const getAchievements = async (): Promise<Achievement[]> => {
    // In a real implementation, this would call an API
    setIsLoading(true);
    
    try {
      console.log('Getting achievements');
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (!currentUser) {
        throw new Error('No user is currently logged in');
      }
      
      return currentUser.achievements;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <UserProfileContext.Provider 
      value={{ 
        currentUser,
        isLoading,
        error,
        login,
        logout,
        updateProfile,
        updatePreferences,
        updateProgress,
        getAchievements
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

// Custom hook to use the user profile context
export const useUserProfile = () => useContext(UserProfileContext);

export default UserProfileContext;
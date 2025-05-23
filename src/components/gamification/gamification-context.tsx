'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define types for the gamification context
export interface GamificationAchievement {
  id: string;
  name: string;
  description: string;
  type: string;
  timestamp?: string;
  questId?: string;
}

export interface GamificationProfile {
  level: number;
  points: number;
  achievements: GamificationAchievement[];
  streakDays: number;
  lastActive: string;
}

export interface GamificationEvent {
  type: string;
  questId?: string;
  questTitle?: string;
  timestamp: string;
  [key: string]: any;
}

export interface GamificationContextType {
  profile?: GamificationProfile;
  achievements?: GamificationAchievement[];
  points?: number;
  level?: number;
  awardPoints: (points: number, metadata: any) => Promise<void>;
  awardAchievement: (achievement: GamificationAchievement) => Promise<void>;
  trackEvent: (event: GamificationEvent) => void;
}

// Create the context with a default value
const GamificationContext = createContext<GamificationContextType | null>(null);

// Mock data for development
const mockProfile: GamificationProfile = {
  level: 5,
  points: 450,
  achievements: [
    {
      id: 'a1',
      name: 'First Steps',
      description: 'Completed your first quest',
      type: 'quest_completion',
      timestamp: '2023-01-15T12:30:00Z'
    },
    {
      id: 'a2',
      name: 'Knowledge Seeker',
      description: 'Completed 5 quests',
      type: 'quest_milestone',
      timestamp: '2023-03-10T14:45:00Z'
    }
  ],
  streakDays: 3,
  lastActive: new Date().toISOString()
};

// Provider component
export const GamificationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [profile, setProfile] = useState<GamificationProfile>(mockProfile);
  
  // Function to award points
  const awardPoints = async (points: number, metadata: any): Promise<void> => {
    // In a real implementation, this would call an API
    console.log(`Awarding ${points} points`, metadata);
    
    setProfile(prev => {
      const newPoints = prev.points + points;
      const newLevel = calculateLevel(newPoints);
      
      return {
        ...prev,
        points: newPoints,
        level: newLevel
      };
    });
  };
  
  // Function to award an achievement
  const awardAchievement = async (achievement: GamificationAchievement): Promise<void> => {
    // In a real implementation, this would call an API
    console.log('Awarding achievement', achievement);
    
    setProfile(prev => {
      // Check if achievement already exists
      const exists = prev.achievements.some(a => a.id === achievement.id);
      
      if (exists) {
        return prev;
      }
      
      return {
        ...prev,
        achievements: [...prev.achievements, achievement]
      };
    });
  };
  
  // Function to track gamification events
  const trackEvent = (event: GamificationEvent): void => {
    // In a real implementation, this would call an API or analytics service
    console.log('Tracking event', event);
    
    // Update last active timestamp
    setProfile(prev => ({
      ...prev,
      lastActive: new Date().toISOString()
    }));
  };
  
  // Helper function to calculate level based on points
  const calculateLevel = (points: number): number => {
    // Simple level calculation: 1 level per 100 points
    return Math.floor(points / 100) + 1;
  };
  
  return (
    <GamificationContext.Provider 
      value={{ 
        profile,
        achievements: profile.achievements,
        points: profile.points,
        level: profile.level,
        awardPoints,
        awardAchievement,
        trackEvent
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
};

// Custom hook to use the gamification context
export const useGamification = () => useContext(GamificationContext);

export default GamificationContext;
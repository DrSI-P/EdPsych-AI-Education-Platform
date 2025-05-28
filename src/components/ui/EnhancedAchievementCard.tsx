"use client";

import React from 'react';
import { cn } from "@/lib/utils";

interface EnhancedAchievementCardProps {
  className?: string;
  title?: string;
  description?: string;
  achievement?: {
    name: string;
    date: string;
    icon?: string;
  };
  onClose?: () => void;
}

export const EnhancedAchievementCard: React.FC<EnhancedAchievementCardProps> = ({ 
  className, 
  title = "Achievement Unlocked!", 
  description = "Congratulations on your achievement!",
  achievement = {
    name: "Learning Milestone",
    date: new Date().toLocaleDateString(),
    icon: "🏆"
  },
  onClose,
  ...props 
}) => {
  return (
    <div className={cn(
      "p-6 rounded-lg shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white relative overflow-hidden",
      className
    )} {...props}>
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          aria-label="Close"
        >
          ✕
        </button>
      )}
      
      <div className="flex items-center mb-4">
        <div className="text-4xl mr-4">{achievement.icon}</div>
        <div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm text-white/80">{achievement.date}</p>
        </div>
      </div>
      
      <div className="mb-4">
        <h4 className="font-semibold text-lg">{achievement.name}</h4>
        <p className="text-white/90">{description}</p>
      </div>
      
      <div className="mt-4 pt-4 border-t border-white/20">
        <div className="flex justify-between items-center">
          <span className="text-sm">Share your achievement</span>
          <div className="flex space-x-2">
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <span className="sr-only">Share on Twitter</span>
              <span>🐦</span>
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <span className="sr-only">Share on Facebook</span>
              <span>📘</span>
            </button>
            <button className="p-2 rounded-full bg-white/20 hover:bg-white/30">
              <span className="sr-only">Share via Email</span>
              <span>✉️</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/10 z-0"></div>
      <div className="absolute -top-10 -left-10 w-24 h-24 rounded-full bg-white/10 z-0"></div>
    </div>
  );
};

export default EnhancedAchievementCard;

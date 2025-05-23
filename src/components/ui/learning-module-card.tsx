'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { SubjectIcon } from '@/components/ui/subject-icon';
import { ProgressVisualization } from '@/components/ui/progress-visualization';

interface LearningModuleCardProps {
  title: string;
  description?: string;
  subject: 'maths' | 'english' | 'science' | 'history' | 'geography' | 'art';
  keyStage: 'eyfs' | 'ks1' | 'ks2' | 'ks3' | 'ks4';
  progress?: number;
  estimatedTime?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  tags?: string[];
  imageSrc?: string;
  className?: string;
  onClick?: () => void;
}

export function LearningModuleCard({
  title,
  description,
  subject,
  keyStage,
  progress = 0,
  estimatedTime,
  difficulty,
  tags = [],
  imageSrc,
  className,
  onClick
}: LearningModuleCardProps) {
  // Difficulty badge color
  const difficultyColor = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    intermediate: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    advanced: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
  };
  
  return (
    <div 
      className={cn(
        'visual-card subject-card interactive-element',
        `subject-${subject}`,
        `theme-${keyStage}`,
        'overflow-hidden',
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {imageSrc && (
        <div className="relative h-40 overflow-hidden">
          <img 
            src={imageSrc} 
            alt={title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-2 left-2">
            <SubjectIcon subject={subject} size="md" />
          </div>
          {difficulty && (
            <div className="absolute top-2 right-2">
              <span className={cn(
                'text-xs px-2 py-1 rounded-full font-medium',
                difficultyColor[difficulty]
              )}>
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        <div className="flex items-start">
          {!imageSrc && <SubjectIcon subject={subject} className="mr-3 flex-shrink-0" />}
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{description}</p>
            )}
          </div>
        </div>
        
        <div className="mt-4">
          <ProgressVisualization 
            progress={progress} 
            showLabel={true}
            label="Completion"
            size="md"
          />
        </div>
        
        <div className="mt-4 flex flex-wrap items-center justify-between text-sm">
          {estimatedTime && (
            <div className="flex items-center text-gray-600 dark:text-gray-300 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              {estimatedTime}
            </div>
          )}
          
          <div className="text-gray-600 dark:text-gray-300">
            {keyStage.toUpperCase()}
          </div>
        </div>
        
        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {tags.map((tag, index) => (
              <span 
                key={index}
                className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningModuleCard;

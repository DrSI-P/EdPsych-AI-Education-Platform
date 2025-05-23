'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressVisualizationProps {
  progress: number; // 0 to 100
  showPercentage?: boolean;
  showLabel?: boolean;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animated?: boolean;
}

export function ProgressVisualization({
  progress,
  showPercentage = true,
  showLabel = false,
  label = 'Progress',
  size = 'md',
  className,
  animated = true
}: ProgressVisualizationProps) {
  // Ensure progress is between 0 and 100
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  
  // Size classes
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  return (
    <div className={cn('space-y-1', className)}>
      {(showLabel || showPercentage) && (
        <div className="flex justify-between items-center text-sm">
          {showLabel && <span>{label}</span>}
          {showPercentage && <span>{normalizedProgress}%</span>}
        </div>
      )}
      
      <div className={cn('progress-bar', sizeClasses[size])}>
        <div 
          className={cn(
            'progress-bar-fill',
            animated && 'transition-all duration-500'
          )}
          style={{ width: `${normalizedProgress}%` }}
          role="progressbar"
          aria-valuenow={normalizedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${normalizedProgress}% complete`}
        />
      </div>
    </div>
  );
}

export default ProgressVisualization;

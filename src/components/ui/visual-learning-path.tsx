'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VisualLearningPathProps {
  steps: LearningPathStep[];
  currentStep?: number;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  onStepClick?: (stepIndex: number) => void;
  keyStage?: 'eyfs' | 'ks1' | 'ks2' | 'ks3' | 'ks4';
}

interface LearningPathStep {
  title: string;
  description?: string;
  status: 'completed' | 'current' | 'upcoming';
  icon?: React.ReactNode;
}

export function VisualLearningPath({
  steps,
  currentStep = 0,
  orientation = 'vertical',
  className,
  onStepClick,
  keyStage
}: VisualLearningPathProps) {
  const keyStageClass = keyStage ? `theme-${keyStage}` : '';
  
  // Status styling
  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-primary text-white border-primary';
      case 'current':
        return 'bg-white text-primary border-primary ring-2 ring-primary-light ring-opacity-50';
      case 'upcoming':
        return 'bg-white text-gray-400 border-gray-300';
      default:
        return 'bg-white text-gray-400 border-gray-300';
    }
  };
  
  // Line styling
  const getLineStyles = (index: number) => {
    const isLast = index === steps.length - 1;
    const isCompleted = steps[index].status === 'completed';
    const nextIsCompleted = !isLast && steps[index + 1].status === 'completed';
    
    if (isLast) return '';
    
    if (isCompleted && nextIsCompleted) {
      return 'bg-primary';
    } else if (isCompleted) {
      return 'bg-gradient-to-b from-primary to-gray-300';
    } else {
      return 'bg-gray-300';
    }
  };
  
  return (
    <div className={cn(
      'visual-learning-path',
      keyStageClass,
      orientation === 'horizontal' ? 'flex' : 'block',
      className
    )}>
      {steps.map((step, index) => (
        <div 
          key={index}
          className={cn(
            'relative',
            orientation === 'horizontal' 
              ? 'flex-1 flex flex-col items-center' 
              : 'pl-10 pb-8'
          )}
        >
          {/* Step indicator */}
          <div 
            className={cn(
              'z-10 flex items-center justify-center w-8 h-8 rounded-full border-2',
              getStatusStyles(step.status),
              orientation === 'horizontal' ? 'mb-4' : 'absolute left-0 top-0',
              onStepClick ? 'cursor-pointer hover:scale-110 transition-transform' : ''
            )}
            onClick={() => onStepClick && onStepClick(index)}
            role={onStepClick ? 'button' : undefined}
            tabIndex={onStepClick ? 0 : undefined}
            aria-current={step.status === 'current' ? 'step' : undefined}
          >
            {step.icon || (
              step.status === 'completed' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-xs font-bold">{index + 1}</span>
              )
            )}
          </div>
          
          {/* Connecting line */}
          {index < steps.length - 1 && (
            <div 
              className={cn(
                orientation === 'horizontal' 
                  ? 'absolute top-4 left-1/2 h-0.5 w-full' 
                  : 'absolute left-4 top-8 w-0.5 h-full -ml-px',
                getLineStyles(index)
              )}
              style={
                orientation === 'horizontal' 
                  ? { left: '50%', width: '100%' } 
                  : {}
              }
            />
          )}
          
          {/* Content */}
          <div className={orientation === 'horizontal' ? 'text-center px-2' : ''}>
            <h4 className={cn(
              'font-bold',
              step.status === 'upcoming' ? 'text-gray-500' : ''
            )}>
              {step.title}
            </h4>
            
            {step.description && (
              <p className={cn(
                'text-sm',
                step.status === 'upcoming' ? 'text-gray-400' : 'text-gray-600 dark:text-gray-300'
              )}>
                {step.description}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default VisualLearningPath;

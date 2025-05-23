'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VisualLearningContainerProps {
  title?: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
  highlight?: boolean;
  conceptMap?: boolean;
}

export function VisualLearningContainer({
  title,
  description,
  className,
  children,
  highlight = false,
  conceptMap = false
}: VisualLearningContainerProps) {
  return (
    <div className={cn(
      'visual-learning-container',
      highlight && 'highlight-animation',
      conceptMap && 'concept-map',
      className
    )}>
      {title && (
        <div className="mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          {description && <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      )}
      
      {children}
    </div>
  );
}

export default VisualLearningContainer;

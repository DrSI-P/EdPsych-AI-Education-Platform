'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface VisualCardProps {
  title: string;
  description?: string;
  subject?: 'maths' | 'english' | 'science' | 'history' | 'geography' | 'art';
  keyStage?: 'eyfs' | 'ks1' | 'ks2' | 'ks3' | 'ks4';
  interactive?: boolean;
  className?: string;
  headerClassName?: string;
  bodyClassName?: string;
  footerClassName?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  onClick?: () => void;
}

export function VisualCard({
  title,
  description,
  subject,
  keyStage,
  interactive = true,
  className,
  headerClassName,
  bodyClassName,
  footerClassName,
  children,
  footer,
  onClick
}: VisualCardProps) {
  const subjectClass = subject ? `subject-${subject} subject-card` : '';
  const keyStageClass = keyStage ? `theme-${keyStage}` : '';
  const interactiveClass = interactive ? 'interactive-element' : '';
  
  return (
    <div 
      className={cn(
        'visual-card',
        subjectClass,
        keyStageClass,
        interactiveClass,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={cn('visual-card-header', headerClassName)}>
        <h3 className="text-xl font-bold">{title}</h3>
        {description && <p className="mt-1 text-sm opacity-90">{description}</p>}
      </div>
      
      <div className={cn('visual-card-body', bodyClassName)}>
        {children}
      </div>
      
      {footer && (
        <div className={cn('visual-card-footer', footerClassName)}>
          {footer}
        </div>
      )}
    </div>
  );
}

export default VisualCard;

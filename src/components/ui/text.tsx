import React from 'react';
import { cn } from '@/lib/utils';

interface TextProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'lead' | 'large' | 'small' | 'muted';
  as?: React.ElementType;
}

/**
 * Text component for consistent typography across the application
 * Supports different variants for different text styles
 */
export function Text({ 
  children, 
  className, 
  variant = 'default',
  as: Component = 'p'
}: TextProps) {
  const baseStyles = 'text-foreground';
  
  const variantStyles = {
    default: 'text-base leading-7',
    lead: 'text-xl leading-7',
    large: 'text-lg leading-7',
    small: 'text-sm leading-6',
    muted: 'text-sm text-muted-foreground leading-6',
  };
  
  const combinedStyles = cn(baseStyles, variantStyles[variant], className);
  
  return (
    <Component className={combinedStyles}>
      {children}
    </Component>
  );
}
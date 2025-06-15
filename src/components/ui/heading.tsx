import React from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps {
  level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  children: React.ReactNode;
  className?: string;
}

/**
 * Heading component for consistent typography across the application
 * Supports all heading levels (h1-h6) with appropriate styling
 */
export function Heading({ level, children, className }: HeadingProps) {
  const baseStyles = 'font-heading font-bold text-foreground';
  
  const sizeStyles = {
    h1: 'text-4xl md:text-5xl mb-4',
    h2: 'text-3xl md:text-4xl mb-3',
    h3: 'text-2xl md:text-3xl mb-2',
    h4: 'text-xl md:text-2xl mb-2',
    h5: 'text-lg md:text-xl mb-1',
    h6: 'text-base md:text-lg mb-1',
  };
  
  const combinedStyles = cn(baseStyles, sizeStyles[level], className);
  
  switch (level) {
    case 'h1':
      return <h1 className={combinedStyles}>{children}</h1>;
    case 'h2':
      return <h2 className={combinedStyles}>{children}</h2>;
    case 'h3':
      return <h3 className={combinedStyles}>{children}</h3>;
    case 'h4':
      return <h4 className={combinedStyles}>{children}</h4>;
    case 'h5':
      return <h5 className={combinedStyles}>{children}</h5>;
    case 'h6':
      return <h6 className={combinedStyles}>{children}</h6>;
    default:
      return <h2 className={combinedStyles}>{children}</h2>;
  }
}
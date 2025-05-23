import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'circle' | 'rounded';
  width?: string | number;
  height?: string | number;
  count?: number;
}

export function Skeleton({
  className = '',
  variant = 'default',
  width,
  height,
  count = 1,
}: SkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 dark:bg-gray-700';
  
  const variantClasses = {
    default: 'rounded',
    circle: 'rounded-full',
    rounded: 'rounded-md',
  };
  
  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || '1rem',
  };
  
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={`${baseClasses} ${variantClasses[variant]} ${className}`}
          style={style}
        />
      ))}
    </>
  );
}

export function SkeletonText({ lines = 3, className = '' }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton 
          key={i} 
          className="h-4" 
          width={i === lines - 1 && lines > 1 ? '80%' : '100%'} 
        />
      ))}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4">
      <Skeleton className="h-32 mb-4" variant="rounded" />
      <Skeleton className="h-6 mb-2 w-2/3" />
      <SkeletonText lines={2} />
    </div>
  );
}

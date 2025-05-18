'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button' | 'input';
  width?: string | number;
  height?: string | number;
  rounded?: boolean;
  animate?: boolean;
}

/**
 * Skeleton Component
 * 
 * A versatile skeleton loader component for displaying loading states
 * with consistent styling and animation.
 */
export function Skeleton({
  className,
  variant = 'default',
  width,
  height,
  rounded = false,
  animate = true,
}: SkeletonProps) {
  const baseStyles = 'bg-gray-200 dark:bg-gray-700';
  const animationStyles = animate ? 'animate-pulse' : '';
  const roundedStyles = rounded ? 'rounded-full' : 'rounded';
  
  const variantStyles = {
    default: '',
    card: 'w-full h-[200px] rounded-lg',
    text: 'h-4 w-full rounded',
    avatar: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24 rounded',
    input: 'h-10 w-full rounded',
  };
  
  const styles = cn(
    baseStyles,
    animationStyles,
    variantStyles[variant],
    rounded ? roundedStyles : '',
    className
  );
  
  return (
    <div 
      className={styles} 
      style={{ 
        width: width !== undefined ? (typeof width === 'number' ? `${width}px` : width) : undefined,
        height: height !== undefined ? (typeof height === 'number' ? `${height}px` : height) : undefined,
      }}
      aria-hidden="true"
    />
  );
}

/**
 * Skeleton Text Component
 * 
 * A specialized skeleton component for text content with multiple lines.
 */
export function SkeletonText({
  className,
  lines = 3,
  lastLineWidth = 70,
  animate = true,
}: {
  className?: string;
  lines?: number;
  lastLineWidth?: number;
  animate?: boolean;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={i === lines - 1 && lastLineWidth < 100 ? `${lastLineWidth}%` : '100%'}
          animate={animate}
        />
      ))}
    </div>
  );
}

/**
 * Skeleton Card Component
 * 
 * A specialized skeleton component for card layouts.
 */
export function SkeletonCard({
  className,
  hasImage = true,
  hasFooter = false,
  animate = true,
}: {
  className?: string;
  hasImage?: boolean;
  hasFooter?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={cn('rounded-lg border p-4', className)}>
      {hasImage && (
        <Skeleton
          className="mb-4"
          height={200}
          animate={animate}
        />
      )}
      <Skeleton
        variant="text"
        className="mb-2"
        animate={animate}
      />
      <SkeletonText
        lines={2}
        animate={animate}
      />
      {hasFooter && (
        <div className="mt-4 flex items-center justify-between">
          <Skeleton
            width={100}
            height={10}
            animate={animate}
          />
          <Skeleton
            width={80}
            height={30}
            rounded
            animate={animate}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Skeleton Table Component
 * 
 * A specialized skeleton component for table layouts.
 */
export function SkeletonTable({
  className,
  rows = 5,
  columns = 4,
  hasHeader = true,
  animate = true,
}: {
  className?: string;
  rows?: number;
  columns?: number;
  hasHeader?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={cn('w-full', className)}>
      {hasHeader && (
        <div className="grid gap-4 mb-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton
              key={i}
              height={30}
              animate={animate}
            />
          ))}
        </div>
      )}
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div 
            key={rowIndex}
            className="grid gap-4"
            style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
          >
            {Array.from({ length: columns }).map((_, colIndex) => (
              <Skeleton
                key={colIndex}
                height={20}
                animate={animate}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton Avatar with Text Component
 * 
 * A specialized skeleton component for avatar with text layouts.
 */
export function SkeletonAvatarWithText({
  className,
  lines = 2,
  animate = true,
}: {
  className?: string;
  lines?: number;
  animate?: boolean;
}) {
  return (
    <div className={cn('flex items-center space-x-4', className)}>
      <Skeleton
        variant="avatar"
        animate={animate}
      />
      <div className="space-y-2 flex-1">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton
            key={i}
            variant="text"
            width={i === 0 ? '70%' : '100%'}
            animate={animate}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Skeleton Form Component
 * 
 * A specialized skeleton component for form layouts.
 */
export function SkeletonForm({
  className,
  fields = 3,
  hasButton = true,
  animate = true,
}: {
  className?: string;
  fields?: number;
  hasButton?: boolean;
  animate?: boolean;
}) {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton
            width={100}
            height={16}
            animate={animate}
          />
          <Skeleton
            variant="input"
            animate={animate}
          />
        </div>
      ))}
      {hasButton && (
        <div className="pt-2">
          <Skeleton
            variant="button"
            width={120}
            animate={animate}
          />
        </div>
      )}
    </div>
  );
}

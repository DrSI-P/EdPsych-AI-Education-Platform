'use client';

import React, { useState, useEffect } from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'white';
  className?: string;
}

export function Spinner({ size = 'md', color = 'primary', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };
  
  const colorClasses = {
    primary: 'text-blue-600',
    secondary: 'text-gray-600',
    white: 'text-white',
  };
  
  return (
    <div className={`inline-block animate-spin ${sizeClasses[size]} ${colorClasses[color]} ${className}`} role="status">
      <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export function Skeleton({ variant = 'text', width, height, className = '' }: SkeletonProps) {
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return 'rounded-md';
      case 'text':
      default:
        return 'rounded w-full h-4';
    }
  };
  
  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;
  
  return (
    <div 
      className={`animate-pulse bg-gray-200 ${getVariantClasses()} ${className}`}
      style={style}
    />
  );
}

interface ProgressProps {
  value: number;
  max?: number;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export function Progress({ 
  value, 
  max = 100, 
  color = 'primary', 
  size = 'md',
  showValue = false,
  className = '' 
}: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4',
  };
  
  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
  };
  
  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-1">
        {showValue && (
          <span className="text-sm font-medium text-gray-700">
            {value}/{max}
          </span>
        )}
        {showValue && (
          <span className="text-sm font-medium text-gray-700">
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div 
          className={`${colorClasses[color]} rounded-full ${sizeClasses[size]}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = 'Loading...' }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-90 z-50">
      <Spinner size="lg" />
      <p className="mt-4 text-lg text-gray-700">{message}</p>
    </div>
  );
}

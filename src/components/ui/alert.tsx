'use client';

import React, { useState, useEffect } from 'react';

interface AlertProps {
  variant?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  dismissible?: boolean;
  className?: string;
}

export function Alert({ 
  variant = 'info', 
  title, 
  children, 
  dismissible = false,
  className = '' 
}: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) return null;
  
  const variantClasses = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    success: 'bg-green-50 border-green-500 text-green-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    error: 'bg-red-50 border-red-500 text-red-800',
  };
  
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        );
      case 'error':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
      case 'info':
      default:
        return (
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };
  
  return (
    <div className={`rounded-md border-l-4 p-4 ${variantClasses[variant]} ${className}`} role="alert">
      <div className="flex">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3">
          {title && <h3 className="text-sm font-medium">{title}</h3>}
          <div className="text-sm">{children}</div>
        </div>
        {dismissible && (
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                className={`inline-flex rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  variant === 'info' ? 'text-blue-500 hover:bg-blue-100 focus:ring-blue-600' :
                  variant === 'success' ? 'text-green-500 hover:bg-green-100 focus:ring-green-600' :
                  variant === 'warning' ? 'text-yellow-500 hover:bg-yellow-100 focus:ring-yellow-600' :
                  'text-red-500 hover:bg-red-100 focus:ring-red-600'
                }`}
                onClick={() => setIsVisible(false)}
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

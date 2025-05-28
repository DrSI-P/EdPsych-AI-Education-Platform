'use client';

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card() : React.ReactNode { children, className = '' }: CardProps) {
  return (
    <div className={`bg-white shadow rounded-lg overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function CardHeader() : React.ReactNode { children, className = '' }: CardHeaderProps) {
  return (
    <div className={`px-4 py-5 sm:px-6 border-b border-grey-200 ${className}`}>
      {children}
    </div>
  );
}

interface CardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContent() : React.ReactNode { children, className = '' }: CardContentProps) {
  return (
    <div className={`px-4 py-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function CardFooter() : React.ReactNode { children, className = '' }: CardFooterProps) {
  return (
    <div className={`px-4 py-4 sm:px-6 border-t border-grey-200 ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

export function CardTitle() : React.ReactNode { children, className = '' }: CardTitleProps) {
  return (
    <h3 className={`text-lg leading-6 font-medium text-grey-900 ${className}`}>
      {children}
    </h3>
  );
}

interface CardDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

export function CardDescription() : React.ReactNode { children, className = '' }: CardDescriptionProps) {
  return (
    <p className={`mt-1 max-w-2xl text-sm text-grey-500 ${className}`}>
      {children}
    </p>
  );
}

interface CardImageProps {
  src: string;
  alt: string;
  className?: string;
}

export function CardImage() : React.ReactNode { src, alt, className = '' }: CardImageProps) {
  return (
    <div className={`w-full ${className}`}>
      <img src={src} alt={alt} className="w-full h-auto" />
    </div>
  );
}

interface CardActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function CardActions() : React.ReactNode { children, className = '' }: CardActionsProps) {
  return (
    <div className={`flex items-centre justify-end space-x-3 ${className}`}>
      {children}
    </div>
  );
}

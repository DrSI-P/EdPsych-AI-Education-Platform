'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LucideIconWrapperProps {
  icon: LucideIcon;
  className?: string;
  [key: string]: any;
}

/**
 * Wrapper component for Lucide icons to prevent hydration mismatches
 * This ensures consistent className handling between server and client
 */
export function Icon({ icon: IconComponent, className = '', ...props }: LucideIconWrapperProps) {
  // Remove any lucide-specific classes that might cause hydration issues
  const cleanClassName = className.replace(/lucide lucide-[a-z-]+\s*/gi, '').trim();
  
  return <IconComponent className={cleanClassName} {...props} />;
}
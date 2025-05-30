'use client';

import React from 'react';
import { useTheme } from '@/components/ui/theme-provider';
import EnhancedAccessibilityPanel from './enhanced-accessibility-panel';
import '@/styles/accessibility.css';

interface AccessibilityProviderProps {
  children: React.ReactNode;
}

/**
 * AccessibilityProvider Component
 * 
 * A provider component that wraps the application and provides
 * accessibility features and context to all child components.
 * 
 * This component:
 * 1. Applies global accessibility classes based on user preferences
 * 2. Renders the EnhancedAccessibilityPanel for user controls
 * 3. Ensures consistent accessibility features across the platform
 */
const AccessibilityProvider: React.FC<AccessibilityProviderProps> = ({ children }) => {
  const { 
    theme, 
    fontSize, 
    isReducedMotion,
    isDyslexicFont
  } = useTheme();
  
  // Determine accessibility classes based on user preferences
  const accessibilityClasses = [
    isReducedMotion ? 'reduce-motion' : '',
    isDyslexicFont ? 'dyslexic-font' : '',
    theme === 'high-contrast' ? 'high-contrast' : '',
    `font-size-${fontSize <= 14 ? 'small' : fontSize <= 16 ? 'medium' : fontSize <= 18 ? 'large' : 'x-large'}`
  ].filter(Boolean).join(' ');
  
  return (
    <div className={accessibilityClasses}>
      {children}
      <EnhancedAccessibilityPanel />
    </div>
  );
};

export default AccessibilityProvider;

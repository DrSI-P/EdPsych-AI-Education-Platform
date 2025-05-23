'use client';

import React, { useEffect } from 'react';
import { AccessibilityMenu } from '@/components/ui/accessibility-menu';

export function VoiceInputProvider({ children }: { children: React.ReactNode }) {
  // Load accessibility styles
  useEffect(() => {
    // Add global CSS variables for accessibility
    const root = document.documentElement;
    
    // Set default values if not already set
    if (!root.style.getPropertyValue('--base-font-size')) {
      root.style.setProperty('--base-font-size', '16px');
    }
    
    if (!root.style.getPropertyValue('--line-spacing')) {
      root.style.setProperty('--line-spacing', '1.5');
    }
    
    if (!root.style.getPropertyValue('--letter-spacing')) {
      root.style.setProperty('--letter-spacing', '0px');
    }
    
    if (!root.style.getPropertyValue('--font-family')) {
      root.style.setProperty('--font-family', 'var(--font-sans)');
    }
    
    if (!root.style.getPropertyValue('--reduce-motion')) {
      root.style.setProperty('--reduce-motion', 'no-preference');
    }
    
    if (!root.style.getPropertyValue('--cursor-size')) {
      root.style.setProperty('--cursor-size', '24px');
    }
    
    // Load OpenDyslexic font if not already loaded
    const dyslexiaFontLink = document.getElementById('dyslexia-font');
    if (!dyslexiaFontLink) {
      const link = document.createElement('link');
      link.id = 'dyslexia-font';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/open-dyslexic-regular.css';
      document.head.appendChild(link);
    }
    
    // Apply saved settings if available
    const savedSettings = localStorage.getItem('accessibility-settings');
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings);
        
        // Apply theme
        if (settings.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else if (settings.theme === 'light') {
          document.documentElement.classList.remove('dark');
        } else if (settings.theme === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          if (prefersDark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        
        // Apply high contrast
        if (settings.highContrast) {
          document.body.classList.add('high-contrast');
        }
        
        // Apply simplified interface
        if (settings.simplifiedInterface) {
          document.body.classList.add('simplified-interface');
        }
        
        // Apply focus mode
        if (settings.focusMode) {
          document.body.classList.add('focus-mode');
        }
      } catch (error) {
        console.error('Error applying saved accessibility settings:', error);
      }
    }
  }, []);
  
  return (
    <>
      {children}
      <AccessibilityMenu />
    </>
  );
}

export default VoiceInputProvider;

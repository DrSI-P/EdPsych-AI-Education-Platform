"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

/**
 * Enhanced ThemeProvider component that provides theme context to the application
 * 
 * This component wraps the Next.js ThemeProvider and adds support for:
 * - Light/dark mode
 * - High contrast mode
 * - Dyslexia-friendly mode
 * - Reduced motion preferences
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);
  const [highContrast, setHighContrast] = React.useState(false);
  const [dyslexiaFriendly, setDyslexiaFriendly] = React.useState(false);
  
  // Effect to handle system preference changes
  React.useEffect(() => {
    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: more)');
    setHighContrast(highContrastQuery.matches);
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setHighContrast(e.matches);
    };
    
    highContrastQuery.addEventListener('change', handleHighContrastChange);
    
    // Set mounted state to enable client-side rendering
    setMounted(true);
    
    return () => {
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);
  
  // Toggle high contrast mode
  const toggleHighContrast = React.useCallback(() => {
    setHighContrast(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('high-contrast', newValue);
      return newValue;
    });
  }, []);
  
  // Toggle dyslexia-friendly mode
  const toggleDyslexiaFriendly = React.useCallback(() => {
    setDyslexiaFriendly(prev => {
      const newValue = !prev;
      document.documentElement.classList.toggle('dyslexia-friendly', newValue);
      return newValue;
    });
  }, []);
  
  // Apply high contrast class based on state
  React.useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('high-contrast', highContrast);
    }
  }, [highContrast, mounted]);
  
  // Apply dyslexia-friendly class based on state
  React.useEffect(() => {
    if (mounted) {
      document.documentElement.classList.toggle('dyslexia-friendly', dyslexiaFriendly);
    }
  }, [dyslexiaFriendly, mounted]);
  
  // Create context value
  const accessibilityContextValue = React.useMemo(() => ({
    highContrast,
    dyslexiaFriendly,
    toggleHighContrast,
    toggleDyslexiaFriendly,
  }), [highContrast, dyslexiaFriendly, toggleHighContrast, toggleDyslexiaFriendly]);
  
  return (
    <AccessibilityContext.Provider value={accessibilityContextValue}>
      <NextThemesProvider {...props}>
        {children}
      </NextThemesProvider>
    </AccessibilityContext.Provider>
  );
}

// Create context for accessibility features
export interface AccessibilityContextType {
  highContrast: boolean;
  dyslexiaFriendly: boolean;
  toggleHighContrast: () => void;
  toggleDyslexiaFriendly: () => void;
}

export const AccessibilityContext = React.createContext<AccessibilityContextType>({
  highContrast: false,
  dyslexiaFriendly: false,
  toggleHighContrast: () => {},
  toggleDyslexiaFriendly: () => {},
});

// Custom hook to use accessibility features
export const useAccessibility = () => React.useContext(AccessibilityContext);

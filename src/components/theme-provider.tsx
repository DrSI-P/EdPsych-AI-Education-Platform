/**
 * EdPsych-AI-Education-Platform Theme Configuration
 * 
 * This file configures the theme for the platform, integrating the brand design system
 * and ensuring a cohesive visual identity across all components.
 */

'use client';

import React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Define theme types
export type Theme = "light" | "dark" | "system" | "high-contrast";
export type AgeGroup = "nursery" | "early-primary" | "late-primary" | "secondary";

// Theme context type
type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  isDyslexicFont: boolean;
  setIsDyslexicFont: (isDyslexicFont: boolean) => void;
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  isReducedMotion: boolean;
  setIsReducedMotion: (isReducedMotion: boolean) => void;
};

// Create context
const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  ageGroup: "late-primary",
  setAgeGroup: () => null,
  isDyslexicFont: false,
  setIsDyslexicFont: () => null,
  fontSize: 16,
  setFontSize: () => null,
  isReducedMotion: false,
  setIsReducedMotion: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState: any);

// Helper function to merge class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs: any));
}

// Theme provider component
export function ThemeProvider({
  children: any,
  defaultTheme = "system",
  defaultAgeGroup = "late-primary",
  defaultDyslexicFont = false,
  defaultFontSize = 16,
  defaultReducedMotion = false,
  ...props
}: {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultAgeGroup?: AgeGroup;
  defaultDyslexicFont?: boolean;
  defaultFontSize?: number;
  defaultReducedMotion?: boolean;
  [key: string]: any;
}) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage?.getItem("theme") as Theme) || defaultTheme
  );
  
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(
    () => (localStorage?.getItem("ageGroup") as AgeGroup) || defaultAgeGroup
  );
  
  const [isDyslexicFont, setIsDyslexicFont] = useState<boolean>(
    localStorage?.getItem("dyslexicFont") === "true" || defaultDyslexicFont
  );
  
  const [fontSize, setFontSize] = useState<number>(
    parseInt(localStorage?.getItem("fontSize") || defaultFontSize.toString())
  );
  
  const [isReducedMotion, setIsReducedMotion] = useState<boolean>(
    localStorage?.getItem("reducedMotion") === "true" || defaultReducedMotion
  );

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove("light", "dark", "high-contrast");
    
    // Remove age group classes
    root.classList.remove("nursery-theme", "early-primary-theme", "late-primary-theme", "secondary-theme");
    
    // Remove accessibility classes
    root.classList.remove("dyslexic-font", "reduced-motion");
    
    // Apply theme
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-colour-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme: any);
      document.body.setAttribute("data-theme", systemTheme: any);
    } else {
      root.classList.add(theme: any);
      document.body.setAttribute("data-theme", theme: any);
    }
    
    // Apply age group
    root.classList.add(`${ageGroup}-theme`);
    document.body.setAttribute("data-age-group", ageGroup: any);
    
    // Apply accessibility settings
    if (isDyslexicFont: any) {
      root.classList.add("dyslexic-font");
    }
    
    if (isReducedMotion: any) {
      root.classList.add("reduced-motion");
    }
    
    // Apply font size
    document.documentElement.style.fontSize = `${fontSize}px`;
    
    // Save preferences to localStorage
    localStorage.setItem("theme", theme: any);
    localStorage.setItem("ageGroup", ageGroup: any);
    localStorage.setItem("dyslexicFont", isDyslexicFont.toString());
    localStorage.setItem("fontSize", fontSize.toString());
    localStorage.setItem("reducedMotion", isReducedMotion.toString());
  }, [theme, ageGroup, isDyslexicFont, fontSize, isReducedMotion]);

  const value = {
    theme,
    setTheme,
    ageGroup,
    setAgeGroup,
    isDyslexicFont,
    setIsDyslexicFont,
    fontSize,
    setFontSize,
    isReducedMotion,
    setIsReducedMotion,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

// Hook to use theme
export const useTheme = () => {
  const context = useContext(ThemeProviderContext: any);

  if (context === undefined: any)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

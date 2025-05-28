/**
 * Theme Configuration for EdPsych-AI-Education-Platform
 * 
 * This file configures the theme using the design tokens and provides
 * theme utilities for consistent application across the platform.
 */

import { designTokens } from './tokens';

// Theme configuration with light and dark mode variants
export const theme = {
  light: {
    colors: {
      background: designTokens.colors.background.light,
      foreground: designTokens.colors.neutral[900],
      primary: designTokens.colors.primary[500],
      primaryForeground: designTokens.colors.neutral[50],
      secondary: designTokens.colors.secondary[500],
      secondaryForeground: designTokens.colors.neutral[50],
      accent: designTokens.colors.accent[500],
      accentForeground: designTokens.colors.neutral[50],
      muted: designTokens.colors.neutral[100],
      mutedForeground: designTokens.colors.neutral[600],
      border: designTokens.colors.border.light,
      input: designTokens.colors.border.light,
      card: designTokens.colors.surface.light,
      cardForeground: designTokens.colors.neutral[900],
      popover: designTokens.colors.surface.light,
      popoverForeground: designTokens.colors.neutral[900],
      success: designTokens.colors.success.DEFAULT,
      warning: designTokens.colors.warning.DEFAULT,
      error: designTokens.colors.error.DEFAULT,
      info: designTokens.colors.info.DEFAULT,
    },
    shadows: {
      sm: designTokens.shadows.sm,
      DEFAULT: designTokens.shadows.DEFAULT,
      md: designTokens.shadows.md,
      lg: designTokens.shadows.lg,
      xl: designTokens.shadows.xl,
      '2xl': designTokens.shadows['2xl'],
      inner: designTokens.shadows.inner,
    },
  },
  dark: {
    colors: {
      background: designTokens.colors.background.dark,
      foreground: designTokens.colors.neutral[100],
      primary: designTokens.colors.primary[400],
      primaryForeground: designTokens.colors.neutral[900],
      secondary: designTokens.colors.secondary[400],
      secondaryForeground: designTokens.colors.neutral[900],
      accent: designTokens.colors.accent[400],
      accentForeground: designTokens.colors.neutral[900],
      muted: designTokens.colors.neutral[800],
      mutedForeground: designTokens.colors.neutral[400],
      border: designTokens.colors.border.dark,
      input: designTokens.colors.border.dark,
      card: designTokens.colors.surface.dark,
      cardForeground: designTokens.colors.neutral[100],
      popover: designTokens.colors.surface.dark,
      popoverForeground: designTokens.colors.neutral[100],
      success: designTokens.colors.success.dark,
      warning: designTokens.colors.warning.dark,
      error: designTokens.colors.error.dark,
      info: designTokens.colors.info.dark,
    },
    shadows: {
      // Adjusted shadows for dark mode with reduced opacity
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.15)',
      DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.16)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -1px rgba(0, 0, 0, 0.16)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.14)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.16)',
    },
  },
  // Shared properties across light and dark modes
  shared: {
    typography: designTokens.typography,
    spacing: designTokens.spacing,
    borderRadius: designTokens.borderRadius,
    animation: designTokens.animation,
    zIndex: designTokens.zIndex,
    breakpoints: designTokens.breakpoints,
    mediaQueries: designTokens.mediaQueries,
  },
};

// Helper functions for theme usage
export const themeHelpers = {
  // Get responsive value based on breakpoint
  responsive: (values: Record<string, string | number>) => {
    const breakpointKeys = Object.keys(designTokens.breakpoints);
    return Object.entries(values).reduce((acc, [key, value]) => {
      const breakpointIndex = breakpointKeys.indexOf(key);
      if (breakpointIndex !== -1) {
        const mediaQuery = designTokens.mediaQueries[key as keyof typeof designTokens.mediaQueries];
        acc[mediaQuery] = value;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, string | number>);
  },
  
  // Get color with opacity
  colorWithOpacity: (color: string, opacity: number) => {
    // Convert hex to rgba
    if (color.startsWith('#')) {
      const hex = color.slice(1);
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    // Handle rgba
    if (color.startsWith('rgba')) {
      return color.replace(/rgba\((.+?),\s*[\d.]+\)/, `rgba($1, ${opacity})`);
    }
    // Handle rgb
    if (color.startsWith('rgb')) {
      return color.replace(/rgb\((.+?)\)/, `rgba($1, ${opacity})`);
    }
    return color;
  },
  
  // Get font stack as CSS string
  fontStack: (fontType: 'sans' | 'serif' | 'mono') => {
    return designTokens.typography.fontFamily[fontType].join(', ');
  },
  
  // Create fluid typography that scales between min and max viewport widths
  fluidTypography: (
    minFontSize: number,
    maxFontSize: number,
    minViewportWidth: number = 320,
    maxViewportWidth: number = 1280
  ) => {
    const fontSizeRange = maxFontSize - minFontSize;
    const viewportRange = maxViewportWidth - minViewportWidth;
    const slope = fontSizeRange / viewportRange;
    const yAxisIntersection = -minViewportWidth * slope + minFontSize;
    
    return {
      fontSize: `clamp(${minFontSize}px, ${yAxisIntersection.toFixed(4)}px + ${(slope * 100).toFixed(4)}vw, ${maxFontSize}px)`,
    };
  },
  
  // Create spacing that scales with viewport
  fluidSpacing: (
    minSpace: number,
    maxSpace: number,
    minViewportWidth: number = 320,
    maxViewportWidth: number = 1280
  ) => {
    const spaceRange = maxSpace - minSpace;
    const viewportRange = maxViewportWidth - minViewportWidth;
    const slope = spaceRange / viewportRange;
    const yAxisIntersection = -minViewportWidth * slope + minSpace;
    
    return `clamp(${minSpace}px, ${yAxisIntersection.toFixed(4)}px + ${(slope * 100).toFixed(4)}vw, ${maxSpace}px)`;
  },
};

export default theme;

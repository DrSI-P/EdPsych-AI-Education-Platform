'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ThemeProvider as NextThemesProvider } from 'next-themes'; // Unused import

type AgeGroup = 'nursery' | 'early-primary' | 'late-primary' | 'secondary' | 'professional';
type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading-writing';

interface ThemeContextType {
  ageGroup: AgeGroup;
  setAgeGroup: (ageGroup: AgeGroup) => void;
  learningStyle: LearningStyle;
  setLearningStyle: (style: LearningStyle) => void;
  isHighContrast: boolean;
  setIsHighContrast: (isHighContrast: boolean) => void;
  isReducedMotion: boolean;
  setIsReducedMotion: (isReducedMotion: boolean) => void;
  isDyslexicFont: boolean;
  setIsDyslexicFont: (isDyslexicFont: boolean) => void;
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  themeClass: string;
}

const ThemeContext = createContext<ThemeContextType>({
  ageGroup: 'secondary',
  setAgeGroup: () => {},
  learningStyle: 'visual',
  setLearningStyle: () => {},
  isHighContrast: false,
  setIsHighContrast: () => {},
  isReducedMotion: false,
  setIsReducedMotion: () => {},
  isDyslexicFont: false,
  setIsDyslexicFont: () => {},
  fontSize: 100,
  setFontSize: () => {},
  themeClass: '',
});

export function useTheme() : React.ReactNode {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultAgeGroup?: AgeGroup;
  defaultLearningStyle?: LearningStyle;
}

export function EnhancedThemeProvider(: React.ReactNode {
  children,
  defaultAgeGroup = 'secondary',
  defaultLearningStyle = 'visual',
}: ThemeProviderProps) {
  const [ageGroup, setAgeGroup] = useState<AgeGroup>(defaultAgeGroup);
  const [learningStyle, setLearningStyle] = useState<LearningStyle>(defaultLearningStyle);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [themeClass, setThemeClass] = useState('');

  // Check system preferences for reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Update theme class based on age group
  useEffect(() => {
    let newThemeClass = '';
    
    // Age group classes
    switch (ageGroup) {
      case 'nursery':
        newThemeClass += ' nursery-theme';
        break;
      case 'early-primary':
        newThemeClass += ' early-primary-theme';
        break;
      case 'late-primary':
        newThemeClass += ' late-primary-theme';
        break;
      case 'secondary':
        newThemeClass += ' secondary-theme';
        break;
      case 'professional':
        newThemeClass += ' professional-theme';
        break;
    }
    
    // Learning style classes
    switch (learningStyle) {
      case 'visual':
        newThemeClass += ' visual-learning-style';
        break;
      case 'auditory':
        newThemeClass += ' auditory-learning-style';
        break;
      case 'kinesthetic':
        newThemeClass += ' kinesthetic-learning-style';
        break;
      case 'reading-writing':
        newThemeClass += ' reading-writing-learning-style';
        break;
    }
    
    // Accessibility classes
    if (isHighContrast) newThemeClass += ' high-contrast';
    if (isReducedMotion) newThemeClass += ' reduced-motion';
    if (isDyslexicFont) newThemeClass += ' dyslexic-font';
    
    setThemeClass(newThemeClass);
  }, [ageGroup, learningStyle, isHighContrast, isReducedMotion, isDyslexicFont]);

  // Apply font size to document
  useEffect(() => {
    document.documentElement.style.fontSize = `${fontSize}%`;
  }, [fontSize]);

  // Apply theme background patterns
  useEffect(() => {
    document.body.classList.remove(
      'nursery-theme-bg',
      'early-primary-theme-bg',
      'late-primary-theme-bg',
      'secondary-theme-bg'
    );
    
    switch (ageGroup) {
      case 'nursery':
        document.body.classList.add('nursery-theme-bg');
        break;
      case 'early-primary':
        document.body.classList.add('early-primary-theme-bg');
        break;
      case 'late-primary':
        document.body.classList.add('late-primary-theme-bg');
        break;
      case 'secondary':
      case 'professional':
        document.body.classList.add('secondary-theme-bg');
        break;
    }
  }, [ageGroup]);

  return (
    <ThemeContext.Provider
      value={{
        ageGroup,
        setAgeGroup,
        learningStyle,
        setLearningStyle,
        isHighContrast,
        setIsHighContrast,
        isReducedMotion,
        setIsReducedMotion,
        isDyslexicFont,
        setIsDyslexicFont,
        fontSize,
        setFontSize,
        themeClass,
      }}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className={themeClass} style={{ fontSize: `${fontSize}%` }}>
          {children}
        </div>
      </NextThemesProvider>
    </ThemeContext.Provider>
  );
}

export default EnhancedThemeProvider;

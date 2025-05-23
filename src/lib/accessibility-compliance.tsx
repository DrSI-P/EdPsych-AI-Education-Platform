/**
 * Accessibility Compliance Module for EdPsych AI Education Platform
 * Implements WCAG 2.1 AA compliance features and utilities
 */

import { useEffect, useState, useCallback } from 'react';

/**
 * Accessibility preference types
 */
export enum AccessibilityPreference {
  HIGH_CONTRAST = 'high_contrast',
  REDUCED_MOTION = 'reduced_motion',
  LARGE_TEXT = 'large_text',
  SCREEN_READER_OPTIMIZED = 'screen_reader_optimized',
  KEYBOARD_NAVIGATION = 'keyboard_navigation',
  SIMPLIFIED_INTERFACE = 'simplified_interface',
}

/**
 * Interface for accessibility settings
 */
export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  largeText: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  simplifiedInterface: boolean;
  textSpacing: number; // 1-3 scale
  lineHeight: number; // 1-3 scale
  fontFamily: 'default' | 'dyslexic' | 'sans-serif' | 'serif';
  colorFilters: 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia' | 'grayscale';
}

/**
 * Default accessibility settings
 */
export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  largeText: false,
  screenReaderOptimized: false,
  keyboardNavigation: true,
  simplifiedInterface: false,
  textSpacing: 1,
  lineHeight: 1,
  fontFamily: 'default',
  colorFilters: 'none',
};

/**
 * Hook for managing accessibility settings
 * @returns Accessibility settings and functions to manage them
 */
export function useAccessibilitySettings() {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS);
  const [initialized, setInitialized] = useState(false);

  // Load settings from localStorage on initial render
  useEffect(() => {
    if (typeof window !== 'undefined' && !initialized) {
      const savedSettings = localStorage.getItem('accessibilitySettings');
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          setSettings(parsedSettings);
        } catch (error) {
          console.error('Error parsing accessibility settings:', error);
        }
      } else {
        // Check for system preferences if no saved settings
        detectSystemPreferences();
      }
      setInitialized(true);
    }
  }, [initialized]);

  // Apply settings to document when they change
  useEffect(() => {
    if (initialized) {
      applyAccessibilitySettings(settings);
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    }
  }, [settings, initialized]);

  /**
   * Detect system accessibility preferences
   */
  const detectSystemPreferences = useCallback(() => {
    if (typeof window === 'undefined') return;

    const newSettings = { ...DEFAULT_ACCESSIBILITY_SETTINGS };

    // Check for prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      newSettings.reducedMotion = true;
    }

    // Check for prefers-contrast
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      newSettings.highContrast = true;
    }

    // Check for prefers-color-scheme
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // Dark mode preference might influence contrast settings
    }

    setSettings(newSettings);
  }, []);

  /**
   * Update a single accessibility setting
   * @param key Setting key to update
   * @param value New value for the setting
   */
  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  /**
   * Reset all settings to defaults
   */
  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  }, []);

  /**
   * Apply current accessibility settings to the document
   * @param currentSettings Settings to apply
   */
  const applyAccessibilitySettings = useCallback((currentSettings: AccessibilitySettings) => {
    if (typeof document === 'undefined') return;

    const root = document.documentElement;

    // Apply high contrast
    if (currentSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (currentSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Apply large text
    if (currentSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Apply screen reader optimizations
    if (currentSettings.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }

    // Apply keyboard navigation
    if (currentSettings.keyboardNavigation) {
      root.classList.add('keyboard-navigation');
    } else {
      root.classList.remove('keyboard-navigation');
    }

    // Apply simplified interface
    if (currentSettings.simplifiedInterface) {
      root.classList.add('simplified-interface');
    } else {
      root.classList.remove('simplified-interface');
    }

    // Apply text spacing
    root.style.setProperty('--text-spacing', `${currentSettings.textSpacing * 0.05 + 0.05}em`);

    // Apply line height
    root.style.setProperty('--line-height', `${currentSettings.lineHeight * 0.5 + 1.5}`);

    // Apply font family
    switch (currentSettings.fontFamily) {
      case 'dyslexic':
        root.style.setProperty('--font-family', '"OpenDyslexic", sans-serif');
        break;
      case 'sans-serif':
        root.style.setProperty('--font-family', 'Arial, Helvetica, sans-serif');
        break;
      case 'serif':
        root.style.setProperty('--font-family', 'Georgia, "Times New Roman", serif');
        break;
      default:
        root.style.setProperty('--font-family', 'var(--font-sans)');
        break;
    }

    // Apply color filters
    switch (currentSettings.colorFilters) {
      case 'deuteranopia':
        root.style.setProperty('--color-filter', 'url(#deuteranopia-filter)');
        break;
      case 'protanopia':
        root.style.setProperty('--color-filter', 'url(#protanopia-filter)');
        break;
      case 'tritanopia':
        root.style.setProperty('--color-filter', 'url(#tritanopia-filter)');
        break;
      case 'grayscale':
        root.style.setProperty('--color-filter', 'grayscale(1)');
        break;
      default:
        root.style.setProperty('--color-filter', 'none');
        break;
    }
  }, []);

  return {
    settings,
    updateSetting,
    resetSettings,
    detectSystemPreferences,
  };
}

/**
 * Utility function to check if an element is keyboard navigable
 * @param element Element to check
 * @returns Whether the element is keyboard navigable
 */
export function isKeyboardNavigable(element: HTMLElement): boolean {
  const tabIndex = element.getAttribute('tabindex');
  const tagName = element.tagName.toLowerCase();
  
  // Elements that are natively keyboard navigable
  const navigableTags = ['a', 'button', 'input', 'select', 'textarea'];
  
  // Check if element has a valid tabindex
  if (tabIndex !== null) {
    const tabIndexValue = parseInt(tabIndex, 10);
    return !isNaN(tabIndexValue) && tabIndexValue >= 0;
  }
  
  // Check if element is a natively navigable element
  return navigableTags.includes(tagName);
}

/**
 * Utility function to check if an element has proper ARIA attributes
 * @param element Element to check
 * @returns Object with validation results
 */
export function validateAriaAttributes(element: HTMLElement): {
  valid: boolean;
  issues: string[];
} {
  const issues: string[] = [];
  
  // Check for required ARIA attributes based on role
  const role = element.getAttribute('role');
  if (role) {
    switch (role) {
      case 'button':
        if (!element.hasAttribute('aria-pressed') && element.tagName.toLowerCase() !== 'button') {
          issues.push('Button role should have aria-pressed attribute');
        }
        break;
      case 'checkbox':
        if (!element.hasAttribute('aria-checked')) {
          issues.push('Checkbox role should have aria-checked attribute');
        }
        break;
      case 'combobox':
        if (!element.hasAttribute('aria-expanded')) {
          issues.push('Combobox role should have aria-expanded attribute');
        }
        break;
      // Add more role-specific checks as needed
    }
  }
  
  // Check for proper labeling
  if (
    !element.hasAttribute('aria-label') &&
    !element.hasAttribute('aria-labelledby') &&
    element.tagName.toLowerCase() !== 'label' &&
    !element.querySelector('label')
  ) {
    const hasVisibleText = element.textContent && element.textContent.trim().length > 0;
    if (!hasVisibleText && element.tagName.toLowerCase() !== 'img') {
      issues.push('Interactive element should have an accessible label');
    }
  }
  
  // Check for proper descriptions
  if (element.hasAttribute('aria-describedby')) {
    const describedById = element.getAttribute('aria-describedby');
    if (describedById && !document.getElementById(describedById)) {
      issues.push(`aria-describedby references non-existent element: ${describedById}`);
    }
  }
  
  return {
    valid: issues.length === 0,
    issues,
  };
}

/**
 * Utility function to check color contrast
 * @param foreground Foreground color in hex format
 * @param background Background color in hex format
 * @returns Contrast ratio and WCAG compliance level
 */
export function checkColorContrast(
  foreground: string,
  background: string
): {
  ratio: number;
  AA_normal_text: boolean;
  AA_large_text: boolean;
  AAA_normal_text: boolean;
  AAA_large_text: boolean;
} {
  // Convert hex to RGB
  const hexToRgb = (hex: string): number[] => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const fullHex = hex.replace(shorthandRegex, (_, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
    return result
      ? [
          parseInt(result[1], 16),
          parseInt(result[2], 16),
          parseInt(result[3], 16),
        ]
      : [0, 0, 0];
  };

  // Calculate relative luminance
  const calculateLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map((c) => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const rgb1 = hexToRgb(foreground);
  const rgb2 = hexToRgb(background);
  
  const l1 = calculateLuminance(rgb1);
  const l2 = calculateLuminance(rgb2);
  
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  
  return {
    ratio,
    AA_normal_text: ratio >= 4.5,
    AA_large_text: ratio >= 3,
    AAA_normal_text: ratio >= 7,
    AAA_large_text: ratio >= 4.5,
  };
}

/**
 * Utility function to add keyboard navigation to an element
 * @param element Element to enhance
 */
export function enhanceKeyboardNavigation(element: HTMLElement): void {
  // Skip if element is already keyboard navigable
  if (isKeyboardNavigable(element)) return;
  
  // Make the element focusable
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }
  
  // Add keyboard event listeners
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      element.click();
    }
  });
  
  // Add visual focus indicator
  element.classList.add('keyboard-focus-target');
}

/**
 * Utility function to scan a DOM subtree for accessibility issues
 * @param rootElement Root element to scan
 * @returns List of accessibility issues
 */
export function scanForAccessibilityIssues(rootElement: HTMLElement): {
  element: HTMLElement;
  issue: string;
}[] {
  const issues: { element: HTMLElement; issue: string }[] = [];
  
  // Check for images without alt text
  const images = rootElement.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.hasAttribute('alt')) {
      issues.push({
        element: img as HTMLElement,
        issue: 'Image missing alt text',
      });
    }
  });
  
  // Check for form controls without labels
  const formControls = rootElement.querySelectorAll('input, select, textarea');
  formControls.forEach((control) => {
    const id = control.getAttribute('id');
    if (id) {
      const label = rootElement.querySelector(`label[for="${id}"]`);
      if (!label && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
        issues.push({
          element: control as HTMLElement,
          issue: 'Form control missing label',
        });
      }
    } else {
      // Check if control is wrapped in a label
      const parentLabel = control.closest('label');
      if (!parentLabel && !control.hasAttribute('aria-label') && !control.hasAttribute('aria-labelledby')) {
        issues.push({
          element: control as HTMLElement,
          issue: 'Form control missing label and id',
        });
      }
    }
  });
  
  // Check for interactive elements without keyboard access
  const interactiveElements = rootElement.querySelectorAll('[onclick], [role="button"], [role="link"]');
  interactiveElements.forEach((element) => {
    if (!isKeyboardNavigable(element as HTMLElement)) {
      issues.push({
        element: element as HTMLElement,
        issue: 'Interactive element not keyboard accessible',
      });
    }
  });
  
  // Check heading hierarchy
  let previousLevel = 0;
  const headings = rootElement.querySelectorAll('h1, h2, h3, h4, h5, h6');
  headings.forEach((heading) => {
    const currentLevel = parseInt(heading.tagName.charAt(1), 10);
    if (previousLevel > 0 && currentLevel > previousLevel + 1) {
      issues.push({
        element: heading as HTMLElement,
        issue: `Heading level skipped from h${previousLevel} to h${currentLevel}`,
      });
    }
    previousLevel = currentLevel;
  });
  
  // Check for proper ARIA attributes
  const ariaElements = rootElement.querySelectorAll('[role], [aria-*]');
  ariaElements.forEach((element) => {
    const validation = validateAriaAttributes(element as HTMLElement);
    if (!validation.valid) {
      validation.issues.forEach((issue) => {
        issues.push({
          element: element as HTMLElement,
          issue,
        });
      });
    }
  });
  
  return issues;
}

/**
 * Component props for the AccessibilityFilters SVG component
 */
export interface AccessibilityFiltersProps {
  id?: string;
}

/**
 * SVG component that provides color filters for color blindness
 * To be included once in the application layout
 */
export function AccessibilityFilters({ id = 'accessibility-filters' }: AccessibilityFiltersProps) {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
    >
      <defs>
        <filter id="deuteranopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.625 0.375 0 0 0
                    0.7 0.3 0 0 0
                    0 0.3 0.7 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="protanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.567 0.433 0 0 0
                    0.558 0.442 0 0 0
                    0 0.242 0.758 0 0
                    0 0 0 1 0"
          />
        </filter>
        <filter id="tritanopia-filter">
          <feColorMatrix
            in="SourceGraphic"
            type="matrix"
            values="0.95 0.05 0 0 0
                    0 0.433 0.567 0 0
                    0 0.475 0.525 0 0
                    0 0 0 1 0"
          />
        </filter>
      </defs>
    </svg>
  );
}

/**
 * Hook for managing focus trap within a component
 * @param active Whether the focus trap is active
 * @param rootRef Reference to the root element to trap focus within
 */
export function useFocusTrap(active: boolean, rootRef: React.RefObject<HTMLElement>) {
  useEffect(() => {
    if (!active || !rootRef.current) return;

    // Store the element that had focus before trapping
    const previousFocus = document.activeElement as HTMLElement;

    // Find all focusable elements within the root
    const getFocusableElements = () => {
      const focusableSelectors = [
        'a[href]:not([disabled])',
        'button:not([disabled])',
        'textarea:not([disabled])',
        'input:not([disabled])',
        'select:not([disabled])',
        '[tabindex]:not([tabindex="-1"])',
      ];
      
      return Array.from(
        rootRef.current?.querySelectorAll(focusableSelectors.join(',')) || []
      ) as HTMLElement[];
    };

    const focusableElements = getFocusableElements();
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when trap is activated
    if (firstElement) {
      firstElement.focus();
    }

    // Handle tab key to keep focus within the container
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (event.shiftKey) {
        // If shift+tab and on first element, move to last element
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement?.focus();
        }
      } else {
        // If tab and on last element, move to first element
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement?.focus();
        }
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Restore focus when trap is deactivated
      if (active) {
        previousFocus?.focus();
      }
    };
  }, [active, rootRef]);
}

/**
 * Hook for managing skip links for keyboard navigation
 * @returns Functions to create and manage skip links
 */
export function useSkipLinks() {
  // Add a skip link to the page
  const addSkipLink = useCallback((targetId: string, label: string) => {
    if (typeof document === 'undefined') return;

    // Check if skip link already exists
    const existingLink = document.querySelector(`a[href="#${targetId}"]`);
    if (existingLink) return;

    // Create skip link
    const skipLink = document.createElement('a');
    skipLink.href = `#${targetId}`;
    skipLink.className = 'skip-link';
    skipLink.textContent = label;
    
    // Add to document
    document.body.insertBefore(skipLink, document.body.firstChild);
  }, []);

  // Initialize common skip links
  useEffect(() => {
    if (typeof document === 'undefined') return;

    // Add common skip links
    addSkipLink('main-content', 'Skip to main content');
    addSkipLink('nav', 'Skip to navigation');
    
    // Ensure target elements have proper IDs and tabindex
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.id) {
      mainContent.id = 'main-content';
      if (!mainContent.hasAttribute('tabindex')) {
        mainContent.setAttribute('tabindex', '-1');
      }
    }
    
    const nav = document.querySelector('nav');
    if (nav && !nav.id) {
      nav.id = 'nav';
      if (!nav.hasAttribute('tabindex')) {
        nav.setAttribute('tabindex', '-1');
      }
    }
  }, [addSkipLink]);

  return { addSkipLink };
}

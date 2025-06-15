// WCAG 2.1 Level AA Compliance Utilities

export const AriaRoles = {
  // Landmark roles
  MAIN: 'main',
  NAVIGATION: 'navigation',
  BANNER: 'banner',
  CONTENTINFO: 'contentinfo',
  COMPLEMENTARY: 'complementary',
  SEARCH: 'search',
  
  // Widget roles
  BUTTON: 'button',
  LINK: 'link',
  CHECKBOX: 'checkbox',
  DIALOG: 'dialog',
  ALERT: 'alert',
  ALERTDIALOG: 'alertdialog',
  PROGRESSBAR: 'progressbar',
  STATUS: 'status',
  TAB: 'tab',
  TABLIST: 'tablist',
  TABPANEL: 'tabpanel',
  
  // Document structure
  ARTICLE: 'article',
  HEADING: 'heading',
  LIST: 'list',
  LISTITEM: 'listitem',
  FORM: 'form',
  REGION: 'region',
} as const;

export const AriaAttributes = {
  // States
  CHECKED: 'aria-checked',
  DISABLED: 'aria-disabled',
  EXPANDED: 'aria-expanded',
  HIDDEN: 'aria-hidden',
  INVALID: 'aria-invalid',
  PRESSED: 'aria-pressed',
  SELECTED: 'aria-selected',
  
  // Properties
  LABEL: 'aria-label',
  LABELLEDBY: 'aria-labelledby',
  DESCRIBEDBY: 'aria-describedby',
  CONTROLS: 'aria-controls',
  LIVE: 'aria-live',
  ATOMIC: 'aria-atomic',
  RELEVANT: 'aria-relevant',
  BUSY: 'aria-busy',
  
  // Relationships
  OWNS: 'aria-owns',
  FLOWTO: 'aria-flowto',
  CURRENT: 'aria-current',
} as const;

// Keyboard navigation utilities
export const KeyboardKeys = {
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  HOME: 'Home',
  END: 'End',
  PAGE_UP: 'PageUp',
  PAGE_DOWN: 'PageDown',
} as const;

// Focus management utilities
export class FocusManager {
  private static focusableElements = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');
  
  static getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(container.querySelectorAll(this.focusableElements));
  }
  
  static trapFocus(container: HTMLElement) {
    const focusableElements = this.getFocusableElements(container);
    if (focusableElements.length === 0) return;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== KeyboardKeys.TAB) return;
      
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };
    
    container.addEventListener('keydown', handleKeyDown);
    firstElement.focus();
    
    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }
  
  static restoreFocus(previouslyFocused: HTMLElement | null) {
    if (previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
    }
  }
}

// Screen reader announcements
export class ScreenReaderAnnouncer {
  private static announcer: HTMLElement | null = null;
  
  static init() {
    if (typeof document === 'undefined') return;
    
    if (!this.announcer) {
      this.announcer = document.createElement('div');
      this.announcer.setAttribute('role', 'status');
      this.announcer.setAttribute('aria-live', 'polite');
      this.announcer.setAttribute('aria-atomic', 'true');
      this.announcer.style.cssText = `
        position: absolute;
        left: -10000px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
      document.body.appendChild(this.announcer);
    }
  }
  
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite') {
    if (!this.announcer) this.init();
    if (!this.announcer) return;
    
    this.announcer.setAttribute('aria-live', priority);
    this.announcer.textContent = message;
    
    // Clear after announcement
    setTimeout(() => {
      if (this.announcer) {
        this.announcer.textContent = '';
      }
    }, 1000);
  }
  
  static destroy() {
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer);
      this.announcer = null;
    }
  }
}

// Color contrast utilities
export class ColorContrastChecker {
  static getLuminance(r: number, g: number, b: number): number {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  }
  
  static getContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);
    
    if (!rgb1 || !rgb2) return 0;
    
    const lum1 = this.getLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = this.getLuminance(rgb2.r, rgb2.g, rgb2.b);
    
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    
    return (brightest + 0.05) / (darkest + 0.05);
  }
  
  static hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  }
  
  static meetsWCAGAA(ratio: number, isLargeText: boolean = false): boolean {
    return isLargeText ? ratio >= 3 : ratio >= 4.5;
  }
  
  static meetsWCAGAAA(ratio: number, isLargeText: boolean = false): boolean {
    return isLargeText ? ratio >= 4.5 : ratio >= 7;
  }
}

// Skip navigation link utilities
export function createSkipLink(targetId: string, text: string = 'Skip to main content'): HTMLAnchorElement {
  const link = document.createElement('a');
  link.href = `#${targetId}`;
  link.textContent = text;
  link.className = 'skip-link';
  link.style.cssText = `
    position: absolute;
    left: -9999px;
    z-index: 999;
    padding: 1em;
    background-color: #000;
    color: #fff;
    text-decoration: none;
  `;
  
  link.addEventListener('focus', () => {
    link.style.left = '50%';
    link.style.transform = 'translateX(-50%)';
  });
  
  link.addEventListener('blur', () => {
    link.style.left = '-9999px';
    link.style.transform = 'none';
  });
  
  return link;
}

// High contrast mode detection
export function isHighContrastMode(): boolean {
  if (typeof window === 'undefined') return false;
  
  const testElement = document.createElement('div');
  testElement.style.borderWidth = '1px';
  testElement.style.borderStyle = 'solid';
  testElement.style.borderTopColor = 'rgb(1, 2, 3)';
  testElement.style.borderBottomColor = 'rgb(4, 5, 6)';
  testElement.style.position = 'absolute';
  testElement.style.height = '0px';
  testElement.style.visibility = 'hidden';
  
  document.body.appendChild(testElement);
  const styles = window.getComputedStyle(testElement);
  const isHighContrast = styles.borderTopColor === styles.borderBottomColor;
  document.body.removeChild(testElement);
  
  return isHighContrast;
}

// Reduced motion preference
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Text spacing utilities for dyslexia support
export const DyslexiaFriendlyStyles = {
  letterSpacing: '0.12em',
  wordSpacing: '0.16em',
  lineHeight: '1.5',
  paragraphSpacing: '2em',
  fontFamily: 'Arial, Helvetica, sans-serif', // Sans-serif fonts are easier to read
};

// Accessibility validation
export function validateAccessibility(element: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Check for alt text on images
  const images = element.querySelectorAll('img');
  images.forEach((img) => {
    if (!img.getAttribute('alt')) {
      issues.push(`Image missing alt text: ${img.src}`);
    }
  });
  
  // Check for form labels
  const inputs = element.querySelectorAll('input, select, textarea');
  inputs.forEach((input) => {
    const id = input.getAttribute('id');
    if (!id || !element.querySelector(`label[for="${id}"]`)) {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        issues.push(`Form element missing label: ${input.outerHTML.substring(0, 50)}...`);
      }
    }
  });
  
  // Check for heading hierarchy
  const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
  let lastLevel = 0;
  headings.forEach((heading) => {
    const level = parseInt(heading.tagName[1]);
    if (level - lastLevel > 1) {
      issues.push(`Heading hierarchy broken: ${heading.tagName} after H${lastLevel}`);
    }
    lastLevel = level;
  });
  
  // Check for color contrast (basic check)
  const elementsWithColor = element.querySelectorAll('[style*="color"]');
  elementsWithColor.forEach((el) => {
    const style = window.getComputedStyle(el as HTMLElement);
    const bgColor = style.backgroundColor;
    const textColor = style.color;
    
    if (bgColor !== 'transparent' && textColor) {
      // This is a simplified check - in production, use a proper contrast checker
      issues.push(`Check color contrast for element: ${el.tagName}`);
    }
  });
  
  return issues;
}
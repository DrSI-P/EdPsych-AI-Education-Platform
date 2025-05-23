/**
 * UI Component Testing Utilities for EdPsych AI Education Platform
 * 
 * This module provides specialized testing utilities for validating
 * UI components across the platform, focusing on rendering, styling,
 * and interaction patterns.
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { logger } from '../../../logging';

// Component test result interface
export interface ComponentTestResult {
  name: string;
  success: boolean;
  renderTime: number;
  accessibilityViolations: number;
  stylingIssues: number;
  interactionIssues: number;
  errors?: string[];
  warnings?: string[];
}

// Component test options interface
export interface ComponentTestOptions {
  testAccessibility?: boolean;
  testStyling?: boolean;
  testInteractions?: boolean;
  expectedProps?: Record<string, any>;
  expectedChildren?: boolean;
  expectedEventHandlers?: string[];
}

// Default component test options
const defaultComponentTestOptions: ComponentTestOptions = {
  testAccessibility: true,
  testStyling: true,
  testInteractions: true,
  expectedChildren: true,
};

/**
 * Tests a React component for rendering, accessibility, styling, and interactions
 * @param Component React component to test
 * @param props Props to pass to the component
 * @param options Test options
 * @returns Component test result
 */
export async function testComponent(
  Component: React.ComponentType<any>,
  props: Record<string, any> = {},
  options: ComponentTestOptions = {}
): Promise<ComponentTestResult> {
  try {
    // Merge with default options
    const fullOptions: ComponentTestOptions = {
      ...defaultComponentTestOptions,
      ...options,
    };
    
    logger.info('Testing component', {
      component: Component.displayName || Component.name,
      props,
      options: fullOptions,
    });
    
    const errors: string[] = [];
    const warnings: string[] = [];
    
    // Measure render time
    const startTime = performance.now();
    const { container } = render(<Component {...props} />);
    const renderTime = performance.now() - startTime;
    
    // Test accessibility if enabled
    let accessibilityViolations = 0;
    if (fullOptions.testAccessibility) {
      try {
        const results = await axe(container);
        accessibilityViolations = results.violations.length;
        
        if (accessibilityViolations > 0) {
          results.violations.forEach(violation => {
            errors.push(`Accessibility violation: ${violation.description} (${violation.impact} impact)`);
          });
        }
      } catch (error) {
        warnings.push(`Accessibility testing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Test styling if enabled
    let stylingIssues = 0;
    if (fullOptions.testStyling) {
      try {
        // Check for basic styling issues
        const stylingErrors = checkStylingIssues(container);
        stylingIssues = stylingErrors.length;
        
        if (stylingIssues > 0) {
          stylingErrors.forEach(error => {
            warnings.push(`Styling issue: ${error}`);
          });
        }
      } catch (error) {
        warnings.push(`Styling testing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Test interactions if enabled
    let interactionIssues = 0;
    if (fullOptions.testInteractions) {
      try {
        // Check for interactive elements and test basic interactions
        const interactionErrors = await testInteractions(container);
        interactionIssues = interactionErrors.length;
        
        if (interactionIssues > 0) {
          interactionErrors.forEach(error => {
            errors.push(`Interaction issue: ${error}`);
          });
        }
      } catch (error) {
        warnings.push(`Interaction testing failed: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Check expected props if provided
    if (fullOptions.expectedProps) {
      for (const [key, value] of Object.entries(fullOptions.expectedProps)) {
        if (props[key] !== value) {
          errors.push(`Expected prop "${key}" to be ${value}, but got ${props[key]}`);
        }
      }
    }
    
    // Check for children if expected
    if (fullOptions.expectedChildren && !props.children && !container.hasChildNodes()) {
      warnings.push('Component expected to have children, but none were provided or rendered');
    }
    
    // Check for expected event handlers
    if (fullOptions.expectedEventHandlers) {
      for (const handler of fullOptions.expectedEventHandlers) {
        const handlerProp = `on${handler.charAt(0).toUpperCase()}${handler.slice(1)}`;
        if (!props[handlerProp]) {
          warnings.push(`Expected event handler "${handlerProp}" not provided`);
        }
      }
    }
    
    // Create test result
    const result: ComponentTestResult = {
      name: Component.displayName || Component.name,
      success: errors.length === 0,
      renderTime,
      accessibilityViolations,
      stylingIssues,
      interactionIssues,
      errors: errors.length > 0 ? errors : undefined,
      warnings: warnings.length > 0 ? warnings : undefined,
    };
    
    // Log results
    if (result.success) {
      logger.info('Component test passed', {
        component: result.name,
        renderTime: result.renderTime,
        warnings: result.warnings?.length || 0,
      });
    } else {
      logger.warn('Component test found issues', {
        component: result.name,
        errors: result.errors?.length || 0,
        warnings: result.warnings?.length || 0,
      });
    }
    
    return result;
  } catch (error) {
    logger.error('Component test failed', { error });
    
    return {
      name: Component.displayName || Component.name,
      success: false,
      renderTime: 0,
      accessibilityViolations: 0,
      stylingIssues: 0,
      interactionIssues: 0,
      errors: [error instanceof Error ? error.message : String(error)],
    };
  }
}

/**
 * Checks for styling issues in a component
 * @param container Component container
 * @returns Array of styling issues
 */
function checkStylingIssues(container: HTMLElement): string[] {
  const issues: string[] = [];
  
  // Check for inline styles (generally discouraged)
  const elementsWithInlineStyles = container.querySelectorAll('[style]');
  if (elementsWithInlineStyles.length > 0) {
    issues.push(`Found ${elementsWithInlineStyles.length} elements with inline styles`);
  }
  
  // Check for potentially problematic font sizes (too small)
  const computedStyles = window.getComputedStyle(container);
  const fontSize = parseFloat(computedStyles.fontSize);
  if (fontSize < 12) {
    issues.push(`Font size is too small: ${fontSize}px (should be at least 12px)`);
  }
  
  // Check for potentially problematic line heights (too tight)
  const lineHeight = parseFloat(computedStyles.lineHeight);
  if (lineHeight < 1.2) {
    issues.push(`Line height is too tight: ${lineHeight} (should be at least 1.2)`);
  }
  
  // Check for potentially problematic text colors (contrast issues)
  const color = computedStyles.color;
  const backgroundColor = computedStyles.backgroundColor;
  
  // This is a simplified check - a real implementation would calculate contrast ratio
  if (color === backgroundColor) {
    issues.push('Text color matches background color, causing visibility issues');
  }
  
  return issues;
}

/**
 * Tests interactions for a component
 * @param container Component container
 * @returns Array of interaction issues
 */
async function testInteractions(container: HTMLElement): Promise<string[]> {
  const issues: string[] = [];
  
  // Find interactive elements
  const buttons = container.querySelectorAll('button');
  const links = container.querySelectorAll('a');
  const inputs = container.querySelectorAll('input');
  const selects = container.querySelectorAll('select');
  const textareas = container.querySelectorAll('textarea');
  
  // Test button clicks
  for (const button of Array.from(buttons)) {
    try {
      fireEvent.click(button);
    } catch (error) {
      issues.push(`Button click failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Test link clicks (prevent default to avoid navigation)
  for (const link of Array.from(links)) {
    try {
      fireEvent.click(link, { preventDefault: jest.fn() });
    } catch (error) {
      issues.push(`Link click failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Test input changes
  for (const input of Array.from(inputs)) {
    try {
      const type = input.getAttribute('type') || 'text';
      
      switch (type) {
        case 'text':
        case 'email':
        case 'password':
        case 'search':
        case 'tel':
        case 'url':
          fireEvent.change(input, { target: { value: 'Test value' } });
          break;
        case 'checkbox':
        case 'radio':
          fireEvent.click(input);
          break;
        case 'number':
          fireEvent.change(input, { target: { value: '42' } });
          break;
        case 'date':
          fireEvent.change(input, { target: { value: '2025-05-23' } });
          break;
      }
    } catch (error) {
      issues.push(`Input interaction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Test select changes
  for (const select of Array.from(selects)) {
    try {
      // Find the first option
      const option = select.querySelector('option');
      if (option) {
        fireEvent.change(select, { target: { value: option.value } });
      }
    } catch (error) {
      issues.push(`Select interaction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  // Test textarea changes
  for (const textarea of Array.from(textareas)) {
    try {
      fireEvent.change(textarea, { target: { value: 'Test content for textarea' } });
    } catch (error) {
      issues.push(`Textarea interaction failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  
  return issues;
}

/**
 * Tests a component for responsive behavior
 * @param Component React component to test
 * @param props Props to pass to the component
 * @param breakpoints Breakpoints to test (in pixels)
 * @returns Test results for each breakpoint
 */
export async function testResponsiveComponent(
  Component: React.ComponentType<any>,
  props: Record<string, any> = {},
  breakpoints: number[] = [320, 768, 1024, 1440]
): Promise<Record<number, ComponentTestResult>> {
  const results: Record<number, ComponentTestResult> = {};
  
  // Test component at each breakpoint
  for (const width of breakpoints) {
    // Set viewport width
    Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: width });
    window.dispatchEvent(new Event('resize'));
    
    // Test component
    const result = await testComponent(Component, props);
    results[width] = result;
  }
  
  return results;
}

/**
 * Tests a component with different themes or variants
 * @param Component React component to test
 * @param baseProps Base props to pass to the component
 * @param variants Object mapping variant names to prop overrides
 * @returns Test results for each variant
 */
export async function testComponentVariants(
  Component: React.ComponentType<any>,
  baseProps: Record<string, any> = {},
  variants: Record<string, Record<string, any>> = {}
): Promise<Record<string, ComponentTestResult>> {
  const results: Record<string, ComponentTestResult> = {};
  
  // Test base component
  results.base = await testComponent(Component, baseProps);
  
  // Test each variant
  for (const [variantName, variantProps] of Object.entries(variants)) {
    const props = { ...baseProps, ...variantProps };
    results[variantName] = await testComponent(Component, props);
  }
  
  return results;
}

/**
 * Tests a component for performance issues
 * @param Component React component to test
 * @param props Props to pass to the component
 * @param iterations Number of render iterations
 * @returns Performance test results
 */
export function testComponentPerformance(
  Component: React.ComponentType<any>,
  props: Record<string, any> = {},
  iterations: number = 100
): {
  averageRenderTime: number;
  minRenderTime: number;
  maxRenderTime: number;
  totalTime: number;
} {
  const renderTimes: number[] = [];
  
  // Render component multiple times and measure performance
  for (let i = 0; i < iterations; i++) {
    const startTime = performance.now();
    const { unmount } = render(<Component {...props} />);
    const endTime = performance.now();
    
    renderTimes.push(endTime - startTime);
    unmount();
  }
  
  // Calculate statistics
  const totalTime = renderTimes.reduce((sum, time) => sum + time, 0);
  const averageRenderTime = totalTime / iterations;
  const minRenderTime = Math.min(...renderTimes);
  const maxRenderTime = Math.max(...renderTimes);
  
  return {
    averageRenderTime,
    minRenderTime,
    maxRenderTime,
    totalTime,
  };
}

// Export default
export default {
  testComponent,
  testResponsiveComponent,
  testComponentVariants,
  testComponentPerformance,
};

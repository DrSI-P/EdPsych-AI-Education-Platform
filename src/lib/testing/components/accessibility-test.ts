/**
 * Accessibility Testing Components for EdPsych AI Education Platform
 * 
 * This module provides specialized testing utilities for validating
 * accessibility compliance across the platform, focusing on WCAG 2.1 AA
 * standards and UK educational requirements.
 */

import { Page } from 'playwright';
import { AxeBuilder } from '@axe-core/playwright';
import { logger } from '../../logging';

// Accessibility violation interface
export interface AccessibilityViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  description: string;
  helpUrl: string;
  nodes: {
    html: string;
    target: string[];
    failureSummary: string;
  }[];
}

// Accessibility test result interface
export interface AccessibilityTestResult {
  url: string;
  timestamp: Date;
  violations: AccessibilityViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  wcagLevel: 'A' | 'AA' | 'AAA';
  success: boolean;
}

// Accessibility test options interface
export interface AccessibilityTestOptions {
  rules?: {
    [key: string]: 'off' | 'warn' | 'error';
  };
  wcagLevel?: 'A' | 'AA' | 'AAA';
  includedImpacts?: ('minor' | 'moderate' | 'serious' | 'critical')[];
  excludeHidden?: boolean;
}

// Default accessibility test options
const defaultAccessibilityTestOptions: AccessibilityTestOptions = {
  wcagLevel: 'AA',
  includedImpacts: ['moderate', 'serious', 'critical'],
  excludeHidden: true,
};

/**
 * Runs an accessibility audit on a page
 * @param page Playwright page object
 * @param options Accessibility test options
 * @returns Accessibility test result
 */
export async function runAccessibilityAudit(
  page: Page,
  options: AccessibilityTestOptions = {}
): Promise<AccessibilityTestResult> {
  try {
    // Merge with default options
    const fullOptions: AccessibilityTestOptions = {
      ...defaultAccessibilityTestOptions,
      ...options,
    };
    
    logger.info('Running accessibility audit', {
      url: page.url(),
      options: fullOptions,
    });
    
    // Configure Axe
    let axeBuilder = new AxeBuilder({ page })
      .withTags([`wcag${fullOptions.wcagLevel}`])
      .exclude('iframe[src*="youtube.com"]') // Exclude third-party content
      .exclude('iframe[src*="vimeo.com"]');
    
    // Apply rule configurations if provided
    if (fullOptions.rules) {
      for (const [rule, state] of Object.entries(fullOptions.rules)) {
        if (state === 'off') {
          axeBuilder = axeBuilder.disableRules([rule]);
        }
      }
    }
    
    // Run the audit
    const results = await axeBuilder.analyze();
    
    // Filter violations by impact if needed
    let filteredViolations = results.violations;
    if (fullOptions.includedImpacts && fullOptions.includedImpacts.length > 0) {
      filteredViolations = results.violations.filter(violation => 
        fullOptions.includedImpacts?.includes(violation.impact as any)
      );
    }
    
    // Create test result
    const testResult: AccessibilityTestResult = {
      url: page.url(),
      timestamp: new Date(),
      violations: filteredViolations,
      passes: results.passes.length,
      incomplete: results.incomplete.length,
      inapplicable: results.inapplicable.length,
      wcagLevel: fullOptions.wcagLevel || 'AA',
      success: filteredViolations.length === 0,
    };
    
    // Log results
    if (testResult.success) {
      logger.info('Accessibility audit passed', {
        url: testResult.url,
        passes: testResult.passes,
      });
    } else {
      logger.warn('Accessibility audit found violations', {
        url: testResult.url,
        violations: testResult.violations.length,
        passes: testResult.passes,
      });
    }
    
    return testResult;
  } catch (error) {
    logger.error('Accessibility audit failed', { error });
    throw new Error(`Accessibility audit failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Tests keyboard navigation on a page
 * @param page Playwright page object
 * @returns Test result
 */
export async function testKeyboardNavigation(page: Page): Promise<{
  success: boolean;
  focusableElements: number;
  unreachableElements: number;
  tabOrder: { selector: string; text: string }[];
}> {
  try {
    logger.info('Testing keyboard navigation', { url: page.url() });
    
    // Get all focusable elements
    const focusableElements = await page.evaluate(() => {
      const selectors = 'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])';
      const elements = Array.from(document.querySelectorAll(selectors));
      
      return elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {
          selector: getSelector(el),
          text: el.textContent?.trim() || '',
          visible: rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).display !== 'none',
          disabled: (el as HTMLElement).hasAttribute('disabled'),
          tabIndex: (el as HTMLElement).tabIndex,
        };
        
        function getSelector(element: Element): string {
          if (element.id) {
            return `#${element.id}`;
          }
          
          let selector = element.tagName.toLowerCase();
          if (element.className) {
            const classes = element.className.split(/\s+/).filter(Boolean);
            if (classes.length > 0) {
              selector += `.${classes.join('.')}`;
            }
          }
          
          return selector;
        }
      });
    });
    
    // Test tab navigation
    const tabOrder: { selector: string; text: string }[] = [];
    
    // Press Tab repeatedly to navigate through the page
    await page.keyboard.press('Tab');
    
    // Get the initial focused element
    let focusedSelector = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? (el.id ? `#${el.id}` : el.tagName.toLowerCase()) : null;
    });
    
    let focusedText = await page.evaluate(() => {
      const el = document.activeElement;
      return el ? (el.textContent?.trim() || '') : '';
    });
    
    if (focusedSelector) {
      tabOrder.push({ selector: focusedSelector, text: focusedText });
    }
    
    // Continue tabbing through elements (limit to 100 to prevent infinite loops)
    for (let i = 0; i < 100; i++) {
      await page.keyboard.press('Tab');
      
      const newFocusedSelector = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? (el.id ? `#${el.id}` : el.tagName.toLowerCase()) : null;
      });
      
      const newFocusedText = await page.evaluate(() => {
        const el = document.activeElement;
        return el ? (el.textContent?.trim() || '') : '';
      });
      
      // If we've looped back to the beginning or reached the end
      if (!newFocusedSelector || (tabOrder.length > 0 && newFocusedSelector === tabOrder[0].selector)) {
        break;
      }
      
      tabOrder.push({ selector: newFocusedSelector, text: newFocusedText });
    }
    
    // Calculate unreachable elements
    const visibleFocusableCount = focusableElements.filter(el => el.visible && !el.disabled).length;
    const unreachableElements = Math.max(0, visibleFocusableCount - tabOrder.length);
    
    const result = {
      success: unreachableElements === 0,
      focusableElements: visibleFocusableCount,
      unreachableElements,
      tabOrder,
    };
    
    // Log results
    if (result.success) {
      logger.info('Keyboard navigation test passed', {
        url: page.url(),
        focusableElements: result.focusableElements,
      });
    } else {
      logger.warn('Keyboard navigation test found unreachable elements', {
        url: page.url(),
        unreachableElements: result.unreachableElements,
        focusableElements: result.focusableElements,
      });
    }
    
    return result;
  } catch (error) {
    logger.error('Keyboard navigation test failed', { error });
    throw new Error(`Keyboard navigation test failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Tests ARIA attributes on a page
 * @param page Playwright page object
 * @returns Test result
 */
export async function testAriaAttributes(page: Page): Promise<{
  success: boolean;
  errors: { element: string; message: string }[];
  warnings: { element: string; message: string }[];
}> {
  try {
    logger.info('Testing ARIA attributes', { url: page.url() });
    
    // Check for common ARIA issues
    const ariaIssues = await page.evaluate(() => {
      const errors: { element: string; message: string }[] = [];
      const warnings: { element: string; message: string }[] = [];
      
      // Check for elements with ARIA attributes
      const elementsWithAria = Array.from(document.querySelectorAll('[aria-*]'));
      
      elementsWithAria.forEach(el => {
        const selector = el.id ? `#${el.id}` : el.tagName.toLowerCase();
        
        // Check for required attributes
        if (el.hasAttribute('aria-labelledby')) {
          const labelledby = el.getAttribute('aria-labelledby');
          if (labelledby && !document.getElementById(labelledby)) {
            errors.push({
              element: selector,
              message: `aria-labelledby references non-existent ID: ${labelledby}`,
            });
          }
        }
        
        // Check for required parent/child relationships
        if (el.getAttribute('role') === 'option' && !el.closest('[role="listbox"], [role="combobox"]')) {
          errors.push({
            element: selector,
            message: 'Element with role="option" must be contained in an element with role="listbox" or role="combobox"',
          });
        }
        
        // Check for conflicting attributes
        if (el.hasAttribute('aria-hidden') && el.hasAttribute('tabindex')) {
          if (el.getAttribute('aria-hidden') === 'true' && el.getAttribute('tabindex') !== '-1') {
            errors.push({
              element: selector,
              message: 'Element with aria-hidden="true" should not be focusable',
            });
          }
        }
        
        // Check for best practices
        if (el.hasAttribute('role') && el.hasAttribute('aria-hidden') && el.getAttribute('aria-hidden') === 'true') {
          warnings.push({
            element: selector,
            message: 'Element with role and aria-hidden="true" may cause confusion for screen readers',
          });
        }
      });
      
      // Check for images without alt text
      const images = Array.from(document.querySelectorAll('img:not([alt])'));
      images.forEach(img => {
        const selector = img.id ? `#${img.id}` : 'img';
        errors.push({
          element: selector,
          message: 'Image without alt attribute',
        });
      });
      
      // Check for buttons without accessible names
      const buttons = Array.from(document.querySelectorAll('button'));
      buttons.forEach(button => {
        if (!button.textContent?.trim() && !button.hasAttribute('aria-label') && !button.hasAttribute('aria-labelledby')) {
          const selector = button.id ? `#${button.id}` : 'button';
          errors.push({
            element: selector,
            message: 'Button without accessible name',
          });
        }
      });
      
      return { errors, warnings };
    });
    
    const result = {
      success: ariaIssues.errors.length === 0,
      errors: ariaIssues.errors,
      warnings: ariaIssues.warnings,
    };
    
    // Log results
    if (result.success) {
      logger.info('ARIA attributes test passed', {
        url: page.url(),
        warnings: result.warnings.length,
      });
    } else {
      logger.warn('ARIA attributes test found errors', {
        url: page.url(),
        errors: result.errors.length,
        warnings: result.warnings.length,
      });
    }
    
    return result;
  } catch (error) {
    logger.error('ARIA attributes test failed', { error });
    throw new Error(`ARIA attributes test failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Tests color contrast on a page
 * @param page Playwright page object
 * @returns Test result
 */
export async function testColorContrast(page: Page): Promise<{
  success: boolean;
  failures: { element: string; foreground: string; background: string; ratio: number; required: number }[];
}> {
  try {
    logger.info('Testing color contrast', { url: page.url() });
    
    // Check for color contrast issues
    const contrastIssues = await page.evaluate(() => {
      const failures: { element: string; foreground: string; background: string; ratio: number; required: number }[] = [];
      
      // Get all text elements
      const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, label, input, select, textarea'));
      
      textElements.forEach(el => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        const fontWeight = style.fontWeight;
        
        // Skip elements with no text
        if (!el.textContent?.trim()) {
          return;
        }
        
        // Skip hidden elements
        if (style.display === 'none' || style.visibility === 'hidden') {
          return;
        }
        
        // Determine if text is large
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= '700');
        
        // Required contrast ratio (4.5:1 for normal text, 3:1 for large text)
        const requiredRatio = isLargeText ? 3 : 4.5;
        
        // Get foreground and background colors
        const foreground = style.color;
        const background = getBackgroundColor(el);
        
        // Calculate contrast ratio
        const ratio = calculateContrastRatio(foreground, background);
        
        // Check if contrast is sufficient
        if (ratio < requiredRatio) {
          const selector = el.id ? `#${el.id}` : el.tagName.toLowerCase();
          failures.push({
            element: selector,
            foreground,
            background,
            ratio,
            required: requiredRatio,
          });
        }
      });
      
      return failures;
      
      // Helper function to get background color (including inherited)
      function getBackgroundColor(element: Element): string {
        const style = window.getComputedStyle(element);
        
        // If element has a background color with alpha > 0, use it
        if (style.backgroundColor !== 'rgba(0, 0, 0, 0)' && style.backgroundColor !== 'transparent') {
          return style.backgroundColor;
        }
        
        // Otherwise, check parent elements
        if (element.parentElement) {
          return getBackgroundColor(element.parentElement);
        }
        
        // Default to white if no background color found
        return 'rgb(255, 255, 255)';
      }
      
      // Helper function to calculate contrast ratio
      function calculateContrastRatio(color1: string, color2: string): number {
        // Convert colors to RGB
        const rgb1 = parseColor(color1);
        const rgb2 = parseColor(color2);
        
        // Calculate relative luminance
        const l1 = calculateLuminance(rgb1);
        const l2 = calculateLuminance(rgb2);
        
        // Calculate contrast ratio
        const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
        
        return ratio;
      }
      
      // Helper function to parse color string to RGB
      function parseColor(color: string): [number, number, number] {
        // Handle rgb/rgba format
        const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
        if (rgbMatch) {
          return [
            parseInt(rgbMatch[1], 10),
            parseInt(rgbMatch[2], 10),
            parseInt(rgbMatch[3], 10),
          ];
        }
        
        // Handle hex format
        const hexMatch = color.match(/#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})/i);
        if (hexMatch) {
          return [
            parseInt(hexMatch[1], 16),
            parseInt(hexMatch[2], 16),
            parseInt(hexMatch[3], 16),
          ];
        }
        
        // Default to black if color format is not recognized
        return [0, 0, 0];
      }
      
      // Helper function to calculate luminance
      function calculateLuminance(rgb: [number, number, number]): number {
        // Convert RGB to sRGB
        const srgb = rgb.map(val => {
          const srgbVal = val / 255;
          return srgbVal <= 0.03928
            ? srgbVal / 12.92
            : Math.pow((srgbVal + 0.055) / 1.055, 2.4);
        });
        
        // Calculate luminance
        return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
      }
    });
    
    const result = {
      success: contrastIssues.length === 0,
      failures: contrastIssues,
    };
    
    // Log results
    if (result.success) {
      logger.info('Color contrast test passed', {
        url: page.url(),
      });
    } else {
      logger.warn('Color contrast test found failures', {
        url: page.url(),
        failures: result.failures.length,
      });
    }
    
    return result;
  } catch (error) {
    logger.error('Color contrast test failed', { error });
    throw new Error(`Color contrast test failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Runs a comprehensive accessibility test suite on a page
 * @param page Playwright page object
 * @param options Accessibility test options
 * @returns Comprehensive test results
 */
export async function runComprehensiveAccessibilityTests(
  page: Page,
  options: AccessibilityTestOptions = {}
): Promise<{
  url: string;
  timestamp: Date;
  success: boolean;
  axe: AccessibilityTestResult;
  keyboard: {
    success: boolean;
    focusableElements: number;
    unreachableElements: number;
    tabOrder: { selector: string; text: string }[];
  };
  aria: {
    success: boolean;
    errors: { element: string; message: string }[];
    warnings: { element: string; message: string }[];
  };
  contrast: {
    success: boolean;
    failures: { element: string; foreground: string; background: string; ratio: number; required: number }[];
  };
}> {
  try {
    logger.info('Running comprehensive accessibility tests', {
      url: page.url(),
      options,
    });
    
    // Run all tests in parallel
    const [axeResults, keyboardResults, ariaResults, contrastResults] = await Promise.all([
      runAccessibilityAudit(page, options),
      testKeyboardNavigation(page),
      testAriaAttributes(page),
      testColorContrast(page),
    ]);
    
    // Combine results
    const result = {
      url: page.url(),
      timestamp: new Date(),
      success: axeResults.success && keyboardResults.success && ariaResults.success && contrastResults.success,
      axe: axeResults,
      keyboard: keyboardResults,
      aria: ariaResults,
      contrast: contrastResults,
    };
    
    // Log results
    if (result.success) {
      logger.info('Comprehensive accessibility tests passed', {
        url: result.url,
      });
    } else {
      logger.warn('Comprehensive accessibility tests found issues', {
        url: result.url,
        axeSuccess: result.axe.success,
        keyboardSuccess: result.keyboard.success,
        ariaSuccess: result.aria.success,
        contrastSuccess: result.contrast.success,
      });
    }
    
    return result;
  } catch (error) {
    logger.error('Comprehensive accessibility tests failed', { error });
    throw new Error(`Comprehensive accessibility tests failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Generates an accessibility report in HTML format
 * @param results Comprehensive test results
 * @returns HTML report
 */
export function generateAccessibilityReport(
  results: {
    url: string;
    timestamp: Date;
    success: boolean;
    axe: AccessibilityTestResult;
    keyboard: {
      success: boolean;
      focusableElements: number;
      unreachableElements: number;
      tabOrder: { selector: string; text: string }[];
    };
    aria: {
      success: boolean;
      errors: { element: string; message: string }[];
      warnings: { element: string; message: string }[];
    };
    contrast: {
      success: boolean;
      failures: { element: string; foreground: string; background: string; ratio: number; required: number }[];
    };
  }
): string {
  // Generate HTML report
  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accessibility Report - ${results.url}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        h1, h2, h3 {
          color: #2c3e50;
        }
        .summary {
          display: flex;
          justify-content: space-between;
          background-color: ${results.success ? '#e6f7e6' : '#f7e6e6'};
          padding: 20px;
          border-radius: 5px;
          margin-bottom: 20px;
        }
        .summary-item {
          text-align: center;
        }
        .success {
          color: #27ae60;
        }
        .failure {
          color: #e74c3c;
        }
        .warning {
          color: #f39c12;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th, td {
          padding: 12px 15px;
          text-align: left;
          border-bottom: 1px solid #ddd;
        }
        th {
          background-color: #f8f9fa;
        }
        tr:hover {
          background-color: #f5f5f5;
        }
        .section {
          margin-bottom: 40px;
        }
        .impact-critical {
          background-color: #ffebee;
        }
        .impact-serious {
          background-color: #fff3e0;
        }
        .impact-moderate {
          background-color: #fffde7;
        }
        .impact-minor {
          background-color: #f1f8e9;
        }
      </style>
    </head>
    <body>
      <h1>Accessibility Report</h1>
      <p>URL: ${results.url}</p>
      <p>Date: ${results.timestamp.toLocaleString()}</p>
      
      <div class="summary">
        <div class="summary-item">
          <h3>Overall</h3>
          <p class="${results.success ? 'success' : 'failure'}">${results.success ? 'PASS' : 'FAIL'}</p>
        </div>
        <div class="summary-item">
          <h3>Axe</h3>
          <p class="${results.axe.success ? 'success' : 'failure'}">${results.axe.success ? 'PASS' : 'FAIL'}</p>
        </div>
        <div class="summary-item">
          <h3>Keyboard</h3>
          <p class="${results.keyboard.success ? 'success' : 'failure'}">${results.keyboard.success ? 'PASS' : 'FAIL'}</p>
        </div>
        <div class="summary-item">
          <h3>ARIA</h3>
          <p class="${results.aria.success ? 'success' : 'failure'}">${results.aria.success ? 'PASS' : 'FAIL'}</p>
        </div>
        <div class="summary-item">
          <h3>Contrast</h3>
          <p class="${results.contrast.success ? 'success' : 'failure'}">${results.contrast.success ? 'PASS' : 'FAIL'}</p>
        </div>
      </div>
      
      <div class="section">
        <h2>Axe Analysis</h2>
        <p>WCAG ${results.axe.wcagLevel} compliance: ${results.axe.violations.length} violations, ${results.axe.passes} passes</p>
        
        ${results.axe.violations.length > 0 ? `
          <h3>Violations</h3>
          <table>
            <thead>
              <tr>
                <th>Impact</th>
                <th>Description</th>
                <th>Elements</th>
                <th>Help</th>
              </tr>
            </thead>
            <tbody>
              ${results.axe.violations.map(violation => `
                <tr class="impact-${violation.impact}">
                  <td>${violation.impact}</td>
                  <td>${violation.description}</td>
                  <td>${violation.nodes.length} elements</td>
                  <td><a href="${violation.helpUrl}" target="_blank">More info</a></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="success">No violations found!</p>'}
      </div>
      
      <div class="section">
        <h2>Keyboard Navigation</h2>
        <p>Focusable elements: ${results.keyboard.focusableElements}</p>
        <p>Unreachable elements: ${results.keyboard.unreachableElements}</p>
        
        ${results.keyboard.unreachableElements > 0 ? 
          '<p class="failure">Some focusable elements cannot be reached using the keyboard.</p>' : 
          '<p class="success">All focusable elements can be reached using the keyboard.</p>'
        }
        
        <h3>Tab Order</h3>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Element</th>
              <th>Text</th>
            </tr>
          </thead>
          <tbody>
            ${results.keyboard.tabOrder.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${item.selector}</td>
                <td>${item.text}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      
      <div class="section">
        <h2>ARIA Attributes</h2>
        
        ${results.aria.errors.length > 0 ? `
          <h3>Errors</h3>
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              ${results.aria.errors.map(error => `
                <tr>
                  <td>${error.element}</td>
                  <td>${error.message}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="success">No ARIA errors found!</p>'}
        
        ${results.aria.warnings.length > 0 ? `
          <h3>Warnings</h3>
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              ${results.aria.warnings.map(warning => `
                <tr>
                  <td>${warning.element}</td>
                  <td>${warning.message}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="success">No ARIA warnings found!</p>'}
      </div>
      
      <div class="section">
        <h2>Color Contrast</h2>
        
        ${results.contrast.failures.length > 0 ? `
          <h3>Contrast Failures</h3>
          <table>
            <thead>
              <tr>
                <th>Element</th>
                <th>Foreground</th>
                <th>Background</th>
                <th>Ratio</th>
                <th>Required</th>
              </tr>
            </thead>
            <tbody>
              ${results.contrast.failures.map(failure => `
                <tr>
                  <td>${failure.element}</td>
                  <td>${failure.foreground}</td>
                  <td>${failure.background}</td>
                  <td>${failure.ratio.toFixed(2)}</td>
                  <td>${failure.required.toFixed(1)}:1</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        ` : '<p class="success">No contrast issues found!</p>'}
      </div>
      
      <footer>
        <p>Generated by EdPsych AI Education Platform Accessibility Testing Tools</p>
      </footer>
    </body>
    </html>
  `;
  
  return html;
}

// Export default
export default {
  runAccessibilityAudit,
  testKeyboardNavigation,
  testAriaAttributes,
  testColorContrast,
  runComprehensiveAccessibilityTests,
  generateAccessibilityReport,
};
